import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {tabs} from './routers';
import {useSelector} from 'react-redux';

const Tab = createBottomTabNavigator();

export const DynamicTabNavigator = (props: any) => {
  const {Test} = tabs;
  const bottomNavigation = {
    Test,
  }; // 根据需要定制显示的tab
  const theme = useSelector(state => {
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
      }}>
      {Object.entries(bottomNavigation).map(item => {
        return (
          <Tab.Screen
            key={item[0]}
            name={item[0]}
            component={item[1].screen}
            options={item[1].navigationOptions}
          />
        );
      })}
    </Tab.Navigator>
  );
};
