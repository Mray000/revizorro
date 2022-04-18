import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image, ScrollView} from 'react-native';
import {Header} from 'styled_components/Header';
import Pen from 'assets/pen.svg';
import Star from 'assets/star.svg';
import HalfStar from 'assets/half_star.svg';
import {moderateScale, scale, verticalScale} from 'utils/normalize';
import {Loader} from 'styled_components/Loader';
import {api, ImageURL} from 'utils/api';
import {CleaningComponent} from 'components/Cleanings/CleaningComponent';
import {app} from 'store/app';
import {observer} from 'mobx-react-lite';
export const WorkerProfile = observer(({navigation, route}) => {
  let worker = route.params.worker;
  let {id, avatar, role, first_name, last_name, middle_name, rating} = worker;

  let is_maid = role == 'role_maid';

  const [cleanings, SetCleanings] = useState(null);
  const getDeclination = (word, count) => {
    if (count == 0 || count > 4) word += 'ок';
    if (count == 1) word += 'ка';
    if (count >= 2 && count <= 4) word += 'ки';
    return word;
  };
  useEffect(() => {
    console.log(342342)
    api
      .getWorker(id)
      .then(worker =>
        SetCleanings(is_maid ? worker.history_cleaning : worker.history_checks),
      );
  }, []);

  if (!cleanings) return <Loader />;
  return (
    <ScrollView style={{paddingBottom: verticalScale(65)}}>
      <Header
        navigation={navigation}
        to="WorkersList"
        onBack={() => {
          if (app.role == 'role_admin' || app.accesses.includes('workers')) {
            navigation.navigate('WorkersList');
          } else navigation.goBack();
        }}
        title={is_maid ? 'Горничная' : 'Менеджер'}
        children={
          app.role == 'role_admin' || app.accesses.includes('workers') ? (
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
          ) : null
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
              (
              {cleanings.length +
                ' ' +
                getDeclination('уборк', cleanings.length)}
              )
            </Text>
          </View>
        ) : (
          <Text
            style={{
              color: '#C5BEBE',
              fontFamily: 'Inter-Medium',
              fontSize: moderateScale(14),
            }}>
            {cleanings.length +
              ' ' +
              getDeclination('провер', cleanings.length)}
          </Text>
        )}
        {cleanings.length ? (
          <View
            style={{
              width: '100%',
              paddingLeft: 10,
              margintop: 20,
              marginBottom: 5,
            }}>
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
            {[...cleanings].map(cleaning => (
              <CleaningComponent
                is_completed={true}
                cleaning={cleaning}
                key={cleaning.id}
                housemaid={is_maid ? worker : null}
                navigation={navigation}
              />
            ))}
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
});
