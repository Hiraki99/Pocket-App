import React from 'react';
import {TouchableOpacity, StyleSheet, Alert, Linking} from 'react-native';
import {Icon} from 'native-base';
import LottieView from 'lottie-react-native';
import ModalWrapper from 'react-native-modal-wrapper';
import PropTypes from 'prop-types';
import RNFS from 'react-native-fs';
import AudioRecord from 'react-native-audio-record';
import {PERMISSIONS} from 'react-native-permissions';

import {requestPermission} from '~/utils/permission';
import {Text} from '~/BaseComponent';
import {SpeakStressType} from '~/BaseComponent/components/elements/script/speak/SpeakStressPractice';
import {requestInit} from '~/utils/utils';
import {OS} from '~/constants/os';
import {alertTimeOut} from '~/utils/apiGoogle';
import navigator from '~/navigation/customNavigator';
import SpeakApi from '~/features/speak/SpeakApi';
import {colors} from '~/themes';
import {translate} from '~/utils/multilanguage';
import {HighLightText} from '~/BaseComponent/components/elements/script/HighLightText';

export default class SpeakModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      currentTime: 0.0,
      recording: false,
      paused: false,
      stoppedRecording: false,
      finished: false,
      hasPermission: undefined,
      loadingRecognize: false,
      countDownTime: props.word ? 20 : 30,
    };

    this.showModal = this.showModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount = async () => {
    const checkExistedFolder = await RNFS.exists(
      RNFS.DocumentDirectoryPath + '/rolePlayRecorder',
    );
    if (!checkExistedFolder) {
      RNFS.mkdir(RNFS.DocumentDirectoryPath + '/rolePlayRecorder');
    }
  };

  initRecord = async () => {
    const data = await requestPermission(
      OS.IsAndroid
        ? PERMISSIONS.ANDROID.RECORD_AUDIO
        : PERMISSIONS.IOS.MICROPHONE,
    );
    this.setState({hasPermission: data.accept});
    if (data.accept) {
      const init = requestInit();
      AudioRecord.init(init);
      this.setState({startTimeRecord: Date.now()});
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
            onPress: () => this.onRequestClose(),
          },
        ],
      );
    }
  };

  showModal() {
    this.setState(
      {
        showModal: true,
      },
      () => {
        this.initRecord();
      },
    );
  }

  record = async () => {
    if (!this.state.hasPermission) {
      return;
    }
    AudioRecord.start();
    this.setState({recording: true, paused: false});
    this.interval = setInterval(() => {
      const {countDownTime} = this.state;
      this.setState({countDownTime: countDownTime - 1});
      if (countDownTime - 1 === 0) {
        AudioRecord.stop();
        this.setState({recording: false});
        clearInterval(this.interval);
        alertTimeOut(this.timeout);
      }
    }, 1000);
  };

  timeout = async () => {
    await this.setState({
      recording: false,
      finished: false,
      loadingRecognize: false,
      countDownTime: this.props.word ? 20 : 30,
    });
    this.initRecord();
  };

  toggleRecord = async () => {
    if (!this.state.recording) {
      await this.record();
    } else {
      await this.finishRecord();
    }
  };

  finishRecord = async () => {
    const audioFile = await AudioRecord.stop();
    if (this.interval) {
      clearInterval(this.interval);
    }
    const duration = (Date.now() - this.state.startTimeRecord) / 1000;
    await this.setState({
      recording: false,
      audioPath: audioFile,
    });
    this.finishRecording(
      true,
      !OS.IsAndroid ? audioFile : `file://${audioFile}`,
      duration,
    );
  };

  finishRecording = async (didSucceed, filePath) => {
    const {onRecorded, word, sentence} = this.props;
    const contentReference = word || sentence;
    this.setState({loadingRecognize: true, filePath});
    setTimeout(async () => {
      const bodyFormData = new FormData();
      const nameFile = filePath.split('/')[filePath.split('/').length - 1];
      bodyFormData.append('audio', {
        uri: filePath,
        name: `${nameFile}`,
        type: 'audio/vnd.wave',
      });
      let score = 0;
      let resZalo = null;

      if (this.props.customData) {
        const typeCustom = this.props.customData.type;
        const partID = this.props.customData.part_id;
        if (typeCustom === SpeakStressType.WORD) {
          const stressWord = this.props.customData.stressWord;
          bodyFormData.append('text', stressWord);
          bodyFormData.append('part_id', partID);
          resZalo = await SpeakApi.recognizeStressWord(bodyFormData);
        } else if (typeCustom === SpeakStressType.SENTENCE) {
          const stressSentence = this.props.customData.stressSentence;
          bodyFormData.append('text', stressSentence);
          bodyFormData.append('part_id', partID);
          resZalo = await SpeakApi.recognizeStressSentence(bodyFormData);
        } else if (typeCustom === SpeakStressType.INTONATION) {
          const stressSentence = this.props.customData.stressSentence;
          bodyFormData.append('text', stressSentence);
          bodyFormData.append('part_id', partID);
          resZalo = await SpeakApi.recognizeIntonationSentence(bodyFormData);
        } else if (typeCustom === SpeakStressType.LINKING_SOUND) {
          resZalo = {ok: true, data: {score: 1, response_type: 'non-ai'}};
        }
      } else {
        bodyFormData.append('text', contentReference);
        resZalo = await SpeakApi.recognizeAudioScore(bodyFormData);
      }

      if (resZalo.ok && resZalo.data) {
        score = resZalo.data.score || 0;
      }
      this.setState({
        finished: didSucceed,
        loadingRecognize: false,
      });
      if (this.props.customData) {
        onRecorded(OS.IsAndroid ? filePath.slice(6) : filePath, resZalo.data);
      } else {
        onRecorded(OS.IsAndroid ? filePath.slice(6) : filePath, score);
      }
      this.closeModal();
    }, 500);
  };

  closeModal = async () => {
    if (this.state.recording) {
      await AudioRecord.stop();
    }
    this.setState({
      showModal: false,
    });
    clearInterval(this.interval);
    this.timeout();
  };

  onRequestClose = () => {
    if (this.props.customData) {
      this.closeModal();
    } else {
      Alert.alert(
        `${translate('Thông báo')}`,
        translate('Bạn muốn rời khỏi bài học?'),
        [
          {
            text: `${translate('Đồng ý')}`,
            onPress: () => {
              this.closeModal();
              navigator.navigate('Activity');
            },
          },
          {
            text: `${translate('Hủy')}`,
          },
        ],
      );
    }
  };

  render() {
    const {word, pronunciation, sentence, customContent} = this.props;
    const {recording, loadingRecognize} = this.state;

    return (
      <ModalWrapper
        containerStyle={{
          flexDirection: 'row',
          alignItems: 'flex-end',
        }}
        onRequestClose={this.onRequestClose}
        shouldAnimateOnRequestClose={true}
        style={{flex: 1, borderTopRightRadius: 20, borderTopLeftRadius: 20}}
        visible={this.state.showModal}>
        <Text h5 medium center style={{marginTop: 32, marginBottom: 4}}>
          {recording
            ? translate('Bấm vào micro để dừng')
            : translate('Bấm vào micro để nói')}
        </Text>
        {customContent !== null && customContent()}
        {customContent === null && (
          <>
            <Text h2 bold primary center>
              {word}
            </Text>
            <Text
              center
              style={{
                lineHeight: 28,
                paddingHorizontal: 24,
              }}>
              <HighLightText
                content={sentence}
                fontSize={24}
                bold
                primary
                center
                colorHighLight={'rgb(248, 147, 31)'}
              />
            </Text>
            <Text h5 center color={colors.helpText2} style={{marginBottom: 20}}>
              {pronunciation}
            </Text>
          </>
        )}

        <TouchableOpacity
          onPress={this.toggleRecord}
          activeOpacity={0.65}
          disabled={loadingRecognize}
          style={styles.recordButton}>
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
        </TouchableOpacity>
      </ModalWrapper>
    );
  }
}

SpeakModal.propTypes = {
  word: PropTypes.string,
  sentence: PropTypes.string,
  pronunciation: PropTypes.string,
  onRecorded: PropTypes.func,
  customContent: PropTypes.func,
  customData: PropTypes.object,
};

SpeakModal.defaultProps = {
  word: null,
  sentence: null,
  pronunciation: '',
  onRecorded: () => {},
  customContent: null,
  customData: null,
};

const styles = StyleSheet.create({
  recordButton: {
    backgroundColor: colors.primary,
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 48,
  },
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
});
