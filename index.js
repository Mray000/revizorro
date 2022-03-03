/**
 * @format
 */

import {ReactNativeFirebase} from '@react-native-firebase/app';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
// ReactNativeFirebase.initializeApp();
AppRegistry.registerComponent(appName, () => App);
