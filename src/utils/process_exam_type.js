import {STATUS_QUESTION} from '~/constants/testData';
import {makeid, matchAllRegex, normalizeText} from '~/utils/utils';

const split = require('lodash/split');

const SelectAnswerParagraph = (
  examQuestion,
  indexQuestion,
  indexList,
  partId,
) => {
  let indexNewQuestion = indexQuestion;

  const sentences = examQuestion.question.split('\n');

  let renderQuestionParagraph = [];

  let childIdsQuestion = [];
  let questionParagraphDetail = {};
  sentences.forEach((question) => {
    let renderQuestion = [];
    if (!question) {
      return;
    }
    const lengthQuestion = question.length;
    const findRegex = /\[.*?]/g;
    const corrects = question.match(findRegex);

    if (!corrects || (corrects && corrects.length === 0)) {
      const words = question.split(' ');
      words.forEach((i) => {
        renderQuestion.push({
          text: i,
          key: makeid(16),
        });
      });
      renderQuestionParagraph.push({
        renderQuestion,
        id: makeid(32),
      });
      return;
    }
    corrects.forEach((item, index) => {
      let answers = [];
      const itemLength = item.length;
      const indexItem = question.indexOf(item);
      const indexNextItem = corrects[index + 1]
        ? question.indexOf(corrects[index + 1])
        : lengthQuestion;
      // add dau doan van
      if (indexItem !== 0 && index === 0) {
        const beginParagraph = question.slice(0, indexItem).split(' ');
        beginParagraph.forEach((i) => {
          renderQuestion.push({
            text: i,
            key: makeid(16),
          });
        });
      }
      const matches = item.match(/\[(.*?)]/);
      const matchesCorrect = item.match(/\((.*?)\)/);

      split(matches[1], '/').forEach((ops, ind) => {
        const text = ops.trim().replace('(', '').replace(')', '');
        answers.push({
          key: makeid(16),
          text: text,
          label: String.fromCharCode(65 + ind),
          isAnswer: matchesCorrect && matchesCorrect[1] === text,
        });
      });
      // add question doan van
      const questionMatching = {
        text: item,
        textHide: '________',
        key: makeid(16),
        answers,
        display_type: examQuestion.display_type,
        indexList,
        parentId: examQuestion._id,
        type: examQuestion.type,
        partId,
        indexQuestion: indexNewQuestion,
        status: STATUS_QUESTION.NEW,
      };
      renderQuestion.push(questionMatching);
      childIdsQuestion.push(questionMatching.key);
      questionParagraphDetail = {
        ...questionParagraphDetail,
        [questionMatching.key]: questionMatching,
      };
      // add cuoi doan van
      if (index === corrects.length - 1) {
        const endParagraph = question.slice(indexItem + itemLength).split(' ');
        endParagraph.forEach((i) => {
          renderQuestion.push({
            text: i,
            key: makeid(16),
          });
        });
      } else {
        const midParagraph = question
          .slice(indexItem + itemLength, indexNextItem)
          .split(' ');
        midParagraph.forEach((i) => {
          renderQuestion.push({
            text: i,
            key: makeid(16),
          });
        });
      }
      if (corrects.length > 1) {
        indexNewQuestion += 1;
      }
    });
    renderQuestionParagraph.push({
      renderQuestion,
      id: makeid(32),
    });
  });

  return {
    infoParagraphQuestion: {
      ...examQuestion,
      renderQuestion: renderQuestionParagraph,
      childIdsQuestion,
      firstQuestion: indexQuestion,
      indexQuestion: indexNewQuestion,
      partId,
    },
    questionParagraphDetail,
    indexQuestion: indexNewQuestion,
  };
};

export const QuestionFillInBlankSentence = (data) => {
  const pronunciationRegex = /[[.*?]]/g;
  const correctAnswers = data.answer.split('/').map((item) => item.trim());
  const listMatchAll = matchAllRegex(pronunciationRegex, data.question || '');
  return {...data, listMatchAll, correctAnswers, userAnswers: {}};
};

export const QuestionFillInBlankParagraph = (data) => {
  const pronunciationRegex = /\[.*?\]/g;
  const listMatchAll = matchAllRegex(pronunciationRegex, data.question || '');
  let correctAnswers = {};
  listMatchAll.forEach((it, index) => {
    correctAnswers = {
      ...correctAnswers,
      [index]: {
        index,
        text: normalizeText(it[0]).replace('[', '').replace(']', ''),
      },
    };
  });
  return {...data, listMatchAll, correctAnswers, userAnswers: {}};
};

export default {
  SelectAnswerParagraph,
  QuestionFillInBlankSentence,
  QuestionFillInBlankParagraph,
};
