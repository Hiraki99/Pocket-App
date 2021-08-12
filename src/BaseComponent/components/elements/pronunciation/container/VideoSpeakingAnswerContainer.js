import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  Linking,
} from 'react-native';
import {View as AnimatedView} from 'react-native-animatable';
import {Icon} from 'native-base';
import RNFS from 'react-native-fs';
import LottieView from 'lottie-react-native';
import AudioRecord from 'react-native-audio-record';
import lodash from 'lodash';
import {connect} from 'react-redux';
import {PERMISSIONS} from 'react-native-permissions';

import {Button, Text} from '~/BaseComponent';
import {
  FlexContainer,
  NoFlexContainer,
  RowContainer,
} from '~/BaseComponent/components/base/CommonContainer';
import VideoPlayer from '~/BaseComponent/components/elements/script/VideoPlayer';
import ScriptWrapper from '~/BaseComponent/components/elements/script/ScriptWrapper';
import {requestPermission} from '~/utils/permission';
import EmbedAudio from '~/BaseComponent/components/elements/script/EmbedAudio';
import {fetchCourse, changeCurrentCourse} from '~/features/course/CourseAction';
import {increaseScore, answerQuestion} from '~/features/script/ScriptAction';
import {colors, images} from '~/themes';
import {requestInit} from '~/utils/utils';
import {OS} from '~/constants/os';
import {generateNextActivity} from '~/utils/script';
import speakApi from '~/features/speak/SpeakApi';
import {translate} from '~/utils/multilanguage';

const initState = {
  loadingRecognize: false,
  answer: {
    show: false,
    isCorrect: false,
  },
  recording: false,
  showForm: false,
};

class VideoSpeakingAnswerContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.answers,
      ...initState,
    };
  }

  componentDidMount = async () => {
    const checkExistedFolder = await RNFS.exists(
      RNFS.DocumentDirectoryPath + '/rolePlayRecorder',
    );
    if (!checkExistedFolder) {
      RNFS.mkdir(RNFS.DocumentDirectoryPath + '/rolePlayRecorder');
    }
    this.initRecord();
  };

  shouldComponentUpdate(nextProps): boolean {
    const {id} = this.props;
    if (id !== nextProps.id) {
      this.setState({
        data: nextProps.answers,
        ...initState,
      });
    }
    return true;
  }

  componentWillUnmount(): void {
    RNFS.unlink(
      `${RNFS.DocumentDirectoryPath}/rolePlayRecorder`,
    ).then(() => {});
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
      this.setState({startTimeRecord: Date.now()});
    } else {
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
    }
  };

  record = async () => {
    if (!this.state.hasPermission) {
      return;
    }
    AudioRecord.start();
    this.setState({recording: true, paused: false});
  };

  toggleRecord = async () => {
    if (!this.state.recording) {
      await this.record();
    } else {
      await this.finishRecord();
    }
  };

  reload = () => {
    this.initRecord();
    this.setState({
      answer: {
        show: false,
        isCorrect: false,
      },
      recording: false,
      showForm: false,
    });
  };

  finishRecord = async () => {
    const audioFile = await AudioRecord.stop();
    const duration = (Date.now() - this.state.startTimeRecord) / 1000;
    await this.setState({
      recording: false,
      audioPath: audioFile,
    });
    this.finishRecording(
      true,
      !OS.IsAndroid ? audioFile : `file://${audioFile}`,
      // audioFile,
      duration,
    );
  };

  finishRecording = async (didSucceed, filePath) => {
    const {list_texts} = this.props;
    const {data} = this.state;
    const bodyFormData = new FormData();
    const nameFile = filePath.split('/')[filePath.split('/').length - 1];
    bodyFormData.append('audio', {
      uri: filePath,
      name: `${nameFile}`,
      type: 'audio/vnd.wave',
    });
    bodyFormData.append('texts', list_texts.join(','));
    let isCorrect = false;
    let dataUpdate = data;
    this.setState({loadingRecognize: true});
    setTimeout(async () => {
      const res = await speakApi.recognizeAudioMultiText(bodyFormData);
      if (res.ok && res.data) {
        const max = lodash.maxBy(res.data, function (o) {
          return o.score;
        });

        dataUpdate = data.map((item, index) => {
          if (item.isAnswer && res.data[index].score === max.score) {
            isCorrect = item.isAnswer;
          }
          return {
            ...item,
            isChoosed: res.data[index].score === max.score,
          };
        });
      }

      this.setState({
        finished: didSucceed,
        answer: {
          show: true,
          isCorrect: isCorrect,
        },
        data: dataUpdate,
        loadingRecognize: false,
      });
      if (isCorrect) {
        this.props.answerQuestion(true, 2);
        setTimeout(() => {
          generateNextActivity();
        }, 2000);
      } else {
        this.props.answerQuestion(false, 2);
        setTimeout(() => {
          this.setState({showForm: true});
        }, 2000);
      }
    }, 1000);
  };

  renderItem = ({item}) => {
    const {answer, showForm} = this.state;
    const {answer_type} = this.props;
    const checker = answer.show && item.isChoosed;
    const typeShort = answer_type === 'short';
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          this.setState({selectedItem: item});
        }}>
        <NoFlexContainer
          paddingHorizontal={24}
          paddingVertical={18}
          alignItems={'center'}
          backgroundColor={
            checker && !showForm
              ? item.isAnswer
                ? colors.primary
                : colors.danger
              : colors.white
          }
          style={{borderRadius: 15}}>
          <Text
            h5={!typeShort}
            h4={typeShort}
            bold={typeShort}
            color={
              checker && !showForm
                ? colors.white
                : typeShort
                ? colors.primary
                : colors.helpText
            }
            center>
            {item.text}
          </Text>
        </NoFlexContainer>
      </TouchableOpacity>
    );
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
            color={colors.white}
            paddingHorizontal={10}>
            +2
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
    const {showForm, recording, loadingRecognize, answer} = this.state;
    const {video, audio} = this.props;

    return (
      <ScriptWrapper>
        <FlexContainer backgroundColor={colors.mainBgColor}>
          {video && (
            <VideoPlayer
              videoId={video.id}
              start={video.start}
              end={video.end}
              height={220}
            />
          )}
          {audio && (
            <EmbedAudio
              ref={(ref) => (this.audioRef = ref)}
              isUser={true}
              audio={audio}
              isSquare={true}
              showTime={false}
            />
          )}
          {this.renderAwardOrDead()}
          <FlexContainer paddingVertical={24} paddingHorizontal={24}>
            <FlatList
              ListHeaderComponent={() => (
                <Text
                  fontSize={24}
                  color={colors.helpText}
                  center
                  accented
                  bold
                  paddingVertical={24}>
                  {translate('Hãy trả lời câu hỏi')}
                </Text>
              )}
              data={this.state.data}
              keyExtractor={(item, index) => `${item.key}_${index}`}
              renderItem={this.renderItem}
              ItemSeparatorComponent={() => <View style={{height: 12}} />}
              style={{flexGrow: 0}}
              initialNumToRender={3}
              showsVerticalScrollIndicator={false}
            />
            {!showForm ? (
              <TouchableOpacity
                onPress={this.toggleRecord}
                activeOpacity={0.65}
                style={
                  answer.isCorrect || !answer.show
                    ? styles.record
                    : styles.recordFail
                }>
                <>
                  {!answer.show && (
                    <>
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
                          style={styles.recordLotteria}
                        />
                      )}
                    </>
                  )}

                  {answer.show && (
                    <>
                      <Icon
                        name={answer.isCorrect ? 'check' : 'close'}
                        type="FontAwesome"
                        style={{color: colors.white, fontSize: 50}}
                      />
                    </>
                  )}
                </>
              </TouchableOpacity>
            ) : (
              <View paddingVertical={24}>
                <Button
                  primary
                  transparent
                  outline
                  block
                  rounded
                  large
                  marginBottom={24}
                  shadow={!OS.IsAndroid}
                  icon
                  reloadIcon
                  uppercase
                  bold
                  onPress={this.reload}>
                  {translate('Làm lại')}
                </Button>
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
                    generateNextActivity();
                  }}>
                  {translate('Tiếp tục')}
                </Button>
              </View>
            )}
          </FlexContainer>
        </FlexContainer>
      </ScriptWrapper>
    );
  }
}

const mapStateToProps = (state) => {
  const {currentScriptItem} = state.script;
  const baseRes = {
    score: state.auth.user.score || 0,
    scoreCache: state.script.score || 0,
  };
  if (!currentScriptItem) {
    return baseRes;
  }
  const list_texts = currentScriptItem.answers.map((item) => item.text);

  return {
    currentScriptItem,
    id: currentScriptItem.id,
    video: currentScriptItem.video,
    audio: currentScriptItem.audio,
    answers: currentScriptItem.answers,
    answer_type: currentScriptItem.answer_type,
    list_texts,
    ...baseRes,
  };
};

const styles = StyleSheet.create({
  record: {
    backgroundColor: colors.primary,
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 24,
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
  responseContainer: {
    position: 'absolute',
    zIndex: 4,
    width: '100%',
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default connect(mapStateToProps, {
  fetchCourse,
  changeCurrentCourse,
  increaseScore,
  answerQuestion,
})(VideoSpeakingAnswerContainer);
