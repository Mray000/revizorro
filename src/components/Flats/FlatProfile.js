import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image, ScrollView} from 'react-native';
import {Header} from 'utils/Header';
import Map from 'assets/map.svg';
import Home from 'assets/home_2.svg';
import Pen from 'assets/pen.svg';
import {moderateScale, scale} from 'utils/Normalize';
import {dimensions} from 'utils/dimisions';
import {convertType} from 'utils/flat_types';
import ArrowDown from 'assets/arrow_down.svg';
import ArrowUp from 'assets/arrow_up.svg';
import {CleaningComponent} from 'components/Cleanings/CleaningComponent';
import {api, ImageURL} from 'utils/api';
import {Loader} from 'utils/Loader';
export const FlatProfile = ({navigation, route}) => {
  let flat = route.params.flat;
  let {id, title, address, type, images} = flat;

  const [cleanings, SetCleanings] = useState(null);
  const [is_need_check_cleanings_full, SetIsNeedCheckCleaningsFull] =
    useState(false);
  const [is_future_cleanings_full, SetIsFutureCleaningsFull] = useState(false);
  const [is_complited_cleanings_full, SetIsComplitedCleaningsFull] =
    useState(false);

  useEffect(() => {
    api.getFlat(id).then(flat => SetCleanings(flat.cleaning));
  }, []);

  if (!cleanings) return <Loader />;

  let need_check_cleanings = cleanings.filter(el => el.status == 'on_check');
  let future_cleanings = cleanings.filter(el => el.status == 'not_accepted');
  let complited_cleanings = cleanings.filter(el => el.state == 'accepted');

  return (
    <ScrollView style={{paddingVertical: 10, paddingBottom: 100}}>
      <Header
        navigation={navigation}
        title={title}
        to="FlatsList"
        children={
          <TouchableOpacity
            onPress={() => navigation.navigate('EditFlat', {flat})}
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

      <View style={{paddingHorizontal: 10}}>
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 15,
            flexDirection: 'row',
            padding: 15,
            alignItems: 'center',
            marginTop: 10,
          }}>
          <Map fill="#C5BEBE"/>
          <Text
            style={{
              fontSize: moderateScale(16),
              color: 'black',
              fontFamily: 'Inter-Medium',
              marginLeft: 10,
            }}>
            {address}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 15,
            flexDirection: 'row',
            padding: 15,
            alignItems: 'center',
            marginTop: 10,
          }}>
          <Home />
          <Text
            style={{
              fontSize: moderateScale(16),
              color: 'black',
              fontFamily: 'Inter-Medium',
              marginLeft: 10,
            }}>
            {convertType(type)}
          </Text>
        </View>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          style={{marginTop: 10}}>
          {images.map(({image}) => (
            <Image
              key={image}
              source={{uri: image}}
              style={{
                width: dimensions.width / 6,
                aspectRatio: 1,
                borderRadius: 10,
                marginRight: 10,
              }}
            />
          ))}
        </ScrollView>
        <View
          style={{
            width: '100%',
            paddingBottom: moderateScale(20),
            alignItems: 'center',
            width: '100%',
          }}>
          {need_check_cleanings.length ? (
            <View style={{width: '100%', marginTop: 10}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {/* <View
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
                </View> */}
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text
                    style={{
                      textAlign: 'left',
                      color: '#A9A6A6',
                      fontSize: moderateScale(15),
                      fontFamily: 'Inter-Regualar',
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
          {future_cleanings.length ? (
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
        </View>
      </View>
    </ScrollView>
  );
};
