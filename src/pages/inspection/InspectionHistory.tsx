import React, { useRef, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { useSelector } from 'react-redux';
import apis from '../../apis';
import { ListData, NavBar, Popup } from '../../common/Component';
import { post } from '../../HiNet';
import { dayFormat, randomId, togetherUrl } from '../../utils';
export default (props: any) => {
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  const userInfo = useSelector((state) => {
    return state.userInfo.userInfo;
  });
  const listRef = useRef();
  const isFaultReport = (report: any) => {
    if (report.status === 2) {
      Alert.alert('提示', '巡检故障是否已修复完毕', [
        {
          text: '已修复',
          onPress: () => {
            post(apis.completeInspection)({ id: report._id })().then(() => {
              Alert.alert('修改成功');
              listRef.current?.refresh();
            });
          },
        },
        {
          text: '取消',
          onPress: () => {},
        },
      ]);
    }
  };
  const renderItem = (data) => {
    return (
      <TouchableOpacity
        onPress={() => {
          isFaultReport(data);
        }}
        style={[styles.renderBox, { borderColor: theme.borderColor }]}
      >
        <View style={styles.boxRow}>
          <Text>上报人：{data?.reportUser?.nickName}</Text>
          <Text>上报时间：{dayFormat(data?.createTime)}</Text>
        </View>
        <View style={styles.boxRow}>
          <Text>巡检点：{data?.parentId?.office}</Text>
          <Text>办公点：{data?.childrenId?.office}</Text>
        </View>
        <View style={styles.boxRow}>
          <Text>状态：{data?.status === 1 ? '正常' : '故障'}</Text>
          <Text>巡检点负责人：{data?.headUser?.nickName}</Text>
        </View>
        <View style={styles.boxRow}>
          {data?.serviceTime && <Text>维修时间：{dayFormat(data?.serviceTime)}</Text>}
          {data?.completeTime && <Text>完成时间：{dayFormat(data?.completeTime)}</Text>}
        </View>
        <Text>巡检情况：{data?.remark}</Text>
        {data?.remarkPhoto ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {data?.remarkPhoto.map((photo) => (
              <Image
                key={randomId()}
                source={{ uri: togetherUrl(photo) }}
                style={{ width: 100, height: 100, marginRight: 1, marginBottom: 1 }}
              />
            ))}
          </View>
        ) : (
          <Text>暂无现场图片</Text>
        )}
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={[{ backgroundColor: theme.primary }, styles.root]}>
      <NavBar title="巡检记录" {...props} />
      <View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
        <ListData
          ref={listRef}
          url={apis.getInspectionList}
          renderItem={renderItem}
          params={{ status: props?.route?.params?.status ?? 1 }}
        />
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
