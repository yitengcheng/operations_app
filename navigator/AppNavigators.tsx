import Reactfrom 'react';
import { pages } from './routers';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import store from '../store';

const Stack = createNativeStackNavigator();
const { Navigator, Screen } = Stack;

export default () => {
  return (
    <Provider store={store}>
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
