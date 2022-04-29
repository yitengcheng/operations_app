// const DEV_URL = 'http://192.168.2.4:8083';
// const DEV_URL = 'https://xd.qiantur.com/prod-api';
const DEV_URL = 'http://192.168.31.254:3000/api';
// const DEV_URL = 'https://yyyw.qiantur.com/api';

const PRO_URL = 'https://yyyw.qiantur.com/api';

// const DEFAULT_IMG_URL = 'http://192.168.2.4:9000';
const DEFAULT_IMG_URL = 'http://img.qiantur.com/';
const PRODUCT_IMG_URL = 'http://img.qiantur.com/';

let API_URL = '';
let IMG_URL = '';

if (process.env.NODE_ENV === 'development') {
  API_URL = DEV_URL;
  IMG_URL = DEFAULT_IMG_URL;
} else {
  API_URL = PRO_URL;
  IMG_URL = PRODUCT_IMG_URL;
}

export default {
  API_URL,
  IMG_URL,
  headers: {},
};
