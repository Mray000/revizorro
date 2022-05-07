import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Modal, Image} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Header} from 'styled_components/Header';
import {moderateScale, scale, verticalScale} from 'utils/normalize';
import {Input} from 'styled_components/Input';
import {dimensions} from 'utils/dimisions';
import {Shadow} from 'react-native-shadow-2';
import ToggleSwitch from 'toggle-switch-react-native';
import {api,} from 'utils/api';
import {Button} from 'styled_components/Button';
import ArrowRight from 'assets/arrow_right.svg';
import ArrowBottom from 'assets/arrow_down.svg';
import {colors} from 'utils/colors';
// import {authentication} from 'store/authentication';

export const EditWorker = ({navigation, route}) => {
  let {
    id,
    avatar,
    role,
    first_name,
    last_name,
    middle_name,
    rating,
    gender,
    manager_permission_check_lists,
    manager_permission_users,
    manager_permission_cleaning,
  } = route.params.worker;
  let is_housemaid = role == 'role_maid';
  const [email, SetEmail] = useState(route.params.worker.email);
  const [name, SetName] = useState(first_name);
  const [surname, SetSurname] = useState(last_name);
  const [middlename, SetMiddlename] = useState(middle_name);
  const [sex, SetSex] = useState(
    gender == 'man_gender' ? 'Мужской' : 'Женский',
  );
  const [control_check_lists, SetControlCheckLists] = useState(
    manager_permission_check_lists || false,
  );
  const [add_workers, SetAddWorkers] = useState(
    manager_permission_users || false,
  );
  const [control_cleaning, SetControlCleaning] = useState(
    manager_permission_cleaning || false,
  );
  const [is_sex_open, SetIsSexOpen] = useState(false);
  const [email_error, SetEmailError] = useState('');
  const [is_load, SetIsLoad] = useState(false);
  const [is_delit_modal_open, SetIsDelitModalOpen] = useState(false);
  let is_button_disabled = !(email && name && surname && sex) || is_load;
  const handleEditWorker = async () => {
    SetIsLoad(true);
    let error = await api.editWorker(
      id,
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
      navigation.navigate('WorkersList');
    } else SetEmailError(error);
    SetIsLoad(false);
  };

  const handleDelitWorker = async () => {
    await api.deleteWorker(id);
    SetIsDelitModalOpen(false);
    navigation.navigate('WorkersList');
  };
  return (
    <>
      <KeyboardAwareScrollView style={{backgroundColor: 'white'}}>
        <Header
          title={'Редактирование'}
          navigation={navigation}
          params={{worker: route.params.worker}}
          to={'WorkerProfile'}
          children={
            <TouchableOpacity
              style={{position: 'absolute', right: 20}}
              disabled={is_button_disabled}
              onPress={handleEditWorker}>
              <Text
                style={{
                  fontSize: moderateScale(15),
                  fontFamily: 'Inter-Medium',
                  color: colors.orange,
                }}>
                Готово
              </Text>
            </TouchableOpacity>
          }
        />
        <Image
          source={{uri: avatar}}
          style={{
            width: scale(70),
            alignSelf: 'center',
            aspectRatio: 1,
            borderRadius: 100,
            marginTop: 10,
          }}
        />
        <View
          style={{
            paddingHorizontal: 10,
            justifyContent: 'space-between',
            marginBottom: 10,
            marginTop: 10,
          }}>
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
                  // justifyContent: 'space-between',
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
                    fontSize: moderateScale(17),
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
                    fontSize: moderateScale(17),
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
                  переключатель, если хотите открыть или отключить доступ к
                  нужной функции:
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
          <TouchableOpacity
            onPress={() => SetIsDelitModalOpen(true)}
            style={{alignItems: 'center', width: '100%', marginTop: 10}}>
            <Text
              style={{
                color: '#AAA8A7',
                fontFamily: 'Inter-Medium',
                fontSize: moderateScale(16),
              }}>
              Удалить сотрудника
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
      {is_delit_modal_open ? (
        <DelitModal
          DelitWorker={handleDelitWorker}
          CloseModal={() => SetIsDelitModalOpen(false)}
        />
      ) : null}
    </>
  );
};

const DelitModal = ({DelitWorker, CloseModal}) => {
  return (
    <Modal animationType="fade" transparent>
      <View
        style={{
          backgroundColor: 'rgba(0,0,0,0.2)',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 15,
            width: '70%',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontFamily: 'Inter-SemiBold',
              fontSize: moderateScale(15),
              color: 'black',
              marginTop: verticalScale(15),
            }}>
            Удаление сотрудника
          </Text>
          <Text
            style={{
              fontFamily: 'Inter-Regular',
              fontSize: moderateScale(13),
              paddingHorizontal: 5,
              color: '#8B8887',
              marginTop: 3,
              textAlign: 'center',
            }}>
            Вы уверены? Вы больше не сможете назначать этого сотрудника на
            уборку квартир, а все его данные удалятся без возможности
            восстановления
          </Text>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 10,
              borderTopColor: '#E5E3E2',
              borderTopWidth: 1,
            }}>
            <TouchableOpacity
              onPress={DelitWorker}
              style={{width: '50%', padding: 8}}>
              <Text
                style={{
                  fontFamily: 'Inter-Regular',
                  fontSize: moderateScale(15),
                  color: '#E6443A',
                  textAlign: 'center',
                }}>
                Удалить
              </Text>
            </TouchableOpacity>
            <View
              style={{backgroundColor: '#E5E3E2', width: 1, height: '100%'}}
            />
            <TouchableOpacity
              onPress={CloseModal}
              style={{
                width: '50%',
                padding: 8,
              }}>
              <Text
                style={{
                  fontFamily: 'Inter-SemiBold',
                  fontSize: moderateScale(15),
                  color: 'black',
                  textAlign: 'center',
                }}>
                Отмена
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const SwitchComponent = ({is_active, SetIsActive, title, disabled}) => {
  let boxShadow = !is_active
    ? {
        startColor: '#00000010',
        finalColor: '#00000002',
        offset: [0, 15],
        distance: 10,
      }
    : {
        startColor: '#0000',
        finalColor: '#0000',
        offset: [0, 0],
        distance: 0,
        corners: [],
        sides: [],
        size: 0,
      };
  return (
    <Shadow
      {...boxShadow}
      viewStyle={{
        flexDirection: 'row',
        width: '100%',
        marginTop: 10,
        height: verticalScale(60),
      }}>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          backgroundColor: 'white',
          borderWidth: 1,
          borderColor: is_active ? '#E5E3E2' : 'white',
          borderRadius: 15,
          paddingHorizontal: 20,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text
          style={{
            color: is_active ? '#8B8887' : 'black',
            fontSize: moderateScale(16),
            width: '80%',
          }}>
          {title}
        </Text>
        <ToggleSwitch
          onColor="#F7AF7B"
          offColor="#C5BEBE"
          size="large"
          isOn={is_active}
          disabled={disabled}
          onToggle={() => SetIsActive(!is_active)}
        />
      </View>
    </Shadow>
  );
};
