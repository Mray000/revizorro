import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Shadow} from 'react-native-shadow-2';
import X from 'assets/x.svg';
import {moderateScale} from 'utils/normalize';
import {Input} from 'styled_components/Input';
import {Button} from 'styled_components/Button';
import {api} from 'utils/api';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {CloseButton} from 'styled_components/CloseButton';
export const ChangePasswordModal = ({navigation, route}) => {
  const [old_password, SetOldPassword] = useState('');
  const [new_password, SetNewPassword] = useState('');
  const [new_password_repeat, SetNewPasswordRepeat] = useState('');
  const [is_load, SetIsLoad] = useState(false);
  const [is_current_password_invalid, SetIsCurrentPasswordInvalid] =
    useState(false);
  let is_button_disabled =
    !old_password ||
    !new_password ||
    new_password !== new_password_repeat ||
    is_load;
  let parent = route.params.parent;
  const handleChangePassword = async () => {
    SetIsLoad(true);
    let is_ok = await api.changePassword(old_password, new_password);
    if (!is_ok) SetIsCurrentPasswordInvalid(true);
    else {
      SetOldPassword('');
      SetNewPassword('');
      SetNewPasswordRepeat('');
      SetIsCurrentPasswordInvalid(false);
      navigation.navigate('Success', {
        to: parent,
        title: 'Пароль успешно изменен',
      });
    }
    SetIsLoad(false);
  };
  return (
    <View style={{flex: 1}}>
      <KeyboardAwareScrollView
        contentContainerStyle={{flex: 1}}
        style={{flex: 1, padding: 10}}>
        <CloseButton onPress={() => navigation.navigate(parent)} />

        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text
            style={{
              fontFamily: 'Inter-SemiBold',
              fontSize: moderateScale(20),
              color: 'black',
            }}>
            Изменение пароля
          </Text>
          <Input
            is_password={true}
            placeholder={'Введите старый пароль'}
            value={old_password}
            onChangeText={SetOldPassword}
            is_error={is_current_password_invalid}
            setError={() => SetIsCurrentPasswordInvalid(false)}
          />
          {is_current_password_invalid ? (
            <Text
              style={{
                fontFamily: 'Inter-Regular',
                fontSize: moderateScale(14),
                color: '#E8443A',
                marginLeft: 15,
                marginTop: 7,
              }}>
              Текущий пароль ввведен неверно
            </Text>
          ) : null}
          <Input
            is_password={true}
            placeholder={'Придумайте новый пароль'}
            value={new_password}
            onChangeText={SetNewPassword}
          />
          <Input
            is_password={true}
            placeholder={'Повторите новый пароль'}
            value={new_password_repeat}
            onChangeText={SetNewPasswordRepeat}
          />
          <Button
            marginTop={10}
            text={'Сохранить пароль'}
            disabled={is_button_disabled}
            onPress={handleChangePassword}
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};
