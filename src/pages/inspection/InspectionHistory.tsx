import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import apis from '../../apis';
import { ListData, NavBar } from '../../common/Component';
export default (props: any) => {
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  const userInfo = useSelector((state) => {
    return state.userInfo.userInfo;
  });
  const renderItem = (data) => {
    return (
      <View style={[styles.renderBox, { borderColor: theme.borderColor }]}>
        <View style={styles.boxRow}>
          <Text>上报人：{data.reportUser.nickName}</Text>
          <Text>上报时间：{data.createTime}</Text>
        </View>
        <View style={styles.boxRow}>
          <Text>巡检点：{data.parentId.office}</Text>
          <Text>办公点：{data.childrenId.office}</Text>
        </View>
        <Text>巡检情况：{data.remark}</Text>
      </View>
    );
  };
  return (
    <SafeAreaView style={[{ backgroundColor: theme.primary }, styles.root]}>
      <NavBar title="巡检历史" {...props} />
      <View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
        <ListData url={apis.getInspectionList} renderItem={renderItem} />
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
    justifyContent: 'space-between',
    marginBottom: 5,
  },
});
