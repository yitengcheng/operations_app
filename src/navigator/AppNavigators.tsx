import React, { useState } from 'react';
import { pages } from './routers';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import store from '../store';
import { ActivityIndicator, View, Text, useWindowDimensions, Modal } from 'react-native';

const Stack = createNativeStackNavigator();
const { Navigator, Screen } = Stack;

export default () => {
  const [loading, setLoading] = useState(false);
  const width = useWindowDimensions().width;
  const height = useWindowDimensions().height;
  global.showLoading = () => {
    setLoading(true);
  };
  global.hidenLoading = () => {
    setLoading(false);
  };
  return (
    <Provider store={store}>
      <Modal visible={loading} transparent animationType="fade" onRequestClose={() => setLoading(false)}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.65)',
          }}
        >
          <ActivityIndicator size="large" color="#00ff00" />
          <Text>加载中...</Text>
        </View>
      </Modal>
      <NavigationContainer>
        <Navigator>
          {pages.map((item) => (
            <Screen name={item.name} component={item.component} options={{ headerShown: false }} key={item.name} />
          ))}
        </Navigator>
      </NavigationContainer>
    </Provider>
  );
};
