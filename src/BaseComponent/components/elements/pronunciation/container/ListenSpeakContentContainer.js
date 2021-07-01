import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  View,
  Alert,
  Linking,
} from 'react-native';
import {connect} from 'react-redux';
import Sound from 'react-native-sound';
import {View as AnimatedView} from 'react-native-animatable';
import RNFS from 'react-native-fs';
import LottieView from 'lottie-react-native';
import {Icon} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AudioRecord from 'react-native-audio-record';
import {PERMISSIONS} from 'react-native-permissions';
import {AnimatedCircularProgress} from 'react-native-circular-progress';

import {
  FlexContainer,
  NoFlexContainer,
  RowContainer,
  Text,
} from '~/BaseComponent';
import {playAudioAnswer, requestInit} from '~/utils/common';
import {requestPermission} from '~/utils/permission';
import ScriptWrapper from '~/BaseComponent/components/elements/script/ScriptWrapper';
import Answer from '~/BaseComponent/components/elements/result/Answer';
import {colors, images} from '~/themes';
import {OS} from '~/constants/os';
import {fetchCourse, changeCurrentCourse} from '~/features/course/CourseAction';
import {
  increaseScore,
  answerQuestion,
  increaseWorkSpeak,
} from '~/features/script/ScriptAction';
import {generateNextActivity} from '~/utils/script';
import {customNavigationOptions} from '~/navigation/navigationHelper';
import {alertTimeOut} from '~/utils/apiGoogle';
import speakApi from '~/features/speak/SpeakApi';
import {MEDIUM_SCORE} from '~/constants/threshold';
import {translate} from '~/utils/multilanguage';

class ListenSpeakContentContainer extends React.Component {
  static navigationOptions = customNavigationOptions;
  constructor(props) {
    super(props);
    this.state = {
      loadingRecognize: false,
      recording: false,
      playState: 'paused',
      answer: {
        show: false,
        isCorrect: false,
      },
      playSeconds: 0,
      duration: 0,
      countDownTime: props.word ? 20 : 30,
    };
  }

  componentDidMount = async () => {
    Sound.enableInSilenceMode(true);
    const checkExistedFolder = await RNFS.exists(
      RNFS.DocumentDirectoryPath + '/rolePlayRecorder',
    );
    if (!checkExistedFolder) {
      RNFS.mkdir(RNFS.DocumentDirectoryPath + '/rolePlayRecorder');
    }
    const data = await requestPermission(
      OS.IsAndroid
        ? PERMISSIONS.ANDROID.RECORD_AUDIO
        : PERMISSIONS.IOS.MICROPHONE,
    );
    await this.setState({hasPermission: data.accept});
    this.init(this.props.audio);
    this.interval = setInterval(() => {
      if (
        this.sound &&
        this.sound.isLoaded() &&
        this.state.playState === 'playing'
      ) {
        this.sound.getCurrentTime((seconds) => {
          this.setState({playSeconds: seconds});
        });
      }
    }, 60);
  };

  shouldComponentUpdate(nextProps) {
    if (this.props.id !== nextProps.id) {
      this.setState(
        {
          loadingRecognize: false,
          playState: 'paused',
          answer: {
            show: false,
            isCorrect: false,
          },
        },
        () => {
          if (nextProps.id) {
            this.init(nextProps.audio);
          }
        },
      );
    }
    return true;
  }

  componentWillUnmount() {
    if (this.sound) {
      this.sound.release();
      this.sound = null;
    }
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  init = (audio) => {
    this.sound = new Sound(audio, '', (err) => {
      if (!err) {
        this.play();
        this.setState({
          duration: this.sound.getDuration(),
        });
      }
    });
    this.initRecord();
  };

  initRecord = async () => {
    if (this.state.hasPermission) {
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
            text: translate('OK'),
            onPress: () => Linking.openURL('app-settings:'),
          },
          {
            text: translate('Hủy'),
            onPress: () => {},
          },
        ],
      );
    }
  };

  timeout = async () => {
    await this.setState({
      loadingRecognize: false,
      recording: false,
      answer: {
        show: false,
        isCorrect: false,
      },
      countDownTime: this.props.word ? 20 : 30,
    });
    this.initRecord();
  };

  playComplete = () => {
    if (this.sound) {
      if (
        Math.floor(this.state.playSeconds) ===
          Math.floor(this.state.duration) ||
        Math.ceil(this.state.playSeconds) === Math.ceil(this.state.duration)
      ) {
        setTimeout(() => {
          this.setState({playSeconds: 0});
        }, 1000);

        this.sound.setCurrentTime(0);

        if (this.state.duration !== 0 && !this.state.isDone) {
          this.setState({isDone: true});
        }
      }
      this.setState({playState: 'paused'});
    }
  };

  onPause = () => {
    this.sound.pause(() => {
      this.setState({playState: 'paused'});
    });
  };

  play = () => {
    if (this.sound) {
      this.sound.play(() => {
        this.setState({playState: 'paused'});
        this.playComplete();
      });
      this.setState({playState: 'playing'});
    }
  };

  record = async () => {
    if (!this.state.hasPermission) {
      return;
    }
    this.onPause();
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

  finishRecord = async () => {
    const audioFile = await AudioRecord.stop();
    if (this.interval) {
      clearInterval(this.interval);
    }
    await this.setState({
      recording: false,
      audioPath: audioFile,
    });
    this.finishRecording(
      true,
      !OS.IsAndroid ? audioFile : `file://${audioFile}`,
    );
  };

  finishRecording = async (didSucceed, filePath) => {
    const {type, word, sentence, answerQuestion} = this.props;
    let content;
    if (type === 'sentence') {
      content = sentence;
    }
    if (type === 'word') {
      content = word;
    }
    this.setState({loadingRecognize: true});
    setTimeout(async () => {
      const bodyFormData = new FormData();
      let isCorrect = false;
      const nameFile = filePath.split('/')[filePath.split('/').length - 1];
      bodyFormData.append('audio', {
        uri: filePath,
        name: `${nameFile}`,
        type: 'audio/vnd.wave',
      });
      bodyFormData.append('text', content);
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
      this.props.increaseWorkSpeak();
      playAudioAnswer(isCorrect);
      answerQuestion(isCorrect, 1);
      setTimeout(() => {
        generateNextActivity();
      }, 2000);
    }, 1000);
  };

  toggleRecord = async () => {
    if (!this.state.recording) {
      await this.record();
    } else {
      await this.finishRecord();
    }
  };

  renderAwardOrDead = () => {
    const {answer} = this.state;
    if (!answer.show || !answer.isCorrect) {
      return null;
    }
    return (
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
            color={colors.helpText}
            paddingHorizontal={10}>
            +1
          </Text>
          <Image
            source={images.star}
            style={{
              width: 30,
              height: 30,
            }}
          />
        </RowContainer>
      </AnimatedView>
    );
  };

  render() {
    const {
      playState,
      answer,
      loadingRecognize,
      recording,
      duration,
      playSeconds,
    } = this.state;
    const {type} = this.props;
    const typeSentence = type === 'sentence';
    const typeWord = type === 'word';

    let processWidth = 0;
    if (duration && duration > 0 && playSeconds) {
      processWidth = (playSeconds / duration) * 100;
    }

    return (
      <ScriptWrapper>
        <FlexContainer backgroundColor={colors.mainBgColor}>
          <FlexContainer
            alignItems="center"
            justifyContent={'center'}
            backgroundColor={colors.mainBgColor}>
            <TouchableOpacity activeOpacity={0.7}>
              <NoFlexContainer
                alignItems="center"
                justifyContent="center"
                marginVertical={36}
                backgroundColor={'rgba(84, 104, 255, 0.05)'}
                style={styles.backgroundWrapperControl}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    const {playState} = this.state;
                    if (playState === 'paused') {
                      this.play();
                    } else {
                      this.onPause();
                    }
                  }}>
                  <NoFlexContainer
                    alignItems="center"
                    justifyContent="center"
                    backgroundColor={colors.primary}
                    style={styles.backgroundControlAudio}>
                    {playState === 'paused' ? (
                      <Ionicons
                        color={colors.white}
                        name={'ios-play'}
                        size={45}
                        style={styles.playIcon}
                      />
                    ) : (
                      <Ionicons
                        color={colors.white}
                        name={'ios-pause'}
                        size={45}
                        style={styles.pauseIcon}
                      />
                    )}
                    <View style={styles.progressContainer}>
                      {/*<ProgressCircle*/}
                      {/*  percent={processWidth > 95 ? 100 : processWidth}*/}
                      {/*  radius={50}*/}
                      {/*  borderWidth={6}*/}
                      {/*  color={colors.mainBgColor}*/}
                      {/*  shadowColor={colors.primary}*/}
                      {/*  bgColor={colors.primary}*/}
                      {/*/>*/}
                      <AnimatedCircularProgress
                        ref={(ref) => (this.circularProgress = ref)}
                        size={100}
                        width={6}
                        fill={processWidth > 95 ? 100 : processWidth}
                        tintColor={colors.white}
                        backgroundColor={colors.primary}
                      />
                    </View>
                  </NoFlexContainer>
                </TouchableOpacity>
              </NoFlexContainer>
            </TouchableOpacity>
          </FlexContainer>
          <NoFlexContainer
            paddingHorizontal={24}
            alignItems={'center'}
            style={{
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              height: OS.Game,
              paddingBottom: 24,
            }}
            backgroundColor={colors.white}>
            <Text fontSize={19} bold center style={styles.title}>
              {this.props.title}
            </Text>
            {typeWord && (
              <>
                <Text h2 bold primary center paddingVertical={8}>
                  {this.props.word}
                </Text>
                <Text h5 color={colors.helpText} center>
                  {this.props.pronunciation}
                </Text>
              </>
            )}
            {typeSentence && (
              <Text fontSize={19} bold primary center style={styles.sentence}>
                {this.props.sentence}
              </Text>
            )}
            <TouchableOpacity
              onPress={this.toggleRecord}
              activeOpacity={0.65}
              style={styles.record}>
              {!answer.show && (
                <>
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
                      style={{color: colors.white, fontSize: 40}}
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
                </>
              )}
            </TouchableOpacity>
          </NoFlexContainer>
        </FlexContainer>
        {answer.show && <Answer isCorrect={answer.isCorrect} />}
        {this.renderAwardOrDead()}
      </ScriptWrapper>
    );
  }
}

const mapStateToProps = (state) => {
  const {currentScriptItem} = state.script;
  if (!currentScriptItem) {
    return {
      score: state.auth.user.score || 0,
      scoreCache: state.script.score || 0,
      googleApiKey: state.stt.stt.api_key,
    };
  }
  return {
    id: currentScriptItem.id,
    title: currentScriptItem.title,
    word: currentScriptItem.word,
    sentence: currentScriptItem.sentence,
    pronunciation: currentScriptItem.pronunciation,
    audio: currentScriptItem.audio,
    score: state.auth.user.score || 0,
    scoreCache: state.script.score || 0,
    googleApiKey: state.stt.stt.api_key,
    currentScriptItem: currentScriptItem,
  };
};

const styles = StyleSheet.create({
  container: {paddingHorizontal: 0},
  pauseIcon: {marginLeft: 1, marginTop: 2},
  playIcon: {marginLeft: 8, marginTop: 2},
  backgroundControlAudio: {width: 100, height: 100, borderRadius: 50},
  backgroundWrapperControl: {width: 148, height: 148, borderRadius: 74},
  dotStyle: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.helpText,
    marginHorizontal: 3,
    marginTop: 23,
  },
  dash: {
    borderStyle: 'dashed',
    borderWidth: 0.5,
    borderColor: '#A2A5AD',
    height: 1,
  },
  swipeDot: {width: 20, height: 20},
  responseContainer: {
    position: 'absolute',
    zIndex: 4,
    width: '100%',
    bottom: 0,
    height: OS.Game + 46,
    backgroundColor: 'transparent',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  record: {
    backgroundColor: colors.primary,
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 16,
  },
  recordFail: {
    backgroundColor: colors.danger,
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 24,
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
  title: {
    marginTop: 32,
    marginBottom: 4,
  },
  loading: {width: 24, height: 24},
  sentence: {paddingTop: 24, paddingBottom: 8},
  progressContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    zIndex: -1,
  },
});

export default connect(mapStateToProps, {
  fetchCourse,
  changeCurrentCourse,
  increaseScore,
  answerQuestion,
  increaseWorkSpeak,
})(ListenSpeakContentContainer);
