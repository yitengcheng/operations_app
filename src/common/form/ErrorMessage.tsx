import React from 'react';
import { Text } from 'react-native';
import { useSelector } from 'react-redux';

/**
 * 错误提示
 * @param isFieldInError
 * @param getErrorsInField
 * @param name
 * @returns
 */
const ErrorMessage = (isFieldInError: Function, getErrorsInField: Function, name: string) => {
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  return (
    isFieldInError(name) &&
    getErrorsInField(name).map((errorMessage) => (
      <Text key={errorMessage} style={{ color: theme.error }}>
        {errorMessage}
      </Text>
    ))
  );
};

export default ErrorMessage;
