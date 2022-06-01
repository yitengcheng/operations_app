import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RNCamera } from 'react-native-camera';
import { NavBar } from './Component';

export default (props: any) => {
  const { onBarCodeRead, onClose } = props;
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavBar title="扫描资产二维码" rightTitle="关闭" onRightClick={onClose} />
      <RNCamera style={{ flex: 1 }} onBarCodeRead={onBarCodeRead}>
        <View style={{ flex: 1 }}>
          <View style={{ backgroundColor: 'rgba(0,0,0,0.8)', flex: 1 }}></View>
          <View style={{ flexDirection: 'row', height: 200 }}>
            <View style={{ backgroundColor: 'rgba(0,0,0,0.8)', flex: 1 }}></View>
            <View style={{ backgroundColor: 'rgba(255,255,255,0)', width: 200 }}></View>
            <View style={{ backgroundColor: 'rgba(0,0,0,0.8)', flex: 1 }}></View>
          </View>
          <View style={{ backgroundColor: 'rgba(0,0,0,0.8)', flex: 1 }}></View>
        </View>
      </RNCamera>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({});
