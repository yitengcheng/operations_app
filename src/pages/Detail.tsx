import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, View, Text} from 'react-native';
import {NavBar} from '../common/Component';
import {useSelector} from 'react-redux';

export default (props: any) => {
  const theme = useSelector(state => {
    return state.theme.theme;
  });

  return (
    <SafeAreaView style={[{backgroundColor: theme.primary}, styles.root]}>
      <NavBar title="详情" {...props} />
      <View style={{flex: 1, backgroundColor: theme.backgroundColor}}>
        <Text>详情</Text>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
