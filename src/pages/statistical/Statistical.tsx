import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text } from 'react-native';
import { useSelector } from 'react-redux';
export default (props: any) => {
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  return (
    <SafeAreaView style={[{ backgroundColor: theme.primary }, styles.root]}>
      <View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
        <Text>统计</Text>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
