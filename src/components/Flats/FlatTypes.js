import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {colors} from 'utils/colors';
import {dimensions} from 'utils/dimisions';
import {Header} from 'utils/Header';
import {moderateScale} from 'utils/Normalize';

export const FlatTypes = ({navigation, route}) => {
  const types = [
    '1-комнатная квартира',
    '2-х комнатная квартира',
    '3-х комнатная квартира',
    '4-х комнатная квартира',
    '5-комнатная квартира',
    'Дом',
    'Участок',
    'Дом с участком',
    'Другое(гаражб склад, и др.)',
  ];
  return (
    <ScrollView style={{paddingTop: 10}}>
      <Header
        title={'Тип недвижимости'}
        onBack={() =>
          navigation.navigate(route.params?.parent, {
            type: route.params?.type,
            flat: route.params?.flat,
          })
        }
      />
      <View>
        {types.map(type => (
          <Type type={type} navigation={navigation} route={route} />
        ))}
      </View>
    </ScrollView>
  );
};

const Type = ({type, navigation, route}) => (
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
    onPress={() =>
      navigation.navigate(route.params.parent, {type, flat: route.params?.flat})
    }>
    <View
      style={{
        width: 20,
        height: 20,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: '#C5BEBE',
        marginRight: 5,
      }}
    />
    <Text
      style={{
        fontSize: moderateScale(16),
        color: 'black',
        fontFamily: 'Inter-Mdeium',
      }}>
      {type}
    </Text>
  </TouchableOpacity>
);
