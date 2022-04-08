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
import {moderateScale} from 'utils/Normalize';
import Check from 'assets/check.svg';
import {colors} from 'utils/colors';
import Star from 'assets/star.svg';
import {api} from 'utils/api';
import {Loader} from 'utils/Loader';
import {Button} from 'utils/Button';
import SuccessSvg from 'assets/success.svg';
import iap from 'react-native-iap';
import {observer} from 'mobx-react-lite';
import {app} from 'store/app';
import {rate} from 'store/rate';
import {rate_items, rate_prices} from 'utils/rate_constants';

export const RateChoice = observer(({navigation, route}) => {
  const [tarifs, SetTarifs] = useState(null);

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

  useEffect(() => {
    iap
      .getSubscriptions(rate_items)
      .then(tarifs => {
        if (Platform.OS == 'android')
          tarifs.map(el => JSON.parse(el.originalJson));
        else return tarifs;
      })
      .then(tarifs =>
        tarifs.map(el => {
          el.price = rate_prices[el.productId];
          return el;
        }),
      )
      .then(SetTarifs);
    rate.setIsRateChoiceScreen(true);
  }, []);

  const OnTarifSelect = () => {
    iap.requestSubscription(rate.getSelectedTarifId());
  };
  let parent = route.params?.parent || 'Onboarding';

  if (!tarifs) return <Loader />;

  let selected_tarif = tarifs.find(el => el.productId == rate.selected_tarf_id);

  // if (true) {
  if (rate.is_subscription_paid) {
    return <RateSuccess navigation={navigation} tarif={selected_tarif} />;
  }

  return (
    <ScrollView>
      <View>
        <RateBackgound2 />
        <Shadow
          startColor={'#00000007'}
          finalColor={'#00000001'}
          offset={[0, 10]}
          distance={15}
          containerViewStyle={{
            position: 'absolute',
            right: 10,
            top: '2%',
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate(parent)}
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
        {/* <RateBackgound1 /> */}
        <View
          style={{
            position: 'absolute',
            bottom: 0.0001,
            right: 0.0001,
          }}>
          <RateHousemaidPhoto />
        </View>
      </View>
      <Text
        style={{
          color: 'black',
          fontFamily: 'Inter-SemiBold',
          fontSize: moderateScale(20),
          textAlign: 'center',
          marginTop: 10,
        }}>
        7 дней бесплатного пользования
      </Text>
      <Text
        style={{
          color: '#928787',
          fontFamily: 'Inter-Regular',
          fontSize: moderateScale(15),
          textAlign: 'center',
        }}>
        При выборе любого тарифного плана:
      </Text>
      <View style={{paddingHorizontal: 10, marginBottom: 10}}>
        {tarifs.map(el => (
          <Tarif
            tarif={el}
            key={el.id}
            is_active={rate.selected_tarif_id == el.productId}
            SetIsActive={rate.setSelectedTarifId}
          />
        ))}
      </View>
      <View style={{paddingHorizontal: 10, marginBottom: 10}}>
        <Text
          style={{
            fontFamily: 'Inter-Regular',
            fontSize: moderateScale(15),
            color: '#A9A6A6',
            textAlign: 'center',
          }}>
          Аннулировать подписку можно в любое время
        </Text>
        <Button
          text={`Продолжить`}
          second_text={`7 дней бесплатно, потом ${selected_tarif?.price}₽ в ${
            selected_tarif?.subscriptionPeriod == 'P1Y' ? 'год' : 'месяц'
          }`}
          onPress={OnTarifSelect}
          marginTop={10}
        />
      </View>
    </ScrollView>
  );
});

const Tarif = ({tarif}) => {
  let {productId, description, name, title, subscriptionPeriod, price} = tarif;
  let is_active = rate.selected_tarf_id == productId;
  let is_year_tarif = subscriptionPeriod == 'P1Y';
  let is_sale = productId == 'revizorro_3';
  return (
    <TouchableOpacity
      onPress={() => rate.setSelectedTarifId(tarif.productId)}
      style={{
        shadowColor: '#C8C7C7',
        shadowOffset: {
          width: 0,
          height: 10,
        },
        shadowOpacity: 0.51,
        shadowRadius: 10,
        padding: 20,
        backgroundColor: 'white',
        marginTop: 8,
        borderRadius: 20,
      }}>
      {is_sale ? (
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#E8443A',
            paddingHorizontal: 10,
            paddingVertical: 5,
            position: 'absolute',
            borderRadius: 20,
            borderBottomLeftRadius: 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: 'white',
              fontFamily: 'Inter-SemiBold',
              fontSize: moderateScale(16),
            }}>
            выгодно
          </Text>
          <Star width="18" height="18" fill="white" />
        </View>
      ) : null}

      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text
          style={{
            fontFamily: 'Inter-Medium',
            fontSize: moderateScale(13),
            color: '#AEA3A4',
            marginTop: is_sale ? 20 : 0,
          }}>
          {!is_year_tarif ? 'ЕЖЕМЕСЯЧНО' : 'ЕЖЕГОДНО'}
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

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 5,
        }}>
        <View>
          <Text
            style={{
              fontFamily: 'Inter-SemiBold',
              fontSize: moderateScale(16),
              color: 'black',
            }}>
            {Platform.OS == 'ios' ? title : name}
          </Text>
          <Text
            style={{
              fontFamily: 'Inter-Medium',
              fontSize: moderateScale(16),
              color: '#75706F',
              marginTop: 5,
            }}>
            {description}
          </Text>
        </View>
        <View style={{alignItems: 'flex-end', flex: 1}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {is_sale ? (
              <Text
                style={{
                  color: '#CCC6C6',
                  textDecorationLine: 'line-through',
                  textDecorationStyle: 'solid',
                  fontFamily: 'Inter-Regular',
                  fontSize: moderateScale(16),
                }}>
                {price / (1 - 0.6)} ₽
              </Text>
            ) : null}
            <Text
              style={{
                fontFamily: 'Inter-SemiBold',
                fontSize: moderateScale(16),
                color: is_sale ? '#E8443A' : 'black',
              }}>
              {' '}
              {price} ₽
            </Text>
          </View>
          <Text
            style={{
              fontFamily: 'Inter-Medium',
              fontSize: moderateScale(16),
              color: '#AEA3A4',
              marginTop: 5,
            }}>
            {!is_year_tarif ? 'в месяц' : 'в год'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const RateSuccess = ({navigation, tarif}) => {
  const OnTarifSelectSuccess = () => {
    navigation.navigate('Cleanings');
    rate.setIsSubscriptionPaid(false);
    rate.setIsRateChoiceScreen(false);
    rate.setSelectedTarifId('revizorro_1');
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
          {tarif.name} ({tarif.description})
        </Text>
        <Text
          style={{
            fontSize: moderateScale(16),
            color: '#686463',
            fontFamily: 'Inter-Regular',
            textAlign: 'center',
            marginTop: 20,
          }}>
          Через 7 дней спишется платеж за месяц. Подписка будет автоматически
          продлеваться каждый месяц.
        </Text>
      </View>
      <View style={{width: '100%'}}>
        <Text
          style={{
            fontSize: moderateScale(14),
            color: '#AEACAB',
            fontFamily: 'Inter-Regular',
            textAlign: 'center',
          }}>
          Вы можете в любой момент отменить подписку в настройках смартфона.
        </Text>
        <Button
          text={'Понятно'}
          onPress={OnTarifSelectSuccess}
          marginTop={10}
        />
      </View>
    </View>
  );
};
