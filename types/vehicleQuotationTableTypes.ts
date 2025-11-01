export interface vehicleQuotationTableType {
  _id?: string;
  vehicleType: string;
  brandModel: string;
  noOfDays: number;
  ratePerDay: number;
  total: number;
  inclusions?: string[];
  exclusions?: string[];
}
