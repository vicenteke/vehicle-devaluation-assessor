export interface BaseDataType {
  label: string;
  value: string;
}


export interface VehicleAssessmentType {
  currentValue: number;
  originalValue: number;
  variation: number;
  inflation?: number;
}
