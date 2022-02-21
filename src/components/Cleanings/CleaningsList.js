import {observer} from 'mobx-react-lite';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {api} from 'utils/api';
import {Loader} from 'utils/Loader';
import {moderateScale, scale, verticalScale} from 'utils/Normalize';
import {colors} from 'utils/colors';
import {Shadow} from 'react-native-shadow-2';
import {dimensions} from 'utils/dimisions';
import {CleaningsCalendar} from 'utils/CleaningsCalendar';
import {CleaningComponent} from './CleaningComponent';
import ArrowDown from 'assets/arrow_down.svg';
import ArrowUp from 'assets/arrow_up.svg';
import {app} from 'store/app';
export const CleaningsList = observer(({navigation}) => {
  const [is_list_active, SetIsListActive] = useState(true);
  const [cleanings, SetCleanings] = useState(null);
  const [is_need_check_cleanings_full, SetIsNeedCheckCleaningsFull] =
    useState(false);
  const [is_future_cleanings_full, SetIsFutureCleaningsFull] = useState(false);
  const [is_complited_cleanings_full, SetIsComplitedCleaningsFull] =
    useState(false);

  useEffect(() => {
    navigation.addListener('focus', () => {
      SetCleanings(null);
      api.getCleanings().then(SetCleanings);
    });
  }, []);

  useEffect(() => {
    if (!cleanings) api.getCleanings().then(SetCleanings);
  }, [cleanings]);

  if (!cleanings) return <Loader />;
  let need_check_cleanings = cleanings.filter(el => el.status == 'on_check');
  let future_cleanings = cleanings.filter(
    el => el.status == 'not_accepted' || el.status == 'report_required',
  );
  let complited_cleanings = cleanings.filter(el => el.status == 'accepted');
  let dates = cleanings.map(el =>
    moment(el.time_cleaning).format('YYYY-MM-DD'),
  );

  const getDeclination = (word, count) => {
    if (count == 1) {
      word = word.slice(0, -1);
      word += 'ая';
    }
    if (count == 0 || count > 4) word += 'х';
    if (count >= 2 && count <= 4) word += 'е';
    return word;
  };

  return (
    <View style={{alignItems: 'center', padding: 10}}>
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: '#E5E5E5',
          borderRadius: 20,
          width: '75%',
          padding: 5,
        }}>
        <TouchableOpacity
          onPress={() => SetIsListActive(true)}
          style={{
            backgroundColor: is_list_active ? 'white' : 'transparent',
            width: '50%',
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 5,
          }}>
          <Text
            style={{
              fontFamily: 'Inter-Regular',
              fontSize: moderateScale(15),
              color: is_list_active ? 'black' : '#9F9494',
            }}>
            Список
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => SetIsListActive(false)}
          style={{
            backgroundColor: !is_list_active ? 'white' : 'transparent',
            width: '50%',
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 5,
          }}>
          <Text
            style={{
              fontFamily: 'Inter-Regular',
              fontSize: moderateScale(15),
              color: !is_list_active ? 'black' : '#9F9494',
            }}>
            Календарь
          </Text>
        </TouchableOpacity>
      </View>
      {is_list_active ? (
        <ScrollView
          contentContainerStyle={{
            alignItems: 'center',
            paddingBottom: moderateScale(60),
            width: '100%',
          }}
          style={{width: '100%'}}>
          {need_check_cleanings.length ? (
            <View style={{width: '100%', marginTop: 10}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View
                  style={{
                    width: scale(18),
                    aspectRatio: 1,
                    borderRadius: scale(40),
                    backgroundColor: '#FCE5E3',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 5,
                  }}>
                  <View
                    style={{
                      width: scale(11),
                      aspectRatio: 1,
                      borderRadius: scale(20),
                      backgroundColor: '#E8443A',
                    }}
                  />
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text
                    style={{
                      fontSize: moderateScale(18),
                      color: 'black',
                      fontFamily: 'Inter-SemiBold',
                      marginLeft: 5,
                    }}>
                    Нужна проверка!
                  </Text>
                  <TouchableOpacity
                    style={{marginLeft: 10}}
                    onPress={() =>
                      SetIsNeedCheckCleaningsFull(!is_need_check_cleanings_full)
                    }>
                    {!is_need_check_cleanings_full ? (
                      <ArrowDown fill="black" />
                    ) : (
                      <ArrowUp fill="black" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
              <View>
                {need_check_cleanings
                  .splice(
                    0,
                    !is_need_check_cleanings_full
                      ? 10
                      : need_check_cleanings.length,
                  )
                  .map(cleaning => (
                    <CleaningComponent
                      key={cleaning.id}
                      navigation={navigation}
                      cleaning={cleaning}
                      is_need_check={true}
                    />
                  ))}
              </View>
            </View>
          ) : null}
          {future_cleanings.length &&
          (app.role == 'role_manager'
            ? app.accesses.includes('cleanings')
            : true) ? (
            <View style={{width: '100%', marginTop: 10}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={{
                    textAlign: 'left',
                    color: '#A9A6A6',
                    fontSize: moderateScale(15),
                    fontFamily: 'Inter-Regualar',
                  }}>
                  предстоящие уборки
                </Text>
                <TouchableOpacity
                  style={{marginLeft: 10}}
                  onPress={() =>
                    SetIsFutureCleaningsFull(!is_future_cleanings_full)
                  }>
                  {!is_future_cleanings_full ? (
                    <ArrowDown fill="#A9A6A6" />
                  ) : (
                    <ArrowUp fill="#A9A6A6" />
                  )}
                </TouchableOpacity>
              </View>
              {future_cleanings
                .splice(
                  0,
                  !is_future_cleanings_full ? 10 : future_cleanings.length,
                )
                .map(cleaning => (
                  <CleaningComponent
                    navigation={navigation}
                    cleaning={cleaning}
                    key={cleaning.id}
                    disabled={
                      cleaning.amount_checks ||
                      cleaning.status == 'report_required'
                    }
                  />
                ))}
            </View>
          ) : null}
          {complited_cleanings.length ? (
            <View style={{width: '100%', marginTop: 10}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={{
                    textAlign: 'left',
                    color: '#A9A6A6',
                    fontSize: moderateScale(15),
                    fontFamily: 'Inter-Regualar',
                  }}>
                  завершенные уборки
                </Text>
                <TouchableOpacity
                  style={{marginLeft: 10}}
                  onPress={() =>
                    SetIsComplitedCleaningsFull(!is_complited_cleanings_full)
                  }>
                  {!is_complited_cleanings_full ? (
                    <ArrowDown fill="#A9A6A6" />
                  ) : (
                    <ArrowUp fill="#A9A6A6" />
                  )}
                </TouchableOpacity>
              </View>
              {complited_cleanings
                .splice(
                  0,
                  !is_complited_cleanings_full
                    ? 10
                    : complited_cleanings.length,
                )
                .map(cleaning => (
                  <CleaningComponent
                    is_completed={true}
                    cleaning={cleaning}
                    key={cleaning.id}
                    navigation={navigation}
                  />
                ))}
            </View>
          ) : null}
        </ScrollView>
      ) : (
        <View style={{width: '100%', marginTop: 10}}>
          <CleaningsCalendar
            last_days_disabled={false}
            dates={dates}
            onDayPress={day => navigation.navigate('DayCleaningsList', {day})}
          />
          <View style={{padding: 10}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View
                style={{
                  width: scale(10),
                  aspectRatio: 1,
                  borderRadius: 30,
                  backgroundColor: '#E8443A',
                  borderColor: '#E8443A',
                  borderWidth: 1,
                }}
              />
              <Text
                style={{
                  fontFamily: 'Inter-Regular',
                  fontSize: moderateScale(15),
                  color: '#888584',
                  marginLeft: 10,
                }}>
                {need_check_cleanings.length}{' '}
                {getDeclination('текущи', need_check_cleanings.length)}
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View
                style={{
                  width: scale(10),
                  aspectRatio: 1,
                  borderRadius: 30,
                  backgroundColor: '#F9DCC8',
                  borderColor: '#ECD1BF',
                  borderWidth: 1,
                }}
              />
              <Text
                style={{
                  fontFamily: 'Inter-Regular',
                  fontSize: moderateScale(15),
                  color: '#888584',
                  marginLeft: 10,
                }}>
                {future_cleanings.length}{' '}
                {getDeclination('предстоящи', future_cleanings.length)}
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View
                style={{
                  width: scale(10),
                  aspectRatio: 1,
                  borderRadius: 30,
                  borderWidth: 1,
                  borderColor: '#DFDDDD',
                  backgroundColor: '#EBE9E9',
                }}
              />
              <Text
                style={{
                  fontFamily: 'Inter-Regular',
                  fontSize: moderateScale(15),
                  color: '#888584',
                  marginLeft: 10,
                }}>
                {complited_cleanings.length}{' '}
                {getDeclination('завершенны', complited_cleanings.length)}
              </Text>
            </View>
          </View>
        </View>
      )}
      {app.role == 'role_admin' || app.accesses.includes('cleanings') ? (
        <Shadow
          startColor={'#F4843316'}
          finalColor={'#F4843301'}
          offset={[0, 6]}
          distance={10}
          containerViewStyle={{
            position: 'absolute',
            width: scale(40),
            aspectRatio: 1,
            backgroundColor: colors.orange,
            top: dimensions.height - verticalScale(60) - scale(40) - 50,
            right: 10,
            borderRadius: 15,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
          }}
          viewStyle={{
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            padding: 0,
          }}>
          <TouchableOpacity onPress={() => navigation.navigate('AddCleaning')}>
            <Text
              style={{
                color: 'white',
                fontFamily: 'Inter-Medium',
                fontSize: moderateScale(30),
                bottom: 3,
              }}>
              +
            </Text>
          </TouchableOpacity>
        </Shadow>
      ) : null}
    </View>
  );
});
