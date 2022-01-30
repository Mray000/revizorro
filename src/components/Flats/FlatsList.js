import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {api} from 'utils/api';
import {moderateScale, scale, verticalScale} from 'utils/Normalize';
import ArrowRight from 'assets/arrow_right.svg';
import {colors} from 'utils/colors';
import {Loader} from 'utils/Loader';
import moment from 'moment';
export const FlatsList = ({navigation}) => {
  const [flats, SetFlats] = useState(null);

  useEffect(() => {
    if (!flats) api.getFlats().then(SetFlats);
  }, [flats]);
  useEffect(() => {
    navigation.addListener('focus', () => {
      SetFlats(null);
      api.getFlats().then(SetFlats);
    });
  }, []);
  if (!flats) return <Loader />;
  return (
    <ScrollView>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 20,
          paddingHorizontal: 20,
        }}>
        <Text
          style={{
            color: 'black',
            fontFamily: 'Inter-SemiBold',
            fontWeight: '800',
            fontSize: moderateScale(19),
          }}>
          Мои квартиры
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddFlat')}>
          <Text
            style={{
              color: colors.orange,
              fontSize: moderateScale(15),
              fontFamily: 'Inter-Medium',
            }}>
            Добавить
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{marginTop: 10, paddingHorizontal: 10}}>
        {flats.map(flat => (
          <Flat flat={flat} navigation={navigation} key={flat.id} />
        ))}
      </View>
    </ScrollView>
  );
};

const Flat = ({flat, navigation}) => {
  const {title, address, last_cleaning, status, time_created} = flat;
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('FlatProfile', {flat})}
      style={{
        shadowColor: 'black',
        shadowOffset: {
          width: 0,
          height: 10,
        },
        shadowOpacity: 0.51,
        shadowRadius: 13.16,
        elevation: 30,
        paddingHorizontal: 10,
        paddingVertical: 5,
      }}>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          borderRadius: 20,
          padding: 15,
          alignItems: 'center',
          backgroundColor: 'white',
        }}>
        <View style={{width: '90%'}}>
          <Text
            style={{
              fontFamily: 'Inter-SemiBold',
              fontSize: moderateScale(16),
              color: 'black',
            }}>
            {title}
          </Text>
          <Text
            style={{
              fontFamily: 'Inter-Regular',
              fontSize: moderateScale(14),
              color: '#8B8887',
            }}>
            {address}
          </Text>
          {moment(last_cleaning).format('YYYY-MM-DD') !==
          moment(time_created).format('YYYY-MM-DD') ? (
            <Text
              style={{
                fontFamily: 'Inter-Medium',
                fontSize: moderateScale(15),
                color: 'black',
              }}>
              Последняя уборка: {moment(last_cleaning).format('DD MMM HH:mm')}
            </Text>
          ) : null}
          {getStatusBlock(status)}
        </View>
        <View
          style={{
            width: '10%',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}>
          <ArrowRight fill="#D1CFCF" width={scale(12)} height={scale(12)} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const getStatusBlock = (status) => {
  if (status == 'сleaning_is_not_required') return null;
  let text = '';
  let color = '';
  let backgroundColor = '';
  switch (status) {
    case 'not_cleaned': {
      text = 'Не убрана!';
      color = '#E7443A';
      backgroundColor = '#FDF2F1';
      break;
    }
    case 'on_check': {
      text = 'На проверке';
      color = colors.orange;
      backgroundColor = '#FEF3EB';
      break;
    }
    case 'сleaning_is_scheduled': {
      text = 'Уборка ' + moment().format('DD MMM');
      color = '#8B8887';
      backgroundColor = 'white';
      break;
    }
  }

  return (
    <View style={{alignItems: 'flex-start', marginTop: 10}}>
      <Text
        style={{
          color,
          backgroundColor,
          borderWidth: status == 'сleaning_is_scheduled' ? 1 : 0,
          borderColor: '#F3F3F3',
          paddingHorizontal: 10,
          paddingVertical: 5,
          borderRadius: 12,
          fontSize: moderateScale(14),
        }}>
        {text}
      </Text>
    </View>
  );
};
