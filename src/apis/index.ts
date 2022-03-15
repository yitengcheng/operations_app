import upload from './upload';
import login from './login';
import staff from './staff';
import template from './template';
import duty from './duty';
import assets from './assets';
import inspection from './inspection';
import fault from './fault';

export default {
  ...upload,
  ...login,
  ...staff,
  ...template,
  ...duty,
  ...assets,
  ...inspection,
  ...fault,
};
