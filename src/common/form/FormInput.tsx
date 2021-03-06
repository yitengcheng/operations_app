import React from 'react';
import { TextInput, View, StyleSheet, Image } from 'react-native';
import { useSelector } from 'react-redux';
import ErrorMessage from './ErrorMessage';
import Label from './Label';

/**
 * 文本输入框或文本域输入框
 * @param props
 * @returns
 */
const FormInput = (props: any) => {
  const { label, inputStyle, placeholder, multiline = false, leftIcon, ...other } = props;
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  const placeholderText = placeholder ?? `请输入${label}`;
  const heightNum = multiline ? 90 : 35;

  return (
    <View style={[styles.column, multiline && { height: 150 }]}>
      {label && <Label {...props} />}
      <TextInput
        style={[
          inputStyle ?? {
            height: heightNum,
            borderWidth: 1,
            borderColor: theme.borderColor,
            fontSize: theme.fontSize,
            padding: 5,
          },
        ]}
        placeholder={placeholderText}
        multiline={multiline}
        {...other}
      />
      {props.isFieldInError && ErrorMessage(props.isFieldInError, props.getErrorsInField, props.name)}
    </View>
  );
};

const styles = StyleSheet.create({
  column: {
    flexDirection: 'column',
    padding: 5,
    marginBottom: 5,
  },
});

export default FormInput;
