import React from 'react';
import { SafeAreaView, StyleSheet, View, Image, Text, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { MenuGrid, NavBar, SwiperImage } from '../../common/Component';
import _ from 'lodash';
import NavigationUtil from '../../navigator/NavigationUtil';
import { post } from '../../HiNet';
import apis from '../../apis';
import { clearStorage } from '../../utils/localStorage';
import { togetherUrl } from '../../utils';

export default (props: any) => {
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  const userInfo = useSelector((state) => {
    return state.userInfo.userInfo;
  });
  const logout = () => {
    Alert.alert('提示', '退出成功', [
      {
        text: '确定',
        onPress: () => {
          NavigationUtil.login();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={[{ backgroundColor: theme.primary }, styles.root]}>
      <NavBar title="个人中心" />
      <View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
        <View style={styles.topInfo}>
          <Image
            source={
              userInfo?.avatar ? { uri: togetherUrl(userInfo.avatar) } : require('../../assets/image/default_head.png')
            }
            style={{ width: 100, height: 100, borderRadius: 50, margin: 10 }}
            resizeMode="contain"
          />

          <View style={styles.userInfo}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: theme.fontColor }}>姓名:{userInfo.nickName}</Text>
            <Text style={{ color: theme.fontColor }}>ID:{userInfo._id}</Text>
            {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
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
            </View> */}
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
              text: '资产模板',
              icon: require('../../assets/image/putIn.png'),
              func: () => {
                NavigationUtil.goPage({ title: '资产模板', type: 1 }, 'Template');
              },
            },
            {
              text: '故障模板',
              icon: require('../../assets/image/fault.png'),
              func: () => {
                NavigationUtil.goPage({ title: '故障模板', type: 2 }, 'Template');
              },
            },
            {
              text: '修改密码',
              icon: require('../../assets/image/modfiy_password.png'),
              func: () => {
                NavigationUtil.goPage({}, 'ModfiyPassword');
              },
            },

            {
              text: '清理缓存',
              icon: require('../../assets/image/clear_cache.png'),
              func: () => {
                clearStorage();
                Alert.alert('提示', '清理完成');
              },
            },

            {
              text: '个人信息',
              icon: require('../../assets/image/userInfo.png'),
              func: () => {
                NavigationUtil.goPage({}, 'UserInfo');
              },
            },
            {
              text: '退出登录',
              icon: require('../../assets/image/logout.png'),
              func: () => {
                logout();
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
