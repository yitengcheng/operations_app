const DEV_URL = 'http://192.168.2.4:8083';
// const DEV_URL = 'https://xd.qiantur.com/prod-api';
// const DEV_URL = 'http://192.168.31.253:3000/api';

const PRO_URL = 'https://xd.qiantur.com/prod-api';

const DEFAULT_IMG_URL = 'http://192.168.2.4:9000';
const PRODUCT_IMG_URL = 'https://xd.qiantur.com/minio';

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
  headers: {
    boundary: '',
  },
};
