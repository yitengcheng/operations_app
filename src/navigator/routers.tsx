import React from 'react';

import Home from '../pages/Home';
import Test from '../pages/Test';
import Login from '../pages/login/Login';
import Detail from '../pages/Detail';

//图标引入
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// 底部导航
export const tabs = {
  Test: {
    screen: Test,
    navigationOptions: {
      tabBarLabel: '测试',
      headerShown: false,
      tabBarIcon: ({color, focused}) => {
        return <MaterialIcons name={'whatshot'} size={26} style={{color}} />;
      },
    },
  },
};

// 页面路由
export const pages = [
  {
    name: 'Login',
    component: Login,
  },
  {
    name: 'Home',
    component: Home,
  },
  {
    name: 'Test',
    component: Test,
  },
  {
    name: 'Detail',
    component: Detail,
  },
];
