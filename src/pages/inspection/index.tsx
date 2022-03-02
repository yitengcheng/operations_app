import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
export default (props: any) => {
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  return (
    <SafeAreaView style={[{ backgroundColor: theme.primary }, styles.root]}>
      <Text>巡检</Text>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
