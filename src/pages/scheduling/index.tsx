import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import Agenda from '../../common/Agenda';
import { NavBar } from '../../common/Component';

export default (props: any) => {
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  return (
    <SafeAreaView style={[{ backgroundColor: theme.primary }, styles.root]}>
      <NavBar title="排班" />
      <Agenda />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
