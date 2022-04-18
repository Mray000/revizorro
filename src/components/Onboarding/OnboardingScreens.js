import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import X from 'assets/x.svg';
import {Shadow} from 'react-native-shadow-2';
import {moderateScale, scale} from 'utils/normalize';
import CleacningPicture from 'assets/cleaning_picture.svg';
import ControlPicture from 'assets/control_picture.svg';
import FamilyPicture from 'assets/family_picture.svg';
import ManagerPicture from 'assets/manager_picture.svg';
import ReportPicture from 'assets/report_picture.svg';
import ClockPicture from 'assets/clock_picture.svg';
import {Button} from 'styled_components/Button';
import {dimensions} from 'utils/dimisions';
import {colors} from 'utils/colors';

export const OnboardingScreens = ({
  navigation,
  SetIsSelectRoleScreen,
  role,
}) => {
  const [index, SetIndex] = useState(0);
  const owner_screens = [
    {
      image: <CleacningPicture />,
      title: 'Удобное планирование уборок',
      text: 'Планируйте уборки на определенные даты и время. Следите за статусом всех ваших квартир и храните данные об уборках в одном месте.',
    },
    {
      image: <ControlPicture />,
      title: 'Простой контроль персонала',
      text: 'Горничные будут присылать фото-отчёты по чек-листам, а ваш менеджер будет их проверять.',
    },
    {
      image: <FamilyPicture />,
      title: 'Уверенность в качестве выполненной работы',
      text: 'Приложение невозможно обмануть. Вы будете уверены, что работа сделана хорошо. А ваши гости приедут в чистую квартиру, оставшись довольными.',
    },
  ];

  const housemaid_screens = [
    {
      image: <CleacningPicture />,
      title: 'Шаг 1: Выполните уборку помещения',
      text: 'Войдите по номеру телефона в приложение и найдите на экране уборку, которую вам необходимо выполнить.',
      header_title:
        'Revizorro поможет вам удобно отчитываться о качестве вашей уборки',
    },
    {
      image: <ReportPicture />,
      title: 'Шаг 2: Заполните отчёт на проверку',
      text: 'Нажмите на уборку и ответьте на все вопросы. Сделайте фотографии по инструкции, если это требуется..',
    },
    {
      image: <ClockPicture />,
      title: 'Шаг 3: Отправьте отчёт и ждите подтверждения',
      text: 'В течение 5-ти минут ваш отчёт проверят и вы получите уведомление.\n\n Если уборку приняли, ваша работа завершена. Если есть недочеты, вы можете их исправить и отправить отчёт  на проверку повторно.',
    },
  ];

  const manager_screens = [
    {
      image: <ManagerPicture />,
      title: 'Ваша роль —  контролировать качество работы горничных',
      text: 'Проверяйте отчёты об уборках. Добавляйте персонал, планируйте уборки на определенные даты и создавайте чек-листы для горничных.',
    },
  ];

  const handleNext = () => {
    if (role == 'manager' || index == 2) navigation.navigate('Login', {role});
    else {
      SetIndex(index + 1);
    }
  };

  const getScreeens = () => {
    if (role == 'owner') return owner_screens;
    if (role == 'manager') return manager_screens;
    if (role == 'housemaid') return housemaid_screens;
  };
  let screen = getScreeens()[index];
  return (
    <View
      style={{
        padding: 10,
        alignItems: 'center',
        flex: 1,
        backgroundColor: 'white',
      }}>
      <Shadow
        startColor={'#00000008'}
        finalColor={'#00000001'}
        offset={[0, 8]}
        distance={15}
        containerViewStyle={{
          width: '10%',
          marginRight: 10,
          alignSelf: 'flex-end',
        }}>
        <TouchableOpacity
          style={{
            width: scale(40),
            height: scale(40),
            aspectRatio: 1,
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 15,
          }}
          onPress={() => {
            SetIsSelectRoleScreen(true);
            SetIndex(0);
          }}>
          <X fill="black" width={15} height={15} />
        </TouchableOpacity>
      </Shadow>
      <View
        style={{
          height: dimensions.height - scale(40) - 50 - dimensions.height / 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View>{screen.image}</View>
        <Text
          style={{
            fontSize: moderateScale(20),
            color: 'black',
            fontFamily: 'Inter-SemiBold',
            marginTop: 10,
            textAlign: "center"
          }}>
          {screen.title}
        </Text>
        <Text
          style={{
            fontSize: moderateScale(16),
            color: '#696463',
            fontFamily: 'Inter-Regular',
            marginTop: 10,
            textAlign: 'center',
          }}>
          {screen.text}
        </Text>
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: 20,
          width: '100%',
          alignItems: 'center',
        }}>
        {role != 'manager' ? (
          <View style={{flexDirection: 'row', marginBottom: 10}}>
            <Dot is_active={index == 0} />
            <Dot is_active={index == 1} />
            <Dot is_active={index == 2} />
          </View>
        ) : null}
        <Button
          text={role != 'manager' ? 'Далее' : 'Понятно!'}
          icon={true}
          onPress={handleNext}
        />
      </View>
    </View>
  );
};

const Dot = ({is_active}) => (
  <View
    style={{
      width: 8,
      borderRadius: 10,
      aspectRatio: 1,
      backgroundColor: is_active ? colors.orange : '#ECEAEA',
      marginLeft: 5,
    }}
  />
);
