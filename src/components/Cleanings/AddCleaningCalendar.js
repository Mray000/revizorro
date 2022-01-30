import moment from 'moment';
import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import {Header} from 'utils/Header';
import {cleaning} from 'store/cleaning';
import {api} from 'utils/api';
import {Loader} from 'utils/Loader';
import {CleaningsCalendar} from 'utils/CleaningsCalendar';

export const AddCleaningCalendar = ({navigation}) => {
  const [dates, SetDates] = useState(null);
  useEffect(() => {
    if (cleaning.flat) {
      api
        .getFlat(cleaning.flat?.id)
        .then(flat =>
          SetDates(
            flat.cleaning.map(el =>
              moment(el.time_cleaning).format('YYYY-MM-DD'),
            ),
          ),
        );
    } else SetDates([]);
  }, []);

  if (!dates) return <Loader />;

  return (
    <View>
      <Header onBack={() => navigation.goBack()} title={'Календарь'} />
      <CleaningsCalendar
        dates={dates}
        onDayPress={day => {
          cleaning.setDate(day);
          navigation.goBack();
        }}
      />
    </View>
  );
};
