import React, {useState} from 'react';
import {
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
import {moderateScale} from 'utils/Normalize';
// import {} from "utils/"
export const Login = ({navigation}) => {
  const [email, SetEmail] = useState('');
  const [password, setPassword] = useState('');
  const [incorrect_data, setIncorrectData] = useState(false);
  const [isLoad, setIsLoad] = useState(false);
  let is_button_disabled = !(email && password) || incorrect_data || isLoad;
  const henderLogin = async () => {
    setIsLoad(true);
    console.log(234);
    let is_ok = await authentication.login(email, password);
    console.log(634);

    if (is_ok) navigation.navigate('Workers');
    else setIncorrectData(true);
    setIsLoad(false);
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
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
        <View style={{flexDirection: 'row', marginTop: 15}}>
          <Text style={{color: '#AEACAB', fontSize: moderateScale(15)}}>
            Еще нет аккаунта?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
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
      </View>
    </KeyboardAvoidingView>
  );
};
