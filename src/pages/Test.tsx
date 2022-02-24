import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { CustomButton, NavBar, SwiperImage } from '../common/Component';
import NavigationUtil from '../navigator/NavigationUtil';

export default (props: any) => {
  const toDetail = () => {
    const { navigation } = props;
    NavigationUtil.goPage({ navigation }, 'Detail');
  };
  const toLogin = () => {
    const { navigation } = props;
    NavigationUtil.goPage({ navigation }, 'Agenda');
  };
  const toMenus = () => {
    NavigationUtil.goPage({}, 'Menus');
  };
  return (
    <SafeAreaView style={styles.root}>
      <NavBar title="测试" />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        <CustomButton title="详情" onClick={toDetail} type="primary" />
        <CustomButton title="排班" type="warrning" onClick={toLogin} />
        <CustomButton title="菜单宫格" type="error" onClick={toMenus} />
        <CustomButton title="相机测试" type="primary" />
      </View>

      <View>
        <SwiperImage
          images={[
            require('../assets/image/PC.png'),
            require('../assets/image/operation.png'),
            require('../assets/image/talking.png'),
            require('../assets/image/teaching.png'),
          ]}
        />
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
