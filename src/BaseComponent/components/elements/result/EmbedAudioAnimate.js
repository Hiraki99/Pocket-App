import React from 'react';
import {Image, TouchableOpacity, Animated} from 'react-native';
import PropTypes from 'prop-types';
import {View} from 'react-native-animatable';
import LottieView from 'lottie-react-native';
import Sound from 'react-native-sound';

import {Text} from '~/BaseComponent';
import {colors, images} from '~/themes';
import {OS} from '~/constants/os';
const WIDTH_AUDIO = OS.WIDTH - 48;
const WIDTH_AUDIO_MODAL_RESULT = OS.WIDTH * 0.8 - 64;

export default class EmbedAudio extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: new Animated.Value(0),
      playState: 'paused',
      playSeconds: 0,
      duration: 0,
      isDone: false,
      endSentence: true,
    };
    this.widthMaxAnimate = props.fullWidth
      ? OS.WIDTH
      : props.modalResult
      ? WIDTH_AUDIO_MODAL_RESULT
      : WIDTH_AUDIO;
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
      this.state.value._value < 1
    ) {
      Animated.timing(this.state.value).stop();
      if (this.interval) {
        clearInterval(this.interval);
      }
    }

    if (
      playState !== nextState.playState &&
      nextState.playState === 'playing' &&
      this.state.value._value < this.widthMaxAnimate
    ) {
      Animated.timing(this.state.value, {
        toValue: 1,
        duration: (nextState.duration - playSeconds) * 1000,
        useNativeDriver: true,
      }).start();
      this.startInterval();
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
    if (this.props.sentence !== prevProps.sentence && this.props.sentence) {
      this.pause();
      this.playSentence();
    }
  }

  playSentence = async () => {
    if (this.sound) {
      if (this.state.endSentence) {
        this.sound.setCurrentTime(this.props.sentence.start);
        this.state.value.setValue(
          this.props.sentence.start / this.state.duration,
        );
      }
      await this.setState({
        playSeconds: this.props.sentence.start,
        playState: 'paused',
        endSentence: false,
      });
      this.props.getAudioState('paused');
      this.play();
      this.startInterval();
    }
  };

  componentWillUnmount() {
    this.removePlayAudio();
  }

  startPlayAudio = () => {
    this.play();
    this.startInterval();
  };

  startInterval = () => {
    this.interval = setInterval(
      () => {
        if (this.sound && this.state.playState === 'playing') {
          this.sound.getCurrentTime((seconds) => {
            this.setState({playSeconds: seconds});
            this.props.getCurrentTime(seconds);
            if (this.props.sentence && this.props.sentence.end < seconds) {
              this.pause();
              this.setState({endSentence: true});
            }
          });
        }
      },
      OS.IsAndroid ? 100 : 50,
    );
  };

  removePlayAudio = () => {
    if (this.sound) {
      this.sound.release();
      this.sound = null;
    }
    if (this.interval) {
      clearInterval(this.interval);
    }
  };

  play = async () => {
    const {autoPlay} = this.props;
    if (this.sound) {
      this.sound.play(this.playComplete);
      this.setState({playState: 'playing'});
      this.props.getAudioState('playing');
    } else if (this.props.audio) {
      this.sound = new Sound(this.props.audio, '', (error) => {
        if (error) {
          this.setState({playState: 'paused'});
        } else {
          if (this.sound) {
            const duration = this.sound.getDuration();
            this.setState({duration});
            if (autoPlay) {
              this.setState(
                {
                  playState: 'playing',
                },
                () => {
                  this.sound.play(this.playComplete);
                  if (this.state.playSeconds > 0) {
                    this.state.value.setValue(
                      this.state.playSeconds / duration,
                    );
                  }
                  this.animation = Animated.timing(this.state.value, {
                    toValue: 1,
                    duration: (duration - this.state.playSeconds) * 1000,
                    useNativeDriver: true,
                  }).start();
                },
              );
              this.props.getAudioState('playing');
            }
            if (this.props.isSub) {
              this.sound.setCurrentTime(this.state.playSeconds);
            }
          }
        }
      });
    }
  };

  playComplete = () => {
    if (this.sound) {
      if (
        Math.floor(this.state.playSeconds) ===
          Math.floor(this.state.duration) ||
        Math.ceil(this.state.playSeconds) === Math.ceil(this.state.duration)
      ) {
        this.setState({playSeconds: 0});
        this.sound.setCurrentTime(0);
        this.props.getCurrentTime(0);
        if (this.state.duration !== 0 && !this.state.isDone) {
          this.setState({isDone: true});
        }
      }
      this.setState({playState: 'paused'});
      this.props.getAudioState('paused');
      this.props.onEndEffect();
      this.state.value.setValue(0);
    }
    if (this.interval) {
      clearInterval(this.interval);
    }
  };

  pause = () => {
    if (this.sound) {
      this.sound.pause();
    }
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.setState({playState: 'paused'});
    this.props.getAudioState('paused');
  };

  getAudioTimeString = (seconds) => {
    const m = parseInt((seconds % (60 * 60)) / 60, 10);
    const s = parseInt(seconds % 60, 10);

    return `${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}`;
  };

  playAudioOnView = () => {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.props.setSentence(null);
    setTimeout(() => {
      this.play(this.playComplete);
    }, 50);
    this.sound.getCurrentTime((seconds) => {
      this.props.onPlayEffect(seconds);
    });
  };

  render() {
    const {duration, playSeconds} = this.state;
    const {isUser, showTime, isSquare} = this.props;
    const currentTimeString = this.getAudioTimeString(playSeconds);
    const translateX = this.state.value.interpolate({
      inputRange: [0, 1],
      outputRange: [-OS.WIDTH, 0],
    });

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
          <View
            style={[
              styles.controls,
              isUser ? styles.userControls : null,
              isSquare ? {borderRadius: 0, marginVertical: 0} : null,
            ]}>
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
                style={[styles.controlWrap, styles.controlPlay]}
                onPress={this.playAudioOnView}>
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

            <Animated.View
              style={[
                isUser ? styles.userProgress : styles.bgProgress,
                {width: OS.WIDTH, transform: [{translateX}]},
              ]}
            />
          </View>
        )}
      </>
    );
  }
}

EmbedAudio.propTypes = {
  audio: PropTypes.string.isRequired,
  isUser: PropTypes.bool,
  autoPlay: PropTypes.bool,
  isSquare: PropTypes.bool,
  modalResult: PropTypes.bool,
  showTime: PropTypes.bool,
  navigateOutScreen: PropTypes.bool,
  getCurrentTime: PropTypes.func,
  sentence: PropTypes.object,
  setSentence: PropTypes.func,
  getAudioState: PropTypes.func,
  onEndEffect: PropTypes.func,
  onPlayEffect: PropTypes.func,
  isSub: PropTypes.bool,
  fullWidth: PropTypes.bool,
};

EmbedAudio.defaultProps = {
  isUser: false,
  autoPlay: true,
  showTime: false,
  modalResult: false,
  navigateOutScreen: false,
  isSquare: false,
  getCurrentTime: () => {},
  setSentence: () => {},
  getAudioState: () => {},
  onEndEffect: () => {},
  onPlayEffect: () => {},
  sentence: null,
  fullWidth: false,
  isSub: false,
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
    backgroundColor: 'rgba(226,230,239,0.6)',
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    overflow: 'hidden',
    width: '100%',
    marginVertical: 8,
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
    backgroundColor: 'rgba(226,230,239,0.5)',
    zIndex: -1,
  },
  userProgress: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 0,
    backgroundColor: 'rgba(226,230,239,0.5)',
    zIndex: -1,
  },
  loading: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
};
