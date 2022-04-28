import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import NoWorkers from 'assets/no_workers.svg';
import NoChecklists from 'assets/no_checklists.svg';
import NoFlats from 'assets/no_flats.svg';
import NoCleanings from 'assets/no_cleanings.svg';
import {colors} from 'utils/colors';
import {moderateScale} from 'utils/normalize';
export const NoData = ({screen}) => {
  const screens = {
    Workers: {
      svg: NoWorkers,
      title: 'Добавить сотрудника',
    },
    CheckLists: {
      svg: NoChecklists,
      title: 'Добавьте чек-лист',
    },
    Flats: {
      svg: NoFlats,
      title: 'Добавьте квартиру',
    },
    Cleanings: {
      svg: NoCleanings,
      title: 'Добавьте уборку',
    },
  };
  let cureent_screen = screens[screen];
  console.log(cureent_screen);
  return (
    <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
      <cureent_screen.svg />
      <Text
        style={{
          color: '#C5BEBE',
          fontFamily: 'Inter-Regular',
          fontSize: moderateScale(16),
        }}>
        {cureent_screen.title}
      </Text>
    </View>
  );
};
