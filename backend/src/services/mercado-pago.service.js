import {
  MercadoPagoConfig,
  Payment,
  Preference,
  WebhookSignatureValidator,
} from 'mercadopago';

import { AppError } from '../errors/app-error.js';

function integrationError() {
  return new AppError('Não foi possível consultar o Mercado Pago.', {
    statusCode: 502,
    code: 'MERCADO_PAGO_INDISPONIVEL',
  });
}

export function createMercadoPagoService({
  accessToken,
  paymentClient,
  preferenceClient,
  signatureValidator = WebhookSignatureValidator,
} = {}) {
  let payment = paymentClient;
  let preference = preferenceClient;

  function createClient() {
    if (!accessToken) {
      throw new AppError('O Mercado Pago não está configurado no backend.', {
        statusCode: 503,
        code: 'MERCADO_PAGO_NAO_CONFIGURADO',
      });
    }
    return new MercadoPagoConfig({ accessToken, options: { timeout: 5000 } });
  }

  return {
    async createPreference(body) {
      preference ??= new Preference(createClient());
      try {
        const created = await preference.create({ body });
        if (!created?.id || !created?.init_point) throw integrationError();
        return { init_point: created.init_point, preference_id: created.id };
      } catch (error) {
        if (error instanceof AppError) throw error;
        throw integrationError();
      }
    },

    validateWebhook({ dataId, secret, xRequestId, xSignature }) {
      if (!secret) {
        throw new AppError('O webhook do Mercado Pago não está configurado.', {
          statusCode: 503,
          code: 'MERCADO_PAGO_WEBHOOK_NAO_CONFIGURADO',
        });
      }
      try {
        signatureValidator.validate({ dataId, secret, xRequestId, xSignature });
      } catch {
        throw new AppError('Notificação do Mercado Pago inválida.', {
          statusCode: 401,
          code: 'WEBHOOK_INVALIDO',
        });
      }
    },

    async getPayment(paymentId) {
      payment ??= new Payment(createClient());
      try {
        return await payment.get({ id: paymentId });
      } catch {
        throw integrationError();
      }
    },
  };
}
