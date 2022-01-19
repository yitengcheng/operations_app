import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
export default (props: any) => {
  const toPage = () => {
    const {
      navigation: {navigate},
    } = props;
    navigate('Home', {msg: '跳转测试'});
  };
  return (
    <SafeAreaView style={styles.root}>
      <TouchableOpacity onPress={toPage}>
        <Text>登录</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
