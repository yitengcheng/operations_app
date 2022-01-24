export const validOption = (name: string, obj: {}) => {
  const { isFieldInError, getErrorsInField } = obj;
  return {
    isFieldInError,
    getErrorsInField,
    name,
  };
};
