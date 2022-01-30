import React from 'react';
import ArrowRight from 'assets/arrow_right.svg';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {Shadow} from 'react-native-shadow-2';
import { moderateScale, scale } from 'utils/Normalize';
import moment from 'moment';

export const CleaningComponent = React.memo(
  ({cleaning, is_completed, is_need_check, repeat_count}) => {
    let {flat, check_lists, maid} = cleaning;
    const getDate = () => {
      let today = moment();
      let date = moment(cleaning.time_cleaning);
      let time = date.format('HH:mm');
      if (date.format('YYYY-MM-DD') == today.format('YYYY-MM-DD')) return time;
      if (date.format('YYYY-MM-DD') == today.add(1, 'day').format('YYYY-MM-DD'))
        return 'завтра ' + time;
      return date.format('D MMM') + ' ' + time;
    };
    return (
      <Shadow
        startColor={!is_completed ? '#00000003' : '#0000'}
        finalColor={!is_completed ? '#00000002' : '#0000'}
        offset={!is_completed ? [0, 5] : [0, 0]}
        distance={is_completed ? 0 : undefined}
        corners={is_completed ? [] : undefined}
        sides={is_completed ? [] : undefined}
        size={is_completed ? 0 : undefined}
        viewStyle={{width: '100%', paddingHorizontal: 1}}>
        <TouchableOpacity
          style={{
            backgroundColor: is_completed ? 'transparent' : 'white',
            width: '100%',
            padding: 15,
            borderRadius: 20,
            marginTop: 10,
            borderWidth: 1,
            borderColor: is_completed ? '#D8D6D5' : 'white',
            paddingBottom: 5,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {is_need_check ? (
                  <View
                    style={{
                      width: scale(15),
                      aspectRatio: 1,
                      borderRadius: scale(40),
                      backgroundColor: '#FCE5E3',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 5,
                    }}>
                    <View
                      style={{
                        width: scale(8),
                        aspectRatio: 1,
                        borderRadius: scale(20),
                        backgroundColor: '#E8443A',
                      }}
                    />
                  </View>
                ) : null}
                <Text
                  style={{
                    fontSize: moderateScale(15),
                    color: 'black',
                    fontFamily: 'Inter-SemiBold',
                  }}>
                  {flat.title}
                </Text>
              </View>
              <Text
                style={{
                  color: '#8B8887',
                  fontFamily: 'Inter-Regular',
                  fontSize: moderateScale(14),
                  marginTop: 5,
                }}>
                {check_lists.map(
                  (el, i) =>
                    el.name + (i == check_lists.length - 1 ? ' ' : ', '),
                )}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 5,
                  alignItems: 'center',
                }}>
                <Image
                  source={{uri: maid.avatar}}
                  style={{
                    width: scale(30),
                    aspectRatio: 1,
                    borderRadius: 30,
                    marginRight: 10,
                  }}
                />
                <Text
                  style={{
                    fontFamily: 'Inter-Medium',
                    fontSize: moderateScale(15),
                    color: 'black',
                  }}>
                  {maid.first_name + ' ' + maid.last_name}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',

              marginTop: repeat_count ? 5 : -5,
            }}>
            {repeat_count ? (
              <Text
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  backgroundColor: '#FDF2F2',
                  color: '#EA5A51',
                  fontSize: moderateScale(14),
                  fontFamily: 'Inter-Regular',
                  borderRadius: 10,
                }}>
                {repeat_count}-я проверка
              </Text>
            ) : (
              <View />
            )}
            <View
              style={{
                borderColor: '#EEEDED',
                borderRadius: 10,
                borderWidth: 1,
                paddingHorizontal: 5,
                paddingVertical: 3,
              }}>
              <Text
                style={{
                  color: '#8B8887',
                  fontSize: moderateScale(14),
                  fontFamily: 'Inter-Regular',
                }}>
                {getDate()}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={{position: 'absolute', top: '50%', right: 15}}>
            <ArrowRight fill="black" />
          </TouchableOpacity>
        </TouchableOpacity>
      </Shadow>
    );
  },
);
