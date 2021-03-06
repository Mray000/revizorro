import React, {useEffect, useState} from 'react';
import {
  BackHandler,
  DeviceEventEmitter,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {authentication} from 'store/authentication';
import {Input} from 'styled_components/Input';
import {Button} from 'styled_components/Button';
import {colors} from 'utils/colors';
import {moderateScale, scale, verticalScale} from 'utils/normalize';
import {observer} from 'mobx-react-lite';
import {app} from 'store/app';
import {tarif} from 'store/tarif';
export const Login = observer(({navigation, route}) => {
  //ianire@gmail.cted
  //ainurhabibullin0@gmail.test
  //ainurhabibullin0@gmail.7657
  //lega6257632@gmail.com

  const [email, SetEmail] = useState('');
  const [password, setPassword] = useState('');
  const [incorrect_data, setIncorrectData] = useState(false);
  const [isLoad, setIsLoad] = useState(false);
  const [is_keyboard_show, SetIsKeyboardShow] = useState(false);
  let is_button_disabled = !(email && password) || isLoad;

  const henderLogin = async () => {
    setIsLoad(true);
    let is_ok = await authentication.login(email.toLowerCase(), password);
    console.log(is_ok);

    console.log();
    if (is_ok) {
      SetEmail('');
      setPassword('');
      let role = app.role;
      let is_company_active = tarif.getIsTarifActive();
      navigation.navigate(
        role
          ? role != 'role_maid'
            ? is_company_active
              ? 'Cleanings'
              : 'TarifSelect'
            : is_company_active
            ? 'Housemaid'
            : 'TarifDisactive'
          : 'Onboarding',
      );
    } else setIncorrectData(true);
    setIsLoad(false);
  };

  useEffect(() => {
    let backhandler;

    navigation.addListener('blur', () => {
      DeviceEventEmitter.removeAllListeners('keyboardDidShow');
      DeviceEventEmitter.removeAllListeners('keyboardDidHide');
      backhandler?.remove();
    });
    navigation.addListener('focus', () => {
      backhandler = BackHandler.addEventListener('hardwareBackPress', () => {
        navigation.navigate('Onboarding');
        return true;
      });
      DeviceEventEmitter.addListener('keyboardDidShow', () =>
        SetIsKeyboardShow(true),
      );
      DeviceEventEmitter.addListener('keyboardDidHide', () =>
        SetIsKeyboardShow(false),
      );
    });
  }, []);
  let is_owner = route.params.role == 'owner';
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
          ??????????????????????
        </Text>
        <Input
          value={email}
          placeholder="?????? E-mail"
          onChangeText={SetEmail}
          absolute={true}
          setError={setIncorrectData}
          is_error={incorrect_data}
          autoCorrect={false}
        />
        <Input
          value={password}
          placeholder="?????? ????????????"
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
            ???????????????? email ?????? ????????????
          </Text>
        ) : null}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('ChangePassword', {role: route.params.role})
          }
          style={{
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            width: '100%',
          }}>
          <Text
            style={{
              color: colors.orange,
              fontWeight: '500',
              marginVertical: 15,
              textAlignVertical: 'center',

              fontSize: moderateScale(15),
            }}>
            ???????????? ?????????????
          </Text>
        </TouchableOpacity>
        <Button
          disabled={is_button_disabled}
          text="??????????"
          absolute={true}
          onPress={henderLogin}
        />
        {is_owner ? (
          <View style={{flexDirection: 'row', marginTop: 15}}>
            <Text style={{color: '#AEACAB', fontSize: moderateScale(15)}}>
              ?????? ?????? ?????????????????
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Registration')}>
              <Text
                style={{
                  color: colors.orange,
                  fontSize: moderateScale(15),
                  marginLeft: 5,
                }}>
                ??????????????????????
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
        {!is_owner && !is_keyboard_show ? (
          <View
            style={{
              position: 'absolute',
              bottom: verticalScale(35),
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
              ???????? ???? ?????????? ??????????????????, ???????????????????? ?? ???????????? ????????????????????????, ??????????
              ???? ?????? ?????????????????????????????? ?? ????????????????????.
            </Text>
          </View>
        ) : null}
      </View>
    </KeyboardAvoidingView>
  );
});
