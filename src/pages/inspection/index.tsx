import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { NavBar } from '../../common/Component';
export default (props: any) => {
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  return (
    <SafeAreaView style={[{ backgroundColor: theme.primary }, styles.root]}>
      <NavBar title="巡检" />
      <View style={{ flex: 1, backgroundColor: theme.backgroundColor }}></View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
