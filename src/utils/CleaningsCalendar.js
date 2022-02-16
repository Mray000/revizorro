import React, {useState, useEffect} from 'react';
import moment from 'moment';
import {Calendar, CalendarList, LocaleConfig} from 'react-native-calendars';
import {moderateScale, scale, verticalScale} from 'utils/Normalize';
import ArrowLeft from 'assets/arrow_left.svg';
import ArrowRight from 'assets/arrow_right.svg';
import {Shadow} from 'react-native-shadow-2';
import {Text, TouchableOpacity, View} from 'react-native';
import {cleaning} from 'store/cleaning';
import {colors} from 'utils/colors';
LocaleConfig.locales['ru'] = {
  monthNames: [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ],
  monthNamesShort: [
    'Янв',
    'Фев',
    'Мар',
    'Апр',
    'Май',
    'Июн',
    'Июл',
    'Авг',
    'Сен',
    'Окт',
    'Ноя',
    'Дек',
  ],
  dayNames: [
    'воскресенье',
    'понедельник',
    'вторник',
    'среда',
    'четверг',
    'пятница',
    'суббота',
  ],
  dayNamesShort: ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'],
  today: 'Сегодня',
};
LocaleConfig.defaultLocale = 'ru';

export const CleaningsCalendar = ({
  onDayPress,
  dates,
  last_days_disabled = true,
}) => (

  <Calendar
  firstDay={1}
    renderArrow={direction => (
      <Shadow
        startColor={'#00000008'}
        finalColor={'#00000001'}
        offset={[0, 8]}
        distance={20}>
        <View
          style={{
            width: scale(30),
            height: scale(30),
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 8,
          }}>
          {direction == 'left' ? (
            <ArrowLeft fill="black" width={10} height={10} />
          ) : (
            <ArrowRight fill="black" width={10} height={10} />
          )}
        </View>
      </Shadow>
    )}
    theme={{
      backgroundColor: 'transperent',
      calendarBackground: 'transperent',
      textWeekColor: 'black',
      textMonthFontSize: 18,
      'stylesheet.calendar.header': {
        dayHeader: {
          color: '#9F9494',
          fontFamily: 'Inter-SemiBold',
          fontSize: moderateScale(14),
        },
        arrow: {
          padding: -10,
        },
        week: {
          borderColor: '#E5E3E2',
          borderBottomWidth: 1,
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginTop: 5,
          paddingBottom: 10,
          fontSize: moderateScale(22),
          color: '#9F9494',
        },
      },
    }}
    dayComponent={data => (
      <DayComponent
        last_days_disabled={last_days_disabled}
        data={data}
        key={data.date.dateString}
        count_of_cleanings={dates.reduce(
          (acc, date) => (acc += date == data.date.dateString ? 1 : 0),
          0,
        )}
        onDayPress={onDayPress}
      />
    )}
  />
);

const DayComponent = ({
  data,
  count_of_cleanings,
  onDayPress,
  last_days_disabled,
}) => {
  let {day, dateString, timestamp} = data.date;
  let is_current_day = moment().format('YYYY-MM-DD') == dateString;
  let is_last_day = moment().isAfter(moment(timestamp));

  const getBackgorundColor = () => {
    if (is_current_day) return '#E8443A';
    if (count_of_cleanings) {
      if (is_last_day) return '#ECEAEA';
      else return '#F8EAE0';
    }
    return 'transperent';
  };

  const getTextColor = () => {
    if (is_current_day) return 'white';
    if (is_last_day) return '#C5BFBE';
    if (count_of_cleanings) return colors.orange;
    return 'black';
  };
  return (
    <TouchableOpacity
      disabled={(is_last_day && !is_current_day) && last_days_disabled}
      onPress={() => onDayPress(timestamp)}
      style={{
        backgroundColor: getBackgorundColor(),
        borderRadius: 10,
        width: '80%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text
        style={{
          color: getTextColor(),
          fontSize: moderateScale(15),
          fontFamily: 'Inter-SemiBold',
        }}>
        {day}
      </Text>
      {count_of_cleanings > 1 ? (
        <Text
          style={{
            position: 'absolute',
            right: 6,
            top: 1,
            color: getTextColor(),
            fontSize: moderateScale(10),
            fontFamily: 'Inter-SemiBold',
          }}>
          {count_of_cleanings}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
};
