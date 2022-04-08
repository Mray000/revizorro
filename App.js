import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Dimensions,
  Platform,
  SafeAreaView,
  Text,
  View,
} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {Login} from './src/components/Authentication/Login.js';
import {ChangePassword} from './src/components/Authentication/ChangePassword.js';
import {ChangePasswordModal} from './src/components/Authentication/ChangePasswordModal.js';
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
import {WorkerSettings} from 'components/Workers/WorkerSettings.js';
import {Button} from 'utils/Button.js';
import {Flats} from 'components/Flats/Flats.js';
import {CheckLists} from 'components/CheckLists/CheckLists.js';
import {Onboarding} from 'components/Onboarding/Onboarding.js';
import {Cleanings} from 'components/Cleanings/Cleanings.js';
import {Housemaid} from 'components/Housemaid/Housemaid.js';
import {Settings} from 'components/Authentication/Settings.js';
import {RateChoice} from 'components/Authentication/RateChoice.js';
import {SubscriptionDisactive} from 'components/Authentication/SubscriptionDisactive.js';
import {fcmService} from './src/utils/FCMService.js';
import {localNotificationService} from './src/utils/LocalNotificationService';
import {observer} from 'mobx-react-lite';
import {app} from './src/store/app.js';
import {rate} from './src/store/rate.js';
import {Loader} from 'utils/Loader.js';
import iap from 'react-native-iap';

const Tab = createBottomTabNavigator();
const App = observer(() => {
  let role = app.role;
  let accesses = app.accesses;

  const [is_load, SetIsLoad] = useState(false);

  useEffect(() => {
    let purchaseUpdatedListener;
    let purchaseErrorListener;

    (async () => {
      let data = await getAsyncData();

      await iap.initConnection();
      purchaseErrorListener = iap.purchaseErrorListener(async error => {
        Alert.alert(
          'Ошибка',
          'Во время попытки оформить подписку произошла ошибка. Код ошибки-',
          error.code,
        );
      });

      purchaseUpdatedListener = iap.purchaseUpdatedListener(async purhcase => {
        const receipt = purhcase.transactionReceipt;
        if (receipt) {
          // Alert.alert('Тестовое сообщение', 'оплата прошла');
          // let tarif_id = Number(rate.selected_tarf_id.split('_')[1]);
          let tarif_id = 1;
          await api.setTarif(tarif_id);
          await iap.finishTransaction(purhcase, true);
          rate.setIsSubscriptionActive(true);
          rate.setIsSubscriptionPaid(true);
        }
      });

      if (data) {
        authentication.SetAccessToken(data.accessToken);
        authentication.SetRefreshToken(data.refreshToken);
        let is_token_normal = await api.refresh_token();
        if (is_token_normal) await app.setMe();
      }
      SetIsLoad(true);
    })();

    return () => {
      console.log('APP unreigster');
      fcmService.unRegitster();
      localNotificationService.unregister();
      purchaseErrorListener.remove();
      purchaseUpdatedListener.remove();
      iap.endConnection();
    };
  }, []);
  let is_company_active = rate.is_subscription_active;
  if (!is_load) return <Loader />;
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'rgba(40,60,0,0)'}}>
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
                  : 'RateChoice'
                : is_company_active
                ? 'Housemaid'
                : 'SubscriptionDisactive'
              : 'Onboarding'
          }
          // initialRouteName={'RateChoice'}
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
            name="RateChoice"
            component={RateChoice}
            options={{hidden: true}}
          />
          <Tab.Screen
            name="SubscriptionDisactive"
            component={SubscriptionDisactive}
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

export default App;
