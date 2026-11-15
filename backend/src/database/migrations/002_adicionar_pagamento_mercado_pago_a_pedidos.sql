ALTER TABLE pedidos ADD COLUMN status_pagamento TEXT NOT NULL DEFAULT 'nao_aplicavel'
  CHECK (status_pagamento IN (
    'nao_aplicavel', 'aguardando_pagamento', 'pago_aguardando_envio',
    'recusado', 'cancelado'
  ));

ALTER TABLE pedidos ADD COLUMN mercado_pago_preference_id TEXT;
ALTER TABLE pedidos ADD COLUMN mercado_pago_payment_id TEXT;

CREATE UNIQUE INDEX idx_pedidos_mercado_pago_preference
  ON pedidos(mercado_pago_preference_id)
  WHERE mercado_pago_preference_id IS NOT NULL;

CREATE UNIQUE INDEX idx_pedidos_mercado_pago_payment
  ON pedidos(mercado_pago_payment_id)
  WHERE mercado_pago_payment_id IS NOT NULL;
