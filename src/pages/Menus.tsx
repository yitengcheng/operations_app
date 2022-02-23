import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { MenuGrid, NavBar } from '../common/Component';
export default (props: any) => {
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  return (
    <SafeAreaView style={[{ backgroundColor: theme.primary }, styles.root]}>
      <NavBar title="菜单宫格" {...props} />
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
      <View style={{ flex: 1, backgroundColor: '#FFFFFF' }} />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
