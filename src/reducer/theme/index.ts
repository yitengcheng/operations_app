import Types from '../../action/types';

// 定义state默认值，数据结构取值的时候要保持一致
const defaultState = {
  theme: {
    backgroundColor: '#FFFFFF',
    primary: '#364ddb',
    // primary: '#1890ff',
    fontColor: 'rgba(0, 0, 0, 0.65)',
    error: '#f5222d',
    warrning: '#faad14',
    success: '#52c41a',
    fontSize: 16,
    borderRadius: 2,
    borderColor: '#d9d9d9',
  },
};
/**
 * action处理函数
 */
export default function onAction(state = defaultState, action) {
  switch (action.type) {
    case Types.THEME_CHANGE:
      return {
        ...state,
        theme: action.theme,
      };

    default:
      return state;
  }
}
