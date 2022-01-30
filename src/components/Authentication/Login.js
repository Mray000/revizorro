import React, {useEffect, useState} from 'react';
import {
  DeviceEventEmitter,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {authentication} from 'store/authentication';
import {Input} from 'utils/Input';
import {Button} from 'utils/Button';
import {colors} from 'utils/colors';
import {moderateScale, scale} from 'utils/Normalize';
export const Login = ({navigation, route}) => {
  const [email, SetEmail] = useState('');
  const [password, setPassword] = useState('');
  const [incorrect_data, setIncorrectData] = useState(false);
  const [isLoad, setIsLoad] = useState(false);
  const [is_warnning_show, SetIsWarningShow] = useState(true);
  let is_button_disabled = !(email && password) || incorrect_data || isLoad;
  const henderLogin = async () => {
    setIsLoad(true);
    let is_ok = await authentication.login(email, password);
    if (is_ok) {
      navigation.navigate('Workers');
      DeviceEventEmitter.removeAllListeners('keyboardDidShow');
    } else setIncorrectData(true);
    setIsLoad(false);
  };

  useEffect(() => {
    DeviceEventEmitter.addListener('keyboardDidShow', () =>
      SetIsWarningShow(false),
    );
    return () => {};
  }, []);
  let is_owner = route.params.role == 'owner';
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}
      >
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 20,
          paddingTop: 10,
        }}>
        <Text
          style={{
            color: 'black',
            fontSize: moderateScale(25),
            fontWeight: '600',
            marginBottom: 20,
          }}>
          Авторизация
        </Text>
        <Input
          value={email}
          placeholder="Ваш E-mail"
          onChangeText={SetEmail}
          absolute={true}
          setError={setIncorrectData}
          is_error={incorrect_data}
        />
        <Input
          value={password}
          placeholder="Ваш пароль"
          onChangeText={setPassword}
          absolute={true}
          setError={setIncorrectData}
          is_error={incorrect_data}
          is_password={true}
        />
        {incorrect_data ? (
          <Text
            style={{
              color: '#E7443A',
              fontWeight: '500',
              alignSelf: 'flex-end',
              fontSize: moderateScale(14),
              marginTop: 3,
            }}>
            неверный email или пароль
          </Text>
        ) : null}
        <Text
          style={{
            color: colors.orange,
            fontWeight: '500',
            marginVertical: 15,
            textAlignVertical: 'center',
            alignSelf: 'flex-start',
            fontSize: moderateScale(15),
          }}>
          Забыли пароль?
        </Text>
        <Button
          disabled={is_button_disabled}
          text="Войти"
          absolute={true}
          onPress={henderLogin}
        />
        {is_owner ? (
          <View style={{flexDirection: 'row', marginTop: 15}}>
            <Text style={{color: '#AEACAB', fontSize: moderateScale(15)}}>
              Еще нет аккаунта?
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Registration')}>
              <Text
                style={{
                  color: colors.orange,
                  fontSize: moderateScale(15),
                  marginLeft: 5,
                }}>
                Регистрация
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
        {!is_owner && is_warnning_show ? (
          <View
            style={{
              position: 'absolute',
              bottom: 40,
              borderColor: '#E5E3E2',
              borderWidth: 1,
              borderRadius: 20,
              flexDirection: 'row',
              padding: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                backgroundColor: 'red',
                borderRadius: 40,
                alignItems: 'center',
                justifyContent: 'center',
                width: scale(20),
                aspectRatio: 1,
              }}>
              <Text
                style={{
                  fontSize: moderateScale(14),
                  color: 'white',
                  fontFamily: 'Inter-SemiBold',
                }}>
                i
              </Text>
            </View>
            <Text
              style={{
                color: 'black',
                fontFamily: 'Inter-Regular',
                fontSize: moderateScale(15),
                marginLeft: 10,
              }}>
              Если вы новый сотрудник, обратитесь к вашему нанимателю, чтобы он
              вас зарегистрировал в приложении.
            </Text>
          </View>
        ) : null}
      </View>
    </KeyboardAvoidingView>
  );
};
