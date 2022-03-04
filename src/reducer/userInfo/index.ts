import Types from '../../action/types';

// 定义state默认值，数据结构取值的时候要保持一致
const defaultState = {
  userInfo: {},
};
/**
 * action处理函数
 */
export default function onAction(state = defaultState, action) {
  switch (action.type) {
    case Types.USERINFO:
      return {
        ...state,
        userInfo: action.userInfo,
      };

    default:
      return state;
  }
}
