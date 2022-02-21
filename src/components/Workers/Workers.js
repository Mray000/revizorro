import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import {AddWorker} from './AddWorker';
import {WorkersList} from './WorkersList';
import {createStackNavigator} from '@react-navigation/stack';
import {WorkerProfile} from './WorkerProfile';
import {EditWorker} from './EditWorker';
import {app} from 'store/app';
const Stack = createStackNavigator();
export const Workers = ({navigation, route}) => {
  useEffect(() => {
    console.log('UAER');
  }, []);
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: 'white'},
      }}
      initialRouteName={'WorkersList'}>
      <Stack.Screen name="AddWorker" component={AddWorker} />
      <Stack.Screen name="WorkersList" component={WorkersList} />
      <Stack.Screen name="WorkerProfile" component={WorkerProfile} />
      <Stack.Screen name="EditWorker" component={EditWorker} />
    </Stack.Navigator>
  );
};
