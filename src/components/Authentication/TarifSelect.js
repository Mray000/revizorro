import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  BackHandler,
  Platform,
} from 'react-native';
import RateBackgound1 from 'assets/rate_background_1';
import RateBackgound2 from 'assets/rate_background_2';
import RatePro from 'assets/rate_pro';
import RateHousemaidPhoto from 'assets/rate_housemaid_photo.svg';
import X from 'assets/x.svg';
import {Shadow} from 'react-native-shadow-2';
import {moderateScale, verticalScale} from 'utils/normalize';
import Check from 'assets/check.svg';
import {colors} from 'utils/colors';
import Star from 'assets/star.svg';
import {api} from 'utils/api';
import {Loader} from 'styled_components/Loader';
import {Button} from 'styled_components/Button';
import SuccessSvg from 'assets/success.svg';
import iap from 'react-native-iap';
import {observer} from 'mobx-react-lite';
import {app} from 'store/app';
import {rate, tarif} from 'store/tarif';
import {tarifs} from 'utils/tarif_constants';
import {useToggle} from 'hooks/useToggle';
import {CloseButton} from 'styled_components/CloseButton';
import {getBoxShadow} from 'utils/get_box_shadow';
import {Input} from 'styled_components/Input';

export const TarifSelect = observer(({navigation, route}) => {
  // const [tarifs, SetTarifs] = useState(null)
  const [selected_tarif_id, SetSelectedTarifId] = useState(0);
  const [is_selected_tarif_sale, SetIsSelectedTarifSale] = useToggle(false);

  BackHandler.addEventListener('hardwareBackPress', () => true);

  useEffect(() => {
    let backhandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );
    navigation.addListener('blur', () => {
      backhandler.remove();
    });
    navigation.addListener('focus', () => {
      backhandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => true,
      );
    });
  }, []);

  let parent = route.params?.parent || 'Onboarding';

  let selected_tarif = tarifs.find(el => el.id == selected_tarif_id);

  if (tarif.is_tarif_paid) {
    return <RateSuccess navigation={navigation} tarif={selected_tarif} />;
  }
  const handleButtonPress = () => {};

  const handleSelectTarif = id => {
    SetSelectedTarifId(id);
    SetIsSelectedTarifSale(false);
  };

  if (!tarifs) return <Loader />;
  return (
    <ScrollView>
      <View>
        <RateBackgound2 />
        <CloseButton
          style={{marginTop: '2%'}}
          is_absolute={true}
          onPress={() => navigation.navigate(parent)}
        />
        <Text
          style={{
            position: 'absolute',
            color: 'white',
            fontFamily: 'Inter-SemiBold',
            fontSize: moderateScale(21),
            top: '20%',
            left: '5%',
          }}>
          Сохраните репутацию своей компании благодаря простому контролю
          горничных
        </Text>
        <Text
          style={{
            position: 'absolute',
            color: 'white',
            fontFamily: 'Inter-Regular',
            fontSize: moderateScale(16),
            top: '40%',
            left: '5%',
            width: '45%',
          }}>
          Планируйте уборки в приложении и будьте уверены в качестве выполненных
          работ
        </Text>
        <View style={{position: 'absolute', top: '70%', left: '10%'}}>
          <RatePro />
          <Text
            style={{
              color: 'white',
              fontFamily: 'Inter-Medium',
              fontSize: moderateScale(15),
              marginTop: 5,
            }}>
            Pro-версия
          </Text>
        </View>
        <View
          style={{
            position: 'absolute',
            bottom: 0.0001,
            right: 0.0001,
          }}>
          <RateHousemaidPhoto />
        </View>
      </View>
      <View style={{paddingHorizontal: 10, marginBottom: 10}}>
        <View>
          {tarifs.map(el => (
            <Tarif
              tarif={el}
              key={el.id}
              is_sale={is_selected_tarif_sale}
              is_active={selected_tarif_id == el.id}
              SetIsActive={handleSelectTarif}
            />
          ))}
        </View>
        <Button
          text={`Продолжить`}
          onPress={handleButtonPress}
          marginTop={10}
        />
      </View>
    </ScrollView>
  );
});

const Tarif = ({tarif, is_active, is_sale, SetIsActive}) => {
  const [promocode, SetPromocode] = useState('');
  let {id, title, flat_counts, price, is_free} = tarif;

  return (
    <Shadow
      {...getBoxShadow()}
      viewStyle={{
        width: '100%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        marginTop: 8,
      }}>
      <TouchableOpacity onPress={() => SetIsActive(id)}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontFamily: 'Inter-SemiBold',
              fontSize: moderateScale(16),
              color: 'black',
            }}>
            {title}
          </Text>
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 100,
              borderWidth: 1,
              borderColor: !is_active ? '#C5BEBE' : colors.orange,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: !is_active ? 'white' : colors.orange,
            }}>
            {is_active ? <Check fill="white" width={12} height={14} /> : null}
          </View>
        </View>
        {is_active && !is_free ? (
          <Input
            value={promocode}
            onChangeText={SetPromocode}
            title={'Промокод'}
            height={verticalScale(50)}
          />
        ) : null}
        <Text
          style={{
            fontFamily: 'Inter-Regular',
            fontSize: moderateScale(16),
            color: '#75706F',
            marginTop: 10,
          }}>
          до {flat_counts} квартир
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginTop: 5,
          }}>
          <Text
            style={{
              fontFamily: 'Inter-Regular',
              fontSize: moderateScale(14),
              color: '#9E9494',
            }}>
            {is_free ? '' : '30 дней'}
          </Text>
          <Text
            style={{
              fontFamily: 'Inter-SemiBold',
              fontSize: moderateScale(16),
              color: is_sale ? '#E8443A' : 'black',
            }}>
            {is_free ? 'Бесплатно' : price + ' руб'}
          </Text>
        </View>
      </TouchableOpacity>
    </Shadow>
  );
};

const RateSuccess = ({navigation, tarif}) => {
  const OnTarifSelectSuccess = () => {
    navigation.navigate('Cleanings');
    tarif.setIsTarifPaid(false);
    tarif.setIsTarifSelectScreen(false);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: 'white',
        alignItems: 'flex-end',
        padding: 20,
      }}>
      <Shadow
        startColor={'#00000008'}
        finalColor={'#00000001'}
        offset={[0, 8]}
        distance={20}>
        <TouchableOpacity
          onPress={OnTarifSelectSuccess}
          style={{
            backgroundColor: 'white',
            width: 45,
            height: 45,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 17,
          }}>
          <X width={13} height={13} fill="#45413E" />
        </TouchableOpacity>
      </Shadow>
      <View
        style={{justifyContent: 'center', alignItems: 'center', width: '100%'}}>
        <SuccessSvg />
        <Text
          style={{
            color: 'black',
            fontFamily: 'Inter-SemiBold',
            textAlign: 'center',
            fontSize: moderateScale(20),
            marginTop: 10,
          }}>
          Регистрация и оплата прошли успешно!
        </Text>
        <Text
          style={{
            color: 'black',
            fontFamily: 'Inter-SemiBold',
            textAlign: 'center',
            fontSize: moderateScale(18),
            marginTop: 20,
          }}>
          Спасибо, {app.name}!
        </Text>
        <Text
          style={{
            fontSize: moderateScale(16),
            color: '#686463',
            fontFamily: 'Inter-Regular',
            textAlign: 'center',
            marginTop: 20,
          }}>
          Вы оформили тариф:
        </Text>
        <Text
          style={{
            color: 'black',
            fontFamily: 'Inter-SemiBold',
            textAlign: 'center',
            fontSize: moderateScale(17),
            marginTop: 5,
          }}>
          {tarif.name} (до {tarif.flat_counts} квартир)
        </Text>
      </View>
      <Button text={'Понятно'} onPress={OnTarifSelectSuccess} marginTop={10} />
    </View>
  );
};
