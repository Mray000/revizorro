import React, {useState, useEffect, useRef} from 'react';
import {app} from 'store/app';
import {api} from 'utils/api';
import {convertType, types} from 'utils/flat_types';
import {AddEditCheckListLayout} from './AddEditCheckListLayout';
import {useToggle} from 'hooks/useToggle';
export const EditCheckList = ({navigation, route}) => {
  let check_list = route.params.check_list;
  console.log(check_list, 'NEW_DATA');
  const [title, SetTitle] = useState(check_list.name);
  const [price, SetPrice] = useState(
    check_list.cost ? String(check_list.cost) : '',
  );

  const [questions_and_photos, SetQuestionsAndPhotos] = useState([
    ...check_list.questions.map(el =>
      el.question_type == 'type_text'
        ? {id: el.id, text: el.question_text, answers: el.answer}
        : {id: el.id, text: el.question_text},
    ),
  ]);
  const [question, SetQuestion] = useState('');
  const [answers, SetAnswers] = useState([]);
  const [answer, SetAnswer] = useState('');
  const [photos_text, SetPhotosText] = useState('');

  const [edit_id, SetEditId] = useState(null);
  const [hours, SetHours] = useState(Math.floor(check_list.interval / 60));
  const [minutes, SetMinutes] = useState(
    check_list.interval - Math.floor(check_list.interval / 60),
  );

  const [deleted_questions_and_photos_ids, SetDeletedQuestionsAndPhotosIds] =
    useState([]);

  const [is_load, SetIsLoad] = useState(false);
  const [is_question_modal_visible, SetIsQuestionModalVisible] =
    useToggle(false);
  const [is_photo_modal_visible, SetIsPhotoModalVisible] = useToggle(false);

  const [is_add_modal_visible, SetIsAddModalVisible] = useToggle(false);

  const [is_delete_modal_open, SetIsDeleteModalOpen] = useState(false);

  let type = route.params?.type || convertType(check_list.type);

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
          new: true,
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
              changed: true,
              new: el.new,
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
        {id: Date.now().toString(), text: photos_text, new: true},
      ]);
    } else {
      SetQuestionsAndPhotos(prev => {
        let new_questions = prev.map(el => {
          if (el.id == edit_id) {
            let new_task = {
              id: edit_id,
              text: photos_text,
              changed: true,
              new: el.new,
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
    if (!questions_and_photos.find(el => el.id == edit_id).new) {
      SetDeletedQuestionsAndPhotosIds(ids => [...ids, edit_id]);
    }
    SetQuestionsAndPhotos(questions_and_photos =>
      questions_and_photos.filter(el => el.id !== edit_id),
    );
    SetEditId(null);
    ChangeIsOpenQuestionModal();
  };

  const DeletePhoto = () => {
    if (!questions_and_photos.find(el => el.id == edit_id).new) {
      SetDeletedQuestionsAndPhotosIds(ids => [...ids, edit_id]);
    }

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

  const handleEditCheckList = async () => {
    SetIsLoad(true);

    await api.editCheckList({
      id: check_list.id,
      name: title,
      type: types[type],
      cost: Number(price),
      interval: hours * 60 + minutes,
    });

    await Promise.all(
      [
        ...questions_and_photos.map((q, index) =>
          q.answers
            ? {
                id: q.id,
                question_type: 'type_text',
                question_text: q.text,
                answer: q.answers,
                new: q.new,
                changed: q.changed,
                check_list_id: check_list.id,
                index,
              }
            : {
                id: q.id,
                question_type: 'type_photo',
                question_text: q.text,
                new: q.new,
                changed: q.changed,
                check_list_id: check_list.id,
                index,
              },
        ),
      ].map(el => {
        if (el.new) return api.addQuestion(el);
        console.log(el.index, el.question_type);
        return api.editQuestion(el);
      }),
    );
    await Promise.all(
      deleted_questions_and_photos_ids.map(id =>
        api.deleteQuestionsAndPhotos(id),
      ),
    );
    navigation.navigate('ListOfCheckLists');
    SetIsLoad(false);
  };

  const handleDeleteCheckList = async () => {
    await api.deleteCheckList(check_list.id);
    SetIsDeleteModalOpen(false);
    navigation.navigate('ListOfCheckLists');
  };
  useEffect(() => {
    if (questionbBottomSheet.current) questionbBottomSheet.current.show();
  }, [is_question_modal_visible]);

  useEffect(() => {
    if (photoBottomSheet.current) photoBottomSheet.current.show();
  }, [is_photo_modal_visible]);

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
      ChangeIsOpenPhotoModal={ChangeIsOpenPhotoModal}
      question={question}
      SetQuestion={SetQuestion}
      SetAnswer={SetAnswer}
      SetPhotosText={SetPhotosText}
      SetQuestionsAndPhotos={SetQuestionsAndPhotos}
      EditPhotoTask={EditPhotoTask}
      handleDeleteCheckList={handleDeleteCheckList}
      handleEditCheckList={handleEditCheckList}
      is_delete_modal_open={is_delete_modal_open}
      SetIsDeleteModalOpen={SetIsDeleteModalOpen}
      is_edit={true}
      check_list={check_list}
      SetAnswers={SetAnswers}
      edit_id={edit_id}
      DeleteQuestion={DeleteQuestion}
      DeletePhoto={DeletePhoto}
    />
  );
};
