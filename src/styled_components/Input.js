import React, {useState, useRef} from 'react';
import {
  Dimensions,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import {Shadow} from 'react-native-shadow-2';
import {colors} from 'utils/colors';
import Eye from 'assets/eye.svg';
import {moderateScale, verticalScale} from '../utils/normalize';
import {dimensions} from 'utils/dimisions';
import MaskInput from 'react-native-mask-input';
import {masks} from 'utils/phone_masks';

export const Input = ({
  value,
  title,
  flex,
  is_error,
  setError,
  onChangeText,
  is_password,
  onBlur,
  dop_styles,
  is_multiline,
  marginTop,
  is_phone,
  is_title_visible,
  height,
  no_shadow,
  ...props
}) => {
  const [is_focused, SetIsFocused] = useState(false);
  const [text_hidden, SetTextHidden] = useState(is_password);
  let boxShadow =
    value && !is_error && !is_focused && !no_shadow
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
  let style = [styles.input, dop_styles];
  if (is_focused) style.push(styles.input_focus);
  if (is_error) style.push(styles.input_error);
  if (is_multiline) style.push(styles.input_multilynes);
  if (is_phone) style.push(styles.input_phone);
  let mask_input = useRef();
  const ChangeMask = text => {
    let first_number = text[0];
    let third_number = text[2];
    let fourh_number = text[3];
    switch (first_number) {
      case '7':
        return masks['Russia'];
      case '3':
        switch (third_number) {
          case '5':
            return masks['Belarus'];
          case '4':
            return masks['Armenia'];
          default:
            if (fourh_number) return masks['empty'];
            else return masks['Belarus'];
        }
      case '9':
        return masks['Georgia'];
      case '6':
        return masks['Thailand'];
    }
    return masks['Russia'];
  };

  return (
    <View
      style={{
        height:
          height ||
          (!is_multiline ? dimensions.height / 10 : verticalScale(150)),
        marginTop: marginTop || is_multiline ? 20 : 10,
        width: '100%',
        justifyContent: 'center',
      }}>
      <Shadow
        containerViewStyle={{flex: 1}}
        viewStyle={{flex: 1, width: '100%', paddingHorizontal: 1}}
        {...boxShadow}>
        {!is_phone ? (
          <TextInput
            secureTextEntry={text_hidden}
            placeholderTextColor="#979493"
            style={style}
            value={value}
            onBlur={() => {
              if (onBlur) onBlur();
              SetIsFocused(false);
            }}
            onFocus={() => SetIsFocused(true)}
            onChangeText={text => {
              onChangeText(text);
              if (setError) setError(false);
            }}
            multiline={is_multiline}
            {...props}
          />
        ) : (
          <View style={{height: '100%', justifyContent: 'center'}}>
            <MaskInput
              ref={mask_input}
              mask={ChangeMask}
              secureTextEntry={text_hidden}
              style={style}
              value={value}
              onBlur={() => {
                if (onBlur) onBlur();
                SetIsFocused(false);
              }}
              onFocus={() => SetIsFocused(true)}
              onChangeText={(format_text, text) => {
                ChangeMask(text);
                onChangeText(text);
                if (setError) setError(false);
              }}
              multiline={is_multiline}
              {...props}
            />
            {is_phone ? (
              <Text
                allowFontScaling={false}
                style={{
                  color: 'black',
                  position: 'absolute',
                  fontSize: moderateScale(17),
                  elevation: 100,
                  zIndex: 10,
                  left: 20,
                }}>
                +
              </Text>
            ) : null}
          </View>
        )}
      </Shadow>
      {(title && value) || is_phone || is_title_visible ? (
        <View style={[styles.title, {top: !is_multiline ? '-10%' : '-5%'}]}>
          <Text
            style={{
              color: is_title_visible && value ? 'black' : '#C5BEBE',
              fontFamily: 'Inter-Regular',
              fontSize: moderateScale(14),
            }}>
            {title}
          </Text>
        </View>
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

const styles = StyleSheet.create({
  input: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 18,
    alignSelf: 'stretch',
    color: 'black',
    borderWidth: 1,
    paddingLeft: 20,
    fontSize: 17,
    borderColor: '#E5E3E2',
  },
  input_error: {
    backgroundColor: '#FEF8F7',
    borderColor: '#F7C2BE',
  },
  input_focus: {
    borderColor: colors.orange,
  },
  input_multilynes: {
    paddingTop: 20,
    textAlignVertical: 'top',
    paddingRight: 20,
  },
  title: {
    position: 'absolute',
    padding: 3,
    paddingLeft: 8,
    paddingRight: 8,
    backgroundColor: 'white',
    left: '5%',
    borderRadius: 10,
  },
  input_phone: {
    paddingLeft: 30,
  },
});
