import moment from 'moment';
import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView} from 'react-native';
import {api} from 'utils/api';
import {Header} from 'utils/Header';
import {Loader} from 'utils/Loader';
import {CleaningComponent} from './CleaningComponent';

export const DayCleaningsList = ({navigation, route}) => {
  let date = route.params.day;
  const [cleanings, SetCleanings] = useState(null);
  useEffect(() => {
    api
      .getCleanings()
      .then(data =>
        SetCleanings(
          data.filter(
            el =>
              moment(el.time_cleaning).format('YYYY-MM-DD') ==
              moment(date).format('YYYY-MM-DD'),
          ),
        ),
      );
  }, []);
  if (!cleanings) return <Loader />;
  return (
    <ScrollView style={{paddingTop: 10}}>
      <Header
        title={moment(date).format('DD MMMM')}
        onBack={() => navigation.goBack()}
      />
      <View style={{padding: 10, paddingTop: 0}}>
        {cleanings.map(cleaning => (
          <CleaningComponent
            key={cleaning.id}
            cleaning={cleaning}
            is_need_check={true}
            repeat_count={cleanings
              .filter(el => el.maid.id == cleaning.maid.id)
              .sort(
                (a, b) => new Date(a.time_cleaning) - new Date(b.time_cleaning),
              )
              .findIndex(el => el.id == cleaning.id)}
          />
        ))}
      </View>
    </ScrollView>
  );
};
