import React, {useState} from 'react';
import {
  Dimensions,
  Platform,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import X from 'assets/x.svg';
import {Input} from 'utils/Input';
import {colors} from 'utils/colors';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Button} from 'utils/Button';
import {Shadow} from 'react-native-shadow-2';
import {authentication} from 'store/authentication';
import {moderateScale} from 'utils/Normalize';

export const Registration = ({navigation}) => {
  const [is_first_step, SetIsFirstStep] = useState(true);
  const [name, SetName] = useState('');
  const [surname, SetSurname] = useState('');
  const [company, SetCompany] = useState('');
  const [phone, SetPhone] = useState('');
  const [email, SetEmail] = useState('');
  const [password, SetPassword] = useState('');
  const [repeat_password, SetRepeatPassword] = useState('');
  const [is_email_error, SetIsEmailError] = useState(false);
  const [is_phone_error, SetIsPhoneError] = useState(false);
  const [is_load, SetIsLoad] = useState(false);
  const [error, SetError] = useState('');
  const handleRegistration = async () => {
    if (!is_first_step) {
      SetIsLoad(true);
      let data = await authentication.registration(
        name,
        surname,
        company,
        // phone,
        email,
        password,
      );
      switch (data) {
        case 'is_ok':
          return navigation.navigate('Workers');
        case 'phone_exist': {
          SetIsPhoneError(true);
          SetError('Номер телефона уже зарегестрирован');
          SetIsFirstStep(true);
          break;
        }
        case 'email_exist': {
          SetIsEmailError(true);
          SetError('Почта уже зарегестрирована');
          SetIsFirstStep(true);

          break;
        }
        case 'email_incorrect': {
          SetIsEmailError(true);
          SetError('Почта некорректна');
          SetIsFirstStep(true);
          break;
        }
      }
      SetIsLoad(false);
    } else SetIsFirstStep(false);
  };
  let is_button_disabled =
    (is_first_step
      ? !(name, surname, company, email)
      : !(password && password == repeat_password)) ||
    is_load ||
    is_email_error ||
    is_phone_error;
  return (
    <KeyboardAwareScrollView style={{flex: 1}}>
      <View
        style={{
          height:
            Dimensions.get('window').height - (StatusBar.currentHeight || 24),
          padding: 20,
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            justifyContent: 'space-between',
            height: '20%',
          }}>
          <View
            style={{
              alignItems: 'flex-end',
              flexDirection: 'row',
              justifyContent: 'center',
              height: 45,
            }}>
            <Text
              style={{
                fontSize: 24,
                color: 'black',
                fontFamily: 'Inter-SemiBold',
              }}>
              Регистрация
            </Text>
            <Shadow
              startColor={'#00000007'}
              finalColor={'#00000001'}
              offset={[0, 10]}
              distance={15}
              containerViewStyle={{
                position: 'absolute',
                right: 10,
              }}>
              <TouchableOpacity
                onPress={() =>
                  is_first_step
                    ? navigation.navigate('Login')
                    : SetIsFirstStep(true)
                }
                style={{
                  backgroundColor: 'white',
                  width: 45,
                  height: 45,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 17,
                }}>
                <X width={13} height={13} fill="#45413E" />
              </TouchableOpacity>
            </Shadow>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: moderateScale(16),
                backgroundColor: colors.orange,
                padding: 5,
                paddingLeft: 8,
                paddingRight: 8,
                borderRadius: 8,
              }}>
              шаг {is_first_step ? 1 : 2}
            </Text>
            <Text
              style={{
                color: '#C5BEBE',
                fontSize: moderateScale(16),
                marginLeft: 8,
              }}>
              из 2
            </Text>
          </View>
          <Text
            style={{
              color: 'black',
              textAlign: 'center',
              fontSize: moderateScale(18),
              fontWeight: '600',
            }}>
            {is_first_step ? 'Заполнение данных' : 'Создание пароля'}
          </Text>
        </View>
        {is_first_step ? (
          <View>
            <Input
              key={1}
              title="имя"
              placeholder="Ваше имя"
              value={name}
              onChangeText={SetName}
            />
            <Input
              key={2}
              title="фамилия"
              placeholder="Ваша фамилия"
              value={surname}
              onChangeText={SetSurname}
            />
            <Input
              key={3}
              title="компания"
              placeholder="Название вашей компании"
              value={company}
              onChangeText={SetCompany}
            />
            {/* <Input
              key={4}
              title="телефон"
              placeholder="Ваш телефон"
              value={phone}
              is_error={is_phone_error}
              setError={SetIsPhoneError}
              onChangeText={SetPhone}
            /> */}
            <Input
              key={5}
              title="e-mail"
              placeholder="Ваш E-mail"
              value={email}
              is_error={is_email_error}
              setError={SetIsEmailError}
              onChangeText={SetEmail}
            />
            <View
              style={{
                marginTop: 10,
                height: Dimensions.get('window').height / 10,
              }}
            />
            {is_first_step && (is_phone_error || is_email_error) ? (
              <Text
                style={{
                  color: '#E7443A',
                  fontWeight: '500',
                  alignSelf: 'flex-end',
                  fontSize: moderateScale(15),
                }}>
                {error}
              </Text>
            ) : null}
          </View>
        ) : (
          <View>
            <Input
              key={6}
              title="пароль"
              placeholder="Придумайте пароль"
              value={password}
              onChangeText={SetPassword}
              is_password
            />
            <Input
              key={7}
              title="пароль"
              placeholder="Повторите пароль"
              value={repeat_password}
              onChangeText={SetRepeatPassword}
              is_password
            />
            <View style={{marginTop: 30, height: '30%'}} />
          </View>
        )}

        <Button
          text={'Далее'}
          disabled={is_button_disabled}
          onPress={handleRegistration}
          icon
        />
      </View>
    </KeyboardAwareScrollView>
  );
};
