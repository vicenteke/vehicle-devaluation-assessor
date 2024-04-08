export interface BaseDataType {
  label: string;
  value: string;
}


export interface VehicleAssessmentType {
  current_price: number;
  original_price: number;
  variation: number;
  inflation?: number;
}
