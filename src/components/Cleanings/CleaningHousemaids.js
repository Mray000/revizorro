import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, ScrollView, Image} from 'react-native';
import {AddButton} from 'utils/AddButton';
import {api} from 'utils/api';
import {colors} from 'utils/colors';
import {dimensions} from 'utils/dimisions';
import {Header} from 'utils/Header';
import {Loader} from 'utils/Loader';
import {moderateScale, scale, verticalScale} from 'utils/Normalize';
import Check from 'assets/check.svg';
import {cleaning} from 'store/cleaning';
import {observer} from 'mobx-react-lite';
import Star from 'assets/star.svg';
import ArrowRight from 'assets/arrow_right.svg';
import {app} from 'store/app';
export const CleaningHousemaids = observer(({navigation}) => {
  const [housemaids, SetHousemaids] = useState(null);

  useEffect(() => {
    api.getHousemaids().then(SetHousemaids);
    navigation.addListener('focus', () => {
      SetHousemaids(null);
      api.getHousemaids().then(SetHousemaids);
    });
  }, []);

  useEffect(() => {
    if (!housemaids) api.getHousemaids().then(SetHousemaids);
  }, [housemaids]);

  if (!housemaids) return <Loader />;
  console.log(housemaids);

  return (
    <ScrollView style={{paddingVertical: 10}}>
      <Header
        title={'Горничные'}
        onBack={navigation.goBack}
        children={
          <TouchableOpacity
            style={{position: 'absolute', right: 20}}
            onPress={navigation.goBack}>
            <Text
              style={{
                fontSize: moderateScale(15),
                fontFamily: 'Inter-Medium',
                color: colors.orange,
              }}>
              Готово
            </Text>
          </TouchableOpacity>
        }
      />
      {app.role == 'role_admin' || app.accesses.includes('workers') ? (
        <View style={{paddingHorizontal: 10}}>
          <AddButton
            text={'Добавить новую горничную'}
            onPress={() =>
              navigation.navigate('AddWorker', {parent: 'CleaningHousemaids'})
            }
          />
        </View>
      ) : null}
      <View style={{marginBottom: 20}}>
        {housemaids.map(housemaid => (
          <Housemaid
            key={housemaid.id}
            housemaid={housemaid}
            SetHousemaid={() => {
              cleaning.setHousemaid(housemaid);
              navigation.goBack();
            }}
          />
        ))}
      </View>
    </ScrollView>
  );
});

const Housemaid = ({housemaid, SetHousemaid}) => {
  let {avatar, role, first_name, last_name, rating, amount_cleaning} = housemaid;

  const getDeclination = amount_cleaning => {
    let word = 'убор';
    if (amount_cleaning == 0 || amount_cleaning > 4) word += 'ок';
    if (amount_cleaning == 1) word += 'ка';
    if (amount_cleaning >= 2 && amount_cleaning <= 4) word += 'ки';
    return word;
  };
  return (
    <TouchableOpacity
      style={{
        height: dimensions.height / 10,
        flexDirection: 'row',
        backgroundColor: 'white',
        marginTop: 10,
        shadowColor: '#C8C7C7',
        shadowOffset: {
          width: 0,
          height: 10,
        },
        shadowOpacity: 0.51,
        shadowRadius: 13.16,
        elevation: 20,
        paddingHorizontal: 20,
        paddingVertical: 5,
        marginHorizontal: 10,
        alignItems: 'center',
        padding: 10,
        borderRadius: 20,
      }}
      onPress={SetHousemaid}>
      <View
        style={{
          height: verticalScale(60),
          width: '100%',
          flexDirection: 'row',
          borderRadius: 20,
          alignItems: 'center',
          backgroundColor: 'white',
        }}>
        <View style={{width: '20%'}}>
          <Image
            source={{uri: avatar}}
            style={{
              width: '80%',
              aspectRatio: 1,
              borderRadius: dimensions.width * 0.2,
            }}
          />
        </View>
        <View style={{width: '70%'}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {role == 'role_maid' ? (
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
                    marginHorizontal: 2,
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
                marginLeft: 5,
              }}>
              {amount_cleaning} {getDeclination(amount_cleaning)}
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
      </View>
    </TouchableOpacity>
  );
};
