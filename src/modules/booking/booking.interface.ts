export interface ICreateBookingPayload {
  serviceId: string;
  scheduledDate: string;
  scheduledTime: string;
  address: string;
  note?: string;
}
