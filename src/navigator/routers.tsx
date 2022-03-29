import React from 'react';

import Home from '../pages/Home';
import Login from '../pages/login/Login';
import Detail from '../pages/Detail';
import Personal from '../pages/personal';
import Repair from '../pages/repair';
import Inspection from '../pages/inspection';
import Scheduling from '../pages/scheduling';
import Statistical from '../pages/statistical';
import StaffManagement from '../pages/personal/StaffManagement';
import AddStaff from '../pages/personal/AddStaff';
import Template from '../pages/personal/Template';
import ModfiyPassword from '../pages/personal/ModfiyPassword';
import UserInfo from '../pages/personal/UserInfo';
import ChangeShiftDetail from '../pages/scheduling/ChangeShiftDetail';
import ChangeShiftList from '../pages/scheduling/ChangeShiftList';
import InspectionAddress from '../pages/inspection/InspectionAddress';
import InspectionPoint from '../pages/inspection/InspectionPoint';
import InspectionReport from '../pages/inspection/InspectionReport';
import InspectionHistory from '../pages/inspection/InspectionHistory';
import RepairList from '../pages/repair/RepairList';
import RepairDetail from '../pages/repair/RepairDetail';
import Assets from '../pages/statistical/Assets';
import { Image, StyleSheet } from 'react-native';

// 底部导航
export const tabs = {
  Personal: {
    screen: Personal,
    navigationOptions: {
      tabBarLabel: '我的',
      headerShown: false,
      tabBarIcon: ({ focused, color }) => {
        if (focused) {
          return (
            <Image source={require('../assets/image/my_active.png')} style={styles.tabIcon} resizeMode="contain" />
          );
        } else {
          return <Image source={require('../assets/image/my.png')} style={styles.tabIcon} resizeMode="contain" />;
        }
      },
    },
  },
  Statistical: {
    screen: Statistical,
    navigationOptions: {
      tabBarLabel: '统计',
      headerShown: false,
      tabBarIcon: ({ focused, color }) => {
        if (focused) {
          return (
            <Image
              source={require('../assets/image/statistical_active.png')}
              style={styles.tabIcon}
              resizeMode="contain"
            />
          );
        } else {
          return (
            <Image source={require('../assets/image/statistical.png')} style={styles.tabIcon} resizeMode="contain" />
          );
        }
      },
    },
  },
  Scheduling: {
    screen: Scheduling,
    navigationOptions: {
      tabBarLabel: '排班',
      headerShown: false,
      tabBarIcon: ({ focused, color }) => {
        if (focused) {
          return (
            <Image
              source={require('../assets/image/scheduling_active.png')}
              style={styles.tabIcon}
              resizeMode="contain"
            />
          );
        } else {
          return (
            <Image source={require('../assets/image/scheduling.png')} style={styles.tabIcon} resizeMode="contain" />
          );
        }
      },
    },
  },
  Inspection: {
    screen: Inspection,
    navigationOptions: {
      tabBarLabel: '巡检',
      headerShown: false,
      tabBarIcon: ({ focused, color }) => {
        if (focused) {
          return (
            <Image
              source={require('../assets/image/inspection_active.png')}
              style={styles.tabIcon}
              resizeMode="contain"
            />
          );
        } else {
          return (
            <Image source={require('../assets/image/inspection.png')} style={styles.tabIcon} resizeMode="contain" />
          );
        }
      },
    },
  },
  Repair: {
    screen: Repair,
    navigationOptions: {
      tabBarLabel: '工单',
      headerShown: false,
      tabBarIcon: ({ focused, color }) => {
        if (focused) {
          return (
            <Image source={require('../assets/image/repair_active.png')} style={styles.tabIcon} resizeMode="contain" />
          );
        } else {
          return <Image source={require('../assets/image/repair.png')} style={styles.tabIcon} resizeMode="contain" />;
        }
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
    name: 'Personal',
    component: Personal,
  },
  {
    name: 'Repair',
    component: Repair,
  },
  {
    name: 'Inspection',
    component: Inspection,
  },
  {
    name: 'Scheduling',
    component: Scheduling,
  },
  {
    name: 'Statistical',
    component: Statistical,
  },
  {
    name: 'StaffManagement',
    component: StaffManagement,
  },
  {
    name: 'AddStaff',
    component: AddStaff,
  },
  {
    name: 'Template',
    component: Template,
  },
  {
    name: 'ModfiyPassword',
    component: ModfiyPassword,
  },
  {
    name: 'UserInfo',
    component: UserInfo,
  },
  {
    name: 'ChangeShiftDetail',
    component: ChangeShiftDetail,
  },
  {
    name: 'ChangeShiftList',
    component: ChangeShiftList,
  },
  {
    name: 'InspectionAddress',
    component: InspectionAddress,
  },
  {
    name: 'InspectionPoint',
    component: InspectionPoint,
  },
  {
    name: 'InspectionReport',
    component: InspectionReport,
  },
  {
    name: 'InspectionHistory',
    component: InspectionHistory,
  },
  {
    name: 'RepairList',
    component: RepairList,
  },
  {
    name: 'RepairDetail',
    component: RepairDetail,
  },
  {
    name: 'Assets',
    component: Assets,
  },
];

const styles = StyleSheet.create({
  tabIcon: {
    width: 25,
    height: 25,
  },
});
