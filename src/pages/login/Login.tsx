import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import NavigationUtil from '../../navigator/NavigationUtil';
import { useDispatch } from 'react-redux';

export default (props: any) => {
  const dispatch = useDispatch();
  const toPage = () => {
    const { navigation } = props;
    dispatch({ type: 'BOTTOMNAVIGATION', bottomNavigation: ['Test'] });
    NavigationUtil.goPage({ navigation }, 'Home');
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
