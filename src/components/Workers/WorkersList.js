import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image, ScrollView} from 'react-native';
import {api} from 'utils/api';
import {colors} from 'utils/colors';
import {Loader} from 'utils/Loader';
import {moderateScale, scale, verticalScale} from 'utils/Normalize';
import ArrowRight from 'assets/arrow_right.svg';
import Star from 'assets/star.svg';
export const WorkersList = ({navigation}) => {
  const [workers, SetWorkers] = useState(null);
  useEffect(() => {
    if (!workers) api.getCompanyWorkers().then(SetWorkers);
  }, [workers]);

  useEffect(() => {
    navigation.addListener('focus', () => {
        SetWorkers(null);
        api.getCompanyWorkers().then(SetWorkers);
    });
  }, []);
console.log(workers, "(((995435349053405934895")
  if (!workers) return <Loader />;
  console.log(workers, "4390634690546945890546890549564908")
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
            fontSize: moderateScale(18),
          }}>
          Мои сотрудники
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddWorker')}>
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
      <View style={{marginTop: 10}}>
        {workers.map(el => (
          <Worker worker={el} navigation={navigation} key={el.id} />
        ))}
      </View>
    </ScrollView>
  );
};

const Worker = ({worker, navigation}) => {
  let {avatar, role, first_name, last_name, rating} = worker;
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('WorkerProfile', {worker})}
      style={{
        shadowColor: '#C8C7C7',
        shadowOffset: {
          width: 0,
          height: 10,
        },
        shadowOpacity: 0.51,
        shadowRadius: 13.16,
        elevation: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
      }}>
      <View
        style={{
          height: verticalScale(60),
          width: '100%',
          flexDirection: 'row',
          borderRadius: 20,
          paddingHorizontal: 10,
          alignItems: 'center',
          backgroundColor: 'white',
        }}>
        <View style={{width: '20%'}}>
          <Image
            source={{uri: avatar}}
            style={{
              width: '100%',
              aspectRatio: 1,
              borderRadius: 100,
            }}
          />
        </View>
        <View style={{width: '70%'}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {role == 'role_maid' && rating ? (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Star fill="#F38434" width={18} height={18} />
                <Text
                  style={{
                    color: 'black',
                    fontSize: moderateScale(15),
                    fontFamily: 'Inter-Medium',
                    marginHorizontal: 5,
                  }}>
                  {rating}
                </Text>
              </View>
            ) : null}
            <Text
              style={{
                fontFamily: 'Inter-Regular',
                fontSize: moderateScale(14),
                color: '#9E9494',
              }}>
              {role == 'role_maid' ? 'Горничная' : 'Менеджер'}
            </Text>
          </View>
          <Text
            style={{
              fontFamily: 'Inter-Medium',
              fontSize: moderateScale(15),
              color: 'black',
            }}>
            {first_name + ' ' + last_name}
          </Text>
        </View>
        <View
          style={{
            width: '10%',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          }}>
          <ArrowRight fill="#D1CFCF" width={scale(12)} height={scale(12)} />
        </View>
      </View>
    </TouchableOpacity>
  );
};
