import React, { useState, useRef } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import apis from '../../apis';
import { CustomButton, ListData, NavBar } from '../../common/Component';
import _ from 'lodash';
import NavigationUtil from '../../navigator/NavigationUtil';
import { post } from '../../HiNet';
export default (props: any) => {
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  const listRef = useRef();
  const delAsset = (id) => {
    Alert.alert('提示', '是否删除此资产', [
      {
        text: '确认',
        onPress: () => {
          post(apis.delAssets)({ id })().then((res) => {
            listRef.current?.refresh();
          });
        },
      },
      {
        text: '取消',
      },
    ]);
  };
  const renderItem = (data) => {
    let res = _.toPairs(data);
    return (
      <TouchableOpacity
        onPress={() => NavigationUtil.goPage(data, 'Assets')}
        onLongPress={() => delAsset(data._id)}
        style={{ padding: 10, borderBottomWidth: 1, borderColor: theme.borderColor }}
      >
        {res.map((item, index) => (
          <View style={{ flexDirection: 'row' }} key={index}>
            <Text style={{ color: '#000000' }}>{item?.[0]}：</Text>
            <Text style={{ color: '#000000' }}>{item?.[1]}</Text>
          </View>
        ))}
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={[{ backgroundColor: theme.primary }, styles.root]}>
      <View style={{ height: 45 }}>
        <CustomButton title="入库" onClick={() => NavigationUtil.goPage({}, 'Assets')} />
      </View>

      <View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
        <ListData url={apis.assetList} renderItem={renderItem} ref={listRef} />
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
