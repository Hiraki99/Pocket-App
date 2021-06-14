import React from 'react';
import {
  StyleSheet,
  Image,
  Alert,
  View,
  FlatList,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import shuffle from 'lodash/shuffle';
import {connect} from 'react-redux';
import Carousel from 'react-native-snap-carousel';
import {
  View as AnimateView,
  View as AnimatedView,
} from 'react-native-animatable';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FastImage from 'react-native-fast-image';

import {
  FlexContainer,
  NoFlexContainer,
  RowContainer,
  SeparatorVertical,
  Text,
} from '~/BaseComponent';
import VocabularyPictureScatterItem from '~/BaseComponent/components/elements/vocabulary/VocabularyPictureScatterItem';
import ScriptWrapper from '~/BaseComponent/components/elements/script/ScriptWrapper';
import {colors, images} from '~/themes';
import {fetchCourse, changeCurrentCourse} from '~/features/course/CourseAction';
import {increaseScore} from '~/features/script/ScriptAction';
import {OS} from '~/constants/os';
import navigator from '~/navigation/customNavigator';
import {
  formatsMinuteOptions,
  playAudio,
  playAudioAnswer,
  timeGameByWord,
} from '~/utils/utils';
import {translate} from '~/utils/multilanguage';

class VocabularyPictureScatterContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: timeGameByWord(props.words.length),
      timeout: false,
      countSuccess: 0,
      countAnswer: 0,
      turn: 3,
      star: 0,
      activeSlide: 0,
      gameData: [],
      gameImageData: [],
      numberQuestionOnceGame: 0,
      answer: {
        show: false,
        isCorrect: false,
      },
      award: {
        show: false,
        isCorrect: false,
      },
      itemSelected: null,
    };
  }

  shouldComponentUpdate(nextProps): boolean {
    if (
      this.props.words.length !== nextProps.words.length ||
      this.props.errorGame !== nextProps.errorGame
    ) {
      this.setState({time: timeGameByWord(nextProps.words.length)});
      this.initGame(nextProps.words, nextProps.errorGame);
    }
    return true;
  }

  componentDidMount = async () => {
    this.initGame(this.props.words, this.props.errorGame);
    this.interval = setInterval(() => {
      const {time, pause} = this.state;
      if (time === 0) {
        clearInterval(this.interval);
        this.endGame();
        return;
      }
      if (!pause) {
        this.setState({time: time - 1});
      }
    }, 1000);
  };

  componentWillUnmount(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  genDataGame = (data) => {
    if (!data || (data && data.length === 0)) {
      return [];
    }
    let shuffleData = shuffle(data);
    if (shuffleData.length > OS.MAX_ANSWER_PICTURE) {
      shuffleData = shuffleData.slice(0, OS.MAX_ANSWER_PICTURE);
    }
    shuffleData = shuffleData.map((item) => {
      return {
        ...item,
        selectedImage:
          item.images[Math.round(Math.random() * (item.images.length - 1))],
        isShowImage: true,
      };
    });
    return shuffleData;
  };

  initGame = async (words, errorGame) => {
    if (!words) {
      return;
    }
    if (errorGame) {
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
      return;
    }
    const genData = this.genDataGame(words);
    if (genData && genData.length > 0) {
      this.setState({numberQuestionOnceGame: genData.length});
      await this.setState({
        gameData: shuffle(genData),
        gameImageData: shuffle(genData),
      });
      this.setState({activeSlide: 0});
      this._carousel.snapToItem(0);
    }
  };

  endGame = () => {
    const {turn} = this.state;
    this.setState({endGame: true});
    if (turn === 0) {
      playAudioAnswer(false);
    } else {
      playAudio('wrong');
    }
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

  onNext = () => {
    const {activeSlide} = this.state;
    const {item} = this.props;
    if (activeSlide === item.length - 1) {
      return;
    }
    if (this._carousel) {
      this._carousel.snapToNext();
      this.setState({activeSlide: activeSlide + 1});
    }
  };

  updateTerminalGame = async (config) => {
    const {turn, star, countSuccess, countAnswer, gameImageData} = this.state;
    if (!config.isCorrect) {
      const restTurn = turn - 1 > 0 ? turn - 1 : 0;
      await this.setState({
        turn: restTurn,
        countAnswer: countAnswer + 1,
      });
      if (restTurn === 0) {
        this.endGame();
      }
      return;
    }
    const {item} = config;
    const updateGameData = gameImageData.map((it) => {
      if (it._id === item._id) {
        return {
          ...it,
          isShowImage: false,
        };
      }
      return it;
    });
    await this.setState({
      star: star + 1,
      countSuccess: countSuccess + 1,
      countAnswer: countAnswer + 1,
      gameImageData: updateGameData,
    });
  };

  setAnswer = async (item) => {
    const {activeSlide, gameData} = this.state;
    const isCorrect = item.name === gameData[activeSlide].name;
    await this.setState({
      answer: {
        show: true,
        isCorrect: isCorrect,
      },
      award: {
        show: true,
        isCorrect: isCorrect,
      },
      itemSelected: item,
    });
    playAudioAnswer(isCorrect);
    if (isCorrect) {
      this.props.increaseScore(1, 1, 0);
    } else {
      this.props.increaseScore(0, 0, 1);
    }
    this.updateTerminalGame({isCorrect: isCorrect, item});
    setTimeout(() => {
      if (this._carousel.currentIndex < gameData.length - 1) {
        this.onNext();
      } else {
        this.initGame(this.props.words, this.props.errorGame);
      }
      this.setState({answer: {show: false}, award: {show: false}});
    }, 1000);
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
            source={turn === 0 ? images.turnout : images.timeout}
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
        backgroundColor={colors.primary}
        justifyContent={'space-around'}
        paddingHorizontal={16}
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
        <RowContainer paddingVertical={15}>
          <MaterialCommunityIcons
            name="timer"
            size={16}
            color={time === 0 ? 'yellow' : colors.white}
          />
          <Text
            h6
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
      <VocabularyPictureScatterItem
        item={item}
        active={index === this.state.activeSlide}
        key={`${item.key}_${index}`}
        onNext={this.onNext}
        updateTerminalGame={this.updateTerminalGame}
        nextEnable={index < gameData.length - 1}
        onEndList={this.onEndList}
        endGame={this.state.endGame}
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
            extraData={[gameData]}
            renderItem={this.renderItem}
            sliderWidth={OS.WIDTH}
            itemWidth={OS.WIDTH}
            firstItem={0}
            inactiveSlideScale={0.9}
            inactiveSlideOpacity={0.7}
            scrollEnabled={false}
            loop={false}
          />
        )}
      </>
    );
  };

  renderImageItem = ({item}) => {
    const {answer, itemSelected} = this.state;
    return (
      <View>
        <TouchableOpacity
          activeOpacity={0.7}
          disable={!item.showImage}
          onPress={() => this.setAnswer(item)}>
          {item.isShowImage ? (
            <FastImage
              source={{uri: item.selectedImage}}
              style={styles.answerContainer}
            />
          ) : (
            <View style={[styles.answerContainer]} />
          )}
        </TouchableOpacity>
        {itemSelected && answer.show && itemSelected._id === item._id && (
          <AnimateView
            style={[
              styles.result,
              {backgroundColor: answer.isCorrect ? '#18D63C' : '#FF3636'},
            ]}
            animation="fadeInUp"
            useNativeDriver={true}
            easing="ease-in-out"
            duration={500}>
            <ImageBackground
              source={answer.isCorrect ? images.correctBg : images.wrongBg}
              resizeMode="cover"
              style={styles.resultBg}>
              {answer.isCorrect && (
                <Image source={images.checkSuccess} style={styles.iconAnswer} />
              )}
              {!answer.isCorrect && (
                <Image source={images.wrong} style={styles.iconAnswer} />
              )}
            </ImageBackground>
          </AnimateView>
        )}
      </View>
    );
  };

  renderAwardOrDead = () => {
    const {award} = this.state;
    if (!award.show || !award.isCorrect) {
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

  getHeightByItem = (data) => {
    if (data <= 3) {
      return 110;
    }
    if (data <= 6) {
      return 220;
    }
    if (data <= 9) {
      return 330;
    }
    return 440;
  };

  render() {
    const {endGame, gameImageData} = this.state;
    return (
      <ScriptWrapper game={false} showProgress={false}>
        <FlexContainer
          alignItems="center"
          justifyContent="space-between"
          backgroundColor={colors.mainBgColor}
          style={styles.container}>
          {this.renderControlGame()}
          <FlexContainer justifyContent="center">
            <FlatList
              data={gameImageData}
              keyExtractor={(item, index) => `${item.id}_${index}`}
              renderItem={this.renderImageItem}
              numColumns={3}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <SeparatorVertical sm />}
              style={{maxHeight: this.getHeightByItem(gameImageData.length)}}
            />
          </FlexContainer>
          <View style={styles.bottom}>{this.renderGame()}</View>
        </FlexContainer>
        {endGame && this.renderTimeOut()}
        {this.renderAwardOrDead()}
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
  container: {
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 48,
    flex: 1,
    overflow: 'hidden',
  },
  control: {
    borderRadius: 24,
    position: 'absolute',
    zIndex: 5,
    top: 24,
    width: 280,
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
  bottom: {height: 80},
  responseContainer: {
    position: 'absolute',
    zIndex: 5,
    width: '100%',
    bottom: 0,
    height: 200,
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
  iconAnswer: {
    width: 28,
    height: 28,
  },
  answerContainer: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginLeft: 8,
    backgroundColor: 'rgba(226, 230, 239, 0.6)',
  },
  result: {
    position: 'absolute',
    borderRadius: 8,
    overflow: 'hidden',
    height: 100,
    width: 100,
    backgroundColor: colors.white,
    justifyContent: 'center',
    marginLeft: 8,
    zIndex: 10,
  },
  resultBg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default connect(mapStateToProps, {
  fetchCourse,
  changeCurrentCourse,
  increaseScore,
})(VocabularyPictureScatterContainer);
