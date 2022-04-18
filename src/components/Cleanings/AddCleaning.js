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
import {Button} from 'styled_components/Button';
import {api} from 'utils/api';
import {getRepeatLabels, getTermLabels} from 'utils/date_repeat';
import {app} from 'store/app';

export const AddCleaning = observer(({navigation}) => {
  const [active_date, SetActiveDate] = useState('сегодня');
  const [is_time_activate, SetIsTimeActivate] = useState(false);
  const [is_timepicker_modal_visible, SetIsTimepickerModalVisible] =
    useState(false);
  const [is_repeatpicker_modal_visible, SetIsRepeatpickerModalVisible] =
    useState(false);
  const [is_termpicker_modal_visible, SetIsTermpickerModalVisible] =
    useState(false);
  const [error_dates, SetErrorDates] = useState([]);
  const [error_housemaid_dates, SetErrorHouseMaidDates] = useState([]);

  let flat = cleaning.flat;
  let check_lists = cleaning.check_lists;
  let housemaid = cleaning.housemaid;
  let date = cleaning.date;
  let time = cleaning.time;
  let is_repeat_active = cleaning.is_repeat_active;

  const repeat_labels = getRepeatLabels();
  const term_labels = getTermLabels();

  const dates = [
    {title: 'сегодня', date: Date.now()},
    {title: 'завтра', date: moment(Date.now()).add(1, 'day')},
    {title: 'послезавтра', date: moment(Date.now()).add(2, 'day')},
  ];
  let is_button_disabled =
    !(flat && check_lists.length && housemaid) ||
    !moment(date)
      .set('h', moment(time).get('h'))
      .set('m', moment(time).get('m'))
      .isAfter(moment());

  const SaveCleaning = async () => {
    let res = await cleaning.addCleaning();
    if (res?.error_dates) return SetErrorDates(res.error_dates);
    if (res?.error_housemaid_dates)
      return SetErrorHouseMaidDates(res.error_housemaid_dates);
    navigation.navigate('CleaningsList');
  };

  useEffect(() => {
    navigation.addListener('focus', () =>
      app.setIsBottomNavigatorVisible(false),
    );
    navigation.addListener('blur', () => app.setIsBottomNavigatorVisible(true));
  }, []);

  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <ScrollView
        contentContainerStyle={{
          alignItems: 'center',
        }}>
        <View style={{padding: 10, width: '100%'}}>
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
              onPress={() => navigation.navigate('CleaningsList')}
              style={{
                width: scale(40),
                height: scale(40),
                aspectRatio: 1,
                backgroundColor: 'white',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 15,
              }}>
              <X fill="black" width={15} height={15} />
            </TouchableOpacity>
          </Shadow>
          <Text
            style={{
              fontFamily: 'Inter-SemiBold',
              fontSize: moderateScale(20),
              color: 'black',
            }}>
            Создание уборки
          </Text>
          <View style={{width: '100%', marginTop: 10}}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('CleaningFlats');
                cleaning.clearAllData();
              }}>
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
            {!housemaid ? (
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
        </View>
        <View
          style={{
            width: dimensions.width,
            backgroundColor: '#EAE9E9',
            height: 1,
          }}
        />
        <View style={{padding: 10, width: '100%'}}>
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
                  shadowColor: is_repeat_active ? '#A19E9D' : '#FFF9F5',
                  shadowOffset: {
                    width: 0,
                    height: 0,
                  },
                  shadowOpacity: is_repeat_active ? 0.5 : 0,
                  shadowRadius: 13.16,
                  elevation: is_repeat_active ? 10 : 0,
                  backgroundColor: is_repeat_active ? 'white' : 'transparent',
                  borderRadius: 15,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  flexDirection: 'row',
                  marginTop: 5,
                  borderColor: is_repeat_active ? 'white' : '#E5E3E2',
                  borderWidth: 1,
                }}>
                <Text
                  style={{
                    color: is_repeat_active ? 'black' : '#E5E3E2',
                    fontSize: moderateScale(15),
                    fontFamily: 'Inter-Medium',
                    marginRight: 10,
                  }}>
                  {cleaning.repeat}
                </Text>
                <ArrowRight
                  fill={is_repeat_active ? '#D1CFCF' : colors.orange}
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
                в течении
              </Text>
              <TouchableOpacity
                onPress={() => SetIsTermpickerModalVisible(true)}
                style={{
                  shadowColor: '#A19E9D',
                  shadowOffset: {
                    width: 0,
                    height: 0,
                  },
                  shadowOpacity: is_repeat_active ? 0.5 : 0,
                  shadowRadius: 13.16,
                  elevation: is_repeat_active ? 10 : 0,
                  backgroundColor: is_repeat_active ? 'white' : 'transparent',
                  borderRadius: 15,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  flexDirection: 'row',
                  marginTop: 5,
                  borderColor: is_repeat_active ? 'white' : '#E5E3E2',
                  borderWidth: 1,
                }}>
                <Text
                  style={{
                    color: is_repeat_active ? 'black' : '#E5E3E2',
                    fontSize: moderateScale(15),
                    fontFamily: 'Inter-Medium',
                    marginRight: 10,
                  }}>
                  {cleaning.term}
                </Text>
                <ArrowRight
                  fill={is_repeat_active ? '#D1CFCF' : colors.orange}
                />
              </TouchableOpacity>
            </View>
          </View>
          <Button
            text={'Создать уборку'}
            marginTop={20}
            disabled={is_button_disabled}
            onPress={SaveCleaning}
          />
        </View>
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
