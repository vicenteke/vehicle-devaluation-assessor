'use client'
import { FC } from "react";
import { CUIAutoComplete, CUIAutoCompleteProps } from "chakra-ui-autocomplete";
import { BaseDataType, ErrorsType } from "@/types";
import { useVehicleForm } from "@/hooks/useVehicleForm";

interface AutocompleteProps extends CUIAutoCompleteProps<{label: string, value:string}> {
  selectedValue: BaseDataType | null;
  setter: (value: BaseDataType | null) => void;
  options: BaseDataType[] | null;
  fieldId: keyof ErrorsType;
  items?: BaseDataType[];
  label?: string;
}

const Autocomplete: FC<AutocompleteProps> = (params: AutocompleteProps) => {
  const { errors, setErrors } = useVehicleForm();

  const {
    selectedValue,
    setter,
    options,
    fieldId,
    ...props
  } = params;

  return <CUIAutoComplete
    {...props}
    disableCreateItem
    items={options! || []}
    selectedItems={(selectedValue ? [selectedValue] : []) as BaseDataType[]}
    onSelectedItemsChange={(changes) => {
      setter(changes.selectedItems?.[changes.selectedItems.length - 1] || null);
      let {...newErrors} = errors;
      newErrors[fieldId] = undefined;
      setErrors(newErrors);
    }}
    inputStyleProps={{
      display: selectedValue?.value ? 'none' : 'block'
    }}
    toggleButtonStyleProps={{
      background: 'transparent',
      border: '1px solid #e7e7e7',
      display: selectedValue?.value ? 'none' : 'block',
    }}
    tagStyleProps={{
      size: 'lg',
      bg: 'white',
      border: '1px solid #e7e7e7',
      mt: 2,
      py: 2,
      mb: -2,
    }}
    listStyleProps={{
      position: 'absolute',
      zIndex: '20',
      maxH: '250px',
      overflowY: 'auto',
      width: '100%',
    }}
    labelStyleProps={{ mb: '-13px' }}
  />
}

export default Autocomplete;
