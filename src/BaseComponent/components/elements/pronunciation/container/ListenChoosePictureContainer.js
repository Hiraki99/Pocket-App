import React from 'react';
import {StyleSheet, TouchableOpacity, Image} from 'react-native';
import {connect} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {View as AnimatedView} from 'react-native-animatable';
import Sound from 'react-native-sound';

import Answer from '~/BaseComponent/components/elements/result/Answer';
import QuestionImages from '~/BaseComponent/components/elements/grammar/element/QuestionImages';
import ScriptWrapper from '~/BaseComponent/components/elements/script/ScriptWrapper';
// eslint-disable-next-line import/order
import {
  FlexContainer,
  NoFlexContainer,
  RowContainer,
  Text,
} from '~/BaseComponent';

// import navigator from '~/navigation/customNavigator';
//import SocketClient from '~/utils/socket-client';
import {fetchCourse, changeCurrentCourse} from '~/features/course/CourseAction';
import {increaseScore, answerQuestion} from '~/features/script/ScriptAction';
import {colors, images} from '~/themes';
import {OS} from '~/constants/os';
import {generateNextActivity} from '~/utils/script';
import {playAudio} from '~/utils/utils';
import {translate} from '~/utils/multilanguage';

class ListenChoosePictureContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: false,
      selectedItem: null,
      playState: 'paused',
      answer: {
        show: false,
        isCorrect: false,
      },
    };
    this.listener = null;
  }

  componentDidMount(): void {
    Sound.enableInSilenceMode(true);
    this.init(this.props.audio);
    this.listener = this.props.navigation.addListener('blur', () => {
      if (this.sound) {
        this.sound.pause();
      }
    });
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.audio !== nextProps.audio) {
      this.setState(
        {
          data: [],
          star: 0,
          loading: false,
          selectedItem: null,
          playState: 'paused',
          answer: {
            show: false,
            isCorrect: false,
          },
        },
        () => {
          if (this.sound) {
            this.sound.pause();
            this.sound.release();
          }
          this.init(nextProps.audio);
        },
      );
    }
    return true;
  }

  componentWillUnmount() {
    if (this.sound) {
      this.sound.release();
    }
    if (this.listener) {
      this.props.navigation.removeListener(this.listener);
    }
  }

  init = (audio) => {
    this.sound = new Sound(audio, '', (err) => {
      if (!err) {
        this.play();
      }
    });
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
      });
      this.setState({playState: 'playing'});
    }
  };

  checkAnswer = (isCorrect) => {
    this.setState({
      answer: {
        show: true,
        isCorrect: isCorrect,
      },
    });
    setTimeout(() => {
      if (isCorrect) {
        playAudio('correct');
      } else {
        playAudio('wrong');
      }
    }, 1000);
    this.props.answerQuestion(isCorrect, 1);
    setTimeout(() => {
      generateNextActivity();
    }, 2000);
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
    const {playState, answer} = this.state;

    return (
      <ScriptWrapper>
        <FlexContainer
          paddingVertical={55}
          paddingHorizontal={24}
          backgroundColor={colors.mainBgColor}>
          <FlexContainer alignItems="center">
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
                  </NoFlexContainer>
                </TouchableOpacity>
              </NoFlexContainer>
            </TouchableOpacity>
          </FlexContainer>
        </FlexContainer>
        <QuestionImages
          data={this.props.currentScriptItem}
          onAnswer={this.checkAnswer}
          questionContent={translate('Tìm bức tranh phù hợp')}
        />
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
    };
  }
  return {
    currentScriptItem,
    answers: currentScriptItem.answers,
    audio: currentScriptItem.audio,
    score: state.auth.user.score || 0,
    scoreCache: state.script.score || 0,
  };
};

const styles = StyleSheet.create({
  container: {paddingHorizontal: 0},
  pauseIcon: {marginLeft: 1, marginTop: 2},
  playIcon: {marginLeft: 8, marginTop: 2},
  backgroundControlAudio: {width: 80, height: 80, borderRadius: 40},
  backgroundWrapperControl: {width: 120, height: 120, borderRadius: 60},
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
});

export default connect(mapStateToProps, {
  fetchCourse,
  changeCurrentCourse,
  increaseScore,
  answerQuestion,
})(ListenChoosePictureContainer);
