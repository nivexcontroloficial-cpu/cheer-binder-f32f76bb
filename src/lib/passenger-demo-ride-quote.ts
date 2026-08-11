import { z } from "zod";
import { ACTIVE_PASSENGER_DEMO_RIDE } from "@/data/passenger-demo-rides";

/**
 * CONTRATO TIPADO DE PREÇO, CUPOM E PAGAMENTO DA CORRIDA
 * Centraliza a lógica de cotação para garantir consistência em todo o fluxo.
 */

export const PAYMENT_METHODS = {
  cash: "Dinheiro",
  pix: "Pix direto ao piloto",
  card: "Cartão na máquina do piloto",
} as const;

export type PaymentMethod = keyof typeof PAYMENT_METHODS;

export const PROMO_CONFIG = {
  CODE: "ROVYA5",
  DISCOUNT: 5.0,
} as const;

export const rideQuoteSearchSchema = z.object({
  promoCode: z.string().optional().catch(undefined),
  paymentMethod: z.enum(["cash", "pix", "card"]).optional().catch("cash" as const),
  technical: z.boolean().optional().catch(false),
});

export type RideQuoteSearch = z.infer<typeof rideQuoteSearchSchema>;

/**
 * Calcula o preço final da corrida baseado no cupom.
 * Preço base fixo de ACTIVE_PASSENGER_DEMO_RIDE.fare (R$ 18,00).
 */
export const calculateRideFare = (promoCode?: string) => {
  const baseFare = ACTIVE_PASSENGER_DEMO_RIDE.fare;
  const isApplied = promoCode?.trim().toUpperCase() === PROMO_CONFIG.CODE;
  const discount = isApplied ? PROMO_CONFIG.DISCOUNT : 0;
  
  return {
    baseFare,
    discount,
    finalFare: Math.max(0, baseFare - discount),
    isApplied,
  };
};

/**
 * Retorna o label amigável do método de pagamento.
 */
export const getPaymentLabel = (method?: string) => {
  const safeMethod = (method as PaymentMethod) || "cash";
  return PAYMENT_METHODS[safeMethod] || PAYMENT_METHODS.cash;
};

/**
 * Helper para navegação preservando a cotação.
 */
export const getQuoteParams = (search: RideQuoteSearch) => {
  const params: Partial<RideQuoteSearch> = {};
  
  if (search.promoCode?.trim().toUpperCase() === PROMO_CONFIG.CODE) {
    params.promoCode = PROMO_CONFIG.CODE;
  }
  
  if (search.paymentMethod && search.paymentMethod !== "cash") {
    params.paymentMethod = search.paymentMethod;
  }
  
  if (search.technical) {
    params.technical = true;
  }
  
  return params;
};
