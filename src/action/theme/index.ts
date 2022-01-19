/**
 * 创建函数
 */
import Types from '../types';

/**
 * 主题变更
 * @param {*} theme
 * @returns {{type: string,theme: *}}
 */
export function onThemeChange(theme: any): {} {
  return {type: Types.THEME_CHANGE, theme};
}
