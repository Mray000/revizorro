import {createStackNavigator} from '@react-navigation/stack';
import {AddCheckList} from 'components/CheckLists/AddCheckList';
import {AddFlat} from 'components/Flats/AddFlat';
import {AddWorker} from 'components/Workers/AddWorker';
import React, {useState, useEffect} from 'react';
import {FlatTypes} from 'utils/FlatTypes';
import {AddCleaning} from './AddCleaning';
import {AddCleaningCalendar} from './AddCleaningCalendar';
import {CleaningCheckLists} from './CleaningCheckLists';
import {CleaningFlats} from './CleaningFlats';
import {CleaningHousemaids} from './CleaningHousemaids';
import {CleaningsList} from './CleaningsList';
import {DayCleaningsList} from './DayCleaningsList';
import { EditCleaning } from './EditCleaning';

const Stack = createStackNavigator();
export const Cleanings = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: 'white'},
      }}
      initialRouteName="CleaningsList">
      <Stack.Screen name="AddCleaning" component={AddCleaning} />
      <Stack.Screen name="CleaningFlats" component={CleaningFlats} />
      <Stack.Screen name="AddFlat" component={AddFlat} />
      <Stack.Screen name="AddCheckList" component={AddCheckList} />
      <Stack.Screen name="AddWorker" component={AddWorker} />
      <Stack.Screen name="FlatTypes" component={FlatTypes} />
      <Stack.Screen name="CleaningsList" component={CleaningsList} />
      <Stack.Screen name="CleaningCheckLists" component={CleaningCheckLists} />
      <Stack.Screen name="CleaningHousemaids" component={CleaningHousemaids} />
      <Stack.Screen name="DayCleaningsList" component={DayCleaningsList} />
      <Stack.Screen name="EditCleaning" component={EditCleaning} />
      <Stack.Screen
        name="AddCleaningCalendar"
        component={AddCleaningCalendar}
      />
    </Stack.Navigator>
  );
};
