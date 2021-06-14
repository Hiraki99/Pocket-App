import {put, call, takeLatest} from 'redux-saga/effects';
import lodash from 'lodash';
import {
  FETCH_EXAM_FEATURE,
  FETCH_CATEGORIES_EXAM,
  FETCH_EXAMS_BY_MULTI_CATEGORY,
  FETCH_SECTION_BY_EXAM,
  FETCH_LIST_ESSAY_EXAM,
  RESET_EXAM,
} from './ExamType';
import examAPI from './ExamApi';
import {
  fetchExamFeatureSuccess,
  fetchExamFeatureFail,
  fetchCategoryExamSuccess,
  fetchCategoryExamFail,
  fetchExamByMultiCategory,
  fetchExamByMultiCategorySuccess,
  fetchExamByMultiCategoryFail,
  fetchSectionByExamSuccess,
  fetchQuestionByPartSuccess,
  setInfoExam,
  fetchEssayExamListSuccess,
  fetchEssayExamListFail,
} from './ExamAction';
import {STATUS_PART, STATUS_QUESTION} from '~/constants/testData';
import {EXAM_TYPE} from '~/constants/exam';
import ProcessExamType from '~/utils/process_exam_type';

export default function* examSaga() {
  yield takeLatest(FETCH_EXAM_FEATURE, fetchExamFeature);
  yield takeLatest(FETCH_LIST_ESSAY_EXAM, fetchEssayExamList);
  yield takeLatest(FETCH_SECTION_BY_EXAM, fetchSectionExam);
  yield takeLatest(FETCH_CATEGORIES_EXAM, fetchCategoriesExam);
  yield takeLatest(RESET_EXAM, saveTestResult);
  yield takeLatest(
    FETCH_EXAMS_BY_MULTI_CATEGORY,
    fetchExamsByMultiCategorySaga,
  );
}

function* fetchSectionExam({payload: {data}}) {
  const response = yield call(examAPI.fetchSectionByExam, data);
  if (response.ok && response.data && response.data.data) {
    const {test_sections, ...restData} = response.data.data;
    yield put(setInfoExam({info: restData}));
    if (test_sections) {
      let questionsExam = {};
      let indexQuestion = 1;
      let sections = test_sections.map((item) => {
        const {test_parts, ...restItem} = item;
        const parts = test_parts.map((part) => {
          const {test_questions} = part;
          const questionIds = test_questions.map(
            (testQuestionItem, indexList) => {
              switch (testQuestionItem.type) {
                case EXAM_TYPE.select_answer_paragraph:
                case EXAM_TYPE.select_answer_sentence:
                  const refIndex = indexQuestion;
                  const resTransformQuestion = ProcessExamType.SelectAnswerParagraph(
                    testQuestionItem,
                    indexQuestion,
                    indexList,
                    part._id,
                  );
                  questionsExam[testQuestionItem._id] = {
                    ...resTransformQuestion.infoParagraphQuestion,
                    indexQuestion:
                      testQuestionItem.type === EXAM_TYPE.select_answer_sentence
                        ? refIndex
                        : resTransformQuestion.indexQuestion,
                    indexList,
                    status: STATUS_QUESTION.NEW,
                  };
                  questionsExam = {
                    ...questionsExam,
                    ...resTransformQuestion.questionParagraphDetail,
                  };

                  indexQuestion =
                    testQuestionItem.type === EXAM_TYPE.select_answer_sentence
                      ? refIndex
                      : resTransformQuestion.indexQuestion;
                  break;
                case EXAM_TYPE.question_with_order:
                  const correctAnswer = testQuestionItem.answers
                    .filter((ans) => ans.isAnswer)
                    .map((ans) => ans.text)
                    .join(' ');

                  questionsExam[testQuestionItem._id] = {
                    ...testQuestionItem,
                    correctAnswer,
                    indexList,
                    answers: lodash.shuffle(testQuestionItem.answers),
                    status: STATUS_QUESTION.NEW,
                    partId: part._id,
                    indexQuestion,
                  };
                  break;
                case EXAM_TYPE.fill_in_blank_sentence:
                  questionsExam[testQuestionItem._id] = {
                    ...ProcessExamType.QuestionFillInBlankSentence(
                      testQuestionItem,
                    ),
                    indexList,
                    partId: part._id,
                    status: STATUS_QUESTION.NEW,
                    indexQuestion,
                  };
                  break;
                case EXAM_TYPE.fill_in_blank:
                  questionsExam[testQuestionItem._id] = {
                    ...ProcessExamType.QuestionFillInBlankParagraph(
                      testQuestionItem,
                    ),
                    indexList,
                    status: STATUS_QUESTION.NEW,
                    indexQuestion,
                  };
                  break;
                default:
                  questionsExam[testQuestionItem._id] = {
                    ...testQuestionItem,
                    indexList,
                    status: STATUS_QUESTION.NEW,
                    partId: part._id,
                    indexQuestion,
                  };
              }

              indexQuestion += 1;

              return testQuestionItem._id;
            },
          );
          return {
            ...part,
            questionIds,
            status: STATUS_PART.DEACTIVE,
          };
        });
        return {
          ...restItem,
          parts,
        };
      });
      yield put(fetchSectionByExamSuccess(sections));
      yield put(fetchQuestionByPartSuccess(questionsExam));
    }
    return;
  }
  yield put(fetchExamFeatureFail());
}

function* fetchExamFeature({payload: {data}}) {
  const response = yield call(examAPI.fetchExamFeature, data);

  if (response.ok && response.data && response.data.data) {
    yield put(fetchExamFeatureSuccess(response.data.data));
    return;
  }
  yield put(fetchExamFeatureFail());
}

function* fetchEssayExamList({payload: {data}}) {
  const response = yield call(examAPI.fetchListExamEssay, data);

  if (response.ok && response.data && response.data.data) {
    const resUpdate = response.data.data.map((item) => {
      return {...item, type: 'essay_exam'};
    });
    yield put(fetchEssayExamListSuccess(resUpdate));
    return;
  }
  yield put(fetchEssayExamListFail());
}

function* fetchCategoriesExam({payload: {data}}) {
  const response = yield call(examAPI.fetchCategoriesExam, data);

  if (response.ok && response.data && response.data.data) {
    const listIdTopicVHottest = response.data.data;
    yield put(
      fetchExamByMultiCategory(
        {
          test_categories: listIdTopicVHottest.map((item) => item._id),
        },
        listIdTopicVHottest,
      ),
    );
    yield put(fetchCategoryExamSuccess(response.data.data));
    return;
  }
  yield put(fetchCategoryExamFail());
}

function* fetchExamsByMultiCategorySaga({payload: {data, refData}}) {
  const response = yield call(examAPI.fetchExamByMultiCategories, data);
  if (response.ok && response.data && response.data.data) {
    const dataUpdate = [];
    response.data.data.forEach((item) => {
      const info = refData.filter((it) => it._id === item.category);
      if (info.length === 0) {
        return;
      }
      dataUpdate.push({
        id: `${info[0]._id}_most_attention`,
        title: info[0].name,
        ...info[0],
        data: item.items,
      });
    });
    yield put(fetchExamByMultiCategorySuccess(dataUpdate));
    return;
  }
  yield put(fetchExamByMultiCategoryFail());
}

function* saveTestResult({payload: {data}}) {
  const result = [];
  (data.examQuestions || []).forEach((item) => {
    if (item.type === EXAM_TYPE.select_answer_paragraph) {
      result.push({
        question: item.parentId,
        answer: {
          text: item.answerSelectedKey
            ? ''
            : item.answers.filter((it) => it.key === item.answerSelectedKey)[0]
                ?.text || '',
        },
        is_true: item.statusAnswerQuestion || false,
      });
    }
    if (item.type === EXAM_TYPE.select_answer_sentence) {
      result.push({
        question: item.parentId,
        answer: {
          text: [
            item.answerSelectedKey
              ? ''
              : item.answers.filter(
                  (it) => it.key === item.answerSelectedKey,
                )[0]?.text || '',
          ],
        },
        is_true: item.statusAnswerQuestion || false,
      });
    }
    if (item.type === EXAM_TYPE.question_with_order) {
      result.push({
        question: item._id,
        answer: item.userOrderAnswer || [],
        is_true: item.statusAnswerQuestion || false,
      });
    }
    if (item.type === EXAM_TYPE.fill_in_blank_sentence) {
      let answer = item?.userAnswers[0]?.text;
      result.push({
        question: item._id,
        answer,
        is_true: item.statusAnswerQuestion || false,
      });
    }
    if (item.type === EXAM_TYPE.fill_in_blank) {
      let answer = [];
      Object.entries(item.correctAnswers).forEach(([key]) => {
        answer.push({
          text: item?.userAnswers[key]?.text || '',
        });
      });
      result.push({
        question: item._id,
        answer,
        is_true: item.statusAnswerQuestion || false,
      });
    }
    if (item.type === EXAM_TYPE.rewrite_base_suggested) {
      result.push({
        question: item._id,
        answer: item.userAnswerText,
        is_true: item.statusAnswerQuestion || false,
      });
    }
    if (
      item.type === EXAM_TYPE.single_choice_inline ||
      item.type === EXAM_TYPE.single_choice_picture
    ) {
      result.push({
        question: item._id,
        answer: (item.idSelected || [])[0] || '',
        is_true: item.statusAnswerQuestion || false,
      });
    }
    if (item.type === EXAM_TYPE.multi_choice_inline) {
      result.push({
        question: item._id,
        answer: item.idSelected || [],
        is_true: item.statusAnswerQuestion || false,
      });
    }
  });
  const dataQuery = {
    test_id: data.test_id,
    result,
  };
  yield call(examAPI.setTestResult, dataQuery);
}
