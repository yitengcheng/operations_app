import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Text, useWindowDimensions, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { ListData, NavBar } from '../../common/Component';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import apis from '../../apis';
import { dayFormat } from '../../utils';
import NavigationUtil from '../../navigator/NavigationUtil';
import { get } from '../../HiNet';

export default (props: any) => {
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  const userInfo = useSelector((state) => {
    return state.userInfo.userInfo;
  });
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 1, title: '待处理' },
    { key: 2, title: '已同意' },
    { key: 3, title: '已拒绝' },
  ]);
  const ListRoute = (props: any) => {
    const { key } = props.route;
    return (
      <ListData
        url={apis.getChangeDutyList}
        params={{ mixStatus: key }}
        renderItem={(data) => {
          return (
            <TouchableOpacity
              style={{ padding: 10, borderBottomWidth: 1, borderColor: theme.borderColor }}
              onPress={() => {
                NavigationUtil.goPage(
                  {
                    title: '调班详情',
                    type: key == 1 ? (userInfo._id === data.applyUser._id ? 2 : 3) : 4,
                    editable: key == 1 && userInfo._id === data.applyUser._id,
                    data,
                  },
                  'ChangeShiftDetail',
                );
              }}
            >
              <View style={styles.listItemRow}>
                <Text>申请人：{data.applyUser.nickName}</Text>
                <Text>申请时间：{dayFormat(data.createTime)}</Text>
              </View>
              <View style={styles.listItemRow}>
                <Text>调班日期：{dayFormat(data.dutyTime)}</Text>
                <Text>调换的值班人员：{data.mixUser.nickName}</Text>
              </View>
              <View style={styles.listItemRow}>
                <Text>备注：{data.mixRemark}</Text>
              </View>
              <View style={styles.listItemRow}>
                <Text>上级备注：{data.reason}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    );
  };
  return (
    <SafeAreaView style={[{ backgroundColor: theme.primary }, styles.root]}>
      <NavBar title="调班列表" {...props} />
      <View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={SceneMap({
            1: ListRoute,
            2: ListRoute,
            3: ListRoute,
          })}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              indicatorStyle={{ backgroundColor: theme.primary }}
              activeColor={theme.primary}
              inactiveColor={theme.fontColor}
              style={{ backgroundColor: '#FFFFFF' }}
            />
          )}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
        />
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  listItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
});
