import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image, ScrollView} from 'react-native';
import {Header} from 'utils/Header';
import Map from 'assets/map.svg';
import Home from 'assets/home_2.svg';
import Pen from 'assets/pen.svg';
import {moderateScale, scale} from 'utils/Normalize';
import {api} from 'utils/api.js';
import {dimensions} from 'utils/dimisions';
const types = {
  '1-комнатная квартира': '1_room_flat',
  '2-х комнатная квартира': '2_room_flat',
  '3-х комнатная квартира': '3_room_flat',
  '4-х комнатная квартира': '4_room_flat',
  '5-комнатная квартира': '5_room_flat',
  Дом: 'house',
  Участок: 'land',
  'Дом с участком': 'house_with_land',
  'Другое(гаражб склад, и др.)': 'other',
};
export const FlatProfile = ({navigation, route}) => {
  let flat = route.params?.flat;
  let {title, address, type, images} = flat;
  const URL = 'http://92.53.97.165/media/';
  console.log(flat);

  console.log(images);

  return (
    <View style={{paddingVertical: 10}}>
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
          <Map />
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
            {Object.keys(types).find(el => types[el] == type)}
          </Text>
        </View>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          style={{marginTop: 10}}>
          {images.map(({image}) => (
            <Image
              source={{uri: URL + image}}
              style={{
                width: dimensions.width / 6,
                aspectRatio: 1,
                borderRadius: 10,
                marginRight: 10,
              }}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};
