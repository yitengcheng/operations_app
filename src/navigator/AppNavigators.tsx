import React, {useState} from 'react';
import {pages} from './routers';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {Provider} from 'react-redux';
import store from '../store';

const Stack = createNativeStackNavigator();
const {Navigator, Screen} = Stack;

export default (props: any) => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Navigator>
          {pages.map((item, index) => (
            <Screen
              name={item.name}
              component={item.component}
              options={{headerShown: false}}
              key={index}
            />
          ))}
        </Navigator>
      </NavigationContainer>
    </Provider>
  );
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
