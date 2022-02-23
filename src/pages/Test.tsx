import React from 'react';
import { SafeAreaView, StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { CustomButton, LineProgress, MenuGrid, NavBar } from '../common/Component';
import NavigationUtil from '../navigator/NavigationUtil';
import Agenda from '../common/Agenda';

export default (props: any) => {
  const toDetail = () => {
    const { navigation } = props;
    NavigationUtil.goPage({ navigation }, 'Detail');
  };
  const toLogin = () => {
    const { navigation } = props;
    NavigationUtil.goPage({ navigation }, 'Agenda');
  };
  return (
    <SafeAreaView style={styles.root}>
      <NavBar title="测试" />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        <CustomButton title="详情" onClick={toDetail} type="primary" />
        <CustomButton title="排班" type="warrning" onClick={toLogin} />
        <CustomButton title="相册" type="error" />
        <CustomButton title="相机测试" type="primary" />
      </View>

      <View>
        <MenuGrid
          segmentation={4}
          menus={[
            {
              text: '测试1',
              icon: require('../assets/image/shopping.png'),
              func: () => {
                Alert.alert('点击按钮1');
              },
            },
            {
              text: '测试2',
              icon: require('../assets/image/shopping.png'),
              func: () => {
                Alert.alert('点击按钮2');
              },
            },
            {
              text: '测试3',
              icon: require('../assets/image/shopping.png'),
              func: () => {
                Alert.alert('点击按钮3');
              },
            },
            {
              text: '测试4',
              icon: require('../assets/image/shopping.png'),
              func: () => {
                Alert.alert('点击按钮4');
              },
            },
            {
              text: '测试5',
              icon: require('../assets/image/shopping.png'),
              func: () => {
                Alert.alert('点击按钮5');
              },
            },
            {
              text: '测试6',
              icon: require('../assets/image/shopping.png'),
              func: () => {
                Alert.alert('点击按钮6');
              },
            },
            {
              text: '测试7',
              icon: require('../assets/image/shopping.png'),
              func: () => {
                Alert.alert('点击按钮7');
              },
            },
            {
              text: '测试8',
              icon: require('../assets/image/shopping.png'),
              func: () => {
                Alert.alert('点击按钮8');
              },
            },
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
