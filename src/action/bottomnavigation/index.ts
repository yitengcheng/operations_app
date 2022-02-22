import Types from '../types';

/**
 * 底部导航
 * @param {*} bottomNavigation
 * @returns {{type: string, bottomNavigation: *}}
 */
export function saveBottomNavigation(bottomNavigation: any): {} {
  return { type: Types.BOTTOMNAVIGATION, bottomNavigation };
}
