import api from '~/utils/apisaure';

const recognizeAudio = (data) => {
  return api.post('/asr/pronunciation', data, {
    headers: {'Content-Type': 'multipart/form-data'},
  });
};

const recognizeAudioScore = (data) => {
  return api.post('/asr/pronunciation-score', data, {
    headers: {'Content-Type': 'multipart/form-data'},
  });
};

const infoPronunciation = (data) => {
  return api.post('/pronunciation/filter', data);
};

const recognizeAudioMultiText = (data) => {
  return api.post('/asr/pronunciation-score-multiple', data, {
    headers: {'Content-Type': 'multipart/form-data'},
  });
};

const recognizeAndSaveAudio = (data) => {
  return api.post('/user-audio-record/add-role-play-audio', data, {
    headers: {'Content-Type': 'multipart/form-data'},
  });
};

const getRolePlayAudio = (data) => {
  return api.post('/user-audio-record/get-role-play-audio', data, {
    responseType: 'arraybuffer',
  });
};

const recognizeAudioVip = (data) => {
  return api.post('/asr/check-pronunciation', data, {
    headers: {'Content-Type': 'multipart/form-data'},
  });
};

const recognizeStressWord = (data) => {
  return api.post('/asr/stress-word', data, {
    headers: {'Content-Type': 'multipart/form-data'},
  });
};

const recognizeStressSentence = (data) => {
  return api.post('/asr/stress-sentence', data, {
    headers: {'Content-Type': 'multipart/form-data'},
  });
};
const recognizeIntonationSentence = (data) => {
  return api.post('/asr/intonation', data, {
    headers: {'Content-Type': 'multipart/form-data'},
  });
};

export default {
  recognizeAudioVip,
  recognizeAudio,
  infoPronunciation,
  recognizeAudioMultiText,
  recognizeAndSaveAudio,
  getRolePlayAudio,
  recognizeAudioScore,
  recognizeStressWord,
  recognizeStressSentence,
  recognizeIntonationSentence,
};
