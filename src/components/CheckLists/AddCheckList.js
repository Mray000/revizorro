import React, {useState, useEffect, useRef} from 'react';

import {api} from 'utils/api';
import {types} from 'utils/flat_types';

import {useToggle} from 'hooks/useToggle';

import {AddEditCheckListLayout} from './AddEditCheckListLayout';
import {app} from 'store/app';

export const AddCheckList = ({navigation, route}) => {
  const [title, SetTitle] = useState('');
  const [price, SetPrice] = useState(0);
  const [question, SetQuestion] = useState('');
  const [answers, SetAnswers] = useState([]);
  const [answer, SetAnswer] = useState('');
  const [hours, SetHours] = useState(0);
  const [minutes, SetMinutes] = useState(5);
  const [photos_text, SetPhotosText] = useState('');

  const [edit_id, SetEditId] = useState(null);
  const [is_load, SetIsLoad] = useState(false);
  const [is_question_modal_visible, SetIsQuestionModalVisible] =
    useToggle(false);
  const [is_photo_modal_visible, SetIsPhotoModalVisible] = useToggle(false);

  const [is_add_modal_visible, SetIsAddModalVisible] = useToggle(false);

  const [questions_and_photos, SetQuestionsAndPhotos] = useState([]);

  let questionbBottomSheet = useRef();
  let photoBottomSheet = useRef();

  const ChangeIsOpenQuestionModal = () => {
    if (is_question_modal_visible) {
      SetEditId(null);
      SetQuestion('');
      SetAnswers([]);
    }
    if (is_add_modal_visible) SetIsAddModalVisible();
    app.setIsBottomNavigatorVisible(is_question_modal_visible);
    SetIsQuestionModalVisible();
  };

  const ChangeIsOpenPhotoModal = () => {
    if (is_photo_modal_visible) {
      SetEditId(null);
      SetPhotosText('');
    }
    if (is_add_modal_visible) SetIsAddModalVisible();
    app.setIsBottomNavigatorVisible(is_photo_modal_visible);
    SetIsPhotoModalVisible();
  };

  const AddAnswer = () => {
    if (!answers.includes(answer)) SetAnswers(prev => [...prev, answer]);
    SetAnswer('');
  };

  const AddQuestion = () => {
    if (!edit_id) {
      SetQuestionsAndPhotos(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          answers,
          text: question,
        },
      ]);
    } else {
      SetQuestionsAndPhotos(prev => {
        let new_questions = prev.map(el => {
          if (el.id == edit_id) {
            let new_task = {
              id: edit_id,
              text: question,
              answers,
            };
            return new_task;
          } else return el;
        });
        return new_questions;
      });
      SetEditId(null);
    }
    ChangeIsOpenQuestionModal();
  };

  const AddPhotosTask = () => {
    if (!edit_id) {
      SetQuestionsAndPhotos(prev => [
        ...prev,
        {id: Date.now().toString(), text: photos_text},
      ]);
    } else {
      SetQuestionsAndPhotos(prev => {
        let new_questions = prev.map(el => {
          if (el.id == edit_id) {
            let new_task = {
              id: edit_id,
              text: photos_text,
            };
            return new_task;
          } else return el;
        });
        return new_questions;
      });
      SetEditId(null);
    }
    ChangeIsOpenPhotoModal();
  };

  const DeleteQuestion = () => {
    SetQuestionsAndPhotos(questions_and_photos =>
      questions_and_photos.filter(el => el.id !== edit_id),
    );
    SetEditId(null);
    ChangeIsOpenQuestionModal();
  };

  const DeletePhoto = () => {
    SetQuestionsAndPhotos(questions_and_photos =>
      questions_and_photos.filter(el => el.id !== edit_id),
    );
    SetEditId(null);
    ChangeIsOpenPhotoModal();
  };

  const EditQuestion = question => {
    SetQuestion(question.text);
    SetAnswers(question.answers);
    SetEditId(question.id);
    ChangeIsOpenQuestionModal();
  };

  const EditPhotoTask = task => {
    SetPhotosText(task.text);
    SetEditId(task.id);
    ChangeIsOpenPhotoModal();
  };

  const handleAddCheckList = async () => {
    SetIsLoad(true);
    await api.addCheckList({
      name: title,
      type: types[type],
      cost: Number(price),
      interval: hours * 60 + minutes,
      questions: [
        ...questions_and_photos.map(q =>
          q.answers
            ? {
                question_type: 'type_text',
                question_text: q.text,
                answer: q.answers,
              }
            : {
                question_type: 'type_photo',
                question_text: q.text,
              },
        ),
      ],
    });
    navigation.goBack();
    SetIsLoad(false);
  };

  useEffect(() => {
    if (questionbBottomSheet.current) questionbBottomSheet.current.show();
  }, [is_question_modal_visible]);

  useEffect(() => {
    if (photoBottomSheet.current) photoBottomSheet.current.show();
  }, [is_photo_modal_visible]);

  let type = route.params?.type;

  return (
    <AddEditCheckListLayout
      type={type}
      SetTitle={SetTitle}
      SetPrice={SetPrice}
      SetHours={SetHours}
      SetMinutes={SetMinutes}
      is_load={is_load}
      questionbBottomSheet={questionbBottomSheet}
      photoBottomSheet={photoBottomSheet}
      ChangeIsOpenQuestionModal={ChangeIsOpenQuestionModal}
      AddAnswer={AddAnswer}
      EditQuestion={EditQuestion}
      AddPhotosTask={AddPhotosTask}
      AddQuestion={AddQuestion}
      questions_and_photos={questions_and_photos}
      title={title}
      price={price}
      answers={answers}
      answer={answer}
      photos_text={photos_text}
      hours={hours}
      minutes={minutes}
      is_question_modal_visible={is_question_modal_visible}
      is_photo_modal_visible={is_photo_modal_visible}
      is_add_modal_visible={is_add_modal_visible}
      navigation={navigation}
      SetIsAddModalVisible={SetIsAddModalVisible}
      handleAddCheckList={handleAddCheckList}
      ChangeIsOpenPhotoModal={ChangeIsOpenPhotoModal}
      question={question}
      SetQuestion={SetQuestion}
      SetAnswer={SetAnswer}
      SetPhotosText={SetPhotosText}
      SetQuestionsAndPhotos={SetQuestionsAndPhotos}
      EditPhotoTask={EditPhotoTask}
      SetAnswers={SetAnswers}
      edit_id={edit_id}
      DeleteQuestion={DeleteQuestion}
      DeletePhoto={DeletePhoto}
    />
  );
};
