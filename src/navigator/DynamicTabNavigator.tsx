import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';

const Tab = createBottomTabNavigator();

export const DynamicTabNavigator = (props: any) => {
  const { bottomNavigation } = props; // 根据需要定制显示的tab
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  return (
    <Tab.Navigator
      activeColor={theme.primary}
      screenOptions={{
        tabBarStyle: {
          paddingBottom: 5,
          height: 55,
        },
      }}
    >
      {_.toPairs(bottomNavigation).map((item) => {
        return (
          <Tab.Screen key={item[0]} name={item[0]} component={item[1].screen} options={item[1].navigationOptions} />
        );
      })}
    </Tab.Navigator>
  );
};
