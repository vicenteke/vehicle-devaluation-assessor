'use client'
import React, { FC } from "react";
import {
  Flex,
  Stack,
  CircularProgress,
  Heading,
  Stat,
  StatArrow,
  StatHelpText,
  Text
} from "@chakra-ui/react";
import { useVehicleForm } from "@/hooks/useVehicleForm";


const AssessmentResults: FC<any> = () => {
  const { loading, data } = useVehicleForm();

  if (loading)
    return <Stack alignItems='center' py={10} px={1} spacing={5}>
      <Text textAlign='center'>
        Please wait while we assess your vehicle...
      </Text>
      <CircularProgress color='teal' isIndeterminate/>
    </Stack>

  if (!data || !data.current_price || !data.variation)
    return <></>;

  return <Stack alignItems='center' pt={10} px={3} spacing={3} w='100%'>
    <Text textAlign='center'>
      Your vehicle is currently rated at
    </Text>
    <Heading size='xl'>
      R$ {data.current_price.toLocaleString(
        'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </Heading>
    <Stat flexGrow={0}>
      <StatHelpText
        whiteSpace='nowrap'
        fontSize='xl'
        color={data.variation >= 0 ? 'green' : 'red'}
      >
        <StatArrow type={data.variation >= 0 ? 'increase' : 'decrease'} />
        {(data.variation* 100).toFixed(2)}%
      </StatHelpText>
    </Stat>
    <Flex justifyContent='space-between' alignItems='center' w='100%' mt={3}>
      <Text fontSize='sm'>
        Car rate at the moment of the acquisition:
      </Text>
      <Heading size='sm'>
        R$ {
          data.original_price ?
          (data.original_price).toLocaleString(
            'en-US',
            { minimumFractionDigits: 2, maximumFractionDigits: 2 }
          )
          : '--'
        }
      </Heading>
    </Flex>
    <Flex justifyContent='space-between' alignItems='center' w='100%'>
      <Text fontSize='sm'>
        Total inflation:
      </Text>
      {data.inflation ?
        <Stat flexGrow={0}>
          <StatHelpText
            whiteSpace='nowrap'
            color={data.inflation >= 0 ? 'green' : 'red'}
          >
            <StatArrow type={0.53 >= 0 ? 'increase' : 'decrease'} />
            {(data.inflation * 100).toFixed(2)}%
          </StatHelpText>
        </Stat>
        : <Text fontSize='sm'>Data unavailable</Text>
      }
    </Flex>
  </Stack>;
}

export default AssessmentResults;
