import React from 'react';
import PropTypes from 'prop-types';
import {View as AnimatedView} from 'react-native-animatable';
import {Animated, Image, StyleSheet} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

import Answer from '~/BaseComponent/components/elements/result/Answer';
import Question from '~/BaseComponent/components/elements/result/Question';
import {
  AnimatableFastImage,
  NoFlexContainer,
  RowContainer,
  Text,
} from '~/BaseComponent';
import {OS} from '~/constants/os';
import {colors, images} from '~/themes';
import {playAudioAnswer} from '~/utils/utils';
import {translate} from '~/utils/multilanguage';

class GameItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      answer: {
        show: false,
        isCorrect: false,
      },
      award: {
        show: false,
        isCorrect: false,
      },
      waterHeight: new Animated.Value(20),
      timeout: false,
    };
    this.timeout = [];
  }

  componentDidMount(): void {
    if (this.props.active) {
      this.runAnimation();
    }
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.active && this.props.active !== nextProps.active) {
      this.runAnimation();
    }
    return true;
  }

  componentWillUnmount() {
    this.clearAnimation();
  }

  clearAnimation = () => {
    this.timeout.forEach((item) => {
      if (item) {
        clearTimeout(item);
      }
    });
    Animated.timing(this.state.waterHeight).stop();
  };

  runAnimation = () => {
    this.animation = Animated.timing(this.state.waterHeight, {
      toValue: OS.GameImageWater,
      duration: this.props.time * 1000,
      useNativeDriver: false,
    }).start();
    this.timeout.push(setTimeout(this.timeOutAnswer, this.props.time * 1000));
  };

  timeOutAnswer = () => {
    const {updateTerminalGame} = this.props;
    const {answer} = this.state;
    if (!answer.show) {
      this.setState({
        timeout: true,
        award: {
          show: true,
          isCorrect: false,
        },
      });
      playAudioAnswer(false);
      setTimeout(() => {
        this.setState({award: {show: false}, answer: {show: false}});
        updateTerminalGame({isCorrect: false});
      }, 2000);
    }
  };

  setAnswer = async (value) => {
    const {updateTerminalGame} = this.props;
    playAudioAnswer(value);
    await this.setState({
      answer: {
        show: true,
        isCorrect: value,
      },
      award: {
        show: true,
        isCorrect: value,
      },
    });
    setTimeout(
      () => {
        this.setState({award: {show: false}, answer: {show: false}});
        updateTerminalGame({isCorrect: value});
      },
      value ? 1000 : 2000,
    );
    this.clearAnimation();
  };

  renderLevel = () => {
    const {level} = this.props;
    if (!level.upStatus) {
      return null;
    }
    return (
      <AnimatedView
        animation="fadeInUp"
        useNativeDriver={true}
        easing="ease-in-out"
        duration={500}
        style={styles.timeOutContainer}>
        <NoFlexContainer alignItems="center">
          <Text
            h2
            fontSize={32}
            bold
            color={colors.white}
            paddingHorizontal={12}>
            {`${translate('Tốc độ')}`}
          </Text>
          <Text
            fontSize={64}
            accented
            bold
            color={colors.white}
            paddingVertical={0}
            paddingHorizontal={12}>
            {level.number}
          </Text>
        </NoFlexContainer>
      </AnimatedView>
    );
  };

  renderAwardOrDead = () => {
    const {award} = this.state;
    if (!award.show) {
      return null;
    }
    return (
      <AnimatedView
        animation="fadeInUp"
        useNativeDriver={true}
        easing="ease-in-out"
        duration={500}
        style={styles.responseContainer}>
        {award.isCorrect ? (
          <RowContainer>
            <Text
              h2
              fontSize={32}
              bold
              color={colors.white}
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
        ) : (
          <RowContainer>
            <Text
              h2
              fontSize={32}
              bold
              color={colors.white}
              paddingHorizontal={12}>
              -1
            </Text>
            <AntDesign
              name="heart"
              size={29}
              color={colors.heartActive}
              style={{marginTop: 6}}
            />
          </RowContainer>
        )}
      </AnimatedView>
    );
  };

  render() {
    const {item, active, level} = this.props;
    const {answer, waterHeight, timeout} = this.state;
    if (!active) {
      return null;
    }
    return (
      <>
        {!answer.show && (
          <Animated.View style={[styles.wave, {height: waterHeight}]} />
        )}
        {!level.upStatus && this.renderAwardOrDead()}
        <AnimatableFastImage
          key={item.image}
          source={{uri: item.image}}
          style={styles.answerImgContainer}
          resizeMode="cover"
          animation="fadeIn"
          easing="ease-in-out"
        />
        <Question data={item} onAnswer={this.setAnswer} />
        {(answer.show || timeout) && (
          <Answer isCorrect={answer.isCorrect} timeout={this.state.timeout} />
        )}
        {this.renderLevel()}
      </>
    );
  }
}

GameItem.propTypes = {
  item: PropTypes.object,
  updateTerminalGame: PropTypes.func,
  active: PropTypes.bool,
  level: PropTypes.object,
  time: PropTypes.number,
};

GameItem.defaultProps = {
  item: {},
  updateTerminalGame: () => {},
  active: false,
  level: {},
  time: 0,
};

const styles = StyleSheet.create({
  wave: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    position: 'absolute',
    bottom: OS.Game - 24,
    zIndex: 3,
  },
  answerImgContainer: {
    overflow: 'hidden',
    top: 0,
    height: (OS.HEIGHT * 60) / 100,
    width: '100%',
    position: 'absolute',
    zIndex: 2,
  },
  responseContainer: {
    position: 'absolute',
    zIndex: 4,
    width: '100%',
    top: 0,
    height: OS.GameImageWater,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeOutContainer: {
    position: 'absolute',
    zIndex: 1001,
    width: '100%',
    top: 0,
    height: '100%',
    backgroundColor: ' rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GameItem;
