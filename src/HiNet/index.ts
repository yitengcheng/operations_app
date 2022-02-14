import config from '../config';

/**
 * 发送get请求
 * @param api 要请求的接口
 */
export function get(api: string) {
  return async (params?: {}) => {
    return handleData(
      fetch(buildParams(config.API_URL + api, params), {
        headers: {
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
  return (params?: {}) => {
    return async (queryParams?: {} | string) => {
      let data, cType;
      if (params instanceof FormData) {
        data = params;
        cType = 'multipart/form-data';
      } else {
        data = JSON.stringify(params);
        cType = 'application/json';
      }
      console.log('params:', data);
      return handleData(
        fetch(buildParams(config.API_URL + api, queryParams), {
          method: 'POST',
          body: data,
          headers: {
            'content-type': cType,
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
  return new Promise((resolve, reject) => {
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
        console.log('response:', JSON.stringify(result));
        if (typeof result === 'string') {
          throw new Error(result);
        }
        const { code, msg, data } = result;
        if (code === 401) {
          return;
        }
        resolve(result);
      })
      .catch((err) => {
        console.log('error:', err);
        reject(err);
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
  let newUrl = new URL(url),
    finalUrl;
  if (typeof params === 'object') {
    for (const [key, value] of Object.entries(params)) {
      newUrl.searchParams.append(key, value as string);
    }
    finalUrl = newUrl.toString();
  } else if (typeof params === 'string') {
    // 适配path参数
    finalUrl = url.endsWith('/') ? url + params : url + '/' + params;
  } else {
    finalUrl = newUrl.toString();
  }
  console.log('buildParams:', finalUrl);
  return finalUrl;
}
