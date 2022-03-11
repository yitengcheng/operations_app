import React from 'react';
import { View, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import ErrorMessage from './ErrorMessage';
import Label from './Label';

/**
 * 选择器
 * @param props
 * @returns
 */
const FormSelect = (props: any) => {
  const { label, placeholder, options, onChange, defaultValue, editable = true, ...other } = props;
  const placeholderText = placeholder ?? `请选择${label}`;

  let items = options.length === 0 && !!defaultValue ? [{ label: defaultValue + '', value: defaultValue }] : options;

  return (
    <View style={styles.column}>
      <Label {...props} />
      <RNPickerSelect
        onValueChange={(obj) => {
          onChange && onChange(obj);
        }}
        placeholder={{ label: placeholderText, value: null, color: '#9EA0A4' }}
        style={pickerSelectStyles}
        items={items}
        value={defaultValue}
        disabled={!editable}
        {...other}
      />
      {props.isFieldInError && ErrorMessage(props.isFieldInError, props.getErrorsInField, props.name)}
    </View>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 2,
    color: 'rgba(0, 0, 0, 0.65)',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 2,
    color: 'rgba(0, 0, 0, 0.65)',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

const styles = StyleSheet.create({
  column: {
    flexDirection: 'column',
    padding: 5,
    minHeight: 90,
  },
});

export default FormSelect;
