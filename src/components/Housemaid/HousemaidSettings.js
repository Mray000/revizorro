import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {authentication} from 'store/authentication';
import {Button} from 'utils/Button';
import {colors} from 'utils/colors';
import {Header} from 'utils/Header';
import {Input} from 'utils/Input';
import {moderateScale} from 'utils/Normalize';
import {SwitchComponent} from 'utils/SwitchComponent';

export const HousemaidSettings = ({navigation}) => {
  const [password, SetPassword] = useState('');
  const [is_notification_active, SetIsNotificationActive] = useState(true);
  const logout = () => {
    authentication.logout();
    navigation.navigate('Onboarding');
  };
  return (
    <View style={{flex: 1, justifyContent: 'space-between', alignItems: "center"}}>
      <View style={{width: "100%"}}>
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
          <SwitchComponent
            title={'Уведомления'}
            is_active={is_notification_active}
            SetIsActive={SetIsNotificationActive}
          />
        </View>
      </View>
      <TouchableOpacity onPress={logout} style={{marginBottom: 10}}>
        <Text
          style={{
            fontSize: moderateScale(17),
            color: '#AAA8A7',
            fontFamily: 'Inter-Medium',
          }}>
          Выйти из аккаунта
        </Text>
      </TouchableOpacity>
    </View>
  );
};
