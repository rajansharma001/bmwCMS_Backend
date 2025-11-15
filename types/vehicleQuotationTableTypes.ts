export interface vehicleQuotationTableType {
  _id?: string;
  quotationId: string;
  vehicleType: string;
  brandModel: string;
  noOfDays: number;
  ratePerDay: number;
  total: number;
}
