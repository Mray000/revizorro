import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
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
export const RateChoice = ({navigation, route}) => {
  const [selected_tarif_id, SetSelectedTarifId] = useState(1);
  const [dollar_course, SetDollarCourse] = useState(null);
  const [is_success, SetIsSuccess] = useState(false);
  let tarifs = [
    {id: 1, title: 'Старт', price: 2.5, cleanings_count: 30},
    {id: 2, title: 'Бизнес', price: 5, cleanings_count: 30},
    {
      id: 3,
      title: 'Профессионал',
      price: 14,
      cleanings_count: 'б',
      is_sale: true,
    },
    {
      id: 4,
      title: 'Всё включено',
      price: 156,
      cleanings_count: 'б',
      is_year_tarif: true,
    },
  ];
  if (is_success)
    return <RateSucces navigation={navigation} name={route?.params?.name} tarif={tarifs.find(el => el.id == selected_tarif_id)}/>;
  useEffect(() => {
    api.getDollarCourse().then(SetDollarCourse);
  }, []);
  if (!dollar_course) return <Loader />;
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
            onPress={() => navigation.navigate('Registration')}
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
            is_active={selected_tarif_id == el.id}
            SetIsActive={SetSelectedTarifId}
            dollar_course={dollar_course}
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
          second_text={`7 дней бесплатно, потом ${Math.round(
            tarifs.find(el => el.id == selected_tarif_id).price / dollar_course,
          )}₽ в месяц`}
          marginTop={10}
        />
      </View>
    </ScrollView>
  );
};

const Tarif = ({tarif, is_active, SetIsActive, dollar_course}) => {
  let {id, is_year_tarif, title, cleanings_count, price, is_sale} = tarif;
  return (
    <TouchableOpacity
      onPress={() => SetIsActive(id)}
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
            {title}
          </Text>
          <Text
            style={{
              fontFamily: 'Inter-Medium',
              fontSize: moderateScale(16),
              color: '#75706F',
              marginTop: 5,
            }}>
            {cleanings_count} уборок в месяц
          </Text>
        </View>
        <View style={{alignItems: 'flex-end'}}>
        
          <Text
            style={{
              fontFamily: 'Inter-SemiBold',
              fontSize: moderateScale(16),
              color: is_sale ? "#E8443A" : 'black',
              marginTop: 5,
            }}>
        {is_sale ? <Text style={{color: "#CCC6C6", textDecorationLine: 'line-through', textDecorationStyle: 'solid', 
               fontFamily: 'Inter-Regular',}}>{Math.round((price / dollar_course) / (1 - 0.6))} ₽</Text> : null} {Math.round(price / dollar_course)} ₽
          </Text>
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


const RateSucces = ({navigation, name, tarif}) => (
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
        onPress={() => navigation.navigate('Workers')}
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
      <Text style={{
          color: 'black',
          fontFamily: 'Inter-SemiBold',
          textAlign: 'center',
          fontSize: moderateScale(18),
          marginTop: 20,
        }}>Спасибо, {"Александр"}!</Text>
      <Text style={{
            fontSize: moderateScale(16),
            color: '#686463',
            fontFamily: 'Inter-Regular',
            textAlign: 'center',
            marginTop: 20,
          }}>Вы оформили тариф:</Text>
          <Text style={{
          color: 'black',
          fontFamily: 'Inter-SemiBold',
          textAlign: 'center',
          fontSize: moderateScale(17),
          marginTop: 5,
        }}>
          {tarif.title} ({tarif.cleanings_count} уборок в месяц)
          </Text>
        <Text
          style={{
            fontSize: moderateScale(16),
            color: '#686463',
            fontFamily: 'Inter-Regular',
            textAlign: 'center',
            marginTop: 20,
          }}>
          Через 7 дней спишется платеж за месяц. Подписка будет автоматически продлеваться каждый месяц.
        </Text>
    </View>
      <View style={{width: "100%"}}>
        <Text  
          style={{
                fontSize: moderateScale(14),
                color: '#AEACAB',
                fontFamily: 'Inter-Regular',
                textAlign: 'center',
              }}>Вы можете в любой момент отменить 
                  подписку в настройках смартфона.</Text>
        <Button
          text={"Понятно"}
          onPress={() => navigation.navigate("Workers")}
          marginTop={10}
        />
        </View>
  </View>
);
