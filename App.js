import React, {useEffect, useState} from 'react';
import {SafeAreaView, Text, View} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {Login} from './src/components/Authentication/Login.js';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Registration} from './src/components/Authentication/Registration.js';
import {AddWorker} from './src/components/Workers/AddWorker.js';
import {BottomNavigator} from 'utils/BottomNavigator.js';
import {authentication} from './src/store/authentication.js';
import {profile} from './src/store/profile.js';
import WorkersIcon from 'assets/workers.svg';
import WorkersActive from 'assets/workers_active.svg';
import FlatsIcon from 'assets/home.svg';
import FlatsActive from 'assets/home_active.svg';
import CleaningsIcon from 'assets/cleaning.svg';
import CleaningsActive from 'assets/cleaning_active.svg';
import CheckListsIcon from 'assets/check_list.svg';
import CheckListsActive from 'assets/check_list_active.svg';
import SettingsIcon from 'assets/settings.svg';
import SettingsActive from 'assets/settings_active.svg';
import {Success} from './src/components/Success/Success.js';
import {api, getAsyncData} from 'utils/api.js';
import {Workers} from 'components/Workers/Workers.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button} from 'utils/Button.js';
import {Flats} from 'components/Flats/Flats.js';
import {CheckLists} from 'components/CheckLists/CheckLists.js';
import {Onboarding} from 'components/Onboarding/Onboarding.js';
import {Cleanings} from 'components/Cleanings/Cleanings.js';
import {Housemaid} from 'components/Housemaid/Housemaid.js';
import {observer} from 'mobx-react-lite';
import {app} from 'store/app.js';
const Tab = createBottomTabNavigator();
const App = observer(() => {
  console.log('RERNEDNENDN');
  let role = app.role;
  let accesses = app.accesses;
  const [is_load, SetIsLoad] = useState(false);
  useEffect(() => {
    (async () => {
      let data = await getAsyncData();
      if (data) {
        authentication.SetAccessToken(data.accessToken);
        authentication.SetRefreshToken(data.refreshToken);
        let is_token_normal = await api.refresh_token();
        if (is_token_normal) await app.setMe();
      }
      SetIsLoad(true);
    })();
  }, []);

  console.log(role);

  if (!is_load) return null;
  return (
    <SafeAreaView style={{flex: 1}}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: {backgroundColor: 'white'},
          }}
          tabBar={props => <BottomNavigator {...props} />}
          initialRouteName={
            role
              ? role != 'role_maid'
                ? 'Cleanings'
                : 'Housemaid'
              : 'Onboarding'
          }>
          <Tab.Screen
            name="Housemaid"
            options={{hidden: 'true'}}
            component={Housemaid}
          />
          <Tab.Screen
            name="Cleanings"
            options={{
              label: 'Уборки',
              icon: CleaningsIcon,
              icon_active: CleaningsActive,
            }}
            component={Cleanings}
          />
          {accesses.includes('workers') || role != 'role_manager' ? (
            <Tab.Screen
              name="Workers"
              options={{
                label: 'Сотрудники',
                icon: WorkersIcon,
                icon_active: WorkersActive,
              }}
              component={Workers}
            />
          ) : null}
          {accesses.includes('check_lists') || role != 'role_manager' ? (
            <Tab.Screen
              name="CheckLists"
              options={{
                label: 'Чек-листы',
                icon: CheckListsIcon,
                icon_active: CheckListsActive,
              }}
              component={CheckLists}
            />
          ) : null}

          {role !== 'role_manager' ? (
            <Tab.Screen
              name="Flats"
              options={{
                label: 'Квартиры',
                icon: FlatsIcon,
                icon_active: FlatsActive,
              }}
              component={Flats}
            />
          ) : null}

          <Tab.Screen
            name="Settings"
            options={{
              label: 'Настройки',
              icon: SettingsIcon,
              icon_active: SettingsActive,
            }}
            component={Settings}
          />
          <Tab.Screen
            name="Onboarding"
            component={Onboarding}
            options={{hidden: true}}
          />
          <Tab.Screen
            name="Login"
            component={Login}
            options={{hidden: true, headerLeft: () => null}}
          />
          <Tab.Screen
            name="Registration"
            component={Registration}
            options={{hidden: true}}
          />
          <Tab.Screen
            name="Success"
            component={Success}
            options={{hidden: true}}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
});

const Settings = ({navigation}) => {
  const logout = () => {
    authentication.logout();
    navigation.navigate('Onboarding');
  };
  return (
    <View>
      <Button text={'Выйти'} onPress={logout} />
    </View>
  );
};

export default App;
