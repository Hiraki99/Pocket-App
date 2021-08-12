import moment from 'moment';
// eslint-disable-next-line import/order
import * as lodash from 'lodash';
// import shuffle from 'lodash/shuffle';
import Sound from 'react-native-sound';
import {Alert, ToastAndroid} from 'react-native';
import {Toast} from 'native-base';
import ToastIos from 'react-native-simple-toast';

import {getStore} from './script';

import audios from '~/themes/audios';
import navigator from '~/navigation/customNavigator';
import {THRESHOLD} from '~/constants/threshold';
import {OS} from '~/constants/os';
import {colors} from '~/themes';
import {translate} from '~/utils/multilanguage';
let listAudio = {};
const keys = Object.keys(audios);
keys.forEach((key) => {
  const audio = audios[key];
  const whoosh = new Sound(audio, (error) => {
    if (error) {
      return;
    }
    whoosh.setVolume(0.3);
    // whoosh.play(() => {});
  });
  listAudio[audios[key]] = whoosh;
});

export const toastNativeMessage = (message) => {
  if (OS.IsAndroid) {
    ToastAndroid.showWithGravityAndOffset(
      message,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  } else {
    ToastIos.showWithGravity(message, ToastIos.LONG, ToastIos.BOTTOM, [
      'RCTModalHostViewController',
    ]);
  }
};
export const truncateStr = (str, maxLength = 100) => {
  return lodash.truncate(str, {
    length: maxLength,
    separator: ' ',
    omission: '...',
  });
};

export const normalizeAnswerFillInBlank = (text) => {
  return text
    .replace('[', '')
    .replace(']', '')
    .replace("'", '’')
    .trim()
    .toLowerCase();
};

export const normalizeAnswerFillInBlankNormal = (text) => {
  return text.replace('[', '').replace(']', '').replace("'", '’').trim();
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
    text: translate('cn'),
    time: moment().weekday(0).startOf('d').valueOf(),
    is_today: moment().weekday(0).startOf('d') - moment().startOf('d') === 0,
    is_next: moment().weekday(0).startOf('d') > moment().startOf('d'),
  },
  {
    text: translate('th 2'),
    time: moment().weekday(1).startOf('d').valueOf(),
    is_today: moment().weekday(1).startOf('d') - moment().startOf('d') === 0,
    is_next: moment().weekday(1).startOf('d') > moment().startOf('d'),
  },
  {
    text: translate('th 3'),
    time: moment().weekday(2).startOf('d').valueOf(),
    is_today: moment().weekday(2).startOf('d') - moment().startOf('d') === 0,
    is_next: moment().weekday(2).startOf('d') > moment().startOf('d'),
  },
  {
    text: translate('th 4'),
    time: moment().weekday(3).startOf('d').valueOf(),
    is_today: moment().weekday(3).startOf('d') - moment().startOf('d') === 0,
    is_next: moment().weekday(3).startOf('d') > moment().startOf('d'),
  },
  {
    text: translate('th 5'),
    time: moment().weekday(4).startOf('d').valueOf(),
    is_today:
      moment().weekday(4).startOf('d').valueOf() - moment().startOf('d') === 0,
    is_next: moment().weekday(4).startOf('d') > moment().startOf('d'),
  },
  {
    text: translate('th 6'),
    time: moment().weekday(5).startOf('d').valueOf(),
    is_today: moment().weekday(5).startOf('d') - moment().startOf('d') === 0,
    is_next: moment().weekday(5).startOf('d') > moment().startOf('d'),
  },
  {
    text: translate('th 7'),
    time: moment().weekday(6).startOf('d').valueOf(),
    is_today: moment().weekday(6).startOf('d') - moment().startOf('d') === 0,
    is_next: moment().weekday(6).startOf('d') > moment().startOf('d'),
  },
];
//
// export const genOtherAnswer = (arr, length, n) => {
//   if (arr.length <= n) {
//     return arr;
//   }
//   const shuffleArray = shuffle(arr);
//   const randomValue = Math.round(Math.random() * length);
//   const indexStart = randomValue <= length - n ? randomValue : length - n;
//   return shuffleArray.slice(indexStart, indexStart + n);
// };
//
const getBoldArray = (question) => {
  const answerRegex = /<.*?>/g;
  const corrects = question.match(answerRegex);
  const analysis = [];
  if (!corrects) {
    const arr = question.split(' ');
    arr.forEach((i) => {
      analysis.push({
        id: makeid(8),
        word: i,
        isAnswer: false,
        isChoose: false,
      });
    });
  } else {
    corrects.forEach((it, index) => {
      const itemLength = it.length;
      const indexItem = question.indexOf(it);
      const indexNextItem = corrects[index + 1]
        ? question.indexOf(corrects[index + 1])
        : itemLength;

      if (indexItem !== 0 && index === 0) {
        const beginParagraph = question.slice(0, indexItem).split(' ');
        beginParagraph.forEach((i) => {
          analysis.push({
            id: makeid(8),
            word: i,
            isAnswer: false,
            isChoose: false,
          });
        });
      }
      const answersCorrect = it
        .replace('<', '')
        .replace('>', '')
        .trim()
        .split(' ');

      answersCorrect.forEach((i) => {
        analysis.push({
          id: makeid(8),
          word: i,
          isExample: true,
          isAnswer: false,
          isChoose: false,
        });
      });
      // add cuoi doan van
      if (index === corrects.length - 1) {
        const endParagraph = question.slice(indexItem + itemLength).split(' ');
        endParagraph.forEach((i) => {
          analysis.push({
            id: makeid(8),
            word: i,
            isAnswer: false,
            isChoose: false,
          });
        });
      } else {
        const midParagraph = question
          .slice(indexItem + itemLength, indexNextItem)
          .split(' ');
        midParagraph.forEach((i) => {
          analysis.push({
            id: makeid(8),
            word: i,
            isAnswer: false,
            isChoose: false,
          });
        });
      }
    });
  }

  return analysis;
};

export const addQuestionInHighlightOrStrike = (nextScriptItem) => {
  const items = nextScriptItem.items.map((item) => {
    const answerRegex = /\[.*?\]/g;
    const corrects = matchAllRegex(answerRegex, item.question);
    let question = item.question;
    let analysis = [];
    let numWordSuccess = 0;
    if (corrects && corrects.length > 0) {
      (corrects || []).forEach((it, index) => {
        const itemLength = it[0].length;
        const indexItem = it.index;
        const indexNextItem = corrects[index + 1]
          ? corrects[index + 1].index
          : itemLength;

        if (indexItem !== 0 && index === 0) {
          const beginParagraph = getBoldArray(question.slice(0, indexItem));
          analysis = [...analysis, ...beginParagraph];
        }
        const answersCorrect = it[0]
          .replace('[', '')
          .replace(']', '')
          .trim()
          .split(' ');
        // const answersCorrect = primaryText.split(' ');
        numWordSuccess = answersCorrect.length;
        answersCorrect.forEach((i) => {
          analysis.push({
            id: makeid(8),
            word: i,
            isAnswer: true,
            isChoose: false,
          });
        });
        // add cuoi doan van
        if (index === corrects.length - 1) {
          const endParagraph = question
            .slice(indexItem + itemLength)
            .split(' ');
          endParagraph.forEach((i) => {
            analysis.push({
              id: makeid(8),
              word: i,
              isAnswer: false,
              isChoose: false,
            });
          });
        } else {
          const midParagraph = question
            .slice(indexItem + itemLength, indexNextItem)
            .split(' ');
          midParagraph.forEach((i) => {
            analysis.push({
              id: makeid(8),
              word: i,
              isAnswer: false,
              isChoose: false,
            });
          });
        }
      });
    } else {
      const listWords = question.split(' ');
      listWords.forEach((i) => {
        analysis.push({
          id: makeid(8),
          word: i,
          isAnswer: false,
          isChoose: false,
        });
      });
    }

    return {
      ...item,
      questions: analysis.filter((analysisItem) => analysisItem.word),
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

export const onOffPlayAudioZoom = (expectStateZoom = false) => {
  if (expectStateZoom) {
    Sound.setCategory('PlayAndRecord');
    Sound.setMode('VideoChat');
  } else {
    Sound.setCategory('Playback');
  }
};

export const playAudio = (name) => {
  if (audios[name]) {
    // const audio = audios[name];
    // const whoosh = new Sound(audio, (error) => {
    //   if (error) {
    //     return;
    //   }
    //   whoosh.setVolume(0.3);
    //   whoosh.play(() => {});
    // });
    listAudio[audios[name]].play();
  }
};
//
export const removeAudio = (name) => {
  if (audios[name] && listAudio[audios[name]]) {
    listAudio[audios[name]].stop();
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

export const forceBackActivity = (
  immediate = true,
  action = () => {},
  // eslint-disable-next-line no-unused-vars
  isActivityVip = false,
  // eslint-disable-next-line no-unused-vars
  fromWordGroup = false,
  isFromLiveClass = false,
) => {
  const store = getStore();
  const state = store.getState();
  const {
    activity: {screenActivity},
  } = state;
  console.log('screenActivity ', screenActivity);
  if (!immediate) {
    Alert.alert(
      translate('Bạn có muốn thoát'),
      translate(
        'Nếu thoát bây giờ thì nội dung học của bài tập này sẽ không được lưu lại',
      ),
      [
        {
          text: translate('Thoát'),
          onPress: () => {
            if (isFromLiveClass) {
              navigator.navigate('LiveHome');
              action();
            } else {
              navigator.navigate(screenActivity);
              action();
            }
          },
        },
        {
          text: translate('Bỏ qua'),
          style: 'cancel',
        },
      ],
    );
  } else {
    if (isFromLiveClass) {
      navigator.goBack();
    } else {
      navigator.navigate(screenActivity);
    }
  }
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

export const matchAllRegex = (reg, content) => {
  const regex = reg;
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

export const genOtherAnswer = (arr, length, n) => {
  if (arr.length <= n) {
    return arr;
  }
  const shuffleArray = lodash.shuffle(arr);
  const randomValue = Math.round(Math.random() * length);
  const indexStart = randomValue <= length - n ? randomValue : length - n;
  return shuffleArray.slice(indexStart, indexStart + n);
};

export const getDescWidthRegex = (text) => {
  const pronunciationRegex = /<.*?>/g;
  const listMatchAll = matchAllRegex(pronunciationRegex, text);
  if (!listMatchAll.length) {
    return {
      isTransform: false,
      desc: text,
    };
  }
};

export const compareStringAcronym = (str1, str2) => {
  const regex = /'/g;
  return (
    str1.replace(regex, '’').trim().toLowerCase() ===
    str2.replace(regex, '’').trim().toLowerCase()
  );
};

export const normalizeText = (str) => {
  const regex = /'/g;
  return str.replace(regex, '’').trim().toLowerCase();
};

export const formatObjectCompareAnswerFillInBlank = (data) => {
  let res = {};
  for (let key in data) {
    if (!key) {
      continue;
    }
    res = {
      ...res,
      [key]: normalizeText(data[key].text),
    };
  }
  return res;
};

export const formatDuration = (duration, format = 'mm:ss') => {
  return moment
    .utc(moment.duration(duration, 's').asMilliseconds())
    .format(format);
};

export const setHtml = (html) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
      <style>
        * {
          font-family: Roboto;
        }
        a {
            pointer-events: none;
        }
        p {
           font-size: 19px;
           margin-left: -6px;
        }
      </style>
    </head>
    <body>
        ${html}
    </body>
    </html>
  `;
};

export const getRangeTime = (publishDate) => {
  const from = moment(publishDate);
  const rangeDay = moment().diff(from, 'day');
  const rangeHour = moment().diff(from, 'hour');
  const rangeMinute = moment().diff(from, 'minute');

  if (rangeDay >= 1) {
    return from.format('DD/MM/YYYY');
  }
  if (rangeHour > 1) {
    return translate('%s giờ trước', {s1: `${rangeHour}`});
  }
  if (rangeMinute < 1) {
    return translate('Vừa xong');
  }
  return translate('%s phút trước', {s1: `${rangeMinute}`});
};

export const showResponse = (status = true, text) => {
  Toast.show({
    text,
    buttonText: translate('Đồng ý'),
    duration: status ? 2000 : 3000,
    position: 'bottom',
    style: {
      backgroundColor: status ? colors.successChoice : colors.helpText_docs,
      bottom: OS ? 18 : 10,
    },
    textStyle: {
      fontFamily: 'CircularStd-Book',
      fontSize: 17,
      fontWeight: '500',
    },
    buttonTextStyle: {
      fontFamily: 'CircularStd-Book',
      fontSize: 17,
      lineHeight: 20,
      fontWeight: '500',
    },
  });
};

export const getColorProgressByScore = (score) => {
  if (score >= 75) {
    return colors.successChoice;
  }
  if (score >= 50) {
    return colors.warning;
  }
  return colors.red_brick;
};

export const getArrFromText = (text, main = false) => {
  const characterList = text.split('');
  let arr = [];
  characterList.forEach((character) => {
    arr.push({
      key: makeid(32),
      text: character,
      main,
      isSpace: character === '',
    });
  });
  return arr;
};

export const zeroPad = (nr, base = 10) => {
  let len = String(base).length - String(nr).length + 1;
  return len > 0 ? new Array(len).join('0') + nr : nr;
};

export const formatTimePlayer = (time) => {
  // Hours, minutes and seconds
  let hrs = ~~(time / 3600);
  let mins = ~~((time % 3600) / 60);
  let secs = ~~time % 60;

  // Output like "1:01" or "4:03:59" or "123:03:59"
  let ret = hrs > 0 ? (hrs < 10 ? '0' : '') : '';
  if (hrs > 0) {
    ret += '' + hrs + ':' + (mins < 10 ? '0' : '');
  } else {
    ret += mins < 10 ? '0' : '';
  }
  ret += '' + mins + ':' + (secs < 10 ? '0' : '');
  ret += '' + secs;
  return ret;
};

export const getScoreColor = (score) => {
  if (score >= 90) {
    return colors.good;
  }
  if (score >= 50) {
    return colors.primary;
  }
  return colors.bad;
};

export const urlify = (text) => {
  let urlRegex = /(https?:\/\/[^\s]+)/g;
  let urlDetected = [];
  const normalizeTextLink = text.replace(urlRegex, function (url) {
    urlDetected.push(url);
    return '<a href="' + url + '">' + url + '</a>';
  });
  return {
    hasLink: urlDetected.length > 0,
    normalizeTextLink,
    linkPreview: urlDetected[0],
  };
};

export const getChattingFormat = (messageUpdate = []) => {
  let detailMessageUpdate = {};
  messageUpdate.forEach((item, index) => {
    let itemUpdate = item;
    delete item.isFirstMessageAccount;
    delete item.isEndMessageAccount;
    const preItem = messageUpdate[index - 1];
    const nextItem = messageUpdate[index + 1];
    if (preItem?.user?._id !== item.user._id) {
      itemUpdate = {
        ...itemUpdate,
        isFirstMessageAccount: true,
      };
    }
    if (nextItem?.user?._id !== item.user._id) {
      itemUpdate = {
        ...itemUpdate,
        isEndMessageAccount: true,
      };
    }
    detailMessageUpdate = {
      ...detailMessageUpdate,
      [itemUpdate._id]: itemUpdate,
    };
    itemUpdate = null;
  });
  return detailMessageUpdate;
};

export const acronymName = (name) => {
  const components = name.split(' ');
  if (components.length === 1) {
    return name;
  } else {
    let formatName = '';
    components.map((it, idx) => {
      if (idx === components.length - 1) {
        formatName += it;
      } else {
        formatName += it.length > 0 ? `${it.charAt(0)}.` : '';
      }
    });
    return formatName;
  }
};
export const removeVietnameseTones = (str) => {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
  str = str.replace(/Đ/g, 'D');
  return str.toLowerCase();
};
