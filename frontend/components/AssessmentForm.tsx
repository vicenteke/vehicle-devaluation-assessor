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
        <FormLabel mb='-13px'>Vehicle Type</FormLabel>
        <CUIAutoComplete
          disableCreateItem
          placeholder="Specify the type of the vehicle"
          items={vehicleTypes! || []}
          selectedItems={
            vehicleTypes?.filter(
              (item) => vehicleType?.value === item.value
            ) || []
          }
          onSelectedItemsChange={(changes) => {
            setVehicleType(changes.selectedItems?.[0] || null);
            const {vehicleType, ...newErrors} = errors;
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
        <FormErrorMessage>{errors.vehicleType}</FormErrorMessage>
      </FormControl>
    </GridItem>
    <GridItem area='brand'>
      <FormControl isDisabled={isLoading} mb='-40px' isInvalid={!!errors.brand} isRequired>
        <FormLabel mb='-13px'>Brand</FormLabel>
        <CUIAutoComplete
          disableCreateItem
          placeholder="Specify the brand"
          items={brands! || []}
          selectedItems={
            brands?.filter(
              (item) => brand?.value === item.value
            ) || []
          }
          onSelectedItemsChange={(changes) => {
            setBrand(changes.selectedItems?.[0] || null);
            const {brand, ...newErrors} = errors;
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
        <FormErrorMessage>{errors.brand}</FormErrorMessage>
      </FormControl>
    </GridItem>
    <GridItem area='model'>
      <FormControl isDisabled={isLoading} mb='-40px' isInvalid={!!errors.model} isRequired>
        <FormLabel mb='-13px'>Model</FormLabel>
        <CUIAutoComplete
          disableCreateItem
          placeholder="Specify the model"
          items={models! || []}
          selectedItems={
            models?.filter(
              (item) => model?.value === item.value
            ) || []
          }
          onSelectedItemsChange={(changes) => {
            setModel(changes.selectedItems?.[0] || null);
            const {model, ...newErrors} = errors;
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
        <FormErrorMessage>{errors.model}</FormErrorMessage>
      </FormControl>
    </GridItem>
    <GridItem area='year'>
      <FormControl isDisabled={isLoading} mb='-40px' isInvalid={!!errors.year} isRequired>
        <FormLabel mb='-13px'>Model Year</FormLabel>
        <CUIAutoComplete
          disableCreateItem
          placeholder="Specify the model year"
          items={years! || []}
          selectedItems={
            years?.filter(
              (item) => year?.value === item.value
            ) || []
          }
          onSelectedItemsChange={(changes) => {
            setYear(changes.selectedItems?.[0] || null);
            const {year, ...newErrors} = errors;
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
        <FormErrorMessage>{errors.year}</FormErrorMessage>
      </FormControl>
    </GridItem>
    <GridItem area='value'>
      <FormControl isDisabled={isLoading} isInvalid={!!errors.value} isRequired>
        <FormLabel>Acquisition Value</FormLabel>
        <NumberInput
          step={500}
          precision={2}
          value={value || 0} min={0}
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
          precision={2}
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
