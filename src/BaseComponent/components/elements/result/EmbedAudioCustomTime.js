import React from 'react';
import {Image, TouchableOpacity, Animated} from 'react-native';
import PropTypes from 'prop-types';
import {View} from 'react-native-animatable';
import LottieView from 'lottie-react-native';
import Sound from 'react-native-sound';

import {Text} from '~/BaseComponent';
import {colors, images} from '~/themes';
import {OS} from '~/constants/os';
const WIDTH_AUDIO = OS.WIDTH;

export default class EmbedAudioCustomTime extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: new Animated.Value(0),
      playState: 'paused',
      playSeconds: 0,
      duration: props.duration,
      endTime: props.endTime,
      isDone: false,
    };
    this.widthMaxAnimate = WIDTH_AUDIO;
    this.play = this.play.bind(this);
    this.playComplete = this.playComplete.bind(this);
  }

  componentDidMount() {
    Sound.enableInSilenceMode(true);

    this.startPlayAudio();
  }

  shouldComponentUpdate(nextProps, nextState): boolean {
    const {playState, playSeconds} = this.state;
    if (
      playState !== nextState.playState &&
      nextState.playState === 'paused' &&
      this.state.value._value < this.widthMaxAnimate
    ) {
      Animated.timing(this.state.value).stop();
      this.state.value.setValue(this.state.value._value);
    }

    if (
      playState !== nextState.playState &&
      nextState.playState === 'playing' &&
      this.state.value._value < this.widthMaxAnimate
    ) {
      Animated.timing(this.state.value, {
        toValue: this.widthMaxAnimate,
        duration:
          (nextState.duration - (this.props.endTime - playSeconds)) * 1000,
      }).start();
    }
    if (playSeconds !== nextState.playSeconds) {
      return false;
    }
    if (
      this.props.navigateOutScreen !== nextProps.navigateOutScreen &&
      nextProps.navigateOutScreen
    ) {
      this.removePlayAudio();
    }
    return true;
  }

  componentDidUpdate(prevProps) {
    if (this.props.audio !== prevProps.audio && !this.props.navigateOutScreen) {
      this.removePlayAudio();
      this.startPlayAudio();
    }
  }

  componentWillUnmount() {
    this.removePlayAudio();
  }

  startPlayAudio = () => {
    this.play();

    this.timeout = setInterval(() => {
      if (
        this.sound &&
        this.sound.isLoaded() &&
        this.state.playState === 'playing'
      ) {
        this.sound.getCurrentTime((seconds) => {
          if (seconds >= this.props.endTime) {
            this.setState({playState: 'paused'}, () => {
              this.sound.setCurrentTime(this.props.startTime);
              this.setState({playSeconds: this.props.startTime});
              this.state.value.setValue(0);
              this.sound.pause();
            });
          } else {
            this.setState({playSeconds: seconds});
          }
        });
      }
    }, 100);
  };

  removePlayAudio = () => {
    if (this.sound) {
      this.sound.release();
      this.sound = null;
    }
    if (this.timeout) {
      clearInterval(this.timeout);
    }
    if (this.playCompleteTimeout) {
      clearTimeout(this.playCompleteTimeout);
    }
  };

  play = () => {
    const {autoPlay} = this.props;
    if (this.sound) {
      this.sound.play(this.playComplete);
      this.setState({playState: 'playing'});
    } else if (this.props.audio) {
      this.sound = new Sound(this.props.audio, '', (error) => {
        if (error) {
          this.setState({playState: 'paused'});
        } else {
          if (this.sound && autoPlay) {
            this.setState(
              {
                playState: 'playing',
              },
              () => {
                this.setState({playSeconds: this.props.startTime});
                this.sound.setCurrentTime(this.props.startTime);
                this.sound.play(this.playComplete);
                this.animation = Animated.timing(this.state.value, {
                  toValue: this.widthMaxAnimate,
                  duration: this.state.duration * 1000,
                }).start();
              },
            );
          }
        }
      });
    }
  };

  playComplete = async () => {
    if (this.sound) {
      if (this.state.playSeconds >= this.props.endTime) {
        if (this.state.duration !== 0 && !this.state.isDone) {
          this.setState({isDone: true});
        }
      }
      this.sound.setCurrentTime(this.props.startTime);
    }
    this.setState({playSeconds: this.props.startTime});
    await this.setState({playState: 'paused'});
    this.state.value.setValue(0);
  };

  pause = () => {
    if (this.sound) {
      this.sound.pause();
    }

    this.setState({playState: 'paused'});
  };

  getAudioTimeString(seconds) {
    const m = parseInt((seconds % (60 * 60)) / 60, 10);
    const s = parseInt(seconds % 60, 10);

    return `${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}`;
  }

  render() {
    const {duration, playSeconds, value} = this.state;
    const {isUser, showTime} = this.props;
    const currentTimeString = this.getAudioTimeString(playSeconds);
    return (
      <>
        {!duration && (
          <View style={styles.loading}>
            <LottieView
              source={require('~/assets/animate/pressing')}
              autoPlay
              loop
              speed={0.8}
              style={{width: 50}}
            />
          </View>
        )}
        {duration > 0 && (
          <View style={[styles.controls, isUser ? styles.userControls : null]}>
            {this.state.playState === 'playing' && (
              <TouchableOpacity
                style={[
                  styles.controlWrap,
                  styles.controlPause,
                  isUser ? styles.userControlWrap : null,
                ]}
                onPress={this.pause}>
                <Image
                  source={isUser ? images.pauseAudioWhite : images.pauseAudio}
                  style={{width: 32, height: 32}}
                />
              </TouchableOpacity>
            )}

            {this.state.playState === 'paused' && (
              <TouchableOpacity
                style={[
                  styles.controlWrap,
                  styles.controlPlay,
                  isUser ? styles.userControlWrap : null,
                ]}
                onPress={this.play}>
                <Image
                  source={isUser ? images.playAudioWhite : images.playAudio}
                  style={{width: 32, height: 32}}
                />
              </TouchableOpacity>
            )}

            <Image
              source={images.sound}
              style={styles.sound}
              resizeMode="contain"
            />

            {showTime && (
              <Text h5 style={[styles.currentTime]}>
                {currentTimeString}
              </Text>
            )}

            <Animated.View style={[styles.bgProgress, {width: value}]} />
          </View>
        )}
      </>
    );
  }
}

EmbedAudioCustomTime.propTypes = {
  audio: PropTypes.string.isRequired,
  isUser: PropTypes.bool,
  autoPlay: PropTypes.bool,
  modalResult: PropTypes.bool,
  showTime: PropTypes.bool,
  navigateOutScreen: PropTypes.bool,
  startTime: PropTypes.number,
  endTime: PropTypes.number,
  duration: PropTypes.number,
};

EmbedAudioCustomTime.defaultProps = {
  isUser: false,
  autoPlay: true,
  showTime: false,
  modalResult: false,
  navigateOutScreen: false,
  startTime: 0,
  endTime: 0,
  duration: 0,
};

const styles = {
  controlWrap: {
    backgroundColor: colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userControlWrap: {
    backgroundColor: colors.white,
  },
  controls: {
    // backgroundColor: 'rgba(226,230,239,0.6)',
    // borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    overflow: 'hidden',
    width: '100%',
    position: 'relative',
  },
  userControls: {
    backgroundColor: colors.primary,
  },
  control: {
    color: colors.white,
    fontSize: 16,
  },
  userControl: {
    color: colors.primary,
  },
  sound: {
    height: 26,
  },
  currentTime: {
    position: 'absolute',
    right: 10,
  },
  userCurrentTime: {
    color: colors.white,
  },
  bgProgress: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 0,
    backgroundColor: '#595FFF',
    zIndex: -1,
  },
  userBgProgress: {
    backgroundColor: '#4A50F1',
  },
  loading: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
};
