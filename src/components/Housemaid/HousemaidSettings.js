import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import { authentication } from 'store/authentication';
import { Button } from 'utils/Button';
import {colors} from 'utils/colors';
import {Header} from 'utils/Header';
import {Input} from 'utils/Input';
import {moderateScale} from 'utils/Normalize';
import {SwitchComponent} from 'utils/SwitchComponent';

export const HousemaidSettings = ({navigation}) => {
  const [password, SetPassword] = useState('dsfdsf');
  const [is_notification_active, SetIsNotificationActive] = useState(true);
  const logout = () => {
    authentication.logout();
    navigation.navigate('Onboarding');
  };
  return (
    <View>
      <Header
        title="Настройки"
        navigation={navigation}
        to="HousemaidCleanings"
      />
      <View style={{padding: 20}}>
        <View style={{marginBottom: 20}}>
          <Input
            title={'пароль'}
            is_password={true}
            value={password}
            onChangeText={SetPassword}
          />
          <Text
            style={{
              color: colors.orange,
              fontFamily: 'Inter-Medium',
              fontSize: moderateScale(15),
              marginLeft: 10,
              marginTop: 10,
            }}>
            изменить пароль
          </Text>
        </View>
        <View>
          <Button text={'Выйти'} onPress={logout} />
        </View>
        <SwitchComponent
          title={'Уведомления'}
          is_active={is_notification_active}
          SetIsActive={SetIsNotificationActive}
        />
      </View>
    </View>
  );
};
