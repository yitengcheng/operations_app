import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  Image,
  View,
  useWindowDimensions,
  Alert,
  Platform,
  TouchableOpacity,
} from 'react-native';
import NavigationUtil from '../../navigator/NavigationUtil';
import { useDispatch } from 'react-redux';
import { saveBottomNavigation } from '../../action/bottomnavigation';
import FormInput from '../../common/form/FormInput';
import { CustomButton, Popup } from '../../common/Component';
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
  const [modalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    loadStorage('loginRecord').then((res) => {
      setPassword(res?.password);
      setUsername(res?.username);
    });
    saveStorage('token', '');
  }, []);
  let registrationId;
  JPush.setLoggerEnable(true);
  JPush.init({ appKey: '27282edcc5414ca852184e55', channel: 'default', production: 1 });
  //连接状态
  JPush.addConnectEventListener((result) => {
    result.connectEnable &&
      JPush.getRegistrationID((res) => {
        registrationId = res.registerID;
      });
  });

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
    const loginRes = await post(apis.login)({ username, password, registrationId })();
    saveStorage('loginRecord', { username, password });
    saveStorage('token', loginRes?.token ?? '');
    dispatch(saveUserInfo(loginRes?.userInfo ?? {}));
    const routers = await post(apis.getRouters)()();
    let bottomNavigation = [];
    let pages = [];
    _.map(routers, (item) => {
      if (item.menuType === 'M') {
        bottomNavigation.push(item.name);
      } else if (item.menuType === 'C') {
        pages.push(item?.name);
      }
    });
    dispatch(saveBottomNavigation(bottomNavigation));
    dispatch(savePages(pages));
    const { navigation } = props;
    NavigationUtil.home({ navigation });
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
          placeholder="请输入登录账号"
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
        <TouchableOpacity
          style={{ marginLeft: 10 }}
          onPress={() => {
            setModalVisible(true);
          }}
        >
          <Text style={{ color: '#364ddb' }}>快速注册</Text>
        </TouchableOpacity>
      </View>
      <View>
        <CustomButton title="登录" buttonStyle={{ width: 200, alignSelf: 'center' }} onClick={toLogin} />
      </View>
      <Popup
        modalVisible={modalVisible}
        onClose={() => {
          setModalVisible(false);
        }}
        type="center"
      >
        <FormInput label="账号"></FormInput>
        <FormInput label="密码"></FormInput>
        <FormInput label="公司名"></FormInput>
        <View style={{ height: 50 }}>
          <CustomButton
            title="注册"
            buttonStyle={{ width: 200, alignSelf: 'center' }}
            onClick={() => {
              post(apis.reigist)()().then(() => {
                setModalVisible(false);
                Alert.alert('注册完成，请等待审核');
              });
            }}
          />
        </View>
      </Popup>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
