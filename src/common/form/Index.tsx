import React from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import RNPickerSelect from 'react-native-picker-select';

export const Label = (props: any) => {
  const { label, labelStyle, required = true } = props;
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', minHeight: 35, padding: 5 }}>
      {required && <AntDesign name="star" size={8} style={{ color: theme.error }} />}
      <Text style={[labelStyle ?? { color: theme.fontColor, fontSize: theme.fontSize }]}>{`${label}：`}</Text>
    </View>
  );
};

export const ErrorMessage = (isFieldInError: Function, getErrorsInField: Function, name: string) => {
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  return (
    isFieldInError(name) &&
    getErrorsInField(name).map((errorMessage, index) => (
      <Text key={errorMessage} style={{ color: theme.error }}>
        {errorMessage}
      </Text>
    ))
  );
};

export const FormSelect = (props: any) => {
  const { label, placeholder, options, onChange } = props;
  const placeholderText = placeholder ?? `请选择${label}`;
  return (
    <View style={styles.column}>
      <Label {...props} />
      <RNPickerSelect
        onValueChange={onChange}
        placeholder={{ label: placeholderText, value: null, color: '#9EA0A4' }}
        style={pickerSelectStyles}
        items={options}
      />
      {props.isFieldInError && ErrorMessage(props.isFieldInError, props.getErrorsInField, props.name)}
    </View>
  );
};

export const FormInput = (props: any) => {
  const { label, inputStyle, placeholder, multiline, ...other } = props;
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  const placeholderText = placeholder ?? `请输入${label}`;
  const heightNum =  multiline ? 90 : 35;
  return (
    <View style={[multiline && { height: 150 }, styles.column]}>
      <Label {...props} />
      <TextInput
        style={[inputStyle ?? {height: heightNum,borderWidth: 1, borderColor: theme.borderColor, fontSize: theme.fontSize, padding:5, }]}
        placeholder={placeholderText}
        multiline
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
