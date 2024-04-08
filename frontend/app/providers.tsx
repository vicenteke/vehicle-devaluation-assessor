'use client';
import { ChakraProvider } from '@chakra-ui/react';
import { VehicleConstantsProvider } from '@/hooks/useVehicleConstants';
import { VehicleFormProvider } from '@/hooks/useVehicleForm';


export function Providers({ children }: { children: React.ReactNode }) {
  return <ChakraProvider>
    <VehicleConstantsProvider>
      <VehicleFormProvider>
        {children}
      </VehicleFormProvider>
    </VehicleConstantsProvider>
  </ChakraProvider>
}
