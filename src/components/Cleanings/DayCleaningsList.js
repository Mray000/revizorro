import moment from 'moment';
import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView} from 'react-native';
import {app} from 'store/app';
import {api} from 'utils/api';
import {Header} from 'utils/Header';
import {Loader} from 'utils/Loader';
import {observer} from 'mobx-react-lite';

import {CleaningComponent} from './CleaningComponent';

export const DayCleaningsList = observer(({navigation, route}) => {
  let date = route.params.day;
  let is_housemaid = app.role == 'role_maid';

  const [cleanings, SetCleanings] = useState(null);
  useEffect(() => {
    api
      .getCleanings()
      .then(data =>
        SetCleanings(
          data.filter(
            el =>
              moment(el.time_cleaning).format('YYYY-MM-DD') ==
                moment(date).format('YYYY-MM-DD') ||
              (moment(date).format('YYYY-MM-DD') ==
              moment().format('YYYY-MM-DD')
                ? el.status == (!is_housemaid ? 'on_check' : 'report_required')
                : false),
          ),
        ),
      );
  }, []);

  const getIsCleaningDisabled = cleaning => {
    if (is_housemaid) {
      return cleaning.status == 'on_check' || cleaning.status == 'not_accepted';
    } else {
      if (
        (app.role == 'role_manager' && app.accesses.includes('cleanings')) ||
        app.role == 'role_admin'
      ) {
        return cleaning.status != 'accepted'
          ? cleaning.status == 'on_check'
            ? false
            : cleaning.amount_checks || cleaning.status == 'report_required'
          : false;
      } else {
        return (
          cleaning.status == 'report_required' ||
          cleaning.status == 'not_accepted'
        );
      }
    }
  };
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
            navigation={navigation}
            key={cleaning.id}
            cleaning={cleaning}
            is_completed={cleaning.status == 'accepted'}
            is_on_check={is_housemaid && cleaning.status == 'on_check'}
            is_need_check={
              is_housemaid
                ? cleaning.status == 'report_required'
                : cleaning.status == 'on_check'
            }
            is_housemiad={is_housemaid}
            disabled={getIsCleaningDisabled(cleaning)}
          />
        ))}
      </View>
    </ScrollView>
  );
});
