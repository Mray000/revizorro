import {observer} from 'mobx-react-lite';
import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {app} from 'store/app';
import {authentication} from 'store/authentication';
import {Button} from 'utils/Button';
import {colors} from 'utils/colors';
import {Header} from 'utils/Header';
import {Input} from 'utils/Input';
import {moderateScale} from 'utils/Normalize';
import {SwitchComponent} from 'utils/SwitchComponent';

export const WorkerSettings = observer(({navigation}) => {
  const logout = () => {
    authentication.logout();
    navigation.navigate('Onboarding');
  };
  return (
    <View
      style={{flex: 1, justifyContent: 'space-between', alignItems: 'center'}}>
      <View style={{width: '100%'}}>
        <Header title="Настройки" onBack={() => navigation.goBack()} />
        <View style={{padding: 20}}>
          <SwitchComponent
            title={'Уведомления'}
            is_active={app.is_notify}
            SetIsActive={app.setNotification}
          />
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ChangePassword', {parent: 'WorkerSettings'})
            }>
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
          </TouchableOpacity>
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
});
