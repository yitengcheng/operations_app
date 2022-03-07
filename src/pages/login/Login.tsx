import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, Image, View, useWindowDimensions, Alert, Platform } from 'react-native';
import NavigationUtil from '../../navigator/NavigationUtil';
import { useDispatch } from 'react-redux';
import { saveBottomNavigation } from '../../action/bottomnavigation';
import FormInput from '../../common/form/FormInput';
import { CustomButton } from '../../common/Component';
import { useValidation } from 'react-native-form-validator';
import JPush from 'jpush-react-native';
import apis from '../../apis';
import { post, get } from '../../HiNet';
import { validOption } from '../../utils';
import { loadStorage, saveStorage } from '../../utils/localStorage';
import { saveUserInfo } from '../../action/userInfo';
import _ from 'lodash';
import { savePages } from '../../action/pages';

export default (props: any) => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  useEffect(() => {
    loadStorage('loginRecord').then((res) => {
      setPassword(res?.password);
      setUsername(res?.username);
    });
    saveStorage('token', '');
    if (username && password) {
      toLogin();
    }
  }, []);

  let registrationId;
  if (Platform.OS === 'android') {
    JPush.setLoggerEnable(true);
    JPush.init({ appKey: '27282edcc5414ca852184e55', channel: 'dev', production: 1 });
    //连接状态
    JPush.addConnectEventListener((result) => {
      result.connectEnable &&
        JPush.getRegistrationID((res) => {
          registrationId = res.registerID;
        });
    });
  }

  const { validate, ...other } = useValidation({
    state: { username, password },
    labels: {
      username: '账号',
      password: '密码',
    },
  });
  const toLogin = async () => {
    const res = validate({
      username: { required: true },
      password: { required: true },
    });
    if (!res) {
      Alert.alert('错误', '缺少账号或密码');
      return;
    }
    const loginRes = await post(apis.login)({ username, password, registrationId, app: true })();
    if (loginRes.code !== 200) {
      return;
    }
    saveStorage('loginRecord', { username, password });
    saveStorage('token', loginRes?.token ?? '');
    const userInfo = await get(apis.getInfo)();
    dispatch(saveUserInfo(userInfo?.user ?? {}));
    const routers = await get(apis.getRouters)();
    let bottomNavigation = [];
    let pages = [];
    _.map(routers, (item) => {
      if (item.menuType === 'M') {
        bottomNavigation.push(item.name);
      } else if (item.menuType === 'C') {
        pages.push(item?.children?.[0]?.name);
      }
    });
    dispatch(saveBottomNavigation(bottomNavigation));
    dispatch(savePages(pages));
    const { navigation } = props;
    NavigationUtil.goPage({ navigation }, 'Home');
  };

  const width = useWindowDimensions().width;

  return (
    <SafeAreaView style={styles.root}>
      <Image
        source={require('../../assets/image/LOGO.png')}
        style={{ width: 200, height: 200, alignSelf: 'center', marginTop: 80 }}
      />
      <View style={{ marginHorizontal: 30, marginBottom: 50 }}>
        <FormInput
          required={false}
          placeholder="请输入账号"
          value={username}
          onChangeText={setUsername}
          {...validOption('username', other)}
        />
        <FormInput
          required={false}
          placeholder="请输入密码"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
          {...validOption('password', other)}
        />
      </View>
      <View>
        <CustomButton title="登录" buttonStyle={{ width: 200, alignSelf: 'center' }} onClick={toLogin} />
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
