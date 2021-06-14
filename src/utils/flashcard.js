import shuffle from 'lodash/shuffle';

import {makeid} from '~/utils/utils';
import {translate} from '~/utils/multilanguage';

const getImageDiffInList = (item, pathUsed) => {
  let imageItem = item.images[Math.floor(Math.random() * item.images.length)];
  if (item.images.length <= 1) {
    return imageItem;
  }
  while (imageItem === pathUsed) {
    imageItem = item.images[Math.floor(Math.random() * item.images.length)];
  }
  return imageItem;
};

const generateRandomAnswers = (item, allWords, pathUsed) => {
  const shuffleData = shuffle(allWords);
  const wordIndex = shuffleData.findIndex((o) => o._id === item._id);
  shuffleData.splice(wordIndex, 1);
  const selected = shuffle(shuffleData).slice(0, 3);

  const answers = selected.map((o) => {
    return {
      text: o.name,
      url: o.images[Math.floor(Math.random() * o.images.length)],
      isAnswer: false,
      key: makeid(),
    };
  });
  let pathItemAnswers;
  if (!pathUsed) {
    pathItemAnswers =
      item.images[Math.floor(Math.random() * item.images.length)];
  } else {
    pathItemAnswers = getImageDiffInList(item, pathUsed);
  }
  answers.push({
    text: item.name,
    url: pathItemAnswers,
    isAnswer: true,
    key: makeid(),
  });

  return shuffle(answers);
};

const generateImageCard = (item) => {
  return {
    type: 'flashcard',
    id: 'flashcard_image_' + item._id,
    attachment: {
      type: 'image',
      item: {
        image: item.images[Math.floor(Math.random() * item.images.length)],
        wordMeaning: item.meaning,
        example: item.example,
      },
    },
    mainWord: item.name,
    audio: item.audio_pronunciation,
    pronunciation: item.pronunciation,
    typeWord: item.type,
  };
};

const generateAudioCard = (item) => {
  const audio = item.audios[Math.floor(Math.random() * item.audios.length)];

  return {
    type: 'flashcard',
    id: 'flashcard_audio_' + item._id,
    attachment: {
      type: 'audio',
      item: {
        image: item.images[Math.floor(Math.random() * item.images.length)],
        audio: audio.audio,
        sentence: audio.transcript,
        translation: audio.translation,
      },
    },
    mainWord: item.name,
    audio: item.audio_pronunciation,
    pronunciation: item.pronunciation,
    typeWord: item.type,
  };
};

const generateVideoCard = (item) => {
  const video = item.videos[Math.floor(Math.random() * item.videos.length)];

  return {
    type: 'flashcard',
    id: 'flashcard_video_' + item._id,
    attachment: {
      type: 'video',
      item: {
        video,
        wordMeaning: item.meaning,
        example: item.example,
      },
    },
    mainWord: item.name,
    audio: item.audio_pronunciation,
    pronunciation: item.pronunciation,
    typeWord: item.type,
  };
};

const generateDefinition = (item) => {
  return {
    type: 'flashcard',
    id: 'flashcard_definition_' + item._id,
    attachment: {
      type: 'definition',
      item: {
        background: item.images[Math.floor(Math.random() * item.images.length)],
        wordMeaning: item.meaning,
        example: item.example,
        definition: item.definition,
      },
    },
    mainWord: item.name,
    audio: item.audio_pronunciation,
    pronunciation: item.pronunciation,
    typeWord: item.type,
  };
};

const generateCharacterCard = (item) => {
  return {
    type: 'learn_word_by_flashcard',
    id: 'learn_word_by_flashcard_character_' + item._id,
    mainWord: item.name,
    typeWord: item.type,
    attachment: {
      type: 'word_character_image',
      item: {
        characters: item.name.split('').map((c) => {
          return {
            text: c,
            isAnswer: true,
            key: makeid(),
          };
        }),
        image: item.images[Math.floor(Math.random() * item.images.length)],
      },
    },
    score: 1,
  };
};

const generateListenAndAnswerCard = (item, allWords) => {
  const imagePathBackground =
    item.images[Math.floor(Math.random() * item.images.length)];
  return {
    type: 'learn_word_by_flashcard',
    id: 'learn_word_by_flashcard_listen_' + item._id,
    mainWord: item.name,
    typeWord: item.type,
    attachment: {
      type: 'listen_and_answer',
      item: {
        answers: generateRandomAnswers(item, allWords, imagePathBackground),
        background: imagePathBackground,
        audio: item.audio_pronunciation,
      },
    },
    score: 1,
  };
};

const generateVideoAndAnswerCard = (item, allWords) => {
  return {
    type: 'learn_word_by_flashcard',
    id: 'learn_word_by_flashcard_video_' + item._id,
    mainWord: item.name,
    typeWord: item.type,
    attachment: {
      type: 'video_and_answer',
      item: {
        answers: generateRandomAnswers(item, allWords),
        video: item.videos[Math.floor(Math.random() * item.videos.length)],
      },
    },
    score: 1,
  };
};

const generateQuizAndAnswerCard = (item, allWords) => {
  const quizImageBackground =
    item.images[Math.floor(Math.random() * item.images.length)];
  return {
    type: 'learn_word_by_flashcard',
    id: 'learn_word_by_flashcard_quiz_' + item._id,
    mainWord: item.name,
    typeWord: item.type,
    attachment: {
      type: 'quiz_and_answer',
      item: {
        answers: generateRandomAnswers(item, allWords, quizImageBackground),
        background: quizImageBackground,
        quiz: item.definition || item.example,
      },
    },
    score: 1,
  };
};

const generatePictureAndAnswerCard = (item, allWords) => {
  const backgroundPicAndAnsCard =
    item.images[Math.floor(Math.random() * item.images.length)];
  return {
    type: 'learn_word_by_flashcard',
    id: 'learn_word_by_flashcard_picture_' + item._id,
    typeWord: item.type,
    mainWord: item.name,
    attachment: {
      type: 'picture_and_answer',
      item: {
        answers: generateRandomAnswers(item, allWords, backgroundPicAndAnsCard),
        background: backgroundPicAndAnsCard,
        content: translate('Chọn bức tranh minh họa cho từ: %s', {
          s1: item.name,
        }),
      },
    },
    score: 1,
  };
};

const generateSelectPictureCard = (item, allWords) => {
  const selectPicCardBackground =
    item.images[Math.floor(Math.random() * item.images.length)];
  return {
    type: 'learn_word_by_flashcard',
    id: 'learn_word_by_flashcard_select_picture_' + item._id,
    mainWord: item.name,
    typeWord: item.type,
    attachment: {
      type: 'select_picture',
      item: {
        answers: generateRandomAnswers(item, allWords, selectPicCardBackground),
        background: selectPicCardBackground,
        content: translate('Hãy chọn bức tranh đúng cho từ này'),
        image: item.images[Math.floor(Math.random() * item.images.length)],
      },
    },
    score: 1,
  };
};

const generateSelectPictureListeningCard = (item, allWords) => {
  const imageSelectPicListenCard =
    item.images[Math.floor(Math.random() * item.images.length)];
  return {
    type: 'learn_word_by_flashcard',
    id: 'learn_word_by_flashcard_select_picture_listening_' + item._id,
    mainWord: item.name,
    typeWord: item.type,
    attachment: {
      type: 'select_picture_listening',
      item: {
        answers: generateRandomAnswers(
          item,
          allWords,
          imageSelectPicListenCard,
        ),
        background: imageSelectPicListenCard,
        audio:
          item.audios[Math.floor(Math.random() * item.audios.length)].audio,
      },
    },
    score: 1,
  };
};

const generateSpeakWordCard = (item) => {
  return {
    type: 'learn_word_by_flashcard',
    id: 'learn_word_by_flashcard_speak_word_' + item._id,
    mainWord: item.name,
    typeWord: item.type,
    attachment: {
      type: 'speak_word',
      item: {
        image: item.images[Math.floor(Math.random() * item.images.length)],
        word: item.name,
        audio: item.audio_pronunciation,
      },
    },
    score: 1,
  };
};

const generateSpeakSentenceCard = (item) => {
  const audio = item.audios[Math.floor(Math.random() * item.audios.length)];

  return {
    type: 'learn_word_by_flashcard',
    id: 'learn_word_by_flashcard_speak_sentence_' + item._id,
    mainWord: item.name,
    typeWord: item.type,
    attachment: {
      type: 'speak_sentence',
      item: {
        image: item.images[Math.floor(Math.random() * item.images.length)],
        sentence: audio.transcript,
        audio: audio.audio,
      },
    },
    score: 1,
  };
};

/**
 * 2 familiarization - 3 memorability - 5 practice
 * @param item
 * @param allWords
 * @returns {{practice: *, memorability: *, familiarization: *}}
 */
export const generateWordData = (item, allWords) => {
  const familiarization = [],
    memorability = [],
    practice = [];

  // 2 familiarization
  familiarization.push(generateImageCard(item));
  familiarization.push(generateAudioCard(item));

  // 3 memorability
  memorability.push(generateVideoCard(item));

  if (item.definition) {
    memorability.push(generateDefinition(item));
  }

  // 5 practice
  const typeArray = item.definition
    ? [
        'picture_character',
        'listen_and_answer',
        'video_and_answer',
        'quiz_and_answer',
        'picture_and_answer',
        'select_picture',
        'select_picture_listening',
        'speak_word',
        // 'speak_sentence',
      ]
    : [
        'picture_character',
        'listen_and_answer',
        'video_and_answer',
        'picture_and_answer',
        'select_picture',
        'select_picture_listening',
        'speak_word',
        // 'speak_sentence',
      ];

  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * typeArray.length);
    const type = typeArray[randomIndex];
    typeArray.splice(randomIndex, 1);

    switch (type) {
      case 'picture_character':
        practice.push(generateCharacterCard(item));
        break;
      case 'listen_and_answer':
        practice.push(generateListenAndAnswerCard(item, allWords));
        break;
      case 'video_and_answer':
        practice.push(generateVideoAndAnswerCard(item, allWords));
        break;
      case 'quiz_and_answer':
        practice.push(generateQuizAndAnswerCard(item, allWords));
        break;
      case 'picture_and_answer':
        practice.push(generatePictureAndAnswerCard(item, allWords));
        break;
      case 'select_picture':
        practice.push(generateSelectPictureCard(item, allWords));
        break;
      case 'select_picture_listening':
        practice.push(generateSelectPictureListeningCard(item, allWords));
        break;
      case 'speak_word':
        practice.push(generateSpeakWordCard(item));
        break;
      case 'speak_sentence':
        practice.push(generateSpeakSentenceCard(item));
        break;
      default:
        break;
    }
  }

  return {
    familiarization,
    memorability,
    practice,
  };
};

export const generateAllWordData = (allWords) => {
  const data = [];
  const allWordData = allWords.map((item) => generateWordData(item, allWords));
  const totalGroup = Math.ceil(allWordData.length / 2);
  const doubleGroup = totalGroup * 2;
  const totalLoop = totalGroup * 5;

  for (let i = 0; i < totalLoop; i++) {
    let wordIndex = i % doubleGroup;
    wordIndex = wordIndex % 2 === 0 ? wordIndex : wordIndex - 1;
    const wordVisit = 2 * Math.floor(i / doubleGroup) + (i % 2);

    if (allWordData[wordIndex]) {
      if (allWordData[wordIndex].familiarization[wordVisit]) {
        data.push(allWordData[wordIndex].familiarization[wordVisit]);
      }

      if (allWordData[wordIndex].memorability[wordVisit]) {
        data.push(allWordData[wordIndex].memorability[wordVisit]);
      }

      if (allWordData[wordIndex].practice[wordVisit]) {
        data.push(allWordData[wordIndex].practice[wordVisit]);
      }
    }

    if (allWordData[wordIndex + 1]) {
      if (allWordData[wordIndex + 1].familiarization[wordVisit]) {
        data.push(allWordData[wordIndex + 1].familiarization[wordVisit]);
      }

      if (allWordData[wordIndex + 1].memorability[wordVisit]) {
        data.push(allWordData[wordIndex + 1].memorability[wordVisit]);
      }

      if (allWordData[wordIndex + 1].practice[wordVisit]) {
        data.push(allWordData[wordIndex + 1].practice[wordVisit]);
      }
    }
  }

  return data;
};
