import { StackActions } from '@react-navigation/native';
import _ from 'lodash';
import { Alert } from 'react-native';
/**
 * 全局导航跳转
 */
export default class NavigationUtil {
  /**
   * 跳转到指定页面
   * @param {*} params 要传递的参数
   * @param {*} page 要跳转的页面名
   */
  static goPage(params: {}, page: string) {
    const navigation = NavigationUtil.navigation || (params || {}).navigation;
    const pages = NavigationUtil.pages || ['Home'];
    if (!navigation) {
      console.log('navigation不能为空');
      return;
    }
    if (_.includes(pages, page)) {
      navigation.navigate(page, {
        ...params,
        navigation: undefined,
      });
      return;
    }
    Alert.alert('权限不足', '您的权限不足，无法查看此功能');
  }
  /**
   * 返回上一页
   * @param {*} params
   */
  static goBack(params: {}) {
    const navigation = NavigationUtil.navigation || (params || {}).navigation;
    navigation.goBack();
  }
  /**
   * 重置到登录
   */
  static login(params: {} = {}) {
    let { navigation } = params;
    if (!navigation) {
      navigation = NavigationUtil.navigation;
    }
    navigation.dispatch(StackActions.replace('Login', {}));
  }
}
