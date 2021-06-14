import React, {
  useState,
  useImperativeHandle,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import {
  StyleSheet,
  Alert,
  Linking,
  View,
  TouchableNativeFeedback,
} from 'react-native';
import {Icon} from 'native-base';
import {PERMISSIONS} from 'react-native-permissions';
import LottieView from 'lottie-react-native';
import ModalWrapper from 'react-native-modal-wrapper';
import PropTypes from 'prop-types';
import RNFS from 'react-native-fs';
import AudioRecord from 'react-native-audio-record';
import {useSelector} from 'react-redux';

import {requestPermission} from '~/utils/permission';
import {PronunciationWord} from '~/BaseComponent/components/elements/pronunciation/element/PronunciationWord';
import {Text} from '~/BaseComponent';
import {makeid, matchAllRegex, requestInit} from '~/utils/utils';
import {OS} from '~/constants/os';
import {alertTimeOut} from '~/utils/apiGoogle';
import speakApi from '~/features/speak/SpeakApi';
import {currentPartSelector} from '~/selector/activity';
import {colors} from '~/themes';
import {translate} from '~/utils/multilanguage';

const SpeakVipModal = (props, modalWrapperRef) => {
  const countRef = useRef(props.word ? 20 : 30);
  const interval = React.useRef();
  const currentPart = useSelector(currentPartSelector);
  const {scriptData} = props;
  const [show, setShowModal] = useState(false);
  const [recording, setRecordingState] = useState(false);
  const [countDownTime, setCountDownTime] = useState(countRef.current);
  const [loadingRecognize, setLoadingRecognize] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  const pronunciationWorstPhone = useMemo(() => {
    const response = [];
    if (props.infoWorstPhone) {
      const {examples} = props.infoWorstPhone;
      const list = examples[0].text.split(' ');
      list.forEach((item) => {
        const pronunciationRegex = /\<.*?\>/g;
        const listMatchAll = matchAllRegex(pronunciationRegex, item);
        // const listMatchAll = [...item.matchAll(pronunciationRegex)];
        if (pronunciationRegex.test(item)) {
          const analysis = [];
          listMatchAll.map((it, index) => {
            if (index === 0 && it.index > 0) {
              analysis.push({
                word: it.input.slice(0, it.index).trim(),
                key: makeid(8),
              });
            }
            analysis.push({
              word: it[0].replace(/[<|>]/g, '').trim(),
              key: makeid(8),
              primary: true,
              refer: true,
            });
            if (index === listMatchAll.length - 1) {
              analysis.push({
                word: it.input.slice(it[0].length + it.index).trim(),
                key: makeid(8),
              });
            } else {
              analysis.push({
                word: it.input
                  .slice(it.index + it[0].length, listMatchAll[index + 1].index)
                  .trim(),
                key: makeid(8),
              });
            }
          });
          response.push({
            key: makeid(8),
            word: item,
            analysis,
          });
        } else {
          response.push({
            key: makeid(8),
            word: item,
          });
        }
      });
      return response;
    }
    return response;
  }, [props.infoWorstPhone]);

  useImperativeHandle(modalWrapperRef, () => ({
    showModal: () => {
      showModal();
      setCountDownTime(countRef.current);
    },
    closeModal: () => {
      closeModal();
    },
  }));

  React.useEffect(() => {
    return () => {
      try {
        AudioRecord.stop();
      } catch {}
    };
  }, []);

  const initRecord = async () => {
    const checkExistedFolder = await RNFS.exists(
      RNFS.DocumentDirectoryPath + '/rolePlayRecorder',
    );
    if (!checkExistedFolder) {
      RNFS.mkdir(RNFS.DocumentDirectoryPath + '/rolePlayRecorder');
    }

    const permission = await requestPermission(
      OS.IsAndroid
        ? PERMISSIONS.ANDROID.RECORD_AUDIO
        : PERMISSIONS.IOS.MICROPHONE,
    );
    setHasPermission(permission.accept);
    if (permission.accept) {
      const init = requestInit();
      AudioRecord.init(init);
      AudioRecord.on('data', () => {});
    } else {
      Alert.alert(
        `${translate('Thông báo')}`,
        `${translate(
          'Tính năng thu âm chưa được cấp quyền, Mời bạn vào cài đặt để bật tính năng !',
        )}`,
        [
          {
            text: `${translate('OK')}`,
            onPress: () => Linking.openURL('app-settings:'),
          },
          {
            text: `${translate('Hủy')}`,
            onPress: () => closeModal(),
          },
        ],
      );
    }
  };

  const showModal = async () => {
    setShowModal(true);
    initRecord();
  };

  const closeModal = () => {
    setShowModal(false);
    if (props.disableSpeakWorstPhone) {
      props.disableSpeakWorstPhone();
    }
    AudioRecord.stop();
    setRecordingState(false);
    if (interval.current) {
      clearInterval(interval.current);
    }
  };

  const record = async () => {
    if (!hasPermission) {
      return;
    }
    AudioRecord.start();
    setRecordingState(true);
    interval.current = setInterval(() => {
      setCountDownTime((old) => {
        if (old - 1 === 0) {
          AudioRecord.stop();
          setRecordingState(false);
          clearInterval(interval.current);
          alertTimeOut(timeout);
        }
        return old - 1;
      });
    }, 1000);
  };

  const timeout = async () => {
    setLoadingRecognize(false);
    setRecordingState(false);
    initRecord();
    setCountDownTime(countRef.current);
  };

  const toggleRecord = async () => {
    if (!recording) {
      await record();
    } else {
      await finishRecord();
    }
  };

  const finishRecord = async () => {
    const audioFile = await AudioRecord.stop();
    if (interval.current) {
      clearInterval(interval.current);
    }
    setRecordingState(false);
    finishRecording(true, !OS.IsAndroid ? audioFile : `file://${audioFile}`);
  };

  const finishRecording = useCallback(
    async (didSucceed, filePath) => {
      const {onResult, word, sentence} = props;
      let contentReference = word || sentence;
      setLoadingRecognize(true);
      setTimeout(async () => {
        const bodyFormData = new FormData();
        const nameFile = filePath.split('/')[filePath.split('/').length - 1];
        bodyFormData.append('audio', {
          uri: filePath,
          name: `${nameFile}`,
          type: 'audio/vnd.wave',
        });
        if (props.speakWorstPhone) {
          const {examples} = props.infoWorstPhone;
          contentReference = examples[0].text;
        }
        bodyFormData.append('text', contentReference);
        bodyFormData.append('part_id', currentPart?._id);
        const resZalo = await speakApi.recognizeAudio(bodyFormData);
        // console.log('resZalo ', resZalo);
        if (resZalo.ok && resZalo.data) {
          const {
            pronunciations,
            brief_review,
            // audio_url,
            worst_phone,
            detail_review,
            training_phone,
          } = resZalo.data;
          onResult({
            pronunciations,
            brief_review,
            audio_url: filePath,
            worst_phone,
            detail_review,
            training_phone,
            filePath,
            speakWorstPhone: props.speakWorstPhone,
          });
        }
        setLoadingRecognize(false);
      }, 500);
    },
    [props, currentPart, scriptData],
  );

  const {pronunciation} = props;

  return (
    <ModalWrapper
      containerStyle={styles.containerModalWrapperStyle}
      onRequestClose={closeModal}
      shouldAnimateOnRequestClose={true}
      style={styles.modalWrapperStyle}
      visible={show}>
      <Text h5 medium center style={{marginTop: 32, marginBottom: 4}}>
        {recording
          ? translate('Bấm vào micro để dừng')
          : translate('Bấm vào micro để nói')}
      </Text>
      {props.speakWorstPhone ? (
        <PronunciationWord
          data={pronunciationWorstPhone}
          containerStyle={[
            styles.containerPronunciation,
            {
              marginBottom: pronunciation ? 0 : 16,
            },
          ]}
          word
        />
      ) : (
        <PronunciationWord
          data={props.data}
          containerStyle={[
            styles.containerPronunciation,
            {
              marginBottom: pronunciation ? 0 : 16,
            },
          ]}
          word={!!props.word}
        />
      )}

      {(pronunciation || props.infoWorstPhone) && (
        <Text h5 center color={colors.helpText2} style={{marginBottom: 20}}>
          {props.speakWorstPhone
            ? props.infoWorstPhone
              ? props.infoWorstPhone.pronunciation
              : ''
            : pronunciation}
        </Text>
      )}

      <TouchableNativeFeedback onPress={toggleRecord}>
        <View activeOpacity={0.65} style={styles.button}>
          {loadingRecognize ? (
            <LottieView
              source={require('~/assets/animate/pressing')}
              autoPlay
              loop
              style={styles.loading}
            />
          ) : (
            <Icon
              name="microphone"
              type="FontAwesome"
              style={{color: colors.white, fontSize: 36}}
            />
          )}

          {recording && (
            <LottieView
              source={require('~/assets/animate/round-loading')}
              autoPlay
              loop
              style={styles.recordLotteria}
            />
          )}
        </View>
      </TouchableNativeFeedback>
      <Text h5 center color={colors.helpText2}>
        {`${countDownTime}`}
      </Text>
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  modalWrapper: {flex: 1, borderTopRightRadius: 24, borderTopLeftRadius: 24},
  title: {
    marginTop: 32,
    marginBottom: 4,
  },
  iconAudioContainer: {
    position: 'absolute',
    top: -20,
    left: OS.WIDTH / 2 - 20,
  },
  iconAudio: {width: 40, height: 40},
  record: {
    backgroundColor: colors.primary,
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 48,
  },
  recordLotteria: {
    width: 100,
    height: 100,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  responseContainer: {
    position: 'absolute',
    zIndex: 4,
    width: '100%',
    bottom: OS.Game - 24,
    height: OS.GameImageWater + OS.headerHeight + 24,
    backgroundColor: ' rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 30,
    height: 30,
  },
  loading: {
    width: 24,
    height: 24,
  },
  wrongIcon: {
    width: 100,
    height: 100,
  },
  avatar: {
    height: 64,
    width: 64,
    borderRadius: 32,
  },
  button: {
    backgroundColor: colors.primary,
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 48,
  },
  containerPronunciation: {
    flexWrap: 'wrap',
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  modalWrapperStyle: {
    flex: 1,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    justifyContent: 'flex-start',
    paddingBottom: 62,
  },
  containerModalWrapperStyle: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
});

const SpeakVipModalRef = React.forwardRef(SpeakVipModal);

SpeakVipModal.propTypes = {
  word: PropTypes.string,
  sentence: PropTypes.string,
  scriptData: PropTypes.object,
  data: PropTypes.array,
  pronunciation: PropTypes.string,
  onResult: PropTypes.func,
  speakWorstPhone: PropTypes.bool,
  infoWorstPhone: PropTypes.object,
};

SpeakVipModal.defaultProps = {
  word: null,
  sentence: null,
  scriptData: {},
  data: [],
  pronunciation: '',
  onResult: () => {},
  speakWorstPhone: false,
  infoWorstPhone: null,
};
export default SpeakVipModalRef;
