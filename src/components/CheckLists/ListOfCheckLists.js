import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {colors} from 'utils/colors';
import {moderateScale, scale} from 'utils/Normalize';
import ArrowRight from 'assets/arrow_right.svg';
import Copy from 'assets/copy.svg';
import Trash from 'assets/trash.svg';
import {dimensions} from 'utils/dimisions';
import {api} from 'utils/api';
import {Loader} from 'utils/Loader';
import {app} from 'store/app';
export const ListOfCheckLists = ({navigation}) => {
  const [check_lists, SetCheckLists] = useState(null);
  const [selected_id, SetSelectedId] = useState(0);

  useEffect(() => {
    api.getCheckLists().then(SetCheckLists);
  }, []);

  useEffect(() => {
    navigation.addListener('focus', () => {
      SetCheckLists(null);
      api.getCheckLists().then(SetCheckLists);
    });
  }, []);

  useEffect(() => {
    if (selected_id) app.setBottomNavigatorColor('rgba(0, 0, 0, 0.08)');
    else app.setBottomNavigatorColor(null);
  }, [selected_id]);

  const CopyCheckList = check_list => {
    api
      .addCheckList(check_list)
      .finally(() => api.getCheckLists().then(SetCheckLists))
      .finally(() => SetSelectedId(0));
  };

  const DeleteCheckList = id => {
    api
      .deleteCheckList(id)
      .finally(() => api.getCheckLists(id).then(SetCheckLists))
      .finally(() => SetSelectedId(0));
  };

  if (!check_lists) return <Loader />;
  return (
    <ScrollView style={{backgroundColor: selected_id ? '#E7E6E6' : '#F9F9F9'}}>
      <TouchableWithoutFeedback onPress={() => SetSelectedId(0)}>
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: dimensions.height,
          }}
        />
      </TouchableWithoutFeedback>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 20,
          paddingHorizontal: 20,
        }}>
        <Text
          style={{
            color: 'black',
            fontFamily: 'Inter-SemiBold',
            fontWeight: '800',
            fontSize: moderateScale(19),
          }}>
          Мои чек-листы
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddCheckList')}>
          <Text
            style={{
              color: colors.orange,
              fontSize: moderateScale(15),
              fontFamily: 'Inter-Medium',
            }}>
            Добавить
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{paddingBottom: 200, marginTop: 10}}>
        {check_lists.map(check_list => (
          <CheckList
            SetSelectedId={SetSelectedId}
            CopyCheckList={CopyCheckList}
            DeleteCheckList={DeleteCheckList}
            selected_id={selected_id}
            check_list={check_list}
            navigation={navigation}
            key={check_list.id}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const CheckList = ({
  check_list,
  SetSelectedId,
  selected_id,
  CopyCheckList,
  navigation,
  DeleteCheckList,
}) => {
  const {id, name, questions} = check_list;
  let questions_count = 0;
  let photo_tasks_count = 0;
  questions.forEach(el => {
    if (el.question_type == 'type_text') questions_count++;
    else photo_tasks_count++;
  });
  return (
    <View>
      <TouchableOpacity
        onLongPress={() => SetSelectedId(id)}
        onPress={() =>
          selected_id
            ? SetSelectedId(0)
            : navigation.navigate('EditCheckList', {check_list})
        }
        style={{
          shadowColor: '#D6D5D5',
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0.51,
          shadowRadius: 13.16,
          elevation: 15,
          paddingHorizontal: 10,
          marginVertical: 5,
          // backgroundColor: "red"
        }}>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            borderRadius: 20,
            padding: 15,
            alignItems: 'center',
            position: 'relative',
            backgroundColor: selected_id
              ? selected_id == id
                ? 'white'
                : '#ECECEC'
              : 'white',
          }}>
          <View style={{width: '90%'}}>
            <Text
              style={{
                fontFamily: 'Inter-SemiBold',
                fontSize: moderateScale(16),
                color: 'black',
              }}>
              {name}
            </Text>
            <Text
              style={{
                fontFamily: 'Inter-Regular',
                fontSize: moderateScale(14),
                color: '#8B8887',
              }}>
              {questions_count} вопросов, {photo_tasks_count} фото
            </Text>
          </View>
          <View
            style={{
              width: '10%',
              alignItems: 'flex-end',
              justifyContent: 'center',
            }}>
            <ArrowRight fill="#D1CFCF" width={scale(12)} height={scale(12)} />
          </View>
        </View>
      </TouchableOpacity>
      {selected_id == id ? (
        <View
          style={{
            position: 'absolute',
            backgroundColor: 'white',
            borderRadius: 20,
            right: 10,
            bottom: -90,
            zIndex: 1,
            elevation: 21,
          }}>
          <TouchableOpacity
            onPress={() => CopyCheckList(check_list)}
            style={{
              flexDirection: 'row',
              borderColor: '#E5E3E2',
              alignItems: 'center',
              borderBottomWidth: 1,
              padding: 10,
            }}>
            <Copy />
            <Text
              style={{
                fontFamily: 'Inter-Medium',
                fontSize: moderateScale(15),
                color: 'black',
                marginLeft: 3,
              }}>
              Создать копию
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 10,
            }}
            onPress={() => DeleteCheckList(id)}>
            <Trash />
            <Text
              style={{
                fontFamily: 'Inter-Medium',
                fontSize: moderateScale(15),
                color: 'black',
                marginLeft: 3,
              }}>
              Удалить
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};
