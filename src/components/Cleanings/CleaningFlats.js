import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {app} from 'store/app';
import {cleaning} from 'store/cleaning';
import {AddButton} from 'styled_components/AddButton';
import {api} from 'utils/api';
import {dimensions} from 'utils/dimisions';
import {Header} from 'styled_components/Header';
import {Loader} from 'styled_components/Loader';
import {moderateScale} from 'utils/normalize';

export const CleaningFlats = ({navigation, route}) => {
  const [flats, SetFlats] = useState(null);

  useEffect(() => {
    api.getFlats().then(SetFlats);

    navigation.addListener('focus', () => {
      SetFlats(null);
      api.getFlats().then(SetFlats);
    });
  }, []);

  useEffect(() => {
    if (!flats) api.getFlats().then(SetFlats);
  }, [flats]);

  if (!flats) return <Loader />;

  return (
    <ScrollView style={{paddingVertical: 10}}>
      <Header title={'Квартиры'} onBack={navigation.goBack} />
      {app.role == 'role_admin' ? (
        <View style={{paddingHorizontal: 10}}>
          <AddButton
            text={'Добавить новую квартиру'}
            onPress={() => navigation.navigate('AddFlat')}
          />
        </View>
      ) : null}
      <View style={{marginBottom: 20}}>
        {flats.map(flat => (
          <Flat flat={flat} navigation={navigation} key={flat.id} />
        ))}
      </View>
    </ScrollView>
  );
};

const Flat = ({flat, navigation}) => (
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
      marginHorizontal: 10,
      alignItems: 'center',
      padding: 10,
      borderRadius: 20,
    }}
    onPress={() => {
      cleaning.setFlat(flat);
      cleaning.deleteCheckLists();
      navigation.goBack();
    }}>
    <Text
      style={{
        fontSize: moderateScale(16),
        color: 'black',
        fontFamily: 'Inter-Medium',
      }}>
      {flat.title}
    </Text>
  </TouchableOpacity>
);
