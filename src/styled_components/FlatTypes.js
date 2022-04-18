import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {colors} from 'utils/colors';
import {dimensions} from 'utils/dimisions';
import {types as global_types} from 'utils/flat_types';
import {Header} from 'styled_components/Header';
import {moderateScale} from 'utils/normalize';

export const FlatTypes = ({navigation, route}) => {
  let types = Object.keys(global_types);

  if(route.params.parent == "AddFlat") {
    types = types.filter(type => type != "Стандартная уборка")
  } 
  
  return (
    <ScrollView style={{paddingTop: 10, paddingBottom: 20}}>
      <Header
        title={'Тип недвижимости'}
        onBack={() =>
          navigation.navigate(route.params?.parent, {
            type: route.params?.type,
            flat: route.params?.flat,
            check_list: route.params?.check_list,
          })
        }
      />
      <View style={{paddingBottom: 20}}>
        {types.map(type => (
          <Type type={type} navigation={navigation} route={route} key={type} />
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
        height: 0,
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
      navigation.navigate(route.params.parent, {
        type,
        flat: route.params?.flat,
        check_list: route.params?.check_list,
      })
    }>
    <Text
      style={{
        fontSize: moderateScale(16),
        color: 'black',
        fontFamily: 'Inter-Medium',
      }}>
      {type}
    </Text>
  </TouchableOpacity>
);
