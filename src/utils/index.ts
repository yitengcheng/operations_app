import _ from 'lodash';
import dayjs from 'dayjs';
import { tabs } from '../navigator/routers';
import config from '../config';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

/**
 * 表单验证
 * @param name 字段名
 * @param obj 参数
 * @returns
 */
export const validOption = (name: string, obj: {}) => {
  const { isFieldInError, getErrorsInField } = obj;
  return {
    isFieldInError,
    getErrorsInField,
    name,
  };
};

/**
 * 随机生成ID
 * @returns
 */
export const randomId = (): string => {
  return _.random(0, 9999999, false);
};

/**
 * 优化promise
 * @param promise
 * @param errorExt
 * @returns
 */
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
  return dayjs(day ?? new Date()).format(format ?? 'YYYY-MM-DD');
};

/**
 * 底部导航
 * @param bottomNav
 * @returns
 */
export const bottomNavigation = (bottomNav: []) => {
  let result;
  _.toPairs(tabs).forEach((item) => {
    if (_.includes(bottomNav, item[0])) {
      result = {
        [item[0]]: item[1],
        ...result,
      };
    }
  });
  return result;
};

/**
 * 拼接图片地址
 * @param url
 * @returns
 */
export const togetherUrl = (url: string) => {
  return `${config.IMG_URL}${url}`;
};

/**
 * 保留小数点指定位数
 * @param number
 * @param fixed
 * @returns
 */
export const toFixed = (number: number, fixed?: number = 2): number => {
  return ~~(Math.pow(10, fixed) * number) / Math.pow(10, fixed);
};

/**
 * 判断字符串是否为json字符串
 * @param str
 * @returns
 */
export const isJsonString = (str: string): boolean => {
  try {
    if (typeof JSON.parse(str) === 'object') {
      return true;
    }
  } catch (error) {}
  return false;
};

/**
 * 性别
 * @param sex
 * @returns
 */
export const gender = (sex: number): string => {
  return sex == 0 ? '男' : '女';
};

/**
 * 状态
 * @param status
 * @returns
 */
export const hasStatus = (status: number): string => {
  return status == 0 ? '启用' : '未启用';
};

/**
 * 工单状态
 * @param status
 * @returns
 */
export const repairStatus = (status: number): string => {
  return status === 1 ? '待处理' : status === 2 ? '已处理' : '已拒绝';
};

/**
 * 电话号码加星
 * @param phoneNumber
 * @returns
 */
export const phoneNumberEncryption = (phoneNumber: string): string => {
  return phoneNumber?.replace(phoneNumber.substring(3, 7), '****');
};

/**
 * 返回两个日期之间的日期数组
 * @param start 起始日期
 * @param end 结束日期
 */
export const getDateList = (start: string, end: string): [string] => {
  let result = [];
  let cDay = dayjs(start).add(1, 'day').format('YYYY-MM-DD');
  if (dayjs(cDay).isBetween(dayjs(start), dayjs(end))) {
    const tmp = getDateList(cDay, end);
    result = [cDay, ...tmp];
  }
  return result;
};
