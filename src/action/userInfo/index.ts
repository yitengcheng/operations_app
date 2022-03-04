import Types from '../types';

/**
 * userInfo
 * @param {*} userInfo
 * @returns {{type: string, userInfo: {}}}
 */
export function saveUserInfo(userInfo: {}): {} {
  return { type: Types.USERINFO, userInfo };
}
