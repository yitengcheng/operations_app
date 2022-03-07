import upload from './upload';
import login from './login';
import staff from './staff';
import template from './template';

export default {
  ...upload,
  ...login,
  ...staff,
  ...template,
};
