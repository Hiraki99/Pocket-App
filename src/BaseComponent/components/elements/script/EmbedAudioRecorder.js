import React from 'react';
import {
  Image,
  TouchableOpacity,
  View,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import {PERMISSIONS} from 'react-native-permissions';
import {Icon} from 'native-base';
import LottieView from 'lottie-react-native';
import Sound from 'react-native-sound';
import PropTypes from 'prop-types';
import AudioRecord from 'react-native-audio-record';

import {FlexContainer, Text} from '~/BaseComponent';
import {requestPermission} from '~/utils/permission';
import {HighLightText} from '~/BaseComponent/components/elements/script/HighLightText';
import {requestInit} from '~/utils/utils';
import {OS} from '~/constants/os';
import {alertTimeOut} from '~/utils/apiGoogle';
import speakApi from '~/features/speak/SpeakApi';
import {MEDIUM_SCORE} from '~/constants/threshold';
import {colors, images} from '~/themes';
import {translate} from '~/utils/multilanguage';

export default class EmbedAudioRecorder extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTime: 0.0,
      recording: false,
      paused: false,
      finished: false,
      hasPermission: undefined,
      loadingRecognize: false,
      sendAnswer: false,
      countDownTime: props.isWord ? 20 : 30,
    };
  }

  componentDidMount(): void {
    Sound.enableInSilenceMode(true);
    const {attachment} = this.props;
    if (attachment) {
      this.sound = new Sound(attachment.item.audio, '', (err) => {
        if (!err && this.props.activeScreen) {
          setTimeout(() => {
            if (this.sound) {
              this.sound.play();
            }
          }, 1000);
        }
      });
    }

    this.initRecord();
  }

  timeout = async () => {
    await this.setState({
      currentTime: 0.0,
      recording: false,
      paused: false,
      finished: false,
      hasPermission: undefined,
      loadingRecognize: false,
      sendAnswer: false,
      countDownTime: this.props.isWord ? 20 : 30,
    });
    this.initRecord();
  };

  componentDidUpdate(prevProps) {
    if (
      this.props.activeScreen !== prevProps.activeScreen &&
      this.props.activeScreen
    ) {
      this.playAudio();
    }
    if (
      this.props.activeScreen !== prevProps.activeScreen &&
      !this.props.activeScreen
    ) {
      this.removeAudio();
    }
  }

  componentWillUnmount() {
    this.removeAudio();
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

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
      return;
    }
    Alert.alert(
      `${translate('Thông báo')}`,
      translate(
        'Tính năng thu âm chưa được cấp quyền, Mời bạn vào cài đặt để bật tính năng !',
      ),
      [
        {
          text: `${translate('OK')}`,
          onPress: () => Linking.openURL('app-settings:'),
        },
        {
          text: `${translate('Hủy')}`,
          onPress: () => {},
        },
      ],
    );
  };

  playAudio = () => {
    if (this.sound) {
      this.sound.play();
    }
  };

  removeAudio = () => {
    if (this.sound) {
      this.sound.release();
      this.sound = null;
    }
  };

  record = async () => {
    if (this.sound) {
      this.sound.pause(() => {
        if (this.state.recording) {
          return;
        }

        if (!this.state.hasPermission) {
          console.warn("Can't record, no permission granted!");
          Alert.alert(
            `${translate('Thông báo')}`,
            translate(
              'Tính năng thu âm chưa được cấp quyền, Mời bạn vào cài đặt để bật tính năng !',
            ),
            [
              {
                text: `${translate('OK')}`,
                onPress: () => Linking.openURL('app-settings:'),
              },
              {
                text: `${translate('Hủy')}`,
                onPress: () => {},
              },
            ],
          );
          return;
        }
        AudioRecord.start();
        this.setState({recording: true, paused: false});
      });
    }
    if (!this.props.attachment) {
      AudioRecord.start();
      this.setState({recording: true});
    }
    this.interval = setInterval(() => {
      const {countDownTime} = this.state;
      this.setState({countDownTime: countDownTime - 1});
      if (countDownTime - 1 === 0) {
        AudioRecord.stop();
        this.setState({recording: false});
        clearInterval(this.interval);
        alertTimeOut(this.timeout);
        this.setState({countDownTime: this.props.isWord ? 20 : 30});
      }
    }, 1000);
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
    const {onRecorded, word} = this.props;
    if (this.sound) {
      this.sound.pause();
    }
    let isCorrect = false;
    this.setState({loadingRecognize: true});
    setTimeout(async () => {
      const bodyFormData = new FormData();
      const nameFile = filePath.split('/')[filePath.split('/').length - 1];
      bodyFormData.append('audio', {
        uri: filePath,
        name: `${nameFile}`,
        type: 'audio/vnd.wave',
      });
      bodyFormData.append('text', word);
      const resZalo = await speakApi.recognizeAudioScore(bodyFormData);
      if (resZalo.ok && resZalo.data) {
        // if (resZalo.data.score >= 20) {
        if (resZalo.data.score >= MEDIUM_SCORE) {
          isCorrect = true;
        }
      }

      this.setState({
        finished: didSucceed,
        loadingRecognize: false,
        sendAnswer: true,
      });
      onRecorded(isCorrect);
    }, 500);
  };

  toggleRecord = async () => {
    if (!this.state.recording) {
      await this.record();
    } else {
      await this.finishRecord();
    }
  };

  render() {
    const {
      word,
      pronunciation,
      isWord,
      colorHighLight,
      attachment,
    } = this.props;
    const {recording, loadingRecognize} = this.state;
    return (
      <View>
        {attachment && (
          <FlexContainer style={styles.iconAudioContainer}>
            <TouchableOpacity
              activeOpacity={0.7}
              disable={recording}
              onPress={this.playAudio}>
              <Image source={images.sound_2} style={styles.iconAudio} />
            </TouchableOpacity>
          </FlexContainer>
        )}
        <Text h5 medium center style={{marginTop: 32, marginBottom: 4}}>
          {recording
            ? translate('Bấm vào micro để dừng')
            : translate('Bấm vào micro để nói')}
        </Text>
        <Text
          center
          style={{
            lineHeight: isWord ? 40 : 30,
            paddingTop: 8,
            paddingBottom: 40,
          }}>
          <HighLightText
            content={word}
            fontSize={isWord ? 32 : 24}
            style={{
              lineHeight: isWord ? 40 : 30,
              paddingTop: 8,
              paddingBottom: 40,
            }}
            bold
            primary
            center
            colorHighLight={colorHighLight}
          />
        </Text>
        {pronunciation !== '' && (
          <Text h5 center color={colors.helpText2} style={{marginBottom: 20}}>
            {pronunciation}
          </Text>
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
              style={styles.recordLotteria}
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
              style={styles.loading}
            />
          )}
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  iconAudioContainer: {
    position: 'absolute',
    top: -20,
    alignItems: 'center',
    width: '100%',
  },
  iconAudio: {width: 40, height: 40},
  loading: {
    width: 100,
    height: 100,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  recordButton: {
    backgroundColor: colors.primary,
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 40,
  },
  recordLotteria: {
    width: 24,
    height: 24,
    opacity: 0.8,
  },
});

EmbedAudioRecorder.propTypes = {
  word: PropTypes.string.isRequired,
  attachment: PropTypes.object,
  pronunciation: PropTypes.string,
  onRecorded: PropTypes.func,
  isWord: PropTypes.bool,
  activeScreen: PropTypes.bool,
  googleApiKey: PropTypes.string,
  colorHighLight: PropTypes.string,
};

EmbedAudioRecorder.defaultProps = {
  word: '',
  pronunciation: '',
  onRecorded: () => {},
  isWord: true,
  activeScreen: false,
  attachment: null,
  googleApiKey: '',
  colorHighLight: colors.primary,
};
