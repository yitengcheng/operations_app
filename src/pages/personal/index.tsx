import React from 'react';
import { SafeAreaView, StyleSheet, View, Image, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { MenuGrid, NavBar, SwiperImage } from '../../common/Component';
import _ from 'lodash';
import NavigationUtil from '../../navigator/NavigationUtil';

export default (props: any) => {
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  const userInfo = useSelector((state) => {
    return state.userInfo.userInfo;
  });

  return (
    <SafeAreaView style={[{ backgroundColor: theme.primary }, styles.root]}>
      <NavBar title="个人中心" />
      <View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
        <View style={styles.topInfo}>
          <Image
            source={require('../../assets/image/default_head.png')}
            style={{ width: 100, height: 100, borderRadius: 50, margin: 10 }}
            resizeMode="contain"
          />

          <View style={styles.userInfo}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: theme.fontColor }}>姓名:{userInfo.nickName}</Text>
            <Text style={{ color: theme.fontColor }}>ID:{`${_.random(1000000, 999999)}`}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ color: theme.fontColor }}>今日故障</Text>
                <Text style={{ color: theme.fontColor }}>5</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ color: theme.fontColor }}>已处理</Text>
                <Text style={{ color: theme.fontColor }}>5</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ color: theme.fontColor }}>未处理</Text>
                <Text style={{ color: theme.fontColor }}>5</Text>
              </View>
            </View>
          </View>
        </View>
        <SwiperImage
          images={[
            require('../../assets/image/banner_1.png'),
            require('../../assets/image/banner_2.png'),
            require('../../assets/image/banner_3.png'),
          ]}
        />
        <MenuGrid
          segmentation={4}
          menus={[
            {
              text: '员工管理',
              icon: require('../../assets/image/staffManagement.png'),
              func: () => {
                NavigationUtil.goPage({}, 'StaffManagement');
              },
            },
            {
              text: '测试2',
              icon: require('../../assets/image/shopping.png'),
              func: () => {
                Alert.alert('点击按钮2');
              },
            },
            {
              text: '测试3',
              icon: require('../../assets/image/shopping.png'),
              func: () => {
                Alert.alert('点击按钮3');
              },
            },
            {
              text: '测试4',
              icon: require('../../assets/image/shopping.png'),
              func: () => {
                Alert.alert('点击按钮4');
              },
            },
            {
              text: '测试5',
              icon: require('../../assets/image/shopping.png'),
              func: () => {
                Alert.alert('点击按钮5');
              },
            },
            {
              text: '测试6',
              icon: require('../../assets/image/shopping.png'),
              func: () => {
                Alert.alert('点击按钮6');
              },
            },
            {
              text: '测试7',
              icon: require('../../assets/image/shopping.png'),
              func: () => {
                Alert.alert('点击按钮7');
              },
            },
            {
              text: '测试8',
              icon: require('../../assets/image/shopping.png'),
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
  topInfo: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
  },
  userInfo: {
    margin: 10,
    flex: 1,
    justifyContent: 'space-around',
  },
});
