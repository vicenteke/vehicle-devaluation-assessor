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


export interface ErrorsType {
  fetch?: string;
  vehicleType?: string;
  brand?: string;
  model?: string;
  year?: string;
  acquisitionYear?: string;
  value?: string;
}
