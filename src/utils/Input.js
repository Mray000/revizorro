import React, {useState} from 'react';
import {
  Dimensions,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Shadow} from 'react-native-shadow-2';
import {colors} from 'utils/colors';
import Eye from 'assets/eye.svg';

export const Input = ({
  value,
  title,
  flex,
  is_error,
  setError,
  onChangeText,
  is_password,
  ...props
}) => {
  const [is_focused, SetIsFocused] = useState(false);
  const [text_hidden, SetTextHidden] = useState(is_password);
  let boxShadow =
    value && !is_error && !is_focused
      ? {
          startColor: '#00000010',
          finalColor: '#00000002',
          offset: [0, 5],
        }
      : {
          startColor: '#0000',
          finalColor: '#0000',
          offset: [0, 0],
          distance: 0,
          corners: [],
          sides: [],
          size: 0,
        };
  return (
    <View
      style={{
        height: Dimensions.get('window').height / 10,
        marginTop: 10,
        width: '100%',
        justifyContent: 'center',
      }}>
      <Shadow
        containerViewStyle={{flex: 1}}
        viewStyle={{flex: 1, width: '100%', paddingHorizontal: 1}}
        {...boxShadow}>
        <TextInput
          secureTextEntry={text_hidden}
          placeholderTextColor="#979493"
          style={{
            height: '100%',
            backgroundColor: is_error ? '#FEF8F7' : 'white',
            borderRadius: 18,
            alignSelf: 'stretch',
            width: '100%',
            color: 'black',
            borderColor: is_error
              ? '#F7C2BE'
              : is_focused
              ? colors.orange
              : '#E5E3E2',
            borderWidth: 1,
            paddingLeft: 20,
            fontSize: 17,
          }}
          value={value}
          onBlur={() => SetIsFocused(false)}
          onFocus={() => SetIsFocused(true)}
          onChangeText={text => {
            onChangeText(text);
            if (setError) setError(false);
          }}
          {...props}
        />
      </Shadow>
      {title && value ? (
        <Text
          style={{
            position: 'absolute',
            padding: 3,
            top: '-10%',
            paddingLeft: 8,
            paddingRight: 8,
            backgroundColor: 'white',
            left: '5%',
            borderRadius: 8,
            color: '#C5BEBE',
          }}>
          {title}
        </Text>
      ) : null}

      {is_password ? (
        <TouchableOpacity
          onPress={() => SetTextHidden(!text_hidden)}
          style={{position: 'absolute', right: 10}}>
          <Eye width={30} height={30} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};
