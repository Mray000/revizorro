import React, {useState, useEffect} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {Shadow} from 'react-native-shadow-2';
import {bytesToSize} from './BytesToSize';
import {moderateScale} from './Normalize';
import X from 'assets/x.svg';

export const PhotoComponent = ({photo, DeletePhoto}) => {
  return (
    <Shadow
      key={photo.image}
      viewStyle={{
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        marginTop: 10,
        flexDirection: 'row',
        paddingHorizontal: 2,
        backgroundColor: 'white',
      }}
      startColor={'#00000010'}
      finalColor={'#00000002'}
      offset={[0, 10]}>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          alignItems: 'center',
          padding: 10,
          borderRadius: 20,
        }}>
        <Image
          source={{uri: photo.uri}}
          style={{
            aspectRatio: 1,
            borderRadius: 10,
            width: '15%',
          }}
        />
        <View
          style={{
            width: '75%',
            paddingLeft: 10,
            justifyContent: 'space-between',
          }}>
          <Text
            lineBreakMode="clip"
            numberOfLines={1}
            style={{
              color: 'black',
              fontSize: moderateScale(15),
              fontFamily: 'Inter-Medium',
            }}>
            {photo.fileName}
          </Text>
          <Text
            style={{
              color: '#C5BEBE',
              fontSize: moderateScale(15),
              fontFamily: 'Inter-Regular',
            }}>
            {bytesToSize(photo.fileSize)}
          </Text>
        </View>
        <TouchableOpacity
          onPress={DeletePhoto}
          style={{width: '10%', alignItems: 'center'}}>
          <X fill="#D1CFCF" />
        </TouchableOpacity>
      </View>
    </Shadow>
  );
};
