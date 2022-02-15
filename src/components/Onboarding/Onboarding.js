import React, {useState, useEffect} from 'react';
import {View, BackHandler} from 'react-native';
import {OnboardingScreens} from './OnboardingScreens';
import {SelectRole} from './SelectRole';

export const Onboarding = ({navigation, route}) => {
  const [role, SetRole] = useState('owner');
  const [is_select_role_screen, SetIsSelectRoleScreen] = useState(true);
  useEffect(() => {
    let backhandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );
    navigation.addListener('blur', () => {
      backhandler.remove();
    });
    navigation.addListener('focus', () => {
      backhandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => true,
      );
    });
  }, []);

  return (
    <View>
      {is_select_role_screen ? (
        <SelectRole
          role={role}
          navigation={navigation}
          SetRole={SetRole}
          SetIsSelectRoleScreen={SetIsSelectRoleScreen}
        />
      ) : (
        <OnboardingScreens
          role={role}
          SetIsSelectRoleScreen={SetIsSelectRoleScreen}
          navigation={navigation}
          route={route}
          SetIsSelectRoleScreen={SetIsSelectRoleScreen}
        />
      )}
    </View>
  );
};
