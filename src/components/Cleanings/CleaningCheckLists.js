import React, {useState, useEffect, useMemo} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {AddButton} from 'utils/AddButton';
import {api} from 'utils/api';
import {colors} from 'utils/colors';
import {dimensions} from 'utils/dimisions';
import {Header} from 'utils/Header';
import {Loader} from 'utils/Loader';
import {moderateScale} from 'utils/Normalize';
import Check from 'assets/check.svg';
import {cleaning} from 'store/cleaning';
import {observer} from 'mobx-react-lite';
export const CleaningCheckLists = observer(({navigation}) => {
  const [check_lists, SetCheckLists] = useState(null);

  useEffect(() => {
    if (!check_lists)
      api
        .getCheckLists()
        .then(check_lists =>
          check_lists.filter(el => el.type == cleaning.flat.type),
        )
        .then(SetCheckLists);
  }, [check_lists]);

  useEffect(() => {
    navigation.addListener('focus', () => {
      SetCheckLists(null);
      api
        .getCheckLists()
        .then(check_lists =>
          check_lists.filter(el => el.type == cleaning.flat.type),
        )
        .then(SetCheckLists);
    });
  }, []);

  let active_check_lists = cleaning.check_lists;
  if (!check_lists) return <Loader />;

  return (
    <ScrollView style={{paddingVertical: 10}}>
      <Header
        title={'Чек-листы'}
        onBack={navigation.goBack}
        children={
          <TouchableOpacity
            style={{position: 'absolute', right: 20}}
            onPress={navigation.goBack}>
            <Text
              style={{
                fontSize: moderateScale(15),
                fontFamily: 'Inter-Medium',
                color: colors.orange,
              }}>
              Готово
            </Text>
          </TouchableOpacity>
        }
      />
      <View style={{paddingHorizontal: 10}}>
        <AddButton
          text={'Добавить новый чек-лист'}
          onPress={() => navigation.navigate('AddCheckList')}
        />
      </View>
      <View style={{marginBottom: 20}}>
        {check_lists.map(check_list => (
          <CheckList
            key={check_list.id}
            check_list={check_list}
            navigation={navigation}
            is_active={active_check_lists.find(el => el.id == check_list.id)}
            SetIsActiveCheckList={() => cleaning.setCheckList(check_list)}
          />
        ))}
      </View>
    </ScrollView>
  );
});

const CheckList = ({check_list, is_active, SetIsActiveCheckList}) => (
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
      paddingHorizontal: 20,
      marginHorizontal: 10,
      alignItems: 'center',
      borderRadius: 20,
    }}
    onPress={SetIsActiveCheckList}>
    <View
      style={{
        width: 20,
        height: 20,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: !is_active ? '#C5BEBE' : colors.orange,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: !is_active ? 'white' : colors.orange,
      }}>
      {is_active ? <Check fill="white" width={12} height={14} /> : null}
    </View>
    <Text
      style={{
        fontSize: moderateScale(16),
        color: 'black',
        fontFamily: 'Inter-Mdeium',
      }}>
      {check_list.name}
    </Text>
    <Text
      numberOfLines={1}
      style={{
        color: '#C5BFBE',
        position: 'absolute',
        right: 10,
        fontFamily: 'Inter-Redular',
        fontSize: moderateScale(16),
      }}>
      {check_list.cost} ₽
    </Text>
  </TouchableOpacity>
);
