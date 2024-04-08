'use client'
import React, { FC, useEffect } from "react";
import {
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Grid,
  GridItem,
  Input,
  Select,
  Text
} from "@chakra-ui/react";
import { CUIAutoComplete } from 'chakra-ui-autocomplete';
import { useVehicleConstants } from "@/hooks/useVehicleConstants";
import { useVehicleForm } from "@/hooks/useVehicleForm";


const AssessmentForm: FC<any> = () => {
  const {
    loading: loadingConstants,
    setLoading: setLoadingConstants,
    vehicleTypes,
    brands,
    models,
    years,
    fetchVehicleTypes,
    fetchBrands,
    fetchModels,
    fetchYears,
  } = useVehicleConstants();

  const {
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
  } = useVehicleForm();

  const isLoading = loadingConstants || loading;

  useEffect(() => {
    if (!vehicleTypes && !loadingConstants)
      fetchVehicleTypes();
  }, []);

  useEffect(() => {
    if (vehicleType)
      fetchBrands(vehicleType.value);
    else {
      setBrand(null);
      setModel(null);
      setYear(null);
    }
  }, [vehicleType]);

  useEffect(() => {
    if (brand)
      fetchModels(vehicleType!.value, brand.value);
    else {
      setModel(null);
      setYear(null);
    }
  }, [brand]);

  useEffect(() => {
    if (model)
      fetchYears(vehicleType!.value, brand!.value, model.value);
    else
      setYear(null);
  }, [model]);

  async function onSubmit() {
    try {
      await fetchData();
    } catch (e) {
      console.error(e);
      setErrors({
        ...errors,
        fetch: 'Failed to fetch data, you can try different filters'
      })
    }
  }

  return <>
    {errors.fetch &&
      <Text color='tomato' w='100%' textAlign='center' mb='10px'>
        {errors.fetch}
      </Text>
    }
    <Grid
      templateAreas={`"buttons buttons"`}
      gap='2'
    >
      {/* <GridItem area='country'>
        <FormControl isDisabled={isLoading} isRequired isInvalid={!!errors.country}>
          <FormLabel>Country</FormLabel>
          <Select placeholder='Select a country'
            onChange={(e) => {
              setCountry(e.target.value);
              const {country, ...newErrors} = errors;
              setErrors(newErrors);
            }}
            value={filter.country || ''}
          >
            {
              constants?.map((country, index) =>
                <option key={index} value={country.baseUri}>
                  {country.name}
                </option>
              )
            }
          </Select>
          <FormErrorMessage>{errors.country}</FormErrorMessage>
        </FormControl>
      </GridItem>
      <GridItem area='states'>
        <FormControl isDisabled={isLoading} mb='-40px' isInvalid={!!errors.states}>
          <FormLabel mb='-13px'>State(s)</FormLabel>
          <CUIAutoComplete
            disableCreateItem
            placeholder="Specify one or more states"
            items={statesOptions}
            selectedItems={
              statesOptions.filter(
                (state) => filter.states?.includes(state.value)
              ) || []
            }
            onSelectedItemsChange={(changes) => {
              if (changes.selectedItems)
                setStates(changes.selectedItems?.map((item) => item.value) || []);
              const {states, ...newErrors} = errors;
              setErrors(newErrors);
            }}
            listStyleProps={{
              position: 'absolute',
              zIndex: '20',
              maxH: '250px',
              overflowY: 'auto',
              width: '100%',
            }}
          />
          <FormErrorMessage>{errors.states}</FormErrorMessage>
        </FormControl>
      </GridItem>
      <GridItem area='initial'>
        <FormControl isDisabled={isLoading} isRequired isInvalid={!!errors.initialMonth}>
          <FormLabel>From</FormLabel>
          <Input
            type='month'
            placeholder='Select an (initial) month'
            onChange={(e) => {
              setInitialMonth(e.target.value);
              const {initialMonth, ...newErrors} = errors;
              setErrors(newErrors);
            }}
            value={filter.initialMonth || ''}
          />
          <FormErrorMessage>{errors.initialMonth}</FormErrorMessage>
        </FormControl>
      </GridItem>
      <GridItem area='final'>
        <FormControl isDisabled={isLoading || !filter.initialMonth} isInvalid={!!errors.finalMonth}>
          <FormLabel>To</FormLabel>
          <Input
            type='month'
            placeholder='Select a (final) month'
            onChange={(e) => {
              setFinalMonth(e.target.value);
              const {finalMonth, ...newErrors} = errors;
              setErrors(newErrors);
            }}
            value={filter.finalMonth || ''}
          />
          <FormErrorMessage>{errors.finalMonth}</FormErrorMessage>
        </FormControl>
      </GridItem> */}
      <GridItem area='buttons' mt='1em'>
        <ButtonGroup w='100%' justifyContent='stretch' isDisabled={isLoading}>
          <Button w='100%' onClick={clear}>
            Clear
          </Button>
          <Button
            colorScheme='teal'
            w='100%'
            onClick={onSubmit}
            isLoading={isLoading}
          >
            Submit
          </Button>
        </ButtonGroup>
      </GridItem>
    </Grid>
  </>;
}

export default AssessmentForm;
