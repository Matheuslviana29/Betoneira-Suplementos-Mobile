import { useSegments } from 'expo-router';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

const ROTAS_DO_FLUXO = new Set([
  'checkout',
  'endereco-entrega',
  'novo-endereco',
  'forma-pagamento',
  'nova-forma-pagamento',
]);

const CheckoutSelectionContext = createContext(null);

export function CheckoutSelectionProvider({ children }) {
  const segmentos = useSegments();
  const rotaAnterior = useRef(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);

  const resetSelection = useCallback(() => {
    setSelectedAddressId(null);
    setSelectedPaymentId(null);
  }, []);

  useEffect(() => {
    const rotaAtual = segmentos[0] ?? null;
    if (ROTAS_DO_FLUXO.has(rotaAnterior.current) && !ROTAS_DO_FLUXO.has(rotaAtual)) {
      resetSelection();
    }
    rotaAnterior.current = rotaAtual;
  }, [resetSelection, segmentos]);

  const initializeSelection = useCallback((addresses = [], payments = []) => {
    setSelectedAddressId((currentId) => {
      if (currentId !== null) return currentId;
      return addresses.find((address) => address.padrao)?.id ?? addresses[0]?.id ?? null;
    });
    setSelectedPaymentId((currentId) => currentId ?? payments[0]?.id ?? null);
  }, []);

  const selectAddress = useCallback((addressId) => {
    setSelectedAddressId(addressId);
  }, []);

  const selectPayment = useCallback((paymentId) => {
    setSelectedPaymentId(paymentId);
  }, []);

  const invalidateAddress = useCallback((addressId) => {
    setSelectedAddressId((currentId) => (currentId === addressId ? null : currentId));
  }, []);

  const invalidatePayment = useCallback((paymentId) => {
    setSelectedPaymentId((currentId) => (currentId === paymentId ? null : currentId));
  }, []);

  const value = useMemo(
    () => ({
      initializeSelection,
      invalidateAddress,
      invalidatePayment,
      resetSelection,
      selectAddress,
      selectPayment,
      selectedAddressId,
      selectedPaymentId,
    }),
    [
      initializeSelection,
      invalidateAddress,
      invalidatePayment,
      resetSelection,
      selectAddress,
      selectPayment,
      selectedAddressId,
      selectedPaymentId,
    ],
  );

  return (
    <CheckoutSelectionContext.Provider value={value}>
      {children}
    </CheckoutSelectionContext.Provider>
  );
}

export function useCheckoutSelection() {
  const context = useContext(CheckoutSelectionContext);
  if (!context) {
    throw new Error('useCheckoutSelection deve ser usado dentro de CheckoutSelectionProvider.');
  }
  return context;
}
