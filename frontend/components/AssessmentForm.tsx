'use client'
import moment from "moment";
import React, { FC, useEffect } from "react";
import {
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Grid,
  GridItem,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Text
} from "@chakra-ui/react";
import { BaseDataType } from "@/types";
import { useVehicleConstants } from "@/hooks/useVehicleConstants";
import { useVehicleForm } from "@/hooks/useVehicleForm";
import Autocomplete from "./Autocomplete";


const AssessmentForm: FC<any> = () => {
  const {
    loading: loadingConstants,
    vehicleTypes,
    brands,
    models,
    years,
    setBrands,
    setModels,
    setYears,
    fetchVehicleTypes,
    fetchBrands,
    fetchModels,
    fetchYears,
  } = useVehicleConstants();

  const {
    loading,
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
      setBrands(null);
      setModels(null);
      setYears(null);
    }
  }, [vehicleType]);

  useEffect(() => {
    if (brand)
      fetchModels(vehicleType!.value, brand.value);
    else {
      setModel(null);
      setYear(null);
      setModels(null);
      setYears(null);
    }
  }, [brand]);

  useEffect(() => {
    if (model)
      fetchYears(vehicleType!.value, brand!.value, model.value);
    else {
      setYear(null);
      setYears(null);
    }
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

  function onClear() {
    setErrors({});
    if (vehicleType)
      clear();
    else
      setData(null);
  }

  return <>
    {errors.fetch &&
      <Text color='tomato' w='100%' textAlign='center' mb='10px'>
        {errors.fetch}
      </Text>
    }
    <Grid
      templateAreas={`
        "vehicleType brand"
        "model model"
        "year year"
        "value acquisitionYear"
        "buttons buttons"
      `}
      gap='2'
    >
      <GridItem area='vehicleType'>
      <FormControl isDisabled={isLoading} mb='-40px' isInvalid={!!errors.vehicleType} isRequired>
        <FormLabel>Vehicle Type</FormLabel>
        <Autocomplete
          fieldId='vehicleType'
          selectedValue={vehicleType}
          options={vehicleTypes}
          setter={setVehicleType}
          placeholder="Specify the type"
        />
        <FormErrorMessage mt='-35px' mb='35px'>{errors.vehicleType}</FormErrorMessage>
      </FormControl>
    </GridItem>
    <GridItem area='brand'>
      <FormControl isDisabled={isLoading} mb='-40px' isInvalid={!!errors.brand} isRequired>
        <FormLabel>Brand</FormLabel>
        <Autocomplete
          fieldId='brand'
          selectedValue={brand}
          options={brands}
          setter={setBrand}
          placeholder="Specify the brand"
        />
        <FormErrorMessage mt='-35px' mb='35px'>{errors.brand}</FormErrorMessage>
      </FormControl>
    </GridItem>
    <GridItem area='model'>
      <FormControl isDisabled={isLoading} mb='-40px' isInvalid={!!errors.model} isRequired>
        <FormLabel>Model</FormLabel>
        <Autocomplete
          fieldId='model'
          selectedValue={model}
          options={models}
          setter={setModel}
          placeholder="Specify the model"
        />
        <FormErrorMessage mt='-35px' mb='35px'>{errors.model}</FormErrorMessage>
      </FormControl>
    </GridItem>
    <GridItem area='year'>
      <FormControl isDisabled={isLoading} mb='-40px' isInvalid={!!errors.year} isRequired>
        <FormLabel>Model Year</FormLabel>
        <Autocomplete
          fieldId='year'
          selectedValue={year}
          options={years}
          setter={setYear}
          placeholder="Specify the model year"
        />
        <FormErrorMessage mt='-35px' mb='35px'>{errors.year}</FormErrorMessage>
      </FormControl>
    </GridItem>
    <GridItem area='value'>
      <FormControl isDisabled={isLoading} isInvalid={!!errors.value} isRequired>
        <FormLabel>Acquisition Value</FormLabel>
        <NumberInput
          step={500.0}
          precision={2}
          value={value || 0.0} min={0}
          onChange={(valueString) => setValue(Number(valueString))}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <FormErrorMessage>{errors.value}</FormErrorMessage>
      </FormControl>
    </GridItem>
    <GridItem area='acquisitionYear'>
      <FormControl isDisabled={isLoading} isInvalid={!!errors.acquisitionYear} isRequired>
        <FormLabel>Acquisition Year</FormLabel>
        <NumberInput
          step={1}
          value={acquisitionYear || moment().year()}
          min={1979}
          max={moment().year()}
          onChange={(valueString) => setAcquisitionYear(Number(valueString))}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <FormErrorMessage>{errors.acquisitionYear}</FormErrorMessage>
      </FormControl>
    </GridItem>
      <GridItem area='buttons' mt='1em'>
        <ButtonGroup w='100%' justifyContent='stretch' isDisabled={isLoading}>
          <Button w='100%' onClick={onClear}>
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
