import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { MenuGrid, NavBar, SwiperImage } from '../../common/Component';
import NavigationUtil from '../../navigator/NavigationUtil';
export default (props: any) => {
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  return (
    <SafeAreaView style={[{ backgroundColor: theme.primary }, styles.root]}>
      <NavBar title="巡检" />
      <View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
        <SwiperImage
          images={[
            require('../../assets/image/banner_4.png'),
            require('../../assets/image/banner_5.png'),
            require('../../assets/image/banner_6.png'),
          ]}
        />
        <MenuGrid
          segmentation={2}
          menus={[
            {
              text: '巡检上报',
              icon: require('../../assets/image/check_table.png'),
              func: () => {
                NavigationUtil.goPage({}, 'InspectionReport');
              },
            },
            {
              text: '巡检点管理',
              icon: require('../../assets/image/check_address.png'),
              func: () => {
                NavigationUtil.goPage({}, 'InspectionAddress');
              },
            },
            {
              text: '办公点管理',
              icon: require('../../assets/image/check_point.png'),
              func: () => {
                NavigationUtil.goPage({}, 'InspectionPoint');
              },
            },
            {
              text: '巡检历史',
              icon: require('../../assets/image/check_history.png'),
              func: () => {
                NavigationUtil.goPage({}, 'InspectionHistory');
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
