import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Shadow} from 'react-native-shadow-2';
import {Button} from 'styled_components/Button';
import {Input} from 'styled_components/Input';
import {moderateScale, scale} from 'utils/normalize';
import X from 'assets/x.svg';
import {colors} from 'utils/colors';
import {api} from 'utils/api';
export const ChangePassword = ({navigation, route}) => {
  const [index, SetIndex] = useState(0);
  const [email, SetEmail] = useState('');
  const [code, SetCode] = useState('');
  const [new_password, SetNewPassword] = useState('');
  const [new_password_repeat, SetNewPasswordRepeat] = useState('');
  const [is_email_error, SetIsEmailError] = useState(false);
  const [is_code_error, SetIsCodeError] = useState(false);

  const text_content = [
    {
      title: 'Восстановление пароля',
      description:
        'На указанную почту будет отправлено письмо с кодом для смены пароля',
    },
    {
      title: 'Введите код из письма',
      description:
        'На указанный номер было отправлено письмо с кодом подтверждения. Обычно оно приходит в течение 3-х минут',
    },
    {
      title: 'Придумайте пароль',
      description: 'Введите ваш новый пароль',
    },
  ];

  const GetCode = async () => {
    let is_ok = await api.getPasswordCode(email);
    if (is_ok && index == 0) SetIndex(index + 1);
    else SetIsEmailError(true);
  };
  const SendCodeWithNewPassword = async () => {
    let is_ok = await api.sendCodeWithNewPassword(code, new_password);
    if (is_ok) {
      SetIndex(0);
      SetNewPassword('');
      SetNewPasswordRepeat('');
      SetCode('');
      navigation.navigate('Success', {
        to: 'Login',
        params: {role: route.params.role},
        title: 'Новый пароль успешно сохранен!',
        button_title: 'Войти с новым паролем',
      });
    } else {
      SetIndex(1);
      SetIsCodeError(true);
    }
  };
  const slides = [
    <View style={{marginTop: 10, width: '100%'}}>
      <Input
        placeholder="Ваш e-mail"
        value={email}
        onChangeText={SetEmail}
        setError={SetIsEmailError}
        is_error={is_email_error}
      />
      {is_email_error ? (
        <Text
          style={{
            color: '#E8443A',
            fontFamily: 'Inter-Regular',
            fontSize: moderateScale(15),
            marginTop: 10,
            textAlign: 'center',
          }}>
          Почта не верная
        </Text>
      ) : null}
      <Button
        disabled={!email}
        text="Получить код"
        onPress={GetCode}
        marginTop={10}
      />
    </View>,

    <View style={{marginTop: 10, width: '100%'}}>
      <Input
        placeholder="Код из письма"
        value={code}
        setError={SetIsCodeError}
        is_error={is_code_error}
        onChangeText={SetCode}
      />
      {is_code_error ? (
        <Text
          style={{
            color: '#E8443A',
            fontFamily: 'Inter-Regular',
            fontSize: moderateScale(15),
            marginTop: 10,
            textAlign: 'center',
          }}>
          Код не верный
        </Text>
      ) : null}
      <Button
        disabled={!code}
        text="Далее"
        onPress={() => SetIndex(index + 1)}
        marginTop={10}
      />

      <TouchableOpacity
        onPress={GetCode}
        style={{marginTop: 15, justifyContent: 'center', alignItems: 'center'}}>
        <Text
          style={{
            color: colors.orange,
            fontFamily: 'Inter-Regular',
            fontSize: moderateScale(15),
          }}>
          Запросить код повторно
        </Text>
      </TouchableOpacity>
    </View>,

    <View style={{marginTop: 10, width: '100%'}}>
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
        disabled={!code && new_password && new_password == new_password_repeat}
        text="Сохранить"
        onPress={SendCodeWithNewPassword}
        marginTop={10}
      />
    </View>,
  ];
  return (
    <View
      style={{
        flex: 1,
        padding: 10,
        width: '100%',
        backgroundColor: 'white',
      }}>
      <Shadow
        startColor={'#00000008'}
        finalColor={'#00000001'}
        offset={[0, 8]}
        distance={15}
        containerViewStyle={{
          width: '10%',
          marginRight: 10,
          alignSelf: 'flex-end',
        }}>
        <TouchableOpacity
          style={{
            width: scale(40),
            aspectRatio: 1,
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 15,
          }}
          onPress={() => {
            navigation.navigate('Login', {role: route.params.role});
          }}>
          <X fill="black" width={15} height={15} />
        </TouchableOpacity>
      </Shadow>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}>
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontFamily: 'Inter-SemiBold',
              color: 'black',
              fontSize: moderateScale(20),
              textAlign: 'center',
            }}>
            {text_content[index].title}
          </Text>
          <Text
            style={{
              color: '#696463',
              fontFamily: 'Inter-Regular',
              fontSize: moderateScale(15),
              textAlign: 'center',
              marginTop: 5,
            }}>
            {text_content[index].description}
          </Text>
        </View>
        {slides[index]}
      </View>
    </View>
  );
};
