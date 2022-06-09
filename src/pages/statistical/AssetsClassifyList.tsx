import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import apis from '../../apis';
import { ListData, NavBar } from '../../common/Component';
import _ from 'lodash';
import { randomId } from '../../utils';

export default (props: any) => {
  const theme = useSelector((state) => {
    return state.theme.theme;
  });

  const renderItem = (data) => {
    delete data._id;
    delete data.__v;
    return (
      <View style={[styles.renderBox, { borderColor: theme.borderColor }]}>
        {_.toPairs(data).map((item) => {
          return (
            <View key={randomId()} style={styles.boxRow}>
              <Text>{item[0]}：</Text>
              <Text>{item[1]}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={[{ backgroundColor: theme.primary }, styles.root]}>
      <NavBar title="资产列表" {...props} />
      <View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
        <ListData url={apis.listByField} params={{ condition: { ...props.route.params } }} renderItem={renderItem} />
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  renderBox: {
    borderBottomWidth: 1,
    padding: 10,
  },
  boxRow: {
    flexDirection: 'row',
    marginBottom: 5,
    paddingHorizontal: 10,
  },
});
