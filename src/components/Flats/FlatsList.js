import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {api} from 'utils/api';
import {moderateScale, scale, verticalScale} from 'utils/normalize';
import ArrowRight from 'assets/arrow_right.svg';
import {colors} from 'utils/colors';
import {Loader} from 'styled_components/Loader';
import moment from 'moment';
import {NoData} from 'styled_components/NoData';
import {PlusButton} from 'styled_components/PlusButton';
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
  console.log(flats[0]);
  return (
    <View style={{flex: 1}}>
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
      {flats.length ? (
        <ScrollView style={{marginTop: 10, paddingHorizontal: 10}}>
          {flats.reverse().map(flat => (
            <Flat flat={flat} navigation={navigation} key={flat.id} />
          ))}
        </ScrollView>
      ) : (
        <NoData screen={'Flats'} />
      )}
      <PlusButton onPress={() => navigation.navigate('AddFlat')} />
    </View>
  );
};

const Flat = ({flat, navigation}) => {
  const {title, address, last_cleaning, status, time_created, cleaning} = flat;
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('FlatProfile', {flat})}
      style={{
        shadowColor: '#C8C7C7',
        shadowOffset: {
          width: 0,
          height: 10,
        },
        shadowOpacity: 0.51,
        shadowRadius: 10,
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
          {moment(last_cleaning).format('YYYY-MM-DD hh:mm') !==
          moment(time_created).format('YYYY-MM-DD hh:mm') ? (
            <Text
              style={{
                fontFamily: 'Inter-Regular',
                fontSize: moderateScale(14),
                color: 'black',
                marginTop: 3,
              }}>
              Последняя уборка: {moment(last_cleaning).format('DD MMM HH:mm')}
            </Text>
          ) : null}
          {getStatusBlock(status, cleaning)}
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

const getStatusBlock = (status, cleaning) => {
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
      text =
        'Уборка ' +
        moment(
          cleaning.find(el => el.status == 'not_accepted')?.time_cleaning,
        ).format('DD MMM');
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
