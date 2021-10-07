import React from 'react';
import {StyleSheet, View, Animated, Easing} from 'react-native';
import {connect} from 'react-redux';
import TrackPlayer, {STATE_PLAYING} from 'react-native-track-player';
import shuffle from 'lodash/shuffle';
import Carousel from 'react-native-snap-carousel';

import VocabularyWordMeditationItem from '~/BaseComponent/components/elements/vocabulary/VocabularyWordMeditationItem';
import {Button, Text, FlexContainer, CommonHeader} from '~/BaseComponent';
import {customNavigationOptions} from '~/navigation/navigationHelper';
import {fetchCourse, changeCurrentCourse} from '~/features/course/CourseAction';
import {OS} from '~/constants/os';
import navigator from '~/navigation/customNavigator';
import {colors, images} from '~/themes';
import {forceBackActivity, playAudio, removeAudio} from '~/utils/utils';

class VocabularyWordMeditationContainer extends React.PureComponent {
  static navigationOptions = customNavigationOptions;
  constructor(props) {
    super(props);
    this.state = {
      star: 0,
      countDown: 3,
      activeSlide: 0,
      showList: false,
      loading: false,
      data: shuffle(props.words),
      countWordListened: 0,
      timeListened: 0,
      outScreen: false,
      listPlayTrack: [],
      numItemPlayed: 0,
      pauseBackground: false,
    };
    this.spinValue = new Animated.Value(0);
  }

  componentDidMount = async () => {
    setTimeout(() => {
      this.setState({loading: true});
    }, 100);
    this.interval = setInterval(() => {
      const {countDown} = this.state;
      if (countDown > 0) {
        this.setState({countDown: countDown - 1});
      } else {
        playAudio('midnightGong');
        if (this.interval) {
          clearInterval(this.interval);
        }
        setTimeout(() => {
          this.setState({showList: true});
        }, 1500);
      }
    }, 1000);
    this.spin();
    TrackPlayer.updateOptions({
      stopWithApp: false,
      capabilities: [TrackPlayer.CAPABILITY_PLAY, TrackPlayer.CAPABILITY_PAUSE],
      compactCapabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
      ],
      previousIcon: null,
      nextIcon: null,
    });
    TrackPlayer.addEventListener('remote-play', () => {
      TrackPlayer.play();
    });

    TrackPlayer.addEventListener('remote-pause', () => {
      TrackPlayer.pause();
    });

    this.listener = TrackPlayer.addEventListener(
      'playback-state',
      async (data) => {
        const {listPlayTrack} = this.state;
        const currentTrack = await TrackPlayer.getCurrentTrack();

        this.setState({stateAudio: data.state});
        if (
          data.state === STATE_PLAYING ||
          data.state === TrackPlayer.STATE_STOPPED
        ) {
          const duration = await TrackPlayer.getDuration();
          if (
            listPlayTrack.length > 0 &&
            currentTrack === listPlayTrack[listPlayTrack.length - 1].id
          ) {
            const currentTime = await TrackPlayer.getPosition();
            this.timeout = setTimeout(() => {
              const {words} = this.props;
              this.updateTimeListened(duration);
              if (this.state.numItemPlayed === words.length) {
                this.setState({
                  data: [...shuffle(words)],
                  activeSlide: 0,
                  listPlayTrack: [],
                  numItemPlayed: 0,
                });
                this.carouselQuestion.snapToItem(0);
              } else {
                this.nextQuestion();
              }
              clearTimeout(this.timeout);
            }, (duration - currentTime) * 1000);
          } else {
            this.updateTimeListened(duration);
          }
        }
        if (data.state === TrackPlayer.STATE_PAUSED) {
          clearTimeout(this.timeout);
          this.timeout = null;
        }
      },
    );
  };

  shouldComponentUpdate(nextProps) {
    if (
      this.props.words.length !== nextProps.words.length ||
      this.props.errorGame !== nextProps.errorGame
    ) {
      this.setState({data: shuffle(nextProps.words)});
    }
    return true;
  }

  componentWillUnmount(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
    removeAudio('midnightGong');
    this.listener = null;
    TrackPlayer.reset();
  }

  addListPlayTrack = (data) => {
    const {listPlayTrack, numItemPlayed} = this.state;
    this.setState({
      listPlayTrack: [...listPlayTrack, ...data],
      numItemPlayed: numItemPlayed + 1,
    });
  };

  spin() {
    this.spinValue.setValue(0);
    Animated.timing(this.spinValue, {
      toValue: 1,
      duration: 3000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(() => this.spin());
  }

  updateTimeListened = (value) => {
    const {timeListened} = this.state;
    this.setState({timeListened: timeListened + value});
  };

  nextQuestion = () => {
    const {countWordListened} = this.state;
    if (this.carouselQuestion) {
      this.carouselQuestion.snapToNext();
      this.setState({countWordListened: countWordListened + 1});
    }
  };

  onClose = () => {};

  endMeditation = () => {
    this.setState({outScreen: true});
    TrackPlayer.reset();
    const {countWordListened, timeListened} = this.state;
    navigator.navigate('GameAchievement', {
      countAllItems: countWordListened,
      timeListened,
      type: 'vocabulary_meditation',
    });
  };

  renderQuestionTextItem = ({item, index}) => {
    return (
      <VocabularyWordMeditationItem
        item={item}
        active={index === this.state.activeSlide}
        onNext={this.nextQuestion}
        updateTimeListened={this.updateTimeListened}
        outScreen={this.state.outScreen}
        updateListPlayTrack={this.addListPlayTrack}
        lessonIndex={this.props.lessonIndex}
        partIndex={this.props.partIndex}
      />
    );
  };

  onSnapToItem = (index) => this.setState({activeSlide: index});

  renderQuestionText = () => {
    const {data} = this.state;
    if (data.length === 0) {
      return;
    }
    return (
      <Carousel
        ref={(c) => {
          this.carouselQuestion = c;
        }}
        onSnapToItem={this.onSnapToItem}
        data={data}
        renderItem={this.renderQuestionTextItem}
        sliderWidth={OS.WIDTH}
        itemWidth={OS.WIDTH - 60}
        firstItem={this.state.activeSlide}
        inactiveSlideScale={0.9}
        inactiveSlideOpacity={0.7}
        scrollEnabled={false}
        initialNumToRender={3}
        containerCustomStyle={{zIndex: 4}}
        loop={false}
      />
    );
  };

  onCloseHeader = () => {
    forceBackActivity(
      false,
      () => {},
      this.props.isActivityVip,
      this.props.fromWordGroup,
    );
  };

  render() {
    const {showList, countWordListened} = this.state;

    const spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    return (
      <>
        <CommonHeader
          back={false}
          themeWhite
          title={!showList ? 'word meditation' : 'thiền từ'}
          close
          onClose={this.onCloseHeader}
        />
        <FlexContainer
          style={styles.container}
          paddingHorizontal={24}
          backgroundColor={colors.mainBgColor}>
          {!this.state.showList ? (
            <FlexContainer justifyContent={'center'} alignItems={'center'}>
              <View style={styles.containerCountdown}>
                <Animated.Image
                  source={images.backgroundCountdown}
                  style={[styles.spinContainer, {transform: [{rotate: spin}]}]}
                />
                <View style={styles.timer}>
                  <Text color={colors.white} fontSize={64} accented bold>
                    {this.state.countDown}
                  </Text>
                </View>
              </View>
            </FlexContainer>
          ) : (
            <FlexContainer>
              <View
                alignItems="center"
                justifyContent="center"
                style={styles.container}>
                {this.renderQuestionText()}
              </View>
            </FlexContainer>
          )}
          <Button
            large
            primary
            rounded
            block
            uppercase
            bold
            icon
            disabled={!(showList && countWordListened > 0)}
            onPress={this.endMeditation}>
            Kết thúc
          </Button>
        </FlexContainer>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  let words = state.vocabulary.wordGroup || [];
  const currentPartId = state.part.currentPart
    ? state.part.currentPart._id
    : null;
  const currentLessonId = state.lesson.currentLesson
    ? state.lesson.currentLesson._id
    : null;

  return {
    words: shuffle(words),
    errorGame: false,
    score: state.auth.user.score || 0,
    partIndex: state.part.parts.findIndex((item) => item._id === currentPartId),
    lessonIndex: state.lesson.lessons.findIndex(
      (item) => item._id === currentLessonId,
    ),
    fromWordGroup: state.vocabulary.fromWordGroup,
    isActivityVip: state.activity.isActivityVip,
  };
};

const styles = StyleSheet.create({
  wave: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    position: 'absolute',
    bottom: OS.Game - 24,
    zIndex: 3,
  },
  container: {
    paddingBottom: 54,
    paddingTop: 32,
  },
  control: {
    borderRadius: 16,
    position: 'absolute',
    zIndex: 5,
    top: 16,
    width: 300,
  },
  containerCountdown: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {paddingHorizontal: 4},
  answerImgContainer: {
    overflow: 'hidden',
    top: 0,
    height: (OS.HEIGHT * 60) / 100,
    width: '100%',
    position: 'absolute',
    zIndex: 1,
  },
  spinContainer: {
    width: 300,
    height: 300,
    position: 'absolute',
    bottom: 0,
  },
  responseContainer: {
    position: 'absolute',
    zIndex: 5,
    width: '100%',
    top: 0,
    height: OS.GameImageWater,
    backgroundColor: ' rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeOutContainer: {
    position: 'absolute',
    zIndex: 1001,
    width: '100%',
    top: 0,
    height: '100%',
    backgroundColor: ' rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconVote: {
    width: 26,
    height: 24,
  },
  iconTimeout: {
    width: 56,
    height: 56,
  },
  questionContainer: {
    position: 'absolute',
    bottom: 0,
    height: OS.Game + 60,
  },
});
export default connect(mapStateToProps, {fetchCourse, changeCurrentCourse})(
  VocabularyWordMeditationContainer,
);
