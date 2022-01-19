import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ConfirmButton,
  NavBar,
  WarrningButton,
  ErrorButton,
} from '../common/Component';
export default (props: any) => {
  const toDetail = () => {
    const {
      navigation: {navigate},
    } = props;
    navigate('Detail');
  };
  return (
    <SafeAreaView style={styles.root}>
      <NavBar title="测试" />
      <View style={{flexDirection: 'row'}}>
        <ConfirmButton title="详情" onClick={toDetail} />
        <WarrningButton title="警告" />
        <ErrorButton title="错误" />
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
