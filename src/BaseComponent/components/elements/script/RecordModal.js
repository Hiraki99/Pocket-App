import React from 'react';
import {
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import AudioRecord from 'react-native-audio-record';
import {Icon} from 'native-base';
import LottieView from 'lottie-react-native';
import ModalWrapper from 'react-native-modal-wrapper';
import {PERMISSIONS} from 'react-native-permissions';
import PropTypes from 'prop-types';
import {View as AnimatedView} from 'react-native-animatable';

import Answer from '~/BaseComponent/components/elements/result/Answer';
import {Button, RowContainer, Text} from '~/BaseComponent';
import OverLayResult from '~/BaseComponent/components/elements/result/OverlayResult';
import ReviewAnswerWrong from '~/BaseComponent/components/elements/result/ReviewAnswerWrong';
import {requestPermission} from '~/utils/permission';
import {OS} from '~/constants/os';
import {getPronunciationWord, makeid, playAudioAnswer} from '~/utils/utils';
import speakApi from '~/features/speak/SpeakApi';
import navigator from '~/navigation/customNavigator';
import {alertTimeOut} from '~/utils/apiGoogle';
import {colors, images} from '~/themes';
import {MEDIUM_SCORE} from '~/constants/threshold';
import {translate} from '~/utils/multilanguage';

const requestInit = () => {
  return {
    sampleRate: 16000,
    channels: 1,
    bitsPerSample: 16,
    audioSource: 6,
    wavFile: `rolePlayRecorder/${makeid(8)}.wav`,
  };
};

export default class RecordModal extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      startTimeRecord: 0,
      duration: 0,
      recording: false,
      paused: false,
      stoppedRecording: false,
      finished: false,
      audioPath: null,
      hasPermission: undefined,
      answer: {
        show: false,
        isCorrect: false,
      },
      reviewWrong: false,
      loadingRecognize: false,
      countDownTime: 30,
      dataAnalysis: [],
      scoreRecognize: 0,
    };
  }

  showModal = () => {
    setTimeout(() => {
      this.setState({
        showModal: true,
      });
    }, 200);
    this.initRecord();
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
        translate(
          'Tính năng thu âm chưa được cấp quyền, Mời bạn vào cài đặt để bật tính năng !',
        ),
        [
          {
            text: `${translate('Đồng ý')}`,
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

  record = async () => {
    if (this.state.recording) {
      return;
    }

    if (!this.state.hasPermission) {
      console.warn("Can't record, no permission granted!");
      return;
    }
    this.props.onPause();
    AudioRecord.start();
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
    this.setState({recording: true, paused: false});
  };

  timeout = async () => {
    await this.setState({
      duration: 0,
      loadingRecognize: false,
      countDownTime: 30,
    });
    this.initRecord();
  };

  onRework = () => {
    this.setState({
      reviewWrong: false,
      answer: {show: false},
    });
    this.props.onFirstWarning();
    this.showModal();
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
    if (this.props.isVip) {
      return this.finishRecordingVip(
        true,
        !OS.IsAndroid ? audioFile : `file://${audioFile}`,
        duration,
      );
    }
    this.finishRecording(
      true,
      !OS.IsAndroid ? audioFile : `file://${audioFile}`,
      duration,
    );
  };

  finishRecording = async (didSucceed, filePath, duration) => {
    const {onRecorded, data} = this.props;
    this.setState({loadingRecognize: true, filePath});
    setTimeout(async () => {
      let isCorrect = false;
      const bodyFormData = new FormData();
      const nameFile = filePath.split('/')[filePath.split('/').length - 1];
      bodyFormData.append('audio', {
        uri: filePath,
        name: `${nameFile}`,
        type: 'audio/vnd.wave',
      });
      bodyFormData.append('text', data.content);
      const resZalo = await speakApi.recognizeAudioScore(bodyFormData);
      if (resZalo.ok && resZalo.data) {
        if (resZalo.data.score >= MEDIUM_SCORE) {
          isCorrect = true;
        }
      }

      this.setState({
        finished: didSucceed,
        answer: {
          show: true,
          isCorrect: isCorrect,
        },
        loadingRecognize: false,
      });
      playAudioAnswer(isCorrect);
      this.props.onUpdateRoleplay(isCorrect);
      this.closeModal();
      if (isCorrect) {
        this.props.onEffect(isCorrect);
        const bodyFormSaveData = new FormData();
        bodyFormSaveData.append('audio', {
          uri: filePath,
          name: `${nameFile}`,
          type: 'audio/vnd.wave',
        });
        bodyFormSaveData.append('text', data.content);
        bodyFormSaveData.append('activity_id', this.props.activity_id);
        bodyFormSaveData.append('script_id', this.props.script_id);
        bodyFormSaveData.append('conversation_id', data.id);
        bodyFormSaveData.append('version', this.props.version);
        if (this.props.activity_type) {
          bodyFormSaveData.append('activity_type', this.props.activity_type);
        }
        await speakApi.recognizeAndSaveAudio(bodyFormSaveData);
        setTimeout(() => {
          this.setState({answer: {show: false}});
          onRecorded(filePath, duration);
        }, 2000);
      } else {
        this.props.onFirstWarning();
      }
    }, 500);
  };

  finishRecordingVip = async (didSucceed, filePath, duration) => {
    const {onRecorded, data} = this.props;
    const nameFile = filePath.split('/')[filePath.split('/').length - 1];
    this.setState({loadingRecognize: true, filePath});
    setTimeout(async () => {
      const bodyFormSaveData = new FormData();
      bodyFormSaveData.append('audio', {
        uri: filePath,
        name: `${nameFile}`,
        type: 'audio/vnd.wave',
      });
      bodyFormSaveData.append('text', data.content);
      let isCorrect = false;
      let dataAnalysis = [];
      let scoreRecognize = 0;
      const res = await speakApi.recognizeAudioVip(bodyFormSaveData);
      if (res.ok && res.data) {
        dataAnalysis = getPronunciationWord(res.data.result, {
          path: filePath,
        });
        let score = 0;
        res.data.result.forEach(
          (item) => (score = item.score_normalize + score),
        );
        scoreRecognize = score / res.data.result.length;
        if (scoreRecognize >= 0.5) {
          isCorrect = true;
        }
        await this.setState({dataAnalysis, scoreRecognize});
      }
      this.setState({
        finished: didSucceed,
        answer: {
          show: true,
          isCorrect: isCorrect,
        },
        loadingRecognize: false,
      });
      playAudioAnswer(isCorrect);
      this.props.onUpdateRoleplay(isCorrect);
      this.closeModal();
      if (isCorrect) {
        this.props.onEffect(isCorrect);
        const bodyFormSaveData = new FormData();
        bodyFormSaveData.append('audio', {
          uri: filePath,
          name: `${nameFile}`,
          type: 'audio/vnd.wave',
        });
        bodyFormSaveData.append('text', data.content);
        bodyFormSaveData.append('activity_id', this.props.activity_id);
        bodyFormSaveData.append('script_id', this.props.script_id);
        bodyFormSaveData.append('conversation_id', data.id);
        bodyFormSaveData.append('version', this.props.version);
        if (this.props.activity_type) {
          bodyFormSaveData.append('activity_type', this.props.activity_type);
        }
        await speakApi.recognizeAndSaveAudio(bodyFormSaveData);

        setTimeout(() => {
          this.setState({
            answer: {show: false},
            dataAnalysis: [],
            scoreRecognize: 0,
          });
          onRecorded(filePath, duration, dataAnalysis, scoreRecognize);
        }, 2000);
      } else {
        this.props.onFirstWarning();
      }
    }, 500);
  };

  skip = async () => {
    const {filePath} = this.state;
    const {onRecorded, data} = this.props;
    const nameFile = filePath.split('/')[filePath.split('/').length - 1];
    await this.setState({loadingRecognize: true});
    const bodyFormSaveData = new FormData();
    bodyFormSaveData.append('audio', {
      uri: filePath,
      name: `${nameFile}`,
      type: 'audio/vnd.wave',
    });
    bodyFormSaveData.append('text', data.content);
    bodyFormSaveData.append('activity_id', this.props.activity_id);
    bodyFormSaveData.append('script_id', this.props.script_id);
    bodyFormSaveData.append('conversation_id', data.id);
    bodyFormSaveData.append('version', this.props.version);
    if (this.props.activity_type) {
      bodyFormSaveData.append('activity_type', this.props.activity_type);
    }
    await speakApi.recognizeAndSaveAudio(bodyFormSaveData);
    this.setState({answer: {show: false}, loadingRecognize: false});
    if (this.props.isVip) {
      onRecorded(
        filePath,
        0,
        this.state.dataAnalysis,
        this.state.scoreRecognize,
      );
    } else {
      onRecorded(filePath, 0);
    }
    this.props.onEffect(false);
    this.setState({dataAnalysis: [], scoreRecognize: 0});
  };

  closeModal = () => {
    this.setState({showModal: false});
    if (this.interval) {
      clearInterval(this.interval);
    }
  };

  onRequestClose = () => {
    Alert.alert(
      `${translate('Thông báo')}`,
      translate('Bạn muốn rời khỏi bài học?'),
      [
        {
          text: `${translate('Đồng ý')}`,
          onPress: () => {
            this.closeModal();
            navigator.navigate(
              this.props.fromWordGroup
                ? 'LibraryLessonDetail'
                : this.props.isVip
                ? 'LessonPracticeSpeakDetail'
                : 'Activity',
            );
          },
        },
        {
          text: `${translate('Từ chối')}`,
        },
      ],
    );
  };

  toggleRecord = async () => {
    if (!this.state.recording) {
      await this.record();
    } else {
      await this.finishRecord();
    }
  };

  renderAnswerWrong = () => {
    const {answer} = this.state;
    return (
      <OverLayResult
        show={answer.show && !answer.isCorrect}
        title={translate('MIKE')}
        memo={translate('Nói chưa chuẩn ngay cũng không sao')}
        subtitle={translate(
          'Không phải câu nào cũng có thể nói một cách chính xác ngay được, bạn cứ bình tĩnh thử một vài lần cho đến khi nói thật tốt nhé',
        )}
        titleStyle={{
          color: colors.primary,
          fontSize: 14,
          fontWeight: 'bold',
        }}
        subtitleStyle={{
          fontSize: 17,
          color: colors.helpText,
        }}
        headerIconComponent={
          <Image source={images.teacher} style={styles.avatar} />
        }
        onRequestClose={() => {}}
        cancellable={false}>
        <Button
          primary
          rounded
          large
          marginBottom={24}
          shadow
          icon
          uppercase
          bold
          onPress={() => {
            this.setState({reviewWrong: true, answer: {show: false}});
          }}>
          {translate('Đã hiểu')}
        </Button>
      </OverLayResult>
    );
  };

  renderReviewAnswerWrong = () => {
    const {data} = this.props;
    if (this.state.audioPath) {
      return (
        <ReviewAnswerWrong
          audio={this.state.audioPath}
          content={data.content}
          onRework={this.onRework}
          onSkip={this.skip}
          onPlayOriginalAudio={this.props.onPlayOriginalAudio}
          loadingAnswer={this.state.loadingRecognize}
        />
      );
    }
  };

  renderAnswerCorrect = () => {
    return (
      <>
        <AnimatedView
          animation="fadeInUp"
          useNativeDriver={true}
          easing="ease-in-out"
          duration={500}
          style={styles.responseContainer}>
          <RowContainer>
            <Text
              h2
              fontSize={32}
              bold
              color={colors.white}
              paddingHorizontal={10}>
              +1
            </Text>
            <Image source={images.star} style={styles.icon} />
          </RowContainer>
        </AnimatedView>
        <Answer isCorrect={true} />
      </>
    );
  };

  render() {
    const {data, firstWarningError, onPlayOriginalAudio} = this.props;
    const {
      recording,
      showModal,
      reviewWrong,
      answer,
      loadingRecognize,
    } = this.state;

    return (
      <View>
        {answer.show && answer.isCorrect && this.renderAnswerCorrect()}
        {!firstWarningError ? (
          <>{answer.show && !answer.isCorrect && this.renderAnswerWrong()}</>
        ) : (
          <>
            {(reviewWrong || (answer.show && !answer.isCorrect)) &&
              this.renderReviewAnswerWrong()}
          </>
        )}

        <ModalWrapper
          containerStyle={styles.modalContainer}
          onRequestClose={this.onRequestClose}
          shouldAnimateOnRequestClose={true}
          style={styles.modalWrapper}
          visible={showModal}>
          <TouchableOpacity
            activeOpacity={0.7}
            disable={recording}
            onPress={() => onPlayOriginalAudio()}>
            <View style={styles.iconAudioContainer}>
              <Image source={images.sound_2} style={styles.iconAudio} />
            </View>
          </TouchableOpacity>
          <>
            <Text h5 medium center style={styles.title}>
              {recording
                ? translate('Bấm vào micro để dừng')
                : translate('Bấm vào micro để nói')}
            </Text>
            <Text
              h4
              bold
              primary
              center
              paddingVertical={16}
              paddingHorizontal={24}>
              {data.content}
            </Text>

            <TouchableOpacity
              onPress={this.toggleRecord}
              activeOpacity={0.65}
              disabled={loadingRecognize}
              style={styles.record}>
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
          </>
        </ModalWrapper>
      </View>
    );
  }
}

RecordModal.propTypes = {
  data: PropTypes.object,
  pronunciation: PropTypes.string,
  version: PropTypes.string.isRequired,
  activity_id: PropTypes.string.isRequired,
  script_id: PropTypes.string.isRequired,
  onRecorded: PropTypes.func,
  onEffect: PropTypes.func,
  onUpdateRoleplay: PropTypes.func,
  onPlayOriginalAudio: PropTypes.func,
  onPause: PropTypes.func,
  firstWarningError: PropTypes.bool,
  googleApiKey: PropTypes.string,
  isVip: PropTypes.bool,
  fromWordGroup: PropTypes.bool,
  activity_type: PropTypes.string,
};

RecordModal.defaultProps = {
  data: {},
  pronunciation: '',
  onRecorded: () => {},
  onEffect: () => {},
  onUpdateRoleplay: () => {},
  onFirstWarning: () => {},
  onPlayOriginalAudio: () => {},
  onPause: () => {},
  firstWarningError: false,
  googleApiKey: '',
  isVip: false,
  fromWordGroup: false,
  activity_type: null,
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
});
