import React from 'react';
import {StyleSheet, View, TouchableOpacity, Image} from 'react-native';
import styled from 'styled-components';
import {connect} from 'react-redux';
import Sound from 'react-native-sound';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {View as AnimatedView} from 'react-native-animatable';

import {
  FlexContainer,
  NoFlexContainer,
  RowContainer,
} from '~/BaseComponent/components/base/CommonContainer';
import {Button, Text, TranslateText} from '~/BaseComponent';
import Answer from '~/BaseComponent/components/elements/result/Answer';
import ScriptWrapper from '~/BaseComponent/components/elements/script/ScriptWrapper';
import {customNavigationOptions} from '~/navigation/navigationHelper';
import {fetchCourse, changeCurrentCourse} from '~/features/course/CourseAction';
import {increaseScore, answerQuestion} from '~/features/script/ScriptAction';
import {colors, images} from '~/themes';
import {makeid} from '~/utils/utils';
import {OS} from '~/constants/os';
import {generateNextActivity} from '~/utils/script';
import {LANGUAGE_MAPPING} from '~/constants/lang';
import {translate} from '~/utils/multilanguage';

class PronunciationSyllableHighlightContainer extends React.Component {
  static navigationOptions = customNavigationOptions;
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
  }

  componentDidMount(): void {
    Sound.enableInSilenceMode(true);
    this.init(this.props.audio, this.props.syllable);
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
          this.init(nextProps.audio, nextProps.syllable);
        },
      );
    }
    return true;
  }

  init = (audio, syllable) => {
    this.sound = new Sound(audio, '', (err) => {
      if (!err) {
        this.play();
      }
    });
    const arr = syllable.trim().split('|');

    let pronunciationData = [];
    arr.forEach((item, index) => {
      if (item.includes('(') && item.includes(')')) {
        pronunciationData.push({
          id: makeid(),
          isCorrect: true,
          value: item.replace('(', '').replace(')', ''),
          end: index === arr.length - 1,
        });
      } else {
        if (item.length > 0) {
          pronunciationData.push({
            id: makeid(),
            isCorrect: false,
            value: item,
            end: index === arr.length - 1,
          });
        }
      }
    });
    this.setState({data: pronunciationData});
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
  checkAnswer = () => {
    const {selectedItem} = this.state;
    const {answerQuestion} = this.props;
    this.setState({
      answer: {
        show: true,
        isCorrect: selectedItem.isCorrect,
      },
    });

    answerQuestion(selectedItem.isCorrect, 1);
    setTimeout(() => {
      generateNextActivity();
    }, 2000);
  };

  renderItem = (item, index) => {
    const {selectedItem, answer} = this.state;
    const statusSelected = selectedItem && selectedItem.id === item.id;
    const colorAnswer = statusSelected
      ? colors.primary
      : answer.show && !answer.isCorrect && item.isCorrect
      ? colors.danger
      : colors.helpText;
    return (
      <RowContainer key={`${item.id}_${index}`}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            this.setState({selectedItem: item});
          }}>
          <NoFlexContainer alignItems={'center'}>
            <NoFlexContainer
              alignItems={'center'}
              justifyContent={'center'}
              style={styles.swipeDot}>
              <SDotSelected
                selected={statusSelected}
                showAnswer={answer.show && item.isCorrect}
                wrongAnswer={!answer.isCorrect && item.isCorrect}
              />
            </NoFlexContainer>
            <Text h2 bold color={colorAnswer} paddingHorizontal={5}>
              {item.value}
            </Text>
          </NoFlexContainer>
          <SDashSelected
            selected={statusSelected}
            showAnswer={answer.show && item.isCorrect}
            wrongAnswer={!answer.isCorrect && item.isCorrect}
          />
        </TouchableOpacity>
        {!item.end && (
          <View>
            <View style={styles.dotStyle} />
          </View>
        )}
      </RowContainer>
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
        <FlexContainer paddingVertical={55} paddingHorizontal={24}>
          <FlexContainer alignItems="center">
            <NoFlexContainer
              alignItems="center"
              justifyContent="center"
              backgroundColor="transparent"
              style={styles.container}>
              <Text h4 color={colors.helpText} bold center>
                {translate('Trọng âm')}
              </Text>
            </NoFlexContainer>
            <TranslateText
              textVI={LANGUAGE_MAPPING.vi.choose_pronunciation_correct}
              textEN={LANGUAGE_MAPPING.en.choose_pronunciation_correct}
              RenderComponent={(props) => (
                <Text h6 color={colors.blurBack} center paddingVertical={12}>
                  {props.content}
                </Text>
              )}
              iconStyle={{
                width: 20,
                height: 20,
                borderRadius: 10,
                paddingHorizontal: 4,
              }}
            />
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
            {!answer.isCorrect && (
              <RowContainer
                alignItem={'center'}
                justifyContent={'flex-end'}
                style={{flexWrap: 'wrap'}}>
                {this.state.data.map((item, index) =>
                  this.renderItem(item, index),
                )}
              </RowContainer>
            )}
          </FlexContainer>
          <Button
            large
            primary
            rounded
            block
            uppercase
            bold
            icon
            disabled={!this.state.selectedItem}
            onPress={() => this.checkAnswer()}>
            {translate('Kiểm tra')}
          </Button>
        </FlexContainer>

        {answer.show && <Answer isCorrect={answer.isCorrect} />}
        {this.renderAwardOrDead()}
      </ScriptWrapper>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    syllable: state.script.currentScriptItem
      ? state.script.currentScriptItem.syllable
      : '',
    audio: state.script.currentScriptItem
      ? state.script.currentScriptItem.audio
      : '',
    score: state.auth.user.score || 0,
    scoreCache: state.script.score || 0,
    time:
      state.script.currentScriptItem && state.script.currentScriptItem.time
        ? state.script.currentScriptItem.time
        : 0,
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

const SDotSelected = styled.View`
  width: ${(props) => {
    if (props.selected) {
      return '20px';
    }
    return '8px';
  }}
  height: ${(props) => {
    if (props.selected) {
      return '20px';
    }
    return '8px';
  }}
  borderRadius: ${(props) => {
    if (props.selected) {
      return 10;
    }
    return 4;
  }}
  backgroundColor: ${(props) => {
    if (props.showAnswer) {
      if (props.wrongAnswer) {
        return colors.danger;
      }
    }
    return colors.primary;
  }}
  opacity: ${(props) => {
    if (props.selected || props.showAnswer) {
      return 1;
    }
    return 0.3;
  }}
`;

const SDashSelected = styled.View`
  borderStyle: dashed
  borderWidth: 0.5
  borderColor: ${(props) => {
    if (props.selected) {
      return colors.primary;
    } else if (props.showAnswer) {
      if (props.wrongAnswer) {
        return colors.danger;
      }
    }
    return '#A2A5AD';
  }}
  height: 1
`;

export default connect(mapStateToProps, {
  fetchCourse,
  changeCurrentCourse,
  increaseScore,
  answerQuestion,
})(PronunciationSyllableHighlightContainer);
