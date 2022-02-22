import React from 'react';
import { SafeAreaView, StyleSheet, View, TouchableOpacity } from 'react-native';
import { CustomButton, NavBar } from '../common/Component';
import NavigationUtil from '../navigator/NavigationUtil';
import Agenda from '../common/Agenda';

export default (props: any) => {
  const toDetail = () => {
    const { navigation } = props;
    NavigationUtil.goPage({ navigation }, 'Detail');
  };
  const toLogin = () => {
    NavigationUtil.login();
  };
  return (
    <SafeAreaView style={styles.root}>
      <NavBar title="测试" />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        <CustomButton title="详情" onClick={toDetail} type="primary" />
        <CustomButton title="接口测试" type="warrning" onClick={toLogin} />
        <CustomButton title="相册" type="error" />
        <CustomButton title="相机测试" type="primary" />
      </View>
      <Agenda />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
