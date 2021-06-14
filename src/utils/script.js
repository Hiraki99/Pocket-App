import random from 'lodash/random';

import {
  changeCurrentScriptItem,
  pushAction,
  answerQuestion,
  // pushScriptItemSpeak,
} from '~/features/script/ScriptAction';
import navigator from '~/navigation/customNavigator';
import * as emotions from '~/constants/emotions';
import {makeAction} from '~/utils/action';
import * as actionTypes from '~/constants/actionTypes';
import {fetchWordGroup} from '~/features/vocalbulary/VocabularyAction';
// import activityApi from '~/features/activity/ActivityApi';
import {addQuestionInHighlightOrStrike, makeid} from '~/utils/utils';
import {translate} from '~/utils/multilanguage';

let store = null;

export const setStoreScript = (initstore) => {
  store = initstore;
};

export const getStore = () => {
  return store;
};

const processEndScript = (waiting) => {
  setTimeout(() => {
    if (store) {
      const state = store.getState();
      const {script} = state;
      const {totalCorrect, totalWrong} = script;
      const total = totalWrong + totalCorrect;
      if (total !== 0 && totalCorrect / total >= 0.9) {
        navigator.navigate('ActivityFinished');
      } else {
        navigator.navigate('ActivityBoard');
      }
    }
  }, waiting);
};
export const navigateToCurrentScriptScreen = (currentItem, waiting = 0) => {
  switch (currentItem.type) {
    case 'listen_answer_question_with_order':
      if (navigator.getCurrentRoute() !== 'ListenAnswerQuestionWithOrders') {
        setTimeout(() => {
          navigator.navigate('ListenAnswerQuestionWithOrders');
        }, waiting);
      }
      break;
    case 'listen_choose_correct_pictures':
      if (navigator.getCurrentRoute() !== 'ListenChoosePicture') {
        setTimeout(() => {
          navigator.navigate('ListenChoosePicture');
        }, waiting);
      }
      break;
    case 'listen_single_choice':
    case 'listen_multi_choice':
      if (navigator.getCurrentRoute() !== 'ListeningSingleChoice') {
        setTimeout(() => {
          navigator.navigate('ListeningSingleChoice');
        }, waiting);
      }
      break;
    default:
      navigator.navigate('MainScript');
  }
};
export const generateNextActivity = async (
  delay = 500,
  waiting = 0,
  isGenerateAtFirst = false,
) => {
  const state = store.getState();
  const {activity, script} = state;
  const {currentActivity, skipGenerateActivityAtFirst} = activity;
  const {currentScriptItem} = script;
  const scripts = currentActivity.script;

  if (isGenerateAtFirst) {
    if (
      skipGenerateActivityAtFirst &&
      skipGenerateActivityAtFirst === currentActivity._id
    ) {
      navigateToCurrentScriptScreen();
      return;
    }
  }

  let index = -1;

  if (currentScriptItem) {
    index = scripts.findIndex((item) => item.id === currentScriptItem.id);
  }

  if (index === scripts.length - 1) {
    if (currentActivity && currentActivity.scriptInType === 'live_result') {
      return;
    }
    if (currentScriptItem && currentScriptItem.scriptInType === 'live') {
      if (navigator.getCurrentRoute() !== 'ScriptAchievement') {
        navigator.navigate('ScriptAchievement');
      }
      return;
    }
    processEndScript(waiting);
  } else {
    let nextScriptItem = scripts[index + 1];

    if (nextScriptItem.type === 'common_highlight_or_strikethrough_sentence') {
      nextScriptItem = addQuestionInHighlightOrStrike(nextScriptItem);
    }

    if (nextScriptItem.type === 'common_highlight_or_strikethrough_paragraph') {
      const sentences = nextScriptItem.question
        .split('\n')
        .filter((item) => item.length > 0);
      const items = sentences.map((item) => {
        return {
          key: makeid(16),
          question: item,
        };
      });
      nextScriptItem = addQuestionInHighlightOrStrike({
        ...nextScriptItem,
        items,
      });
    }
    store.dispatch(changeCurrentScriptItem(nextScriptItem));
    if (nextScriptItem.word_group) {
      store.dispatch(
        fetchWordGroup({word_group_id: nextScriptItem.word_group._id}),
      );
    }

    switch (nextScriptItem.type) {
      case 'sentence':
        if (nextScriptItem.scriptInType === 'live') {
          if (navigator.getCurrentRoute() !== 'MainScript') {
            navigator.navigate('MainScript');
          }
          break;
        }
        navigator.navigate('Sentence');
        break;
      case 'water_up_new':
        navigator.navigate('GameWater');
        break;
      case 'conversation':
        navigator.navigate('Conversation');
        break;
      case 'listen_and_answer':
        processListenAndAnswer(nextScriptItem);
        break;
      case 'summary_review':
        if (navigator.getCurrentRoute() !== 'SummaryReview') {
          navigator.navigate('SummaryReview');
        }
        return;
      case 'summary_vocabulary':
        if (navigator.getCurrentRoute() !== 'SummaryVocabulary') {
          navigator.navigate('SummaryVocabulary');
        }
        return;
      case 'single_choice_inline':
        if (navigator.getCurrentRoute() !== 'MainScript') {
          navigator.navigate('MainScript');
        }

        const action = makeAction(
          actionTypes.SINGLE_CHOICE_INLINE,
          nextScriptItem,
          delay,
        );

        store.dispatch(pushAction(action, true));
        break;
      case 'multi_choice_inline':
        if (navigator.getCurrentRoute() !== 'MainScript') {
          navigator.navigate('MainScript');
        }

        const multiChoiceAction = makeAction(
          actionTypes.MULTI_CHOICE_INLINE,
          nextScriptItem,
          delay,
        );

        store.dispatch(pushAction(multiChoiceAction, true));
        break;
      case 'listen_and_speak_word':
      case 'listen_and_speak_sentence':
        if (navigator.getCurrentRoute() !== 'MainScript') {
          navigator.navigate('MainScript');
        }

        const listenAndSpeakAction = makeAction(
          actionTypes.LISTEN_AND_SPEAK,
          nextScriptItem,
          delay,
        );

        store.dispatch(pushAction(listenAndSpeakAction, true));
        break;

      case 'speaking_stress_word_inline':
      case 'speaking_stress_sentence_inline':
      case 'speaking_intonation_inline':
      case 'speaking_linking_sound_inline':
        if (navigator.getCurrentRoute() !== 'MainScript') {
          navigator.navigate('MainScript');
        }
        const speakStressAction = makeAction(
          actionTypes.SPEAKING_STRESS,
          nextScriptItem,
          delay,
        );
        store.dispatch(pushAction(speakStressAction, true));
        break;

      case 'answer_question_writing':
        if (navigator.getCurrentRoute() !== 'MainScript') {
          navigator.navigate('MainScript');
        }

        const answerQuestionWritingAction = makeAction(
          actionTypes.ANSWER_QUESTION_WRITING,
          nextScriptItem,
          delay,
        );

        store.dispatch(pushAction(answerQuestionWritingAction, true));
        break;

      case 'answer_question_with_given_words':
        if (navigator.getCurrentRoute() !== 'MainScript') {
          navigator.navigate('MainScript');
        }

        const aqGivenWordsAction = makeAction(
          actionTypes.ANSWER_QUESTION_WITH_GIVEN_WORDS,
          nextScriptItem,
          delay,
        );

        store.dispatch(pushAction(aqGivenWordsAction, true));
        break;
      case 'answer_question_picture':
        if (navigator.getCurrentRoute() !== 'MainScript') {
          navigator.navigate('MainScript');
        }

        const aqGivenImagesAction = makeAction(
          actionTypes.ANSWER_QUESTION_WITH_GIVEN_IMAGES,
          nextScriptItem,
          delay,
        );

        store.dispatch(pushAction(aqGivenImagesAction, true));
        break;
      case 'speaking_coach_introduction':
        if (navigator.getCurrentRoute() !== 'MainScript') {
          navigator.navigate('MainScript');
        }
        processListenAndPractice(nextScriptItem);
        break;
      case 'speaking_coach_sentence':
        if (navigator.getCurrentRoute() !== 'MainScript') {
          navigator.navigate('MainScript');
        }
        const speakingCoachSentenceAction = makeAction(
          actionTypes.SPEAK_COACH_SENTENCE,
          nextScriptItem,
          delay,
        );

        store.dispatch(pushAction(speakingCoachSentenceAction, true));
        break;
      case 'speaking_coach_word':
        if (navigator.getCurrentRoute() !== 'MainScript') {
          navigator.navigate('MainScript');
        }
        const speakingCoachWordAction = makeAction(
          actionTypes.SPEAK_COACH_WORD,
          nextScriptItem,
          delay,
        );
        store.dispatch(pushAction(speakingCoachWordAction, true));
        break;
      case 'flashcard':
      case 'learn_word_by_flashcard':
        if (navigator.getCurrentRoute() !== 'Flashcard') {
          setTimeout(() => {
            navigator.navigate('Flashcard');
          }, waiting);
        }
        break;
      case 'flashcard_new':
        if (navigator.getCurrentRoute() !== 'FlashcardCollection') {
          setTimeout(() => {
            navigator.navigate('FlashcardCollection');
          }, waiting);
        }
        break;
      case 'speaking_roleplay':
      case 'speaking_roleplay_vip':
        if (navigator.getCurrentRoute() !== 'Roleplay') {
          setTimeout(() => {
            navigator.navigate('Roleplay');
          }, waiting);
        }
        break;
      case 'fill_in_blank_with_given_words':
        if (navigator.getCurrentRoute() !== 'FillInBlankWithGivenWords') {
          setTimeout(() => {
            navigator.navigate('FillInBlankWithGivenWords');
          }, waiting);
        }
        break;
      case 'fill_in_blank_writing':
        if (navigator.getCurrentRoute() !== 'FillInBlankWriting') {
          setTimeout(() => {
            navigator.navigate('FillInBlankWriting');
          }, waiting);
        }
        break;
      case 'fill_in_blank_multi_part':
        if (navigator.getCurrentRoute() !== 'FillInBlankMultiPart') {
          setTimeout(() => {
            navigator.navigate('FillInBlankMultiPart');
          }, waiting);
        }
        break;
      case 'listen_single_choice':
      case 'listen_multi_choice':
        if (navigator.getCurrentRoute() !== 'ListeningSingleChoice') {
          setTimeout(() => {
            navigator.navigate('ListeningSingleChoice');
          }, waiting);
        }
        break;
      case 'common_answer_all_questions':
        if (navigator.getCurrentRoute() !== 'CommonAnswerAllQuestions') {
          setTimeout(() => {
            navigator.navigate('CommonAnswerAllQuestions');
          }, waiting);
        }
        break;
      case 'reading_answer_questions':
        if (navigator.getCurrentRoute() !== 'ReadingAnswerQuestions') {
          setTimeout(() => {
            navigator.navigate('ReadingAnswerQuestions');
          }, waiting);
        }
        break;
      case 'reading_matching':
        if (navigator.getCurrentRoute() !== 'ReadingMatching') {
          setTimeout(() => {
            navigator.navigate('ReadingMatching');
          }, waiting);
        }
        break;
      case 'fill_in_blank_paragraph_with_given_words':
        if (
          navigator.getCurrentRoute() !== 'FillInBlankParagraphWithGivenWords'
        ) {
          setTimeout(() => {
            navigator.navigate('FillInBlankParagraphWithGivenWords');
          }, waiting);
        }
        break;
      case 'fill_in_blank_paragraph_writing':
        if (navigator.getCurrentRoute() !== 'FillInBlankParagraphWriting') {
          setTimeout(() => {
            navigator.navigate('FillInBlankParagraphWriting');
          }, waiting);
        }
        break;
      case 'match_expression_with_picture':
        if (
          navigator.getCurrentRoute() !== 'CommonMatchExpressionWithPictures'
        ) {
          setTimeout(() => {
            navigator.navigate('CommonMatchExpressionWithPictures');
          }, waiting);
        }
        break;
      case 'fill_in_blank_paragraph_choose_correct_words':
        if (
          navigator.getCurrentRoute() !==
          'FillInBlankParagraphChooseCorrectWords'
        ) {
          setTimeout(() => {
            navigator.navigate('FillInBlankParagraphChooseCorrectWords');
          }, waiting);
        }
        break;
      case 'pronounciation_syllable_highlight':
        if (navigator.getCurrentRoute() !== 'PronunciationSyllableHighlight') {
          setTimeout(() => {
            navigator.navigate('PronunciationSyllableHighlight');
          }, waiting);
        }
        break;
      case 'vocabulary_picture_scatter':
        if (navigator.getCurrentRoute() !== 'VocabularyPictureScatter') {
          setTimeout(() => {
            navigator.navigate('VocabularyPictureScatter');
          }, waiting);
        }
        break;
      case 'common_matching':
        if (navigator.getCurrentRoute() !== 'CommonMatching') {
          setTimeout(() => {
            navigator.navigate('CommonMatching');
          }, waiting);
        }
        break;
      case 'listen_answer_question_with_order':
        if (navigator.getCurrentRoute() !== 'ListenAnswerQuestionWithOrders') {
          setTimeout(() => {
            navigator.navigate('ListenAnswerQuestionWithOrders');
          }, waiting);
        }
        break;
      case 'vocabulary_word_meditation':
        if (navigator.getCurrentRoute() !== 'VocabularyWordMeditation') {
          setTimeout(() => {
            navigator.navigate('VocabularyWordMeditation');
          }, waiting);
        }
        break;
      case 'video_speaking_answer':
      case 'audio_speaking_answer':
        if (navigator.getCurrentRoute() !== 'VideoSpeakerAnswer') {
          setTimeout(() => {
            navigator.navigate('VideoSpeakerAnswer');
          }, waiting);
        }
        break;
      case 'vocabulary_match_words_with_definitions':
        if (
          navigator.getCurrentRoute() !== 'VocabularyMatchWordsWithDefinition'
        ) {
          setTimeout(() => {
            navigator.navigate('VocabularyMatchWordsWithDefinition');
          }, waiting);
        }
        break;
      case 'common_highlight_or_strikethrough_sentence':
        if (navigator.getCurrentRoute() !== 'CommonHighlightOrStrike') {
          setTimeout(() => {
            navigator.navigate('CommonHighlightOrStrike');
          }, waiting);
        }
        break;
      case 'common_highlight_or_strikethrough_paragraph':
        if (
          navigator.getCurrentRoute() !== 'CommonHighlightOrStrikeParagraph'
        ) {
          setTimeout(() => {
            navigator.navigate('CommonHighlightOrStrikeParagraph');
          }, waiting);
        }
        break;
      case 'listen_choose_correct_pictures':
        if (navigator.getCurrentRoute() !== 'ListenChoosePicture') {
          setTimeout(() => {
            navigator.navigate('ListenChoosePicture');
          }, waiting);
        }
        break;
      case 'listen_and_speak_word_full':
        if (navigator.getCurrentRoute() !== 'ListenSpeakWord') {
          setTimeout(() => {
            navigator.navigate('ListenSpeakWord');
          }, waiting);
        }
        break;
      case 'listen_and_speak_sentence_full':
        if (navigator.getCurrentRoute() !== 'ListenSpeakSentence') {
          setTimeout(() => {
            navigator.navigate('ListenSpeakSentence');
          }, waiting);
        }
        break;
      case 'look_and_trace':
        if (navigator.getCurrentRoute() !== 'LookAndTrace') {
          setTimeout(() => {
            navigator.navigate('LookAndTrace');
          }, waiting);
        }
        break;
      case 'look_and_write':
        if (navigator.getCurrentRoute() !== 'LookAndWrite') {
          setTimeout(() => {
            navigator.navigate('LookAndWrite');
          }, waiting);
        }
        break;
      case 'listen_and_repeat':
        if (navigator.getCurrentRoute() !== 'PrimaryListenAndRepeat') {
          setTimeout(() => {
            navigator.navigate('PrimaryListenAndRepeat');
          }, waiting);
        }
        break;
      case 'lets_talk':
        if (navigator.getCurrentRoute() !== 'PrimaryLetTalk') {
          setTimeout(() => {
            navigator.navigate('PrimaryLetTalk');
          }, waiting);
        }
        break;
      case 'listen_and_number':
        if (navigator.getCurrentRoute() !== 'PrimaryListenAndNumber') {
          setTimeout(() => {
            navigator.navigate('PrimaryListenAndNumber');
          }, waiting);
        }
        break;
      case 'look_listen_and_repeat_sentence':
        if (
          navigator.getCurrentRoute() !== 'PrimaryLookListenAndRepeatSentence'
        ) {
          setTimeout(() => {
            navigator.navigate('PrimaryLookListenAndRepeatSentence');
          }, waiting);
        }
        break;
      case 'point_and_say_bubble':
        if (navigator.getCurrentRoute() !== 'PrimaryPointAndSayBubble') {
          setTimeout(() => {
            navigator.navigate('PrimaryPointAndSayBubble');
          }, waiting);
        }
        break;
      case 'read_and_match_text':
        if (navigator.getCurrentRoute() !== 'PrimaryReadAndMatchText') {
          setTimeout(() => {
            navigator.navigate('PrimaryReadAndMatchText');
          }, waiting);
        }
        break;
      case 'listen_and_write':
        if (navigator.getCurrentRoute() !== 'PrimaryListenAndWrite') {
          setTimeout(() => {
            navigator.navigate('PrimaryListenAndWrite');
          }, waiting);
        }
        break;
      case 'read_and_complete':
        if (navigator.getCurrentRoute() !== 'PrimaryReadAndComplete') {
          setTimeout(() => {
            navigator.navigate('PrimaryReadAndComplete');
          }, waiting);
        }
        break;
      case 'write_something':
        if (navigator.getCurrentRoute() !== 'PrimaryWriteSomething') {
          setTimeout(() => {
            navigator.navigate('PrimaryWriteSomething');
          }, waiting);
        }
        break;
      case 'choose_answer_for_image':
        if (navigator.getCurrentRoute() !== 'PrimaryChooseAnswerForImage') {
          setTimeout(() => {
            navigator.navigate('PrimaryChooseAnswerForImage');
          }, waiting);
        }
        break;
      case 'listen_and_check':
      case 'read_and_tick':
        if (navigator.getCurrentRoute() !== 'PrimaryListenAndTick') {
          setTimeout(() => {
            navigator.navigate('PrimaryListenAndTick');
          }, waiting);
        }
        break;
      case 'listen_and_tick_or_cross':
        if (navigator.getCurrentRoute() !== 'PrimaryListenAndTickOrCross') {
          setTimeout(() => {
            navigator.navigate('PrimaryListenAndTickOrCross');
          }, waiting);
        }
        break;
      case 'listen_and_point':
        if (navigator.getCurrentRoute() !== 'PrimaryListenAndPoint') {
          setTimeout(() => {
            navigator.navigate('PrimaryListenAndPoint');
          }, waiting);
        }
        break;
      case 'point_and_say':
        if (navigator.getCurrentRoute() !== 'PrimaryPointAnSay') {
          setTimeout(() => {
            navigator.navigate('PrimaryPointAnSay');
          }, waiting);
        }
        break;
      case 'listen_and_chant':
        if (navigator.getCurrentRoute() !== 'PrimaryListenAndChant') {
          setTimeout(() => {
            navigator.navigate('PrimaryListenAndChant');
          }, waiting);
        }
        break;
      case 'listen_and_repeat_letter_word_sentence':
        if (navigator.getCurrentRoute() !== 'PrimaryListenAndRepeatLetter') {
          setTimeout(() => {
            navigator.navigate('PrimaryListenAndRepeatLetter');
          }, waiting);
        }
        break;
      case 'lets_sing':
        if (navigator.getCurrentRoute() !== 'PrimaryLetsSing') {
          setTimeout(() => {
            navigator.navigate('PrimaryLetsSing');
          }, waiting);
        }
        break;
      case 'let_talk_conversation':
        if (navigator.getCurrentRoute() !== 'PrimaryLetTalkConversation') {
          setTimeout(() => {
            navigator.navigate('PrimaryLetTalkConversation');
          }, waiting);
        }
        break;
      case 'lets_talk_with_situation':
        if (navigator.getCurrentRoute() !== 'PrimaryLetsTalkWithSituations') {
          setTimeout(() => {
            navigator.navigate('PrimaryLetsTalkWithSituations');
          }, waiting);
        }
        break;
      case 'find_the_words':
        if (navigator.getCurrentRoute() !== 'PrimaryFindTheWords') {
          setTimeout(() => {
            navigator.navigate('PrimaryFindTheWords');
          }, waiting);
        }
        break;
      case 'look_listen_and_number':
        if (navigator.getCurrentRoute() !== 'PrimaryLookListenAndNumber') {
          setTimeout(() => {
            navigator.navigate('PrimaryLookListenAndNumber');
          }, waiting);
        }
        break;
      //  PrimaryLetsTalkWithSituationsScreen let_talk_conversation find_the_words
      default:
        break;
    }
  }
};

export const addAction = (action, resetWrong = false) => {
  store.dispatch(pushAction(action, resetWrong));
};

/*
 * Block Listen and Answer
 */
const processListenAndPractice = (nextScriptItem) => {
  const introductionListenAndPractice = makeAction(
    actionTypes.SPEAK_COACH_INTRODUCTION,
    nextScriptItem,
  );

  store.dispatch(pushAction(introductionListenAndPractice, true));
};

const processListenAndAnswer = (nextScriptItem) => {
  const action1 = makeAction(actionTypes.INLINE_SENTENCE, {
    content: translate(
      'Chuẩn bị nghe bây giờ nhé! Ta sẽ nghe không phụ đề trước. Bấm OK để bắt đầu nhé bạn!',
    ),
  });

  navigator.navigate('MainScript');
  store.dispatch(pushAction(action1));

  const action2 = makeAction(
    actionTypes.INLINE_ACTION,
    {
      content: translate('OK, Mình đã sẵn sàng!'),
      action: () => {
        const inlineAudio = makeAction(
          actionTypes.INLINE_AUDIO,
          nextScriptItem,
        );

        store.dispatch(pushAction(inlineAudio));
      },
    },
    1000,
  );

  store.dispatch(pushAction(action2));
};

export const processListenAndAnswerGoToTest = () => {
  const action = makeAction(actionTypes.INLINE_SENTENCE, {
    content: translate(
      'Good! Bây giờ hãy trả lời các câu hỏi để chúng ta cùng xem bạn hiểu bài nghe đến đâu nhé!',
    ),
  });

  store.dispatch(pushAction(action));

  const inlineAction = makeAction(actionTypes.INLINE_ACTION, {
    content: translate('OK, mình sẵn sàng!'),
    action: () => generateNextActivity(),
  });

  store.dispatch(pushAction(inlineAction));
};

/*
 * Block Process user's answer
 */
export const processUserAnswer = (
  isCorrect,
  score = 0,
  canRetry = false,
  callback = null,
  // eslint-disable-next-line no-unused-vars
  type = null,
  userAnswer = null,
) => {
  const state = store.getState();
  const {script} = state;

  const {currentCorrectCount, currentWrongCount} = script;
  const showImage = random(0, 100) >= 0;

  let textAction;
  let imageAction = null;
  let text,
    image = null;

  let emotionResults = null;

  if (isCorrect) {
    if (currentCorrectCount === 0) {
      if (currentWrongCount === 0) {
        emotionResults = emotions.oneCorrect;
      } else if (currentWrongCount === 1) {
        emotionResults = emotions.oneWrongToCorrect;
      } else {
        emotionResults = emotions.oneCorrect;
      }
    } else if (currentCorrectCount === 1) {
      emotionResults = emotions.twoCorrect;
    } else {
      emotionResults = emotions.threeCorrect;
    }
  } else {
    if (!canRetry) {
      emotionResults = emotions.threeWrong;
    } else if (currentWrongCount === 0) {
      emotionResults = emotions.oneWrong;
    } else if (currentWrongCount === 1) {
      emotionResults = emotions.twoWrong;
    } else {
      emotionResults = emotions.threeWrong;
    }
  }

  text =
    emotionResults.text[Math.floor(Math.random() * emotionResults.text.length)];

  if (showImage) {
    image =
      emotionResults.image[
        Math.floor(Math.random() * emotionResults.image.length)
      ];
    imageAction = makeAction(
      actionTypes.INLINE_EMOTION,
      {
        image,
      },
      500,
    );

    store.dispatch(pushAction(imageAction));
  }

  textAction = makeAction(
    actionTypes.INLINE_SENTENCE,
    {
      content: text,
      score: isCorrect ? score : 0,
    },
    showImage ? 1500 : 1000,
  );

  store.dispatch(pushAction(textAction));

  // todo dispatch changes and next
  store.dispatch(answerQuestion(isCorrect, score, canRetry));
  if (isCorrect) {
    generateNextActivity(showImage ? 3000 : 2500, 5000);
  } else {
    if (canRetry && currentWrongCount < 2) {
      if (callback) {
        callback();
      }
    } else {
      // todo show correct answer
      showCorrectAnswer(showImage, userAnswer);
      setTimeout(() => {
        // todo show next action
        generateNextActivity(showImage ? 3500 : 8000, 8000);
      }, 3000);
    }
  }
};

const showCorrectAnswer = (showImage, userAnswer) => {
  const state = store.getState();
  const {script} = state;

  const {currentScriptItem} = script;
  switch (currentScriptItem.type) {
    case 'single_choice_inline':
      const correctAnswer = currentScriptItem.options.find(
        (item) => item.isAnswer === true,
      );

      if (correctAnswer) {
        const action = makeAction(
          actionTypes.INLINE_SENTENCE,
          {
            content: correctAnswer.text,
          },
          showImage ? 3500 : 3000,
        );

        store.dispatch(pushAction(action));
      }
      break;

    case 'multi_choice_inline':
      const action = makeAction(
        actionTypes.MULTI_CHOICE_INLINE,
        {
          ...currentScriptItem,
          showResult: true,
        },
        showImage ? 3500 : 3000,
      );

      store.dispatch(pushAction(action));
      break;

    case 'answer_question_with_given_words':
      const aqAction = makeAction(
        actionTypes.ANSWER_QUESTION_WITH_GIVEN_WORDS,
        {
          ...currentScriptItem,
          showResult: true,
        },
        showImage ? 3500 : 3000,
      );

      store.dispatch(pushAction(aqAction));
      break;

    case 'answer_question_writing':
      const aqwAction = makeAction(
        actionTypes.ANSWER_QUESTION_WRITING,
        {
          ...currentScriptItem,
          showResult: true,
          userAnswer,
        },
        showImage ? 1500 : 1000,
      );

      store.dispatch(pushAction(aqwAction));
      break;
    case 'answer_question_picture':
      const correctAPQAnswer = currentScriptItem.answers.find(
        (item) => item.isAnswer === true,
      );
      const aqpAction = makeAction(
        actionTypes.INLINE_IMAGE,
        {
          isUser: false,
          image: correctAPQAnswer.url,
          showResult: true,
          userAnswer,
        },
        showImage ? 1500 : 1000,
      );
      setTimeout(() => {
        store.dispatch(pushAction(aqpAction));
      }, 2000);
      break;
  }
};

export const dispatchAnswerQuestion = (
  isCorrect,
  score,
  canRetry = false,
  extraData = null,
) => store.dispatch(answerQuestion(isCorrect, score, canRetry, extraData));

export const processUserDoneActivity = (
  currentStep = 'ActivityBoard',
  showUpLevel = false,
) => {
  if (showUpLevel) {
    navigator.navigate('UpLevel');
  } else {
    const state = store.getState();
    const {
      progress,
      activity: {screenActivity},
    } = state;
    const {perfectScoreStreak} = progress;
    const steps = [
      'ActivityBoard',
      'UpLevel',
      'PerfectScoreStreak',
      'DoneFiveActivity',
      'DoneLesson',
      'DoneCourse',
    ];

    const index = steps.indexOf(currentStep);

    if (perfectScoreStreak && index < steps.indexOf('PerfectScoreStreak')) {
      navigator.navigate('PerfectScoreStreak');
      return;
    }
    if (screenActivity) {
      navigator.navigate(screenActivity);
      return;
    }
    navigator.navigate('Activity');
  }
};
