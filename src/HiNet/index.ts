import config from '../config';
import NavigationUtil from '../navigator/NavigationUtil';
import _ from 'lodash';
import { Alert } from 'react-native';
import { loadStorage } from '../utils/localStorage';

/**
 * 发送get请求
 * @param api 要请求的接口
 */
export function get(api: string) {
  showLoading();
  return async (params?: {}) => {
    const token = await loadStorage('token');
    return handleData(
      fetch(buildParams(config.API_URL + api, params), {
        headers: {
          Authorization: 'Bearer ' + token,
          ...config.headers,
        },
      }),
    );
  };
}
/**
 *
 * @param api
 * @returns
 */
export function post(api: string) {
  showLoading();
  return (params?: {}) => {
    return async (queryParams?: {} | string) => {
      let data;
      let cType;
      if (params instanceof FormData) {
        data = params;
        cType = 'multipart/form-data';
      } else {
        data = JSON.stringify(params);
        cType = 'application/json';
      }
      const token = await loadStorage('token');
      console.log('params:', data);
      return handleData(
        fetch(buildParams(config.API_URL + api, queryParams), {
          method: 'POST',
          body: data,
          headers: {
            'content-type': cType,
            Authorization: 'Bearer ' + token,
            ...config.headers,
          },
        }),
      );
    };
  };
}
/**
 * 处理接口返回数据
 * @param doAction
 */
function handleData(doAction: Promise<any>) {
  return new Promise((resolve) => {
    doAction
      .then((res) => {
        // 解析Content-Type 防止将非json数据进行json转换
        const type = res.headers.get('Content-Type');
        if (type?.indexOf('json') !== -1) {
          return res.json();
        }
        return res.text();
      })
      .then((result) => {
        hidenLoading();
        console.log('response:', JSON.stringify(result));
        if (typeof result === 'string') {
          throw new Error(result);
        }
        const { code, msg } = result;
        if (code === 401) {
          NavigationUtil?.login();
          return;
        }
        if (code !== 200) {
          let message = msg ?? '访问失败，请重试';
          Alert.alert('失败', message);
          return;
        }
        resolve(result?.data ?? result);
      })
      .catch((err) => {
        hidenLoading();
        console.log(err);
      });
  });
}
/**
 * 构建url参数
 * @param url
 * @param params
 * @returns
 */
function buildParams(url: string, params?: {} | string): string {
  const newUrl = new URL(url);
  let finalUrl;
  if (typeof params === 'object') {
    for (const [key, value] of _.toPairs(params)) {
      newUrl.searchParams.append(key, value as string);
    }
    finalUrl = newUrl?.toString();
  } else if (typeof params === 'string') {
    // 适配path参数
    finalUrl = `${url}${params}`;
  } else {
    finalUrl = url;
  }
  console.log('buildParams:', finalUrl);
  return finalUrl;
}
