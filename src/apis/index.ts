import upload from './upload';
import login from './login';
import staff from './staff';
import template from './template';
import duty from './duty';

export default {
  ...upload,
  ...login,
  ...staff,
  ...template,
  ...duty,
};
