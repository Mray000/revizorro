import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import {Shadow} from 'react-native-shadow-2';
import {moderateScale, verticalScale} from 'utils/normalize';
import X from 'assets/x.svg';
import {Button} from 'styled_components/Button';
export const Support = ({navigation}) => {
  const [support_text, SetSupportText] = useState('');
  return (
    <View style={{padding: 10, flex: 1, backgroundColor: 'white'}}>
      <Shadow
        startColor={'#00000007'}
        finalColor={'#00000001'}
        offset={[0, 10]}
        distance={15}
        containerViewStyle={{
          width: '10%',
          marginRight: 10,
          alignSelf: 'flex-end',
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            width: 45,
            height: 45,
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 17,
          }}>
          <X width={13} height={13} fill="#45413E" />
        </TouchableOpacity>
      </Shadow>
      <Text
        style={{
          color: '#AEACAB',
          fontFamily: 'Inter-Regular',
          fontSize: moderateScale(15),
          textAlign: 'center',
          marginTop: verticalScale(30),
        }}>
        Если у Вас возникли вопросы по работе с мобильным приложением или
        имеются технические неисправности – просьба отправить нам сообщение
      </Text>
      <View
        style={{
          height: verticalScale(150),
          marginTop: verticalScale(40),
        }}>
        <TextInput
          multiline={true}
          style={{
            height: '100%',
            backgroundColor: 'white',
            borderRadius: 20,
            borderColor: '#E5E3E2',
            borderWidth: 1,
            paddingTop: 15,
            paddingLeft: 5,
            textAlignVertical: 'top',
          }}
          value={support_text}
          placeholderTextColor={`#979493`}
          placeholder="Например: сделайте фото заправленной кровати"
          onChangeText={SetSupportText}
        />
        <View
          style={{
            borderRadius: 8,
            position: 'absolute',
            top: -10,
            left: '5%',
            overflow: 'hidden',
            backgroundColor: 'white',
          }}>
          <Text
            style={{
              padding: 3,
              paddingLeft: 8,
              paddingRight: 8,
              color: !support_text ? 'rgb(197, 190, 190)' : 'black',
            }}>
            какое фото нужно сделать
          </Text>
        </View>
      </View>
      <Button text={'Отправить'} marginTop={30} />
    </View>
  );
};
