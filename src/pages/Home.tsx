import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, View, Text} from 'react-native';
import {useSelector} from 'react-redux';
import {DynamicTabNavigator} from '../navigator/DynamicTabNavigator';

export default (props: any) => {
  const theme = useSelector(state => {
    return state.theme.theme;
  });
  return (
    <SafeAreaView style={[{backgroundColor: theme.primary}, styles.root]}>
      <DynamicTabNavigator />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
