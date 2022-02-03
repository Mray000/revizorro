import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {Header} from 'utils/Header';
import Pen from 'assets/pen.svg';
import Star from 'assets/star.svg';
import HalfStar from 'assets/half_star.svg';
import {moderateScale, scale} from 'utils/Normalize';
import {Loader} from 'utils/Loader';
import {api} from 'utils/api';
export const WorkerProfile = ({navigation, route}) => {
  let {id, avatar, role, first_name, last_name, middle_name, rating} =
    route.params.worker;

  let is_maid = role == 'role_maid';

  const [cleanings, SetCleanings] = useState(null);

  useEffect(() => {
    api
      .getWorker(id)
      .then(worker =>
        SetCleanings(is_maid ? worker.history_cleaning : worker.history_checks),
      );
  }, []);

  if (!cleanings) return <Loader />;
  return (
    <View>
      <Header
        navigation={navigation}
        to={'WorkersList'}
        title={is_maid ? 'Горничная' : 'Менеджер'}
        children={
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('EditWorker', {worker: route.params.worker})
            }
            style={{
              position: 'absolute',
              right: 20,
              width: 40,
              height: 40,
              alignItems: 'flex-end',
              justifyContent: 'center',
            }}>
            <Pen />
          </TouchableOpacity>
        }
      />
      <View style={{alignItems: 'center'}}>
        <Image
          source={{uri: avatar}}
          style={{
            width: scale(70),
            aspectRatio: 1,
            borderRadius: 100,
            marginTop: 10,
          }}
        />
        <Text
          style={{
            fontSize: moderateScale(18),
            fontFamily: 'Inter-Medium',
            color: 'black',
            marginTop: 5,
          }}>
          {first_name + ' ' + last_name + ' ' + middle_name}
        </Text>
        {is_maid ? (
          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
            {[1, 2, 3, 4, 5].map(el => (
              <View style={{marginLeft: 3}} key={el}>
                {el - Number(rating) < 1 && el - Number(rating) > 0 ? (
                  <HalfStar width={30} height={30} />
                ) : (
                  <Star
                    fill={Number(rating) < el ? '#DFDCDC' : '#F38434'}
                    width={30}
                    height={30}
                  />
                )}
              </View>
            ))}
          </View>
        ) : null}

        {is_maid ? (
          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
            <Text
              style={{
                fontFamily: 'Inter-Medium',
                fontSize: moderateScale(14),
                color: 'black',
              }}>
              {rating}&nbsp;
            </Text>
            <Text
              style={{
                color: '#C5BEBE',
                fontFamily: 'Inter-Medium',
                fontSize: moderateScale(14),
              }}>
              (0 уборок)
            </Text>
          </View>
        ) : (
          <Text
            style={{
              color: '#C5BEBE',
              fontFamily: 'Inter-Medium',
              fontSize: moderateScale(14),
            }}>
            0 проверок
          </Text>
        )}
        {cleanings.length ? (
          <View style={{width: '100%', paddingLeft: 10, marginTop: 20}}>
            <Text
              style={{
                color: '#AAA8A7',
                fontSize: moderateScale(15),
                fontFamily: 'inter-Medium',
                textAlign: 'left',
                width: '100%',
              }}>
              история {is_maid ? 'уборок' : 'проверок'}
            </Text>
            {cleanings.map(cleaning => (
              <CleaningComponent
                is_completed={true}
                cleaning={cleaning}
                key={cleaning.id}
                navigation={navigation}
              />
            ))}
          </View>
        ) : null}
      </View>
    </View>
  );
};
