import {observer} from 'mobx-react-lite';
import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {Shadow} from 'react-native-shadow-2';
import {app} from 'store/app';
import {authentication} from 'store/authentication';
import {api} from 'utils/api';
import {colors} from 'utils/colors';
import {dimensions} from 'utils/dimisions';
import {Input} from 'utils/Input';
import {Loader} from 'utils/Loader';
import {moderateScale} from 'utils/Normalize';
import {SwitchComponent} from 'utils/SwitchComponent';
import ArrowRight from 'assets/arrow_right.svg';
import {ModalPicker} from 'utils/ModalPicker';
export const Settings = observer(({navigation}) => {
  const [name, SetName] = useState('');
  const [surname, SetSurname] = useState('');
  const [company, SetCompany] = useState('');
  const [email, SetEmail] = useState('');
  const [rate, SetRate] = useState(null);
  const [is_email_error, SetIsEmailError] = useState(false);
  const [is_actual_data, SetIsActualData] = useState(false);
  const [interval, SetInterval] = useState(5);
  const [is_cleaning_interval_modal_active, SetIsCleaningIntervalModalActive] =
    useState(false);

  const [error, SetError] = useState('');

  const logout = () => {
    authentication.logout();
    navigation.navigate('Onboarding');
  };

  const SetMe = async () => {
    await api.getMe().then(me => {
      SetName(me.first_name);
      SetSurname(me.last_name);
      SetEmail(me.email);
      SetCompany(me.company.title);
    });
    await api.getRate().then(data => SetRate(data.rate));
    SetIsActualData(true);
  };

  useEffect(() => {
    if (!is_actual_data) SetMe();
  }, [is_actual_data]);

  useEffect(() => {
    navigation.addListener('focus', () => {
      SetIsActualData(false);
      SetMe();
    });
  }, []);

  const SaveAdminProfile = () => {
    api.editWorker(
      app.id,
      'role_admin',
      name,
      surname,
      '',
      email,
      'man_gender',
      true,
      true,
      true,
    );
  };

  const SaveCompanyTitle = () => {
    api.changeCompany(company, true);
  };

  let is_year_tarif = false;

  const intervals = ['3 минут', '5 минут', '7 минут', '10 минут', '15 минут'];

  const SetGlobalInterval = interval => {
    let minutes = Number(interval.split(" ")[0]);
    console.log(interval);
    SetInterval(minutes);
  };
  if (!is_actual_data) return <Loader />;
  return (
    <ScrollView style={{padding: 10}}>
      <Text
        style={{
          fontFamily: 'Inter-SemiBold',
          fontSize: moderateScale(20),
          color: 'black',
          marginTop: 10,
        }}>
        Настройки
      </Text>
      <Text
        style={{
          fontFamily: 'Inter-Medium',
          fontSize: moderateScale(15),
          color: '#AAA8A7',
          marginLeft: 10,
          marginTop: 10,
        }}>
        мои данные
      </Text>
      <View style={{marginTop: 10}}>
        <Input
          key={1}
          title="имя"
          placeholder="Ваше имя"
          value={name}
          onChangeText={SetName}
          onBlur={SaveAdminProfile}
        />
        <Input
          key={2}
          title="фамилия"
          placeholder="Ваша фамилия"
          value={surname}
          onChangeText={SetSurname}
          onBlur={SaveAdminProfile}
        />
        <Input
          key={3}
          title="компания"
          placeholder="Название вашей компании"
          value={company}
          onChangeText={SetCompany}
          onBlur={SaveCompanyTitle}
        />
        <Input
          key={4}
          title="e-mail"
          placeholder="Ваш E-mail"
          value={email}
          is_error={is_email_error}
          setError={SetIsEmailError}
          onChangeText={SetEmail}
          onBlur={SaveAdminProfile}
        />
        {is_email_error ? (
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
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('ChangePassword', {parent: 'Settings'})
        }>
        <Text
          style={{
            color: colors.orange,
            fontFamily: 'Inter-Medium',
            fontSize: moderateScale(15),
            marginLeft: 15,
            marginTop: 10,
          }}>
          изменить пароль
        </Text>
      </TouchableOpacity>
      <View style={{paddingHorizontal: 5, marginTop: 20}}>
        <Text
          style={{
            color: '#AAA8A7',
            fontFamily: 'Inter-Regular',
            fontSize: moderateScale(13),
            marginLeft: 10,
          }}>
          АКТИВНЫЙ ТАРИФ
        </Text>
        <View
          style={{
            shadowColor: '#C8C7C7',
            shadowOffset: {
              width: 0,
              height: 10,
            },
            shadowOpacity: 0.51,
            shadowRadius: 10,
            padding: 20,
            backgroundColor: 'white',
            marginTop: 8,
            borderRadius: 20,
          }}>
          <Text
            style={{
              fontFamily: 'Inter-Medium',
              fontSize: moderateScale(13),
              color: '#AEA3A4',
            }}>
            {!is_year_tarif ? 'ЕЖЕМЕСЯЧНО' : 'ЕЖЕГОДНО'}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 5,
            }}>
            <View>
              <Text
                style={{
                  fontFamily: 'Inter-SemiBold',
                  fontSize: moderateScale(16),
                  color: 'black',
                }}>
                {rate.title}
              </Text>
              <Text
                style={{
                  fontFamily: 'Inter-Medium',
                  fontSize: moderateScale(16),
                  color: '#75706F',
                  marginTop: 5,
                }}>
                {!is_year_tarif ? rate.cleaning_limit : '∞'} уборок в месяц
              </Text>
            </View>
            <View>
              <Text
                style={{
                  fontFamily: 'Inter-SemiBold',
                  fontSize: moderateScale(16),
                  color: 'black',
                }}>
                {!is_year_tarif ? rate.price_month : rate.price_year} $
              </Text>
              <Text
                style={{
                  fontFamily: 'Inter-Medium',
                  fontSize: moderateScale(16),
                  color: '#AEA3A4',
                  marginTop: 5,
                }}>
                {!is_year_tarif ? 'в месяц' : 'в год'}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('ChangePassword', {parent: 'Settings'})
        }>
        <Text
          style={{
            color: colors.orange,
            fontFamily: 'Inter-Medium',
            fontSize: moderateScale(15),
            marginLeft: 15,
            marginTop: 10,
          }}>
          изменить тариф
        </Text>
      </TouchableOpacity>
      <Text
        style={{
          fontFamily: 'Inter-Regular',
          fontSize: moderateScale(15),
          color: '#AAA8A7',
          marginLeft: 15,
          marginTop: 10,
        }}>
        Осталось 8 дней бесплатного периода до списания средств.
      </Text>
      <SwitchComponent
        title={'Уведомления'}
        is_active={app.is_notify}
        SetIsActive={app.setNotification}
      />
      <TouchableOpacity
        onPress={() => SetIsCleaningIntervalModalActive(true)}
        style={{
          height: dimensions.height / 10,
          marginTop: 20,
          width: '100%',
          justifyContent: 'center',
        }}>
        <Shadow
          viewStyle={{
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            borderColor: '#E5E3E2',
            borderWidth: 1,
            borderRadius: 18,
            flexDirection: 'row',
            paddingHorizontal: 1,
            backgroundColor: 'white',
          }}
          startColor={'#00000010'}
          finalColor={'#00000002'}>
          <View
            style={{
              justifyContent: 'center',
              width: '90%',
              height: '100%',
            }}>
            <Text
              style={{
                alignSelf: 'stretch',
                color: 'black',
                paddingLeft: 20,
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 17,
              }}>
              {interval} минут
            </Text>
          </View>
          <View
            style={{
              width: '10%',
              alignItems: 'center',
            }}>
            <ArrowRight fill={'#CAC8C8'} />
          </View>
        </Shadow>
        <View
          style={{
            position: 'absolute',
            paddingVertical: 3,
            top: '-10%',
            paddingHorizontal: 8,
            backgroundColor: 'white',
            left: '5%',
            borderRadius: 8,
          }}>
          <Text
            style={{
              color: '#C5BEBE',
              fontFamily: 'Inter-Regular',
              fontSize: moderateScale(14),
            }}>
            время автомат. принятия уборки
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={logout}
        style={{
          marginTop: 10,
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 20,
        }}>
        <Text
          style={{
            fontSize: moderateScale(17),
            color: '#AAA8A7',
            fontFamily: 'Inter-Medium',
          }}>
          Выйти из аккаунта
        </Text>
      </TouchableOpacity>
      <ModalPicker
        visible={is_cleaning_interval_modal_active}
        data={intervals}
        onPick={SetGlobalInterval}
        closeModal={() => SetIsCleaningIntervalModalActive(false)}
      />
    </ScrollView>
  );
});
