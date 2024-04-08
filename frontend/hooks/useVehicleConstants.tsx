'use client'
import React, { FC, createContext, useContext, useState } from "react";
import axios from "axios";
import { BaseDataType } from "@/types";


interface VehicleConstantsContext {
  loading?: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  vehicleTypes: BaseDataType[] | null;
  brands: BaseDataType[] | null;
  models: BaseDataType[] | null;
  years: BaseDataType[] | null;
  fetchVehicleTypes: () => Promise<any>;
  fetchBrands: (type: string) => Promise<any>;
  fetchModels: (type: string, brand: string) => Promise<any>;
  fetchYears: (type: string, brand: string, model: string) => Promise<any>;
}

const VehicleConstantsContext = createContext<VehicleConstantsContext>({} as VehicleConstantsContext);

export const VehicleConstantsProvider: FC<any> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>({
    'types': [],
    'brands': {},
    'models': {},
    'years': {},
  });  // stores all received data as a buffer

  const [vehicleTypes, setVehicleTypes] = useState<BaseDataType[] | null>(null);
  const [brands, setBrands] = useState<BaseDataType[] | null>(null);
  const [models, setModels] = useState<BaseDataType[] | null>(null);
  const [years, setYears] = useState<BaseDataType[] | null>(null);

  async function _fetchData(
      level: 'types' | 'brands' | 'models' | 'years',
      type?: string,
      brand?: string,
      model?: string
  ) {
    if (!process.env.NEXT_PUBLIC_BACKEND_URL)
      throw new Error('BACKEND_URL not set on .env.local');

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 10000);

    let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/constants`;
    let setter = null;
    if (level === 'types') {
      url += '/vehicle_types';
      setter = setVehicleTypes;
    } else if (level === 'brands') {
      url += `/${type}/brands`;
      setter = setBrands;
    } else if (level === 'models') {
      url += `/${type}/${brand}/models`;
      setter = setModels;
    } else {
      url += `/${type}/${brand}/${model}/years`;
      setter = setYears;
    }

    const response = await axios.get(url);
    if (response.status !== 200) {
      setLoading(false);
      throw new Error(
        `Failed to fetch vehicle ${level}: ${response.statusText}`
      );
    }

    const res = response.data;

    let newData: any = {};
    switch (level) {
      case 'types':
        newData = {
          'types': res,
          'brands': {},
          'models': {},
          'years': {},
        };
        break;
      case 'brands':
        newData = {
          ...data,
          'models': {},
          'years': {},
        };
        newData.brands![type!] = res;
        break;
      case 'models':
        newData = {
          ...data,
          'years': {},
        };
        newData.models![brand!][type!] = res;
        break;
      case 'years':
        newData = {
          ...data,
        };
        newData.years![model!][brand!][type!] = res;
        break;
    }
    setData(newData);
    setter(res);
    setLoading(false);

    return res;
  }

  async function fetchVehicleTypes() {
    return await _fetchData('types');
  }

  async function fetchBrands(vehicleType: string) {
    if (data.brands?.[vehicleType]) {
      setBrands(data.brands[vehicleType]);
      return data.brands[vehicleType];
    };
    return await _fetchData('brands', vehicleType);
  }

  async function fetchModels(vehicleType: string, brand: string) {
    if (data.models?.[brand]?.[vehicleType]) {
      setModels(data.models[brand][vehicleType]);
      return data.models[brand][vehicleType];
    };
    return await _fetchData('models', vehicleType, brand);
  }

  async function fetchYears(vehicleType: string, brand: string, model: string) {
    if (data.years?.[model]?.[brand]?.[vehicleType]) {
      setYears(data.years[model][brand][vehicleType]);
      return data.years[model][brand][vehicleType];
    };
    return await _fetchData('years', vehicleType, brand, model);
  }

  return (
    <VehicleConstantsContext.Provider value={{
        loading,
        setLoading,
        vehicleTypes,
        brands,
        models,
        years,
        fetchVehicleTypes,
        fetchBrands,
        fetchModels,
        fetchYears,
      }}
    >
      {children}
    </VehicleConstantsContext.Provider>
)
}

export function useVehicleConstants() {
  const context = useContext(VehicleConstantsContext);
  if (!context) {
      throw new Error('useVehicleConstants must be used within an VehicleConstantsProvider')
  }

  return context;
}