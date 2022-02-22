import Types from '../../action/types';

// 定义state默认值，数据结构取值的时候要保持一致
const defaultState = {
  bottomNavigation: [],
};
/**
 * action处理函数
 */
export default function onAction(state = defaultState, action) {
  switch (action.type) {
    case Types.BOTTOMNAVIGATION:
      return {
        ...state,
        bottomNavigation: action.bottomNavigation,
      };

    default:
      return state;
  }
}
