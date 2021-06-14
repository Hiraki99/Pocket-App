import {shuffle, truncate} from 'lodash';
import moment from 'moment';
import Sound from 'react-native-sound';

import {THRESHOLD} from '~/constants/threshold';
import audios from '~/themes/audios';

let listAudio = {};

export const getRangeTime = (publishDate) => {
  const now = new Date();
  const from = new Date(publishDate);
  const range = Math.floor((now.getTime() - from.getTime()) / 60000);

  if (range < 1) {
    return 'vừa xong';
  }
  if (range < 60) {
    return `${range} phút trước`;
  }

  if (range < 1440) {
    return `${Math.floor(range / 60)} giờ trước`;
  }
  const day = Math.floor(range / 1440);

  if (day < 2) {
    return 'ngày hôm qua';
  }
  if (day < 7) {
    return `${day} ngày trước`;
  }
  if (day < 30) {
    return `${Math.floor(day / 7)} tuần trước`;
  }

  const month = Math.floor(day / 30);
  if (month < 2) {
    return 'tháng trước';
  }
  if (month < 12) {
    return `${month} tháng trước`;
  }
  return `${Math.floor(month / 12)} năm trước`;
};

export const formatNumber = (num) => {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
};

export const truncateStr = (str, maxLength = 100) => {
  return truncate(str, {
    length: maxLength,
    separator: ' ',
    omission: '...',
  });
};

export const formatsMinuteOptions = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes < 10 ? `0${minutes}` : minutes}:${
    seconds < 10 ? `0${seconds}` : seconds
  }`;
};

export const makeid = (length = 30) => {
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
//
export const makeStreakLogin = () => [
  {
    text: 'cn',
    time: moment().weekday(0).startOf('d').valueOf(),
    is_today: moment().weekday(0).startOf('d') - moment().startOf('d') === 0,
    is_next: moment().weekday(0).startOf('d') > moment().startOf('d'),
  },
  {
    text: 'th 2',
    time: moment().weekday(1).startOf('d').valueOf(),
    is_today: moment().weekday(1).startOf('d') - moment().startOf('d') === 0,
    is_next: moment().weekday(1).startOf('d') > moment().startOf('d'),
  },
  {
    text: 'th 3',
    time: moment().weekday(2).startOf('d').valueOf(),
    is_today: moment().weekday(2).startOf('d') - moment().startOf('d') === 0,
    is_next: moment().weekday(2).startOf('d') > moment().startOf('d'),
  },
  {
    text: 'th 4',
    time: moment().weekday(3).startOf('d').valueOf(),
    is_today: moment().weekday(3).startOf('d') - moment().startOf('d') === 0,
    is_next: moment().weekday(3).startOf('d') > moment().startOf('d'),
  },
  {
    text: 'th 5',
    time: moment().weekday(4).startOf('d').valueOf(),
    is_today:
      moment().weekday(4).startOf('d').valueOf() - moment().startOf('d') === 0,
    is_next: moment().weekday(4).startOf('d') > moment().startOf('d'),
  },
  {
    text: 'th 6',
    time: moment().weekday(5).startOf('d').valueOf(),
    is_today: moment().weekday(5).startOf('d') - moment().startOf('d') === 0,
    is_next: moment().weekday(5).startOf('d') > moment().startOf('d'),
  },
  {
    text: 'th 7',
    time: moment().weekday(6).startOf('d').valueOf(),
    is_today: moment().weekday(6).startOf('d') - moment().startOf('d') === 0,
    is_next: moment().weekday(6).startOf('d') > moment().startOf('d'),
  },
];

export const genOtherAnswer = (arr, length, n) => {
  if (arr.length <= n) {
    return arr;
  }
  const shuffleArray = shuffle(arr);
  const randomValue = Math.round(Math.random() * length);
  const indexStart = randomValue <= length - n ? randomValue : length - n;
  return shuffleArray.slice(indexStart, indexStart + n);
};

export const addQuestionInHighlightOrStrike = (nextScriptItem) => {
  const items = nextScriptItem.items.map((item) => {
    let numWordSuccess = 0;
    const words = item.question.trim().split(' ');
    const listWordStatement = words.map((word) => {
      if (word.includes('<') || word.includes('>')) {
        return {
          id: makeid(8),
          word: word.replace('<', '').replace('>', ''),
          isExample: true,
          isChoose: false,
        };
      }
      const isAnswer = word.includes('[') || word.includes(']');
      if (isAnswer) {
        numWordSuccess += 1;
      }
      return {
        id: makeid(8),
        word: word.replace('[', '').replace(']', ''),
        isAnswer,
        isChoose: false,
      };
    });
    return {
      ...item,
      questions: listWordStatement,
      numWordSuccess,
    };
  });
  return {
    ...nextScriptItem,
    items,
  };
};

export const requestInit = () => {
  return {
    sampleRate: 16000,
    channels: 1,
    bitsPerSample: 16,
    audioSource: 6,
    wavFile: `rolePlayRecorder/${makeid(8)}.wav`,
  };
};

export const playAudio = (name) => {
  if (audios[name]) {
    const audio = audios[name];
    const whoosh = new Sound(audio, (error) => {
      if (error) {
        return;
      }
      whoosh.setVolume(0.3);
      whoosh.play();
    });
    listAudio[audios[name]] = whoosh;
  }
};

export const removeAudio = (name) => {
  if (audios[name] && listAudio[audios[name]]) {
    listAudio[audios[name]].release();
    delete listAudio[audios[name]];
  }
};

export const playAudioAnswer = (isCorrect) => {
  if (isCorrect) {
    playAudio('correct');
  } else {
    playAudio('wrong');
  }
};

export const getDimensionVideo169 = (width) => {
  return (width * 9) / 16;
};

export const timeGameByWord = (length) => {
  if (length <= 4) {
    return 90;
  }
  if (length <= 6) {
    return 120;
  }
  if (length <= 9) {
    return 150;
  }
  return 180;
};

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const getPronunciationWord = (pronunciations, attachment) => {
  const response = [];
  pronunciations.forEach((item) => {
    const analysis = [];
    item.letters.map((it) => {
      analysis.push({
        word: it.letter,
        key: makeid(8),
        good: it.score_normalize >= THRESHOLD.GOOD,
        passable:
          it.score_normalize >= THRESHOLD.PASSABLE &&
          it.score_normalize < THRESHOLD.GOOD,
        average:
          it.score_normalize > THRESHOLD.BAD &&
          it.score_normalize < THRESHOLD.PASSABLE,
        bad: it.score_normalize <= THRESHOLD.BAD,
        phone_ipa: it.phones[0].phone_ipa,
      });
    });
    response.push({
      key: makeid(8),
      word: item,
      analysis,
      attachment: {
        ...attachment,
        startTime: item.start_time,
        endTime: item.end_time,
      },
    });
  });
  return response;
};

export const matchAllRegex = (regex, content) => {
  let listMatchAll = [];
  let matchItem = regex.exec(content);
  while (matchItem) {
    listMatchAll.push(matchItem);
    matchItem = regex.exec(content);
  }
  return listMatchAll;
};

export const normalizedAnswer = (answer) => {
  const regexCharacter = /[.,!~?]/g;
  return answer.replace(regexCharacter, '').toLowerCase().trim();
};
