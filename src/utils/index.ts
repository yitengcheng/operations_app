import _ from 'lodash';
import dayjs from 'dayjs';
import { tabs } from '../navigator/routers';

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

export const to = (promise: any, errorExt: any) => {
  return promise
    .then((data) => [null, data])
    .catch((err) => {
      if (errorExt) {
        const parsedError = Object.assign({}, err, errorExt);
        return [parsedError, undefined];
      }
      return [err, undefined];
    });
};

/**
 * 日期格式
 * @param day
 * @param format
 * @returns
 */
export const dayFormat = (day: any, format?: string) => {
  return dayjs(day).format(format ?? 'YYYY-MM-DD');
};

export const bottomNavigation = (bottomNavigation: []) => {
  let result;
  Object.entries(tabs).map((item) => {
    if (_.includes(bottomNavigation, item[0])) {
      result = {
        [item[0]]: item[1],
        ...result,
      };
    }
  });
  return result;
};
