import React, {useState, useEffect, useMemo, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
} from 'react-native';
import {Shadow} from 'react-native-shadow-2';
import {moderateScale, scale, verticalScale} from 'utils/normalize';
import X from 'assets/x.svg';
import ArrowRight from 'assets/arrow_right.svg';
import {dimensions} from 'utils/dimisions';
import {colors} from 'utils/colors';
import CheckListsIcon from 'assets/check_list.svg';
import {cleaning} from 'store/cleaning';
import {observer} from 'mobx-react-lite';
import Calendar from 'assets/calendar.svg';
import TimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import 'moment/locale/ru';
import {ModalPicker} from 'styled_components/ModalPicker';
import {getRepeatLabels, getTermLabels} from 'utils/date_repeat';
import {app} from 'store/app';
import {Header} from 'styled_components/Header';
import {ErrorText} from 'styled_components/ErrorText';

export const EditCleaning = observer(({navigation}) => {
  const [active_date, SetActiveDate] = useState('сегодня');
  const [is_time_activate, SetIsTimeActivate] = useState(false);
  const [is_timepicker_modal_visible, SetIsTimepickerModalVisible] =
    useState(false);
  const [is_repeatpicker_modal_visible, SetIsRepeatpickerModalVisible] =
    useState(false);
  const [is_termpicker_modal_visible, SetIsTermpickerModalVisible] =
    useState(false);

  const [is_delete_modal_visible, SetIsDeleteModalVisible] = useState(false);
  const [error_dates, SetErrorDates] = useState([]);
  const [error_housemaid_dates, SetErrorHouseMaidDates] = useState([]);

  let edit_id = cleaning.edit_id;
  let flat = cleaning.flat;
  let check_lists = cleaning.check_lists;
  let housemaid = cleaning.housemaid;
  let date = cleaning.date;
  let time = cleaning.time;
  console.log(housemaid?.is_active);

  const repeat_labels = getRepeatLabels();
  const term_labels = getTermLabels();

  let now = Date.now();
  const dates = [
    {title: 'сегодня', date: now},
    {title: 'завтра', date: moment(now).add(1, 'day')},
    {title: 'послезавтра', date: moment(now).add(2, 'day')},
  ];

  let current_selected_date = moment(date)
    .set('h', moment(time).get('h'))
    .set('m', moment(time).get('m'));

  let is_overdue = !current_selected_date.isAfter(moment());

  let is_button_disabled =
    !(flat && check_lists.length && housemaid) ||
    is_overdue ||
    !housemaid?.is_active;

  const handleEditCleaning = async () => {
    let error = await cleaning.editCleaning();
    console.log(error);
    if (!error) navigation.navigate('CleaningsList');
    else {
      if (error == 'data_error') SetErrorDates([current_selected_date]);
      else SetErrorHouseMaidDates([current_selected_date]);
    }
  };

  useEffect(() => {
    navigation.addListener('focus', () =>
      app.setIsBottomNavigatorVisible(false),
    );
    navigation.addListener('blur', () => app.setIsBottomNavigatorVisible(true));
  }, []);

  const handleDeleteCleaning = async () => {
    await cleaning.deleteCleaning();
    navigation.navigate('CleaningsList');
  };

  if (cleaning.amount_checks) {
    return (
      <View>
        <Header
          title={'Редактирование'}
          onBack={() => {
            navigation.goBack();
            cleaning.clearAllData();
          }}
        />
        <Text
          style={{
            fontSize: moderateScale(20),
            color: colors.orange,
            fontFamily: 'Inter-Medium',
          }}>
          Дождитесь отчета горничной
        </Text>
        <TouchableOpacity
          onPress={() => SetIsDeleteModalVisible(true)}
          style={{alignItems: 'center', width: '100%', marginTop: 20}}>
          <Text
            style={{
              color: '#AAA8A7',
              fontFamily: 'Inter-Medium',
              fontSize: moderateScale(16),
              marginBottom: 20,
            }}>
            Удалить уборку
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <ScrollView
        contentContainerStyle={{
          alignItems: 'center',
          paddingTop: 10,
        }}>
        <Header
          title={'Редактирование'}
          onBack={() => {
            navigation.goBack();
            cleaning.clearAllData();
          }}
          children={
            <TouchableOpacity
              style={{position: 'absolute', right: 20}}
              disabled={is_button_disabled}
              onPress={handleEditCleaning}>
              <Text
                style={{
                  fontSize: moderateScale(15),
                  fontFamily: 'Inter-Medium',
                  color: is_button_disabled ? 'gray' : colors.orange,
                }}>
                Готово
              </Text>
            </TouchableOpacity>
          }
        />
        <View style={{padding: 10, width: '100%'}}>
          <View style={{width: '100%'}}>
            <TouchableOpacity
              onPress={() => navigation.navigate('CleaningFlats')}>
              <Shadow
                viewStyle={{
                  width: '100%',
                  height: dimensions.height / 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderColor: flat ? 'white' : '#FDE2CE',
                  borderWidth: 1,
                  borderRadius: 18,
                  flexDirection: 'row',
                  paddingHorizontal: 1,
                  backgroundColor: flat ? 'white' : '#FFF9F5',
                }}
                startColor={flat ? '#00000010' : '#0000'}
                finalColor={flat ? '#00000002' : '#0000'}
                offset={flat ? [0, 5] : [0, 0]}
                distance={!flat ? 0 : undefined}
                corners={!flat ? [] : undefined}
                sides={!flat ? [] : undefined}
                size={!flat ? 0 : undefined}>
                <View
                  style={{
                    justifyContent: 'center',
                    width: '90%',
                    height: '100%',
                  }}>
                  <Text
                    style={{
                      alignSelf: 'stretch',
                      color: flat ? 'black' : colors.orange,
                      paddingLeft: 20,
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 17,
                    }}>
                    {flat?.title || 'Выберите квартиру'}
                  </Text>
                </View>
                <View
                  style={{
                    width: '10%',
                    alignItems: 'center',
                  }}>
                  <ArrowRight fill={flat ? '#CAC8C8' : colors.orange} />
                </View>
              </Shadow>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={!flat}
              onPress={() => navigation.navigate('CleaningCheckLists')}
              style={{
                height: dimensions.height / 10,
                backgroundColor: check_lists.length ? 'white' : '#FFF9F5',
                borderRadius: 20,
                marginTop: 10,
                borderColor: check_lists.length ? '#E5E3E2' : '#FDE2CE',
                borderWidth: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  justifyContent: 'center',
                  width: '90%',
                  height: '100%',
                }}>
                <Text
                  style={{
                    alignSelf: 'stretch',
                    color: colors.orange,
                    paddingLeft: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 17,
                  }}>
                  {!check_lists?.length
                    ? 'Назначьте чек-лист уборки'
                    : 'Добавить еще чек-лист'}
                </Text>
              </View>
              <View
                style={{
                  width: '10%',
                  alignItems: 'center',
                }}>
                <ArrowRight fill={colors.orange} />
              </View>
            </TouchableOpacity>

            <View>
              {check_lists.map(check_list => (
                <CheckList check_list={check_list} key={check_list.id} />
              ))}
            </View>
            {!housemaid || !housemaid?.is_active ? (
              <TouchableOpacity
                onPress={() => navigation.navigate('CleaningHousemaids')}
                style={{
                  height: dimensions.height / 10,
                  backgroundColor: '#FFF9F5',
                  borderRadius: 20,
                  marginTop: 10,
                  borderColor: '#FDE2CE',
                  borderWidth: 1,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    justifyContent: 'center',
                    width: '90%',
                    height: '100%',
                  }}>
                  <Text
                    style={{
                      alignSelf: 'stretch',
                      color: colors.orange,
                      paddingLeft: 20,
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 17,
                    }}>
                    Выберите горничную
                  </Text>
                </View>
                <View
                  style={{
                    width: '10%',
                    alignItems: 'center',
                  }}>
                  <ArrowRight fill={colors.orange} />
                </View>
              </TouchableOpacity>
            ) : (
              <Housemaid housemaid={housemaid} />
            )}
          </View>
          <View style={{width: '100%', marginTop: 20}}>
            {is_overdue ? (
              <Text
                style={{
                  color: colors.red,
                  fontFamily: 'Inter-SemiBold',
                  textAlign: 'center',
                  fontSize: moderateScale(16),
                  marginBottom: 10,
                }}>
                Уборка не выполнена
              </Text>
            ) : null}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                width: '100%',
              }}>
              <View
                style={{
                  width: scale(30),
                  aspectRatio: 1,
                  backgroundColor: 'white',
                  borderRadius: 8,
                  shadowColor: '#C8C7C7',
                  shadowOffset: {
                    width: 0,
                    height: 0,
                  },
                  shadowOpacity: 0.51,
                  shadowRadius: 13.16,
                  elevation: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Calendar />
              </View>

              <Text
                style={{
                  color: 'black',
                  fontSize: moderateScale(16),
                  fontFamily: 'Inter-SemiBold',
                  marginLeft: 5,
                }}>
                Назначьте дату уборки:
              </Text>
            </View>
            <View style={{flexDirection: 'row', marginTop: 10}}>
              {dates.map(el => (
                <TouchableOpacity
                  key={el.title}
                  style={{
                    backgroundColor:
                      active_date == el.title ? '#F48433' : '#F9F9F9',
                    padding: 10,
                    borderRadius: 10,
                    marginRight: 15,
                  }}
                  onPress={() => {
                    SetActiveDate(el.title);
                    cleaning.setDate(el.date);
                  }}>
                  <Text
                    style={{
                      color: active_date == el.title ? 'white' : '#93918F',
                      fontSize: moderateScale(15),
                      fontFamily: 'Inter-Regular',
                    }}>
                    {el.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
              }}>
              <View>
                <Text
                  style={{
                    color: '#AEACAB',
                    fontFamily: 'Inter-Regular',
                    fontSize: moderateScale(14),
                    marginLeft: 5,
                  }}>
                  день
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('AddCleaningCalendar')}
                  style={{
                    shadowColor: '#A19E9D',
                    shadowOffset: {
                      width: 0,
                      height: 0,
                    },
                    shadowOpacity: 0.5,
                    shadowRadius: 13.16,
                    elevation: 10,
                    backgroundColor: 'white',
                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                    flexDirection: 'row',
                    marginTop: 5,
                  }}>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: moderateScale(15),
                      fontFamily: 'Inter-Medium',
                      marginRight: 10,
                    }}>
                    {moment(date).format('D')}
                  </Text>
                  <ArrowRight fill="#D1CFCF" />
                </TouchableOpacity>
              </View>
              <View style={{marginLeft: 20}}>
                <Text
                  style={{
                    color: '#AEACAB',
                    fontFamily: 'Inter-Regular',
                    fontSize: moderateScale(14),
                    marginLeft: 5,
                  }}>
                  месяц
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('AddCleaningCalendar')}
                  style={{
                    shadowColor: '#A19E9D',
                    shadowOffset: {
                      width: 0,
                      height: 0,
                    },
                    shadowOpacity: 0.5,
                    shadowRadius: 13.16,
                    elevation: 10,
                    backgroundColor: 'white',
                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                    flexDirection: 'row',
                    marginTop: 5,
                  }}>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: moderateScale(15),
                      fontFamily: 'Inter-Medium',
                      marginRight: 10,
                    }}>
                    {moment(date).format('MMMM')}
                  </Text>
                  <ArrowRight fill="#D1CFCF" />
                </TouchableOpacity>
              </View>
              <View style={{marginLeft: 20}}>
                <Text
                  style={{
                    color: '#AEACAB',
                    fontFamily: 'Inter-Regular',
                    fontSize: moderateScale(14),
                    marginLeft: 5,
                  }}>
                  время
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    SetIsTimepickerModalVisible(true);
                    SetIsTimeActivate(true);
                  }}
                  style={{
                    shadowColor: is_time_activate ? '#A19E9D' : '#FFF9F5',
                    shadowOffset: {
                      width: 0,
                      height: 0,
                    },
                    shadowOpacity: 0.5,
                    shadowRadius: 13.16,
                    elevation: 10,
                    backgroundColor: is_time_activate ? 'white' : '#FFF9F5',
                    borderRadius: 15,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                    flexDirection: 'row',
                    marginTop: 5,
                    borderColor: is_time_activate ? 'white' : '#FDE2CE',
                    borderWidth: 1,
                  }}>
                  <Text
                    style={{
                      color: is_time_activate ? 'black' : '#FDE2CE',
                      fontSize: moderateScale(15),
                      fontFamily: 'Inter-Medium',
                      marginRight: 10,
                    }}>
                    {moment(time).format('HH:mm')}
                  </Text>
                  <ArrowRight fill={is_time_activate ? '#D1CFCF' : '#FDE2CE'} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => SetIsDeleteModalVisible(true)}
            style={{alignItems: 'center', width: '100%', marginTop: 20}}>
            <Text
              style={{
                color: '#AAA8A7',
                fontFamily: 'Inter-Medium',
                fontSize: moderateScale(16),
                marginBottom: 20,
              }}>
              Удалить уборку
            </Text>
          </TouchableOpacity>
        </View>
        {/* <View
          style={{
            width: dimensions.width,
            backgroundColor: '#EAE9E9',
            height: 1,
          }}
        /> */}
        {/* <View style={{padding: 10, width: '100%'}}>
          <Text
            style={{
              fontFamily: 'Inter-SemiBold',
              fontSize: moderateScale(16),
              color: 'black',
              marginTop: 10,
            }}>
            Повторять уборку:
          </Text>
          <View style={{flexDirection: 'row', marginTop: 10}}>
            <View>
              <Text
                style={{
                  color: '#AEACAB',
                  fontFamily: 'Inter-Regular',
                  fontSize: moderateScale(14),
                  marginLeft: 5,
                }}>
                каждый
              </Text>
              <TouchableOpacity
                onPress={() => SetIsRepeatpickerModalVisible(true)}
                style={{
                  shadowColor: cleaning.is_repeat_active ? '#A19E9D' : 'white',
                  shadowOffset: {
                    width: 0,
                    height: 0,
                  },
                  shadowOpacity: 0.5,
                  shadowRadius: 13.16,
                  elevation: 10,
                  backgroundColor: cleaning.is_repeat_active
                    ? 'white'
                    : 'transparent',
                  borderRadius: 15,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  flexDirection: 'row',
                  marginTop: 5,
                  borderColor: cleaning.is_repeat_active ? 'white' : '#E5E3E2',
                  borderWidth: 1,
                }}>
                <Text
                  style={{
                    color: cleaning.is_repeat_active ? 'black' : '#E5E3E2',
                    fontSize: moderateScale(15),
                    fontFamily: 'Inter-Medium',
                    marginRight: 10,
                  }}>
                  {cleaning.repeat}
                </Text>
                <ArrowRight
                  fill={cleaning.is_repeat_active ? '#D1CFCF' : colors.orange}
                />
              </TouchableOpacity>
            </View>
            <View style={{marginLeft: 20}}>
              <Text
                style={{
                  color: '#AEACAB',
                  fontFamily: 'Inter-Regular',
                  fontSize: moderateScale(14),
                  marginLeft: 5,
                }}>
                в течение
              </Text>
              <TouchableOpacity
                onPress={() => SetIsTermpickerModalVisible(true)}
                style={{
                  shadowColor: cleaning.is_repeat_active ? '#A19E9D' : 'white',
                  shadowOffset: {
                    width: 0,
                    height: 0,
                  },
                  shadowOpacity: 0.5,
                  shadowRadius: 13.16,
                  elevation: 10,
                  backgroundColor: cleaning.is_repeat_active
                    ? 'white'
                    : 'transparent',
                  borderRadius: 15,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  flexDirection: 'row',
                  marginTop: 5,
                  borderColor: cleaning.is_repeat_active ? 'white' : '#E5E3E2',
                  borderWidth: 1,
                }}>
                <Text
                  style={{
                    color: cleaning.is_repeat_active ? 'black' : '#E5E3E2',
                    fontSize: moderateScale(15),
                    fontFamily: 'Inter-Medium',
                    marginRight: 10,
                  }}>
                  {cleaning.term}
                </Text>
                <ArrowRight
                  fill={cleaning.is_repeat_active ? '#D1CFCF' : colors.orange}
                />
              </TouchableOpacity>
            </View>
          </View>
          
        </View> */}
      </ScrollView>
      <TimePickerModal
        isVisible={is_timepicker_modal_visible}
        mode="time"
        cancelTextIOS="Отмена"
        confirmTextIOS="Сохранить"
        is24Hour={true}
        date={moment(time).toDate()}
        onConfirm={time => {
          cleaning.setTime(time);
          SetIsTimepickerModalVisible(false);
        }}
        onCancel={() => SetIsTimepickerModalVisible(false)}
      />
      <ModalPicker
        visible={is_repeatpicker_modal_visible}
        data={repeat_labels}
        onPick={cleaning.setRepeat}
        closeModal={() => SetIsRepeatpickerModalVisible(false)}
      />
      <ModalPicker
        visible={is_termpicker_modal_visible}
        data={term_labels}
        onPick={cleaning.setTerm}
        closeModal={() => SetIsTermpickerModalVisible(false)}
      />

      {error_dates.length ? (
        <ErrorDatesModal
          error_dates={error_dates}
          SetErrorDates={() => SetErrorDates([])}
        />
      ) : null}
      {error_housemaid_dates.length ? (
        <ErrorHousemaidModal
          error_housemaid_dates={error_housemaid_dates}
          SetErrorHouseMaidDates={() => SetErrorHouseMaidDates([])}
        />
      ) : null}
      {is_delete_modal_visible ? (
        <DeleteModal
          DeleteCleaning={handleDeleteCleaning}
          CloseModal={() => SetIsDeleteModalVisible(false)}
        />
      ) : null}
    </View>
  );
});

//////////////////////////////////////////
const CheckList = ({check_list}) => (
  <View
    style={{
      height: dimensions.height / 12,
      backgroundColor: '#F5F4F4',
      borderRadius: 15,
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
      paddingHorizontal: 15,
      marginTop: 10,
    }}>
    <View style={{flexDirection: 'row', width: '70%'}}>
      <CheckListsIcon />
      <Text
        numberOfLines={1}
        style={{
          fontFamily: 'Inter-Regular',
          fontSize: moderateScale(16),
          color: 'black',
          marginLeft: 5,
        }}>
        {check_list.name}
      </Text>
    </View>
    <View
      style={{
        width: '23%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <Text
        numberOfLines={1}
        style={{
          color: 'black',
          fontWeight: '800',
          fontFamily: 'Inter-SemiBold',
          fontSize: moderateScale(16),
        }}>
        {check_list.cost} ₽
      </Text>
      <TouchableOpacity onPress={() => cleaning.setCheckList(check_list)}>
        <X fill="#BCB6B6" />
      </TouchableOpacity>
    </View>
  </View>
);

const Housemaid = ({housemaid}) => (
  <View
    style={{
      height: dimensions.height / 10,
      backgroundColor: 'white',
      marginTop: 10,

      shadowColor: '#C8C7C7',
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.51,
      shadowRadius: 13.16,
      elevation: 20,
      paddingHorizontal: 20,
      paddingVertical: 5,
      alignItems: 'center',
      padding: 10,
      borderRadius: 20,
      flexDirection: 'row',
    }}>
    <View
      style={{
        width: '100%',
        justifyContent: 'space-around',
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <View style={{width: '20%'}}>
        <Image
          source={{uri: housemaid.avatar}}
          style={{
            width: '80%',
            aspectRatio: 1,
            borderRadius: dimensions.width * 0.2,
          }}
        />
      </View>
      <View style={{width: '80%'}}>
        <Text
          style={{
            fontFamily: 'Inter-Medium',
            fontSize: moderateScale(15),
            color: 'black',
          }}>
          {housemaid.first_name + ' ' + housemaid.last_name}
        </Text>
      </View>
      <TouchableOpacity onPress={() => cleaning.setHousemaid(null)}>
        <X fill="#BCB6B6" />
      </TouchableOpacity>
    </View>
  </View>
);

const ErrorDatesModal = ({error_dates, SetErrorDates}) => (
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
            fontSize: moderateScale(17),
            color: 'black',
            marginTop: verticalScale(15),
          }}>
          Ошибка
        </Text>
        <Text
          style={{
            fontFamily: 'Inter-Medium',
            fontSize: moderateScale(15),
            color: 'black',
            marginTop: verticalScale(3),
            textAlign: 'center',
          }}>
          Уборки на эти даты уже назначены:
        </Text>
        <Text
          style={{
            fontFamily: 'Inter-Medium',
            fontSize: moderateScale(15),
            color: 'black',
          }}>
          {error_dates.map(
            (date, i) =>
              moment(date).format('D MMMM YYYY г. в HH:mm') +
              (i == error_dates.length - 1 ? '' : ',\n'),
          )}
        </Text>

        <View
          style={{
            flexDirection: 'row',
            marginTop: 10,
            borderTopColor: '#E5E3E2',
            borderTopWidth: 1,
          }}>
          <TouchableOpacity
            onPress={SetErrorDates}
            style={{
              width: '100%',
              padding: 8,
            }}>
            <Text
              style={{
                fontFamily: 'Inter-SemiBold',
                fontSize: moderateScale(15),
                color: 'black',
                textAlign: 'center',
              }}>
              Ок
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const ErrorHousemaidModal = ({
  error_housemaid_dates,
  SetErrorHouseMaidDates,
}) => (
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
            fontSize: moderateScale(17),
            color: 'black',
            marginTop: verticalScale(15),
          }}>
          Ошибка
        </Text>
        <Text
          style={{
            fontFamily: 'Inter-Medium',
            fontSize: moderateScale(15),
            color: 'black',
          }}>
          Горнчиная на это время уже занята:
        </Text>
        <Text
          style={{
            fontFamily: 'Inter-Medium',
            fontSize: moderateScale(15),
            color: 'black',
          }}>
          {error_housemaid_dates.map(
            (date, i) =>
              moment(date).format('DD MMMM YYYY г. в HH:mm') +
              (i == error_housemaid_dates.length - 1 ? '' : ',\n'),
          )}
        </Text>

        <View
          style={{
            flexDirection: 'row',
            marginTop: 10,
            borderTopColor: '#E5E3E2',
            borderTopWidth: 1,
          }}>
          <TouchableOpacity
            onPress={SetErrorHouseMaidDates}
            style={{
              width: '100%',
              padding: 8,
            }}>
            <Text
              style={{
                fontFamily: 'Inter-SemiBold',
                fontSize: moderateScale(15),
                color: 'black',
                textAlign: 'center',
              }}>
              Ок
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const DeleteModal = ({DeleteCleaning, CloseModal}) => {
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
            Удаление уборки
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
            Вы уверены, что хотите удалить уборку? Все данные уборки удалятся
            без возможности восстановления.
          </Text>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 10,
              borderTopColor: '#E5E3E2',
              borderTopWidth: 1,
            }}>
            <TouchableOpacity
              onPress={DeleteCleaning}
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
