import {createStackNavigator} from '@react-navigation/stack';
import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import {AddFlat} from './AddFlat';
import {EditFlat} from './EditFlat';
import {FlatProfile} from './FlatProfile';
import {FlatsList} from './FlatsList';
import {FlatTypes} from './FlatTypes';

const Stack = createStackNavigator();
export const Flats = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: 'white'},
      }}
      initialRouteName="FlatsList">
      <Stack.Screen name="FlatsList" component={FlatsList} />
      <Stack.Screen name="AddFlat" component={AddFlat} />
      <Stack.Screen name="FlatTypes" component={FlatTypes} />
      <Stack.Screen name="FlatProfile" component={FlatProfile} />
      <Stack.Screen name="EditFlat" component={EditFlat} />
    </Stack.Navigator>
  );
};
