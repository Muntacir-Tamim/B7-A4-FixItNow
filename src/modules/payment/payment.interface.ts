export interface ICreatePaymentPayload {
  bookingId: string;
  provider?: "STRIPE" | "SSLCOMMERZ";
}
