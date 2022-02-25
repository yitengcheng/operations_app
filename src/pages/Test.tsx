import React from 'react';
import { SafeAreaView, StyleSheet, View, Text } from 'react-native';
import apis from '../apis';
import { CustomButton, ListData, NavBar } from '../common/Component';
import NavigationUtil from '../navigator/NavigationUtil';
import { toFixed } from '../utils';

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
  const testFixed = () => {
    console.log(toFixed(3.1415926));
  };
  return (
    <SafeAreaView style={styles.root}>
      <NavBar title="测试" />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        <CustomButton title="详情" onClick={toDetail} type="primary" />
        <CustomButton title="排班" type="warrning" onClick={toLogin} />
        <CustomButton title="菜单宫格" type="error" onClick={toMenus} />
        <CustomButton title="保留小数位数" type="primary" onClick={testFixed} />
      </View>

      <ListData
        url={apis.test}
        renderItem={(data) => {
          return <Text>{data.item.name}</Text>;
        }}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
