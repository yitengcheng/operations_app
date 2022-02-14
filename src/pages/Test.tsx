import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { CustomButton, NavBar } from '../common/Component';
import { post } from '../HiNet';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import apis from '../apis';

export default (props: any) => {
  const toDetail = () => {
    const {
      navigation: { navigate },
    } = props;
    navigate('Detail');
  };
  const testApi = () => {
    post(apis.test)()().then((res) => console.log(res));
  };
  const startCamera = async () => {
    const res = await launchCamera({ cameraType: 'back' });
    console.log(res);
  };
  const photo = async () => {
    const res = await launchImageLibrary();
    console.log(res);
  };
  return (
    <SafeAreaView style={styles.root}>
      <NavBar title="测试" />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        <CustomButton title="详情" onClick={toDetail} type="primary" />
        <CustomButton title="接口测试" type="warrning" onClick={testApi} />
        <CustomButton title="相册" type="error" onClick={photo} />
        <CustomButton title="相机测试" type="primary" onClick={startCamera} />
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
