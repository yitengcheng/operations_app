import _ from 'lodash';

export const validOption = (name: string, obj: {}) => {
  const { isFieldInError, getErrorsInField } = obj;
  return {
    isFieldInError,
    getErrorsInField,
    name,
  };
};

export const randomId = () => {
  return _.random(0, 9999999, false);
};
