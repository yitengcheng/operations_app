import React, { useRef, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { useSelector } from 'react-redux';
import apis from '../../apis';
import { ListData, NavBar, Popup } from '../../common/Component';
import { post } from '../../HiNet';
import { dayFormat, randomId, togetherUrl } from '../../utils';
import NavigationUtil from '../../navigator/NavigationUtil';
export default (props: any) => {
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  const userInfo = useSelector((state) => {
    return state.userInfo.userInfo;
  });
  const listRef = useRef();
  const { title } = props.route.params;
  const [customerId, setCustomerId] = useState();

  const report = (data) => {
    NavigationUtil.goPage({ title: '故障上报', assetsId: data._id }, 'RepairDetail');
  };

  const renderItem = (data) => {
    return (
      <TouchableOpacity
        onPress={() => {
          report(data);
        }}
        style={[styles.renderBox, { borderColor: theme.borderColor }]}
      >
        <View style={styles.boxRow}>
          <Text>名称：{data?.name}</Text>
          <Text>型号：{data?.models}</Text>
        </View>
        <View style={styles.boxRow}>
          <Text>品牌：{data?.brand}</Text>
          <Text>固定资产编号：{data?.fixedNumber}</Text>
        </View>
        <Text>备注：{data?.remark}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[{ backgroundColor: theme.primary }, styles.root]}>
      <NavBar title={title} {...props} />
      <View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
        <ListData ref={listRef} url={apis.goodShareList} renderItem={renderItem} params={{ customerId }} />
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
