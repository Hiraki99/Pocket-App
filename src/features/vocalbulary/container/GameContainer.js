import React from 'react';
import {StyleSheet, Image, Alert} from 'react-native';
import shuffle from 'lodash/shuffle';
import {connect} from 'react-redux';
import Carousel from 'react-native-snap-carousel';
import {View as AnimatedView} from 'react-native-animatable';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

import GameItem from './GameItem';

import {
  FlexContainer,
  NoFlexContainer,
  RowContainer,
  Text,
} from '~/BaseComponent';
import ScriptWrapper from '~/BaseComponent/components/elements/script/ScriptWrapper';
import {customNavigationOptions} from '~/navigation/navigationHelper';
import {colors, images} from '~/themes';
import {fetchCourse, changeCurrentCourse} from '~/features/course/CourseAction';
import {OS} from '~/constants/os';
import navigator from '~/navigation/customNavigator';
import {
  formatsMinuteOptions,
  makeid,
  playAudio,
  genOtherAnswer,
} from '~/utils/utils';
import {answerQuestion} from '~/features/script/ScriptAction';
import {translate} from '~/utils/multilanguage';

class GameContainer extends React.Component {
  static navigationOptions = customNavigationOptions;
  constructor(props) {
    super(props);
    this.state = {
      time: 90,
      countConsecutive: 0,
      level: {
        upStatus: false,
        number: 1,
      },
      timeout: false,
      countSuccess: 0,
      countAnswer: 0,
      turn: 3,
      star: 0,
      endGame: false,
      activeSlide: 0,
      visibleModal: false,
      pause: false,
      gameData: [],
      numberQuestionOnceGame: 0,
    };
  }

  componentDidMount(): void {
    if (this.props.words.length > 0) {
      this.initGame(this.props.words, this.props.errorGame);
    }
  }

  shouldComponentUpdate(nextProps) {
    if (
      (this.props.words.length !== nextProps.words.length &&
        nextProps.words.length > 0) ||
      this.props.errorGame !== nextProps.errorGame
    ) {
      this.initGame(nextProps.words, nextProps.errorGame);
    }
    return true;
  }

  componentWillUnmount(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    if (this.timeoutNext) {
      clearTimeout(this.timeoutNext);
    }
    if (this.timeoutLevel) {
      clearTimeout(this.timeoutLevel);
    }
    if (this.intervalGame) {
      clearInterval(this.intervalGame);
    }
  }

  initGame = (data, errorGame) => {
    if (!errorGame) {
      let gameData = [];
      const NumberQuestionOnceGame = data.length;
      const numberLoop = Math.ceil(OS.MAX_SHUFFLE / NumberQuestionOnceGame);
      for (let i = 0; i < numberLoop; i++) {
        const genData = this.genDataGame(data, i);
        gameData.push(...shuffle(genData));
      }
      this.setState({gameData, numberQuestionOnceGame: data.length});
      if (!this.intervalGame) {
        this.intervalGame = setInterval(() => {
          const {time, pause} = this.state;
          if (time === 0) {
            clearInterval(this.intervalGame);
            this.endGame();
            return;
          }
          if (!pause) {
            this.setState({time: time - 1});
          }
        }, 1000);
      }
    } else {
      Alert.alert(
        `${translate('Thông báo')}`,
        `${translate('Có lỗi xảy ra, Vui lòng thử lại sau')}`,
        [
          {
            text: `${translate('Đồng ý')}`,
          },
        ],
      );
      navigator.navigate('Activity');
    }
  };

  genDataGame = (data, index) => {
    let dataGame = [];
    const lengthVocabulary = data.length;
    const randomSmallOtherQuestion = Math.round(Math.random() * 2);
    const numberOtherQuestion =
      lengthVocabulary > 5
        ? 3
        : randomSmallOtherQuestion > 0
        ? randomSmallOtherQuestion
        : 1;
    const arrayIndex = Array.from(Array(lengthVocabulary).keys());
    for (let i = 0; i < lengthVocabulary; i++) {
      const gameDataItem = [];
      const listOtherKey = arrayIndex.filter((item) => item !== i);
      let imageQuestion = data[i].images[index];
      if (!imageQuestion) {
        imageQuestion =
          data[i].images[
            Math.round(Math.random() * (data[i].images.length - 1))
          ];
      }
      gameDataItem.push({
        text: data[i].name,
        isAnswer: true,
        key: makeid(8),
      });
      const listKeyOtherAnswer = genOtherAnswer(
        listOtherKey,
        listOtherKey.length,
        numberOtherQuestion,
      );
      listKeyOtherAnswer.forEach((iter) => {
        gameDataItem.push({
          text: data[iter].name,
          isAnswer: false,
          key: makeid(8),
        });
      });
      dataGame.push({
        image: imageQuestion,
        answers: shuffle(gameDataItem),
      });
    }
    return dataGame;
  };

  endGame = () => {
    if (this.intervalGame) {
      clearInterval(this.intervalGame);
    }
    this.setState({endGame: true});
    this.timeout = setTimeout(() => {
      const {
        countSuccess,
        countAnswer,
        star,
        numberQuestionOnceGame,
      } = this.state;
      navigator.navigate('GameAchievement', {
        countSuccess: countSuccess,
        countAllItems: countAnswer,
        starIncrease: star,
        NumberQuestionOnceGame: numberQuestionOnceGame,
      });
    }, 3000);
  };

  onPause = (value) => this.setState({pause: value});

  onNext = () => {
    const {gameData} = this.state;
    if (this._carousel.currentIndex === gameData.length - 1) {
      this.endGame(true);
      return;
    }
    if (this._carousel) {
      this._carousel.snapToNext();
    }
  };

  getTimeByLevel = () => {
    const {level} = this.state;
    const baseTime = 15;

    const timeOutValue =
      baseTime - level.number * 2 > 3 ? baseTime - level.number * 2 : 3;
    return level.number === 1 ? baseTime : timeOutValue;
  };

  checkEnableUpLevel = (level) => {
    const baseTime = 15;
    return baseTime - level * 2 > 3;
  };

  updateTerminalGame = async (config) => {
    const {turn, star, countSuccess, level, countAnswer} = this.state;
    const {answerQuestion} = this.props;

    answerQuestion(config.isCorrect, 1);

    if (!config.isCorrect) {
      const restTurn = turn - 1 > 0 ? turn - 1 : 0;
      await this.setState({
        turn: restTurn,
        countAnswer: countAnswer + 1,
      });
      if (restTurn === 0) {
        this.endGame();
        return;
      }
      this.onNext();
      return;
    }

    await this.setState({
      star: star + 1,
      countSuccess: countSuccess + 1,
      countAnswer: countAnswer + 1,
    });
    if ((countSuccess + 1) % 3 === 0 && countSuccess + 1 > 0) {
      const newLevel = level.number + 1;
      if (this.checkEnableUpLevel(newLevel)) {
        await this.setState({
          level: {
            upStatus: true,
            number: newLevel,
          },
        });
        playAudio('levelUpWaterUp');
        this.timeoutLevel = setTimeout(() => {
          this.setState({
            level: {
              upStatus: false,
              number: newLevel,
            },
          });
          this.onNext();
        }, 2000);
        return;
      }
    }
    this.onNext();
  };

  renderTimeOut = () => {
    const {turn} = this.state;
    return (
      <AnimatedView
        animation="fadeInUp"
        useNativeDriver={true}
        easing="ease-in-out"
        duration={500}
        style={styles.timeOutContainer}>
        <NoFlexContainer alignItems="center">
          <Image
            source={turn !== 0 ? images.timeout : images.turnout}
            style={styles.iconTimeout}
          />
          <Text
            h2
            fontSize={32}
            bold
            color={colors.white}
            paddingVertical={8}
            paddingHorizontal={12}>
            {turn === 0
              ? `${translate('Hết lượt chơi')}`
              : `${translate('Hết giờ')}`}
          </Text>
        </NoFlexContainer>
      </AnimatedView>
    );
  };

  renderControlGame = () => {
    const {turn, time, countAnswer, countSuccess} = this.state;
    const {number_lives} = this.props;
    const list = [];
    for (let i = 0; i < number_lives; i++) {
      list.push(
        <AntDesign
          name="heart"
          key={`geader_${i}`}
          size={18}
          color={turn > i ? colors.heartActive : colors.heartDeactive}
          style={styles.icon}
        />,
      );
    }

    return (
      <RowContainer
        backgroundColor={colors.blurBack}
        justifyContent={'space-around'}
        paddingHorizontal={16}
        paddingVertical={10}
        style={styles.control}>
        <RowContainer>
          <MaterialCommunityIcons
            name="check-bold"
            size={16}
            color={colors.white}
          />
          <Text h6 bold color={colors.white} paddingHorizontal={4}>
            {`${countSuccess}/${countAnswer}`}
          </Text>
        </RowContainer>
        <RowContainer>{list}</RowContainer>
        <RowContainer>
          <MaterialCommunityIcons
            name="timer"
            size={16}
            color={time === 0 ? 'yellow' : colors.white}
          />
          <Text
            h6
            bold
            color={time === 0 ? 'yellow' : colors.white}
            paddingHorizontal={4}>
            {formatsMinuteOptions(time)}
          </Text>
        </RowContainer>
      </RowContainer>
    );
  };

  renderItem = ({item, index}) => {
    const {gameData} = this.state;
    return (
      <GameItem
        item={item}
        active={index === this.state.activeSlide}
        key={`${item.key}_${index}`}
        onNext={this.onNext}
        updateTerminalGame={this.updateTerminalGame}
        nextEnable={index < gameData.length - 1}
        onPause={this.onPause}
        endGame={this.state.endGame}
        level={this.state.level}
        time={this.getTimeByLevel()}
      />
    );
  };

  renderGame = () => {
    const {gameData} = this.state;
    return (
      <>
        {gameData.length > 0 && (
          <Carousel
            ref={(c) => {
              this._carousel = c;
            }}
            onSnapToItem={(index) => this.setState({activeSlide: index})}
            data={gameData}
            extraData={[this.state.level, this.state.endGame]}
            renderItem={this.renderItem}
            sliderWidth={OS.WIDTH}
            itemWidth={OS.WIDTH}
            firstItem={0}
            inactiveSlideScale={0.9}
            inactiveSlideOpacity={0.7}
            scrollEnabled={false}
            containerCustomStyle={{zIndex: 4}}
            loop={false}
            initialNumToRender={3}
          />
        )}
      </>
    );
  };

  render() {
    const {endGame} = this.state;
    return (
      <ScriptWrapper game>
        <FlexContainer
          alignItems="center"
          justifyContent="center"
          backgroundColor="transparent"
          style={styles.container}>
          {endGame && this.renderTimeOut()}
          {this.renderControlGame()}
          {this.renderGame()}
        </FlexContainer>
      </ScriptWrapper>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    item: [],
    words: state.vocabulary.wordGroup,
    errorGame: false,
    score: state.auth.user.score || 0,
    number_lives: 3,
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
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingTop: 0,
    flex: 1,
    overflow: 'hidden',
  },
  control: {
    borderRadius: 16,
    position: 'absolute',
    zIndex: 5,
    top: 16,
    width: 300,
  },
  controlContainer: {
    width: 300,
    zIndex: 2,
    position: 'absolute',
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
});
export default connect(mapStateToProps, {
  fetchCourse,
  changeCurrentCourse,
  answerQuestion,
})(GameContainer);
