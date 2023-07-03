import upload from './upload';
import login from './login';
import staff from './staff';
import template from './template';
import duty from './duty';
import assets from './assets';
import inspection from './inspection';
import fault from './fault';
import statistical from './statistical';
import customer from './customer';
import good from './good';

export default {
  ...upload,
  ...login,
  ...staff,
  ...template,
  ...duty,
  ...assets,
  ...inspection,
  ...fault,
  ...statistical,
  ...customer,
  ...good,
};
