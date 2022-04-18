import {observer} from 'mobx-react-lite';
import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {app} from 'store/app';
import {authentication} from 'store/authentication';
import {Button} from 'styled_components/Button';
import {colors} from 'utils/colors';
import {Header} from 'styled_components/Header';
import {Input} from 'styled_components/Input';
import {moderateScale} from 'utils/normalize';
import {SwitchComponent} from 'styled_components/SwitchComponent';
import {useToggle} from 'hooks/useToggle';
import {LogoutModal} from 'styled_components/LogoutModal';

export const WorkerSettings = observer(({navigation}) => {
  const [is_logout_modal_visible, SetIsLogoutModalVisible] = useToggle(false);
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
              navigation.navigate('ChangePasswordModal', {
                parent: 'WorkerSettings',
              })
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
      <TouchableOpacity
        onPress={SetIsLogoutModalVisible}
        style={{marginBottom: 10}}>
        <Text
          style={{
            fontSize: moderateScale(17),
            color: '#AAA8A7',
            fontFamily: 'Inter-Medium',
          }}>
          Выйти из аккаунта
        </Text>
      </TouchableOpacity>
      <LogoutModal
        visible={is_logout_modal_visible}
        navigation={navigation}
        closeModal={SetIsLogoutModalVisible}
      />
    </View>
  );
});
