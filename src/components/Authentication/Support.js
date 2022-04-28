import React, {useState, useEffect} from 'react';
import {View, Text, KeyboardAvoidingView} from 'react-native';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import {Shadow} from 'react-native-shadow-2';
import {moderateScale, verticalScale} from 'utils/normalize';
import X from 'assets/x.svg';
import {Button} from 'styled_components/Button';
import {Input} from 'styled_components/Input';
import {api} from 'utils/api';
import {ErrorText} from 'styled_components/ErrorText';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {CloseButton} from 'styled_components/CloseButton';

export const Support = ({navigation}) => {
  const [phone, SetPhone] = useState('');
  const [text, SetText] = useState('');
  const [is_phone_error, SetIsPhoneError] = useState(false);

  const Send = async () => {
    console.log(phone);
    let error = await api.sendSupport('+' + phone, text);
    if (!error) {
      navigation.navigate('Success', {
        to: 'Settings',
        title: 'Спасибо за отзыв!',
        description: 'Ваше сообщение успешно отправлено',
      });
      SetPhone('');
      SetText('');
    } else SetIsPhoneError(true);
  };
  return (
    <View style={{padding: 10, flex: 1, backgroundColor: 'white'}}>
      <KeyboardAwareScrollView>
        <CloseButton onPress={() => navigation.navigate('Settings')} />
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
        <Input
          key={4}
          title="телефон"
          value={phone}
          is_error={is_phone_error}
          setError={SetIsPhoneError}
          onChangeText={SetPhone}
          is_phone={true}
        />
        {is_phone_error ? (
          <ErrorText error={'Введите верный номер телефона'} />
        ) : null}
        <Input
          is_multiline={true}
          value={text}
          onChangeText={SetText}
          placeholder="Ваш вопрос"
          title="ваш вопрос"
        />

        <Button text={'Отправить'} marginTop={30} onPress={Send} />
      </KeyboardAwareScrollView>
    </View>
  );
};
