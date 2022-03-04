import Types from '../types';

/**
 * 路由页面
 * @param {*} pages
 * @returns {{type: string, pages: *}}
 */
export function savePages(pages: any): {} {
  return { type: Types.PAGES, pages };
}
