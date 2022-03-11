import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { NavBar } from '../../common/Component';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Assets from './Assets';
import Statistical from './Statistical';

export default (props: any) => {
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: '0', title: '资产' },
    { key: '1', title: '统计' },
  ]);
  return (
    <SafeAreaView style={[{ backgroundColor: theme.primary }, styles.root]}>
      <NavBar title="统计" />
      <View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={SceneMap({
            0: Assets,
            1: Statistical,
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
});
