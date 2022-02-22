import { StackActions } from '@react-navigation/native';
/**
 * 全局导航跳转
 */
export default class NavigationUtil {
  /**
   * 跳转到指定页面
   * @param {*} params 要传递的参数
   * @param {*} page 要跳转的页面名
   */
  public static goPage(params: {}, page: string) {
    const navigation = NavigationUtil.navigation || (params || {}).navigation;
    if (!navigation) {
      console.log('navigation不能为空');
      return;
    }
    navigation.navigate(page, {
      ...params,
      navigation: undefined,
    });
  }
  /**
   * 返回上一页
   * @param {*} navigation
   */
  public static goBack(navigation: {}) {
    navigation.goBack();
  }
  /**
   * 重置到登录
   */
  public static login(params: {} = {}) {
    let { navigation } = params;
    if (!navigation) {
      navigation = NavigationUtil.navigation;
    }
    navigation.dispatch(StackActions.replace('Login', {}));
  }
}
