import {createStackNavigator} from '@react-navigation/stack';
import {FlatTypes} from 'components/Flats/FlatTypes';
import React, {useState, useEffect} from 'react';
import {AddCheckList} from './AddCheckList';
import {CheckListsFlatTypes} from './CheckListsFlatTypes';
import {EditCheckList} from './EditCheckList';
import {ListOfCheckLists} from './ListOfCheckLists';

const Stack = createStackNavigator();
export const CheckLists = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: 'white'},
      }}
      initialRouteName="ListOfCheckLists">
      <Stack.Screen name="AddCheckList" component={AddCheckList} />
      <Stack.Screen name="CheckListsFlatTypes" component={CheckListsFlatTypes} />
      <Stack.Screen name="ListOfCheckLists" component={ListOfCheckLists} />
      <Stack.Screen name="EditCheckList" component={EditCheckList} />
    </Stack.Navigator>
  );
};
