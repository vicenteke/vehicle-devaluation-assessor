'use client'
import React, { FC, createContext, useContext, useState } from "react";
import axios from "axios";
import moment from "moment";
import {
  BaseDataType,
  ErrorsType,
  VehicleAssessmentType
} from "@/types";


interface VehicleFormContext {
  loading?: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  data: VehicleAssessmentType | null;
  setData: React.Dispatch<React.SetStateAction<VehicleAssessmentType | null>>;
  fetchData: () => void;
  errors: ErrorsType;
  vehicleType: BaseDataType | null;
  brand: BaseDataType | null;
  model: BaseDataType | null;
  year: BaseDataType | null;
  acquisitionYear: number;
  value: number;
  setErrors: React.Dispatch<React.SetStateAction<ErrorsType>>;
  setVehicleType: React.Dispatch<React.SetStateAction<BaseDataType | null>>;
  setBrand: React.Dispatch<React.SetStateAction<BaseDataType | null>>;
  setModel: React.Dispatch<React.SetStateAction<BaseDataType | null>>;
  setYear: React.Dispatch<React.SetStateAction<BaseDataType | null>>;
  setAcquisitionYear: React.Dispatch<React.SetStateAction<number>>;
  setValue: React.Dispatch<React.SetStateAction<number>>;
  clear: () => void;
  validate: () => boolean;
}

const VehicleFormContext = createContext<VehicleFormContext>({} as VehicleFormContext);

export const VehicleFormProvider: FC<any> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<VehicleAssessmentType | null>(null);
  const [errors, setErrors] = useState<ErrorsType>({});

  const [vehicleType, setVehicleType] = useState<BaseDataType | null>(null);
  const [brand, setBrand] = useState<BaseDataType | null>(null);
  const [model, setModel] = useState<BaseDataType | null>(null);
  const [year, setYear] = useState<BaseDataType | null>(null);
  const [acquisitionYear, setAcquisitionYear] = useState<number>(moment().year());
  const [value, setValue] = useState<number>(0);

  function clear() {
    setVehicleType(null);
    setBrand(null);
    setModel(null);
    setYear(null);
    setAcquisitionYear(moment().year());
    setValue(0);
    setErrors({});
  };

  function validate() {
    let newErrors: ErrorsType = {};
    if (!process.env.NEXT_PUBLIC_BACKEND_URL)
      newErrors.fetch = 'BACKEND_URL not set on .env.local';
    if (vehicleType === null)
      newErrors.vehicleType = 'Field is required';
    if (brand === null)
      newErrors.brand = 'Field is required';
    if (model === null)
      newErrors.model = 'Field is required';
    if (year === null)
      newErrors.year = 'Field is required';
    if (value === 0)
      newErrors.value = 'Field is required';
    else if (value < 0)
      newErrors.value = 'Invalid number';
    if (acquisitionYear < 1950 || acquisitionYear > moment().year())
      newErrors.acquisitionYear = 'Invalid number';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function fetchData() {
    if (!validate())
      return null;
    let url = (`${process.env.NEXT_PUBLIC_BACKEND_URL}${vehicleType!.value}/` +
      `${brand!.value}/${model!.value}/${year!.value}/${value}` +
      `/${acquisitionYear}`);

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 10000)

    let response: any;
    try {
      response = await axios.get(url);
      if (response.status !== 200) {
        setLoading(false);
        throw new Error(`Failed to fetch vehicle assessment: ${response.statusText}`);
      }
    } catch (e) {
      setLoading(false);
      throw new Error(`Failed to fetch vehicle assessment: ${e}`);
    }

    const res = response.data;
    setData(res);
    setLoading(false);

    return res
  }

  return (
    <VehicleFormContext.Provider value={{
        loading,
        setLoading,
        data,
        setData,
        fetchData,
        errors,
        vehicleType,
        brand,
        model,
        year,
        acquisitionYear,
        value,
        setErrors,
        setVehicleType,
        setBrand,
        setModel,
        setYear,
        setAcquisitionYear,
        setValue,
        clear,
        validate,
      }}
    >
      {children}
    </VehicleFormContext.Provider>
)
}

export function useVehicleForm() {
  const context = useContext(VehicleFormContext);
  if (!context) {
      throw new Error('useVehicleForm must be used within an VehicleFormProvider')
  }

  return context;
}