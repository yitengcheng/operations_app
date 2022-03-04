import { combineReducers } from 'redux';
import theme from './theme';
import bottomNavigation from './bottomNavigation';
import userInfo from './userInfo';
import pages from './pages';
/**
 * 合并reducer,通过combineReducers将多个reducer合并成一个根reducer
 * @type {Reducer<any> | Reducer<any,AnyAction>}
 */
const index = combineReducers({
  theme,
  bottomNavigation,
  userInfo,
  pages,
});

export default index;
