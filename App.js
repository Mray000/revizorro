import React, {useEffect, useState} from 'react';
import {AppState, Platform, SafeAreaView} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {Login} from './src/components/Authentication/Login.js';
import {ChangePassword} from './src/components/Authentication/ChangePassword.js';
import {ChangePasswordModal} from './src/components/Authentication/ChangePasswordModal.js';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Registration} from './src/components/Authentication/Registration.js';
import {BottomNavigator} from 'styled_components/BottomNavigator.js';
import {authentication} from './src/store/authentication.js';
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

import {requestATTPermission} from './src/utils/PermisionsAccess';
import {Workers} from 'components/Workers/Workers.js';
import {WorkerSettings} from 'components/Workers/WorkerSettings.js';
import {Flats} from 'components/Flats/Flats.js';
import {CheckLists} from 'components/CheckLists/CheckLists.js';
import {Onboarding} from 'components/Onboarding/Onboarding.js';
import {Cleanings} from 'components/Cleanings/Cleanings.js';
import {Housemaid} from 'components/Housemaid/Housemaid.js';
import {Settings} from 'components/Authentication/Settings.js';
import {Support} from 'components/Authentication/Support.js';
import {TarifSelect} from 'components/Authentication/TarifSelect.js';
import {TarifDisactive} from 'components/Authentication/TarifDisactive.js';
import {observer} from 'mobx-react-lite';
import {app} from './src/store/app.js';
import {tarif} from './src/store/tarif.js';
import {Loader} from 'styled_components/Loader.js';
import SplashScreen from 'react-native-splash-screen';

const Tab = createBottomTabNavigator();

const App = observer(() => {
  let role = app.role;
  let accesses = app.accesses;

  const [is_load, SetIsLoad] = useState(false);

  const handleAppStateChange = nextState => {
    if (nextState === 'active') {
      if (Platform.OS === 'ios') {
        requestATTPermission();
      } else {
        SplashScreen.hide();
      }
    }
  };

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);

    (async () => {
      await authentication.onAppOpen();
      SetIsLoad(true);
    })();

    return app.onAppClose;
  }, []);

  let is_company_active = tarif.is_tarif_active;
  if (!is_load) return <Loader />;
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
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
                ? is_company_active
                  ? 'Cleanings'
                  : 'TarifSelect'
                : is_company_active
                ? 'Housemaid'
                : 'TarifDisactive'
              : 'Onboarding'
          }
          // initialRouteName={'TarifSelect'}
        >
          {app.role == 'role_maid' && is_company_active ? (
            <Tab.Screen
              name="Housemaid"
              options={{hidden: 'true'}}
              component={Housemaid}
            />
          ) : null}

          {is_company_active ? (
            <Tab.Screen
              name="Cleanings"
              options={{
                label: 'Уборки',
                icon: CleaningsIcon,
                icon_active: CleaningsActive,
              }}
              component={Cleanings}
            />
          ) : null}

          {accesses.includes('workers') ||
          (role != 'role_manager' && is_company_active) ? (
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
          {accesses.includes('check_lists') ||
          (role != 'role_manager' && is_company_active) ? (
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

          {role !== 'role_manager' && is_company_active ? (
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

          {role == 'role_admin' && is_company_active ? (
            <Tab.Screen
              name="Settings"
              options={{
                label: 'Настройки',
                icon: SettingsIcon,
                icon_active: SettingsActive,
              }}
              component={Settings}
            />
          ) : null}
          {role != 'role_admin' && is_company_active ? (
            <Tab.Screen
              name="WorkerSettings"
              options={{
                label: 'Настройки',
                icon: SettingsIcon,
                icon_active: SettingsActive,
                hidden: app.role == 'role_maid',
              }}
              component={WorkerSettings}
            />
          ) : null}
          <Tab.Screen
            name="ChangePassword"
            options={{hidden: true}}
            component={ChangePassword}
          />
          <Tab.Screen
            name="ChangePasswordModal"
            options={{hidden: true}}
            component={ChangePasswordModal}
          />
          <Tab.Screen
            name="Onboarding"
            component={Onboarding}
            options={{hidden: true}}
          />
          <Tab.Screen
            initialParams={{role: 'admin'}}
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
            name="TarifSelect"
            component={TarifSelect}
            options={{hidden: true}}
          />
          <Tab.Screen
            name="TarifDisactive"
            component={TarifDisactive}
            options={{hidden: true}}
          />
          <Tab.Screen
            name="Success"
            component={Success}
            options={{hidden: true}}
          />
          <Tab.Screen
            name="Support"
            component={Support}
            options={{hidden: true}}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
});

export default App;
