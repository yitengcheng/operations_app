/**
 * @format
 */

import { AppRegistry } from 'react-native';
import 'react-native-gesture-handler';
import { name as appName } from './app.json';
import App from './src/navigator/AppNavigators';
import { simpleUpdate } from 'react-native-update';

AppRegistry.registerComponent(appName, () => simpleUpdate(App));
