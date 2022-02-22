import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { DynamicTabNavigator } from '../navigator/DynamicTabNavigator';
import NavigationUtil from '../navigator/NavigationUtil';
import { bottomNavigation } from '../utils';

export default (props: any) => {
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  const bn = useSelector((store) => {
    return store.bottomNavigation.bottomNavigation;
  });
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
