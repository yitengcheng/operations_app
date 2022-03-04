import React from 'react';
import { SafeAreaView, StyleSheet, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { DynamicTabNavigator } from '../navigator/DynamicTabNavigator';
import { bottomNavigation } from '../utils';
import NavigationUtil from '../navigator/NavigationUtil';

export default (props: any) => {
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  const bn = useSelector((state) => {
    return state.bottomNavigation.bottomNavigation;
  });
  const pages = useSelector((state) => {
    return state.pages.pages;
  });
  NavigationUtil.pages = pages;
  NavigationUtil.navigation = props.navigation;
  return (
    <SafeAreaView style={[{ backgroundColor: theme.primary }, styles.root]}>
      <DynamicTabNavigator bottomNavigation={bottomNavigation(bn)} />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
