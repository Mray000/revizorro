import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Header} from 'styled_components/Header';
import {moderateScale, scale, verticalScale} from 'utils/normalize';
import {Input} from 'styled_components/Input';
import {dimensions} from 'utils/dimisions';
import {Shadow} from 'react-native-shadow-2';
import ToggleSwitch from 'toggle-switch-react-native';
import {api} from 'utils/api';
import {Button} from 'styled_components/Button';
import ArrowRight from 'assets/arrow_right.svg';
import ArrowBottom from 'assets/arrow_down.svg';
import {authentication} from 'store/authentication';
import {SwitchComponent} from 'styled_components/SwitchComponent';
export const AddWorker = ({navigation, route}) => {
  const [is_housemaid, SetIsHousemaid] = useState(true);
  const [email, SetEmail] = useState('');
  const [name, SetName] = useState('');
  const [surname, SetSurname] = useState('');
  const [middlename, SetMiddlename] = useState('');
  const [sex, SetSex] = useState('');
  const [control_check_lists, SetControlCheckLists] = useState(false);
  const [add_workers, SetAddWorkers] = useState(false);
  const [control_cleaning, SetControlCleaning] = useState(false);
  const [is_sex_open, SetIsSexOpen] = useState(false);
  const [email_error, SetEmailError] = useState('');
  const [is_load, SetIsLoad] = useState(false);
  const handleAddWorker = async () => {
    SetIsLoad(true);
    let error = await api.addWorker(
      is_housemaid ? 'role_maid' : 'role_manager',
      name,
      surname,
      middlename,
      email,
      sex == 'Мужской' ? 'man_gender' : 'woman_gender',
      control_check_lists,
      add_workers,
      control_cleaning,
    );
    if (!error) {
      navigation.navigate('Success', {
        to: route.params.parent,
        title: 'Сотрудник добавлен',
        description:
          'Сообщите вашему сотруднику, что на его почту отправлено письмо с паролем для входа в приложение',
      });
    } else SetEmailError(error);

    SetIsLoad(false);
  };
  let is_button_disabled =
    !(email && name && surname && middlename && sex) || is_load;
  return (
    <KeyboardAwareScrollView style={{backgroundColor: 'white'}}>
      <Header title={'Добавление сотрудников'} onBack={navigation.goBack} />
      <View
        style={{
          paddingHorizontal: 10,
          justifyContent: 'space-between',
          marginBottom: 10,
        }}>
        <View
          style={{
            backgroundColor: '#F3F3F3',
            borderRadius: 20,

            height: verticalScale(50),
            padding: 5,
            marginTop: 10,
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            onPress={() => SetIsHousemaid(true)}
            style={{
              backgroundColor: is_housemaid ? 'white' : '#F3F3F3',
              width: '50%',
              borderRadius: 20,
              height: '100%',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: is_housemaid ? 'black' : '#ADABAA',
                fontFamily: 'Inter-Medium',
                fontSize: moderateScale(15),
                fontWeight: '600',
                textAlign: 'center',
              }}>
              Горничная
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => SetIsHousemaid(false)}
            style={{
              backgroundColor: !is_housemaid ? 'white' : '#F3F3F3',
              width: '50%',
              borderRadius: 20,
              height: '100%',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: !is_housemaid ? 'black' : '#ADABAA',
                fontFamily: 'Inter-Medium',
                fontSize: moderateScale(15),
                fontWeight: '600',
                textAlign: 'center',
              }}>
              Менеджер
            </Text>
          </TouchableOpacity>
        </View>
        <Text
          style={{
            color: '#ADABAA',
            textAlign: 'center',
            fontSize: moderateScale(13),
            paddingHorizontal: 10,
            marginTop: 5,
          }}>
          {is_housemaid
            ? 'Горничная выполняет уборки и присылает отчёты на проверку'
            : 'Менеджер проверяет уборки: принимает или отклоняет отчёты горничных за вас'}
        </Text>
        <View
          style={{
            height: dimensions.height * 0.6,
            justifyContent: 'space-between',
          }}>
          <Input
            key={1}
            title="email"
            placeholder="Email"
            value={email}
            is_error={email_error}
            setError={SetEmailError}
            onChangeText={SetEmail}
          />
          <Input
            key={2}
            title="имя"
            placeholder="Имя"
            value={name}
            onChangeText={SetName}
          />
          <Input
            key={3}
            title="фамилия"
            placeholder="Фамилия"
            value={surname}
            onChangeText={SetSurname}
          />
          <Input
            key={4}
            title="отчество"
            placeholder="Отчество"
            value={middlename}
            onChangeText={SetMiddlename}
          />
          <TouchableOpacity
            onPress={() => SetIsSexOpen(!is_sex_open)}
            style={{
              height: dimensions.height / 10,
              marginTop: 10,
              width: '100%',
              justifyContent: 'center',
              paddingBottom: 10,
            }}>
            <Shadow
              containerViewStyle={{flex: 1}}
              viewStyle={{
                flex: 1,
                width: '100%',
                backgroundColor: 'white',
                alignItems: 'center',
                justifyContent: 'center',
                borderColor: '#E5E3E2',
                borderWidth: 1,
                borderRadius: 18,
                flexDirection: 'row',
                overflow: 'hidden',
              }}
              startColor={sex ? '#00000010' : '#0000'}
              finalColor={sex ? '#00000002' : '#0000'}
              offset={sex ? [0, 5] : [0, 0]}
              distance={!sex ? 0 : undefined}
              corners={!sex ? [] : undefined}
              sides={!sex ? [] : undefined}
              size={!sex ? 0 : undefined}>
              <View style={{justifyContent: 'center', width: '90%'}}>
                <Text
                  style={{
                    alignSelf: 'stretch',
                    color: sex ? 'black' : '#979493',
                    paddingLeft: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 17,
                  }}>
                  {sex || 'Выберите пол'}
                </Text>
              </View>
              <View
                style={{
                  width: '10%',
                  alignItems: 'center',
                }}>
                {is_sex_open ? (
                  <ArrowBottom fill="#CAC8C8" />
                ) : (
                  <ArrowRight fill="#CAC8C8" />
                )}
              </View>
            </Shadow>
            {sex ? (
              <Text
                style={{
                  position: 'absolute',
                  padding: 3,
                  top: '-10%',
                  paddingLeft: 8,
                  paddingRight: 8,
                  backgroundColor: 'white',
                  left: '5%',
                  borderRadius: 8,
                  color: '#C5BEBE',
                }}>
                Пол
              </Text>
            ) : null}
          </TouchableOpacity>
        </View>
        {is_sex_open ? (
          <View>
            <TouchableOpacity
              onPress={() => {
                SetSex('Мужской');
                SetIsSexOpen(false);
              }}
              style={{
                height: dimensions.height / 10,
                marginTop: 5,
                width: '100%',
                justifyContent: 'center',
                marginBottom: 10,
                width: '100%',
                backgroundColor: 'white',
                alignItems: 'center',
                justifyContent: 'center',
                borderColor: '#E5E3E2',
                borderWidth: 1,
                borderRadius: 18,
              }}>
              <Text
                style={{
                  backgroundColor: 'white',
                  alignSelf: 'stretch',
                  width: '100%',
                  color: sex ? 'black' : '#979493',
                  paddingLeft: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 17,
                }}>
                Мужской
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                SetIsSexOpen(false);
                SetSex('Женский');
              }}
              style={{
                height: dimensions.height / 10,
                marginTop: 5,
                width: '100%',
                justifyContent: 'center',
                marginBottom: 10,
                width: '100%',
                backgroundColor: 'white',
                alignItems: 'center',
                justifyContent: 'center',
                borderColor: '#E5E3E2',
                borderWidth: 1,
                borderRadius: 18,
              }}>
              <Text
                style={{
                  backgroundColor: 'white',
                  alignSelf: 'stretch',
                  width: '100%',
                  color: sex ? 'black' : '#979493',
                  paddingLeft: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 17,
                }}>
                Женский
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
        {email_error ? (
          <Text
            style={{
              width: '100%',
              color: '#E7443A',
              fontWeight: '500',
              fontSize: moderateScale(14),
              marginBottom: 10,
            }}>
            {email_error}
          </Text>
        ) : null}
        {!is_housemaid ? (
          <View>
            <View
              style={{
                padding: 15,
                borderWidth: 1,
                borderColor: '#E5E3E2',
                borderRadius: 20,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                  <View
                    style={{
                      width: scale(20),
                      height: scale(20),
                      borderRadius: 20,
                      backgroundColor: '#E7443A',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 5,
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontFamily: 'Inter-SemiBold',
                        color: 'white',
                        fontSize: moderateScale(14),
                        textAlignVertical: 'center',
                      }}>
                      i
                    </Text>
                  </View>
                <Text
                  style={{
                    fontFamily: 'Inter-SemiBold',
                    fontSize: moderateScale(15),
                    color: 'black',
                    padding: 0,
                  }}>
                  Полномочия менеджера
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: 'Inter-Regular',
                  fontSize: moderateScale(14),
                  color: 'black',
                }}>
                Функционал, который доступен вашему менеджеру. Нажмите на
                переключатель, если хотите открыть или отключить доступ к нужной
                функции:
              </Text>
            </View>
            <View style={{marginBottom: 10}}>
              <SwitchComponent
                title={'Проверка уборок'}
                is_active={true}
                disabled={true}
              />
              <SwitchComponent
                title={'Создание и редактирование чек-листов'}
                is_active={control_check_lists}
                SetIsActive={SetControlCheckLists}
              />
              <SwitchComponent
                title={'Добавление сотрудников'}
                is_active={add_workers}
                SetIsActive={SetAddWorkers}
              />
              <SwitchComponent
                title={'Создание и редактирование уборок'}
                is_active={control_cleaning}
                SetIsActive={SetControlCleaning}
              />
            </View>
          </View>
        ) : null}
        <Button
          disabled={is_button_disabled}
          text={is_housemaid ? 'Добавить горничную' : 'Добавить менеджера'}
          onPress={handleAddWorker}
        />
      </View>
    </KeyboardAwareScrollView>
  );
};
