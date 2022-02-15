import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {HousemaidClenaings} from '../Housemaid/HousemaidCleanings';
import {HousemaidSettings} from 'components/Housemaid/HousemaidSettings';
import { DayCleaningsList } from 'components/Cleanings/DayCleaningsList';
import { CompleteCleaning } from './CompleteCleaning';
const Stack = createStackNavigator();
export const Housemaid = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: 'white'},
      }}
      initialRouteName="HousemaidCleanings">
      <Stack.Screen name="HousemaidCleanings" component={HousemaidClenaings} />
      <Stack.Screen name="HousemaidSettings" component={HousemaidSettings} />
      <Stack.Screen name="DayCleaningsList" component={DayCleaningsList} />
      <Stack.Screen name="CompleteCleaning" component={CompleteCleaning} />
    </Stack.Navigator>
  );
};
