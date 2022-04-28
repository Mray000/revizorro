import {observer} from 'mobx-react-lite';
import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, ScrollView, Platform} from 'react-native';
import {Shadow} from 'react-native-shadow-2';
import {app} from 'store/app';
import {authentication} from 'store/authentication';
import {api} from 'utils/api';
import {colors} from 'utils/colors';
import SupportSvg from 'assets/support.svg';
import {dimensions} from 'utils/dimisions';
import {Input} from 'styled_components/Input';
import {Loader} from 'styled_components/Loader';
import {moderateScale} from 'utils/normalize';
import {SwitchComponent} from 'styled_components/SwitchComponent';
import ArrowRight from 'assets/arrow_right.svg';
import {ModalPicker} from 'styled_components/ModalPicker';
import iap from 'react-native-iap';
import {rate} from 'store/rate';
import {rate_prices} from 'utils/rate_constants';
import {useToggle} from 'hooks/useToggle';
import {LogoutModal} from 'styled_components/LogoutModal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
export const Settings = observer(({navigation}) => {
  const [name, SetName] = useState('');
  const [surname, SetSurname] = useState('');
  const [company, SetCompany] = useState('');
  const [email, SetEmail] = useState('');
  const [is_actual_data, SetIsActualData] = useState(false);
  const [interval, SetInterval] = useState(5);
  const [is_cleaning_interval_modal_active, SetIsCleaningIntervalModalActive] =
    useState(false);
  const [is_logout_modal_visible, SetIsLogoutModalVisible] = useToggle(false);
  // const [tarif, SetTarif] = useState(null);

  const [error, SetError] = useState('');

  const SetMe = async () => {
    await api.getMe().then(me => {
      SetName(me.first_name);
      SetSurname(me.last_name);
      SetEmail(me.email);
      SetCompany(me.company.title);
      SetInterval(me.autocheck_time);
    });
    SetIsActualData(true);
  };

  // useEffect(() => {
  //   iap.initConnection().then(() => {
  //     api.getRate().then(data => {
  //       let current_tarif_id = 'revizorro_' + data.rate.id;
  //       iap
  //         .getProducts([current_tarif_id])
  //         .then(tarifs => {
  //           if (Platform.OS == 'android')
  //             return JSON.parse(tarifs[0].originalJson);
  //           else return tarifs[0];
  //         })
  //         .then(tarif => {
  //           tarif.price = rate_prices[tarif.productId];
  //           SetTarif(tarif);
  //         });
  //     });
  //   });
  // }, []);

  useEffect(() => {
    if (!is_actual_data) SetMe();
  }, [is_actual_data]);

  useEffect(() => {
    navigation.addListener('focus', () => {
      SetIsActualData(false);
      SetMe();
    });
  }, []);

  const SaveAdminProfile = async () => {
    let error = await api.editAdmin(
      name,
      surname,
      email,
      app.is_notify,
      interval,
    );
    console.log(error);
    if (error) SetError(error);
    else SetError('');
  };

  const SaveCompanyTitle = () => {
    api.changeCompany(company, true);
  };

  const intervals = ['3 минуты', '5 минут', '7 минут', '10 минут', '15 минут'];

  const SetGlobalInterval = interval => {
    let minutes = Number(interval.split(' ')[0]);
    api.setInterval(minutes);
    SetInterval(minutes);
  };
  // if (!tarif) return <Loader />;
  if (!is_actual_data) return <Loader />;
  return (
    <KeyboardAwareScrollView style={{padding: 10}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontFamily: 'Inter-SemiBold',
            fontSize: moderateScale(20),
            color: 'black',
            marginTop: 10,
          }}>
          Настройки
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Support')}>
          <SupportSvg />
        </TouchableOpacity>
      </View>
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
          is_error={error}
          setError={SetError}
          onChangeText={SetEmail}
          onBlur={SaveAdminProfile}
        />
        {error ? (
          <Text
            style={{
              color: '#E7443A',
              fontWeight: '500',
              fontSize: moderateScale(15),
              marginTop: 10,
              marginLeft: 5,
            }}>
            {error}
          </Text>
        ) : null}
      </View>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('ChangePasswordModal', {parent: 'Settings'})
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
      {/* <View style={{paddingHorizontal: 5, marginTop: 20}}>
        <Text
          style={{
            color: '#AAA8A7',
            fontFamily: 'Inter-Regular',
            fontSize: moderateScale(13),
            marginLeft: 10,
          }}>
          АКТИВНЫЙ ТАРИФ
        </Text>
        <Tarif tarif={tarif} />
      </View> 
       <TouchableOpacity
        onPress={() => navigation.navigate('RateChoice', {parent: 'Settings'})}>
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
      </TouchableOpacity> */}
      {/* <Text
        style={{
          fontFamily: 'Inter-Regular',
          fontSize: moderateScale(15),
          color: '#AAA8A7',
          marginLeft: 15,
          marginTop: 10,
        }}>
        Осталось 8 дней бесплатного периода до списания средств.
      </Text> */}
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
        onPress={() => navigation.navigate('Support')}
        style={{
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          marginVertical: 15,
        }}>
        <Text
          style={{
            fontSize: moderateScale(17),
            color: colors.orange,
            fontFamily: 'Inter-Medium',
          }}>
          Написать в техподдержку
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={SetIsLogoutModalVisible}
        style={{
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
      <LogoutModal
        visible={is_logout_modal_visible}
        closeModal={SetIsLogoutModalVisible}
        navigation={navigation}
      />
    </KeyboardAwareScrollView>
  );
});

const Tarif = ({tarif}) => {
  let {productId, description, name, title, subscriptionPeriod, price} = tarif;
  let is_year_tarif = subscriptionPeriod == 'P1Y';
  let is_sale = productId == 'revizorro_3';
  return (
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
      {is_sale ? (
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#E8443A',
            paddingHorizontal: 10,
            paddingVertical: 5,
            position: 'absolute',
            borderRadius: 20,
            borderBottomLeftRadius: 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: 'white',
              fontFamily: 'Inter-SemiBold',
              fontSize: moderateScale(16),
            }}>
            выгодно
          </Text>
          <Star width="18" height="18" fill="white" />
        </View>
      ) : null}
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text
          style={{
            fontFamily: 'Inter-Medium',
            fontSize: moderateScale(13),
            color: '#AEA3A4',
            marginTop: is_sale ? 20 : 0,
          }}>
          {!is_year_tarif ? 'ЕЖЕМЕСЯЧНО' : 'ЕЖЕГОДНО'}
        </Text>
      </View>
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
            {Platform.OS == 'ios' ? title : name}
          </Text>
          <Text
            style={{
              fontFamily: 'Inter-Medium',
              fontSize: moderateScale(16),
              color: '#75706F',
              marginTop: 5,
            }}>
            {description}
          </Text>
        </View>
        <View style={{alignItems: 'flex-end', flex: 1}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {is_sale ? (
              <Text
                style={{
                  color: '#CCC6C6',
                  textDecorationLine: 'line-through',
                  textDecorationStyle: 'solid',
                  fontFamily: 'Inter-Regular',
                  fontSize: moderateScale(16),
                }}>
                {price / (1 - 0.6)} ₽
              </Text>
            ) : null}
            <Text
              style={{
                fontFamily: 'Inter-SemiBold',
                fontSize: moderateScale(16),
                color: is_sale ? '#E8443A' : 'black',
              }}>
              {' '}
              {price} ₽
            </Text>
          </View>
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
  );
};
