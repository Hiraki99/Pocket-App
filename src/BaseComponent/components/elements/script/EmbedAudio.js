import React from 'react';
import {TapGestureHandler} from 'react-native-gesture-handler';
import {Animated, Image, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import PropTypes from 'prop-types';
import {View} from 'react-native-animatable';
import LottieView from 'lottie-react-native';
import Sound from 'react-native-sound';

import {RowContainer, Text} from '~/BaseComponent';
import TranscriptModalRef from '~/BaseComponent/components/elements/script/TranscriptModal';
import {colors, images} from '~/themes';
import {onOffPlayAudioZoom} from '~/utils/utils';

export default class EmbedAudio extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playState: 'paused',
      playSeconds: 0,
      duration: 0,
      isDone: false,
      width: 0,
      value: new Animated.Value(0),
      visible: false,
      showText: props.showText,
    };
  }

  componentDidMount() {
    Sound.enableInSilenceMode(true);
    this.startPlayAudio();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.audio && this.props.audio !== prevProps.audio) {
      this.removePlayAudio();
      this.startPlayAudio();
    }

    if (this.props.autoPlay && this.props.autoPlay !== prevProps.autoPlay) {
      this.startPlayAudio();
    }
  }

  shouldComponentUpdate(nextProps, nextState): boolean {
    const {playState, playSeconds} = this.state;
    if (nextState.isDone) {
      this.state.value.setValue(0);
    }
    if (
      playState !== nextState.playState &&
      nextState.playState === 'paused' &&
      this.state.value._value < 1
    ) {
      Animated.timing(this.state.value).stop();
    }

    if (
      playState !== nextState.playState &&
      nextState.playState === 'playing' &&
      this.state.value._value < 1
    ) {
      Animated.timing(this.state.value, {
        toValue: 1,
        duration: (nextState.duration - playSeconds) * 1000,
        useNativeDriver: false,
      }).start();
    }

    if (
      this.props.navigateOutScreen !== nextProps.navigateOutScreen &&
      nextProps.navigateOutScreen
    ) {
      this.removePlayAudio();
    }
    return true;
  }

  componentWillUnmount() {
    this.removePlayAudio();
    this.props.onLoadDone(false);
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
          this.setState({playSeconds: seconds});
        });
      }
    }, 10);
  };

  removePlayAudio = () => {
    if (this.sound) {
      this.sound.release();
      this.sound = null;
    }
    if (this.timeout) {
      clearInterval(this.timeout);
    }
    if (this.timeoutStart) {
      clearInterval(this.timeoutStart);
    }
    if (this.playCompleteTimeout) {
      clearTimeout(this.playCompleteTimeout);
    }
  };

  play = () => {
    if (this.props.isPresentation) {
      onOffPlayAudioZoom(false);
    }
    const {autoPlay} = this.props;
    if (this.sound) {
      this.sound.play(this.playComplete);
      this.setState({playState: 'playing', isDone: false, showText: false});
    } else if (this.props.audio) {
      this.sound = new Sound(this.props.audio, '', (error) => {
        if (error) {
          this.setState({playState: 'paused'});
        } else {
          this.props.onLoadDone(true);
          if (this.sound) {
            this.setState({
              duration: this.sound.getDuration(),
            });
            // this.setState({showText: false});
            if (autoPlay) {
              this.timeoutStart = setTimeout(() => {
                this.setState(
                  {
                    playState: 'playing',
                  },
                  () => {
                    this.sound.play(this.playComplete);
                  },
                );
              }, 300);
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

        if (this.state.duration !== 0 && !this.state.isDone) {
          this.setState({isDone: true});
        }
      }
      this.setState({playState: 'paused', isDone: true});
      this.state.value.setValue(0);
      if (this.props.isPresentation) {
        onOffPlayAudioZoom(true);
      }
    }
  };

  pause = () => {
    if (this.props.isPresentation) {
      onOffPlayAudioZoom(true);
    }
    if (this.sound) {
      this.sound.pause();
    }

    this.setState({playState: 'paused'});
  };

  getAudioTimeString(secondsFloat) {
    const seconds = Math.round(secondsFloat) || 0;
    const m = parseInt((seconds % (60 * 60)) / 60, 10);
    const s = parseInt(seconds % 60, 10);

    return `${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}`;
  }

  onLayout = (e) => {
    this.setState({
      width: e.nativeEvent.layout.width,
    });
  };

  onSingleTap = async ({nativeEvent}) => {
    const {width, duration} = this.state;
    const {enablePressControl} = this.props;
    const {x} = nativeEvent;
    if (x > 20 && x < 60) {
      return;
    }
    if (!enablePressControl) {
      return;
    }
    this.pause();
    const time = width > 0 ? (x / width) * duration : 0;
    if (this.sound) {
      await this.setState({playSeconds: time, isDone: false});
      this.state.value.setValue(x / width);
      this.sound.setCurrentTime(time);
      this.play();
    }
  };

  setCurrentTime = async (time) => {
    const {duration} = this.state;
    await this.setState({playSeconds: time, isDone: false});
    console.log('setCurrentTime ', time);
    if (this.sound && duration > 0) {
      this.sound.setCurrentTime(time);
      this.state.value.setValue(time / (duration || 1));
      Animated.timing(this.state.value).stop();
      Animated.timing(this.state.value, {
        toValue: 1,
        duration: (duration - time) * 1000,
        useNativeDriver: false,
      }).start();
    } else {
      this.sound = new Sound(this.props.audio, '', (error) => {
        if (error) {
          this.setState({playState: 'paused'});
        } else {
          this.props.onLoadDone(true);
          if (this.sound) {
            const durationSound = this.sound.getDuration();
            this.setState({
              duration: durationSound,
            });
            this.sound.setCurrentTime(time);
            this.state.value.setValue(time / this.sound.getDuration());

            Animated.timing(this.state.value).stop();
            Animated.timing(this.state.value, {
              toValue: 1,
              duration: (durationSound - time) * 1000,
              useNativeDriver: false,
            }).start();
          }
        }
      });
    }
  };

  render() {
    const {duration, playSeconds} = this.state;
    const {isUser, isSquare, darker, enablePressControl} = this.props;
    const currentTimeString = this.getAudioTimeString(playSeconds);
    const move = this.state.value.interpolate({
      inputRange: [0, 1],
      outputRange: [0, this.state.width],
    });

    return (
      <>
        <TranscriptModalRef
          ref={(refs) => (this.transcriptModal = refs)}
          transcript={this.props.transcript}
        />
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
          <RowContainer>
            {this.state.playState === 'playing' && (
              <TouchableOpacity
                style={[
                  styles.controlWrap,
                  styles.controlPause,
                  isUser ? styles.userControlWrap : null,
                ]}
                disabled={!enablePressControl}
                onPress={this.pause}>
                <RowContainer>
                  <Image
                    source={isUser ? images.pauseAudioWhite : images.pauseAudio}
                    style={{width: 32, height: 32}}
                  />
                </RowContainer>
              </TouchableOpacity>
            )}
            {this.state.showText && (
              <View style={{position: 'absolute', left: 48, zIndex: 100}}>
                <Text h6 bold>
                  {this.props.text}
                </Text>
              </View>
            )}

            {this.state.playState === 'paused' && (
              <TouchableOpacity
                style={[
                  styles.controlWrap,
                  styles.controlPlay,
                  isUser ? styles.userControlWrap : null,
                ]}
                disabled={!enablePressControl}
                onPress={this.play}>
                <Image
                  source={isUser ? images.playAudioWhite : images.playAudio}
                  style={{width: 32, height: 32}}
                />
              </TouchableOpacity>
            )}
            <TapGestureHandler onHandlerStateChange={this.onSingleTap}>
              <View
                style={[
                  styles.controls,
                  isUser ? styles.userControls : null,
                  this.props.white ? styles.darker : null,
                  darker ? styles.darker : null,
                  isSquare ? styles.square : null,
                ]}
                onLayout={this.onLayout}>
                <Image
                  source={images.sound}
                  style={styles.sound}
                  resizeMode="contain"
                />
                {!this.state.isDone && (
                  <Animated.View
                    style={[
                      styles.bgProgress,
                      {width: move},
                      isUser ? styles.userBgProgress : null,
                      darker ? styles.darkerProgress : null,
                      this.props.white ? styles.white : null,
                    ]}
                  />
                )}
              </View>
            </TapGestureHandler>
            {this.props.showTime && (
              <RowContainer
                style={[
                  styles.currentTime,
                  isUser ? styles.userCurrentTime : null,
                ]}>
                <Text
                  h5
                  color={!isUser ? colors.commentText : colors.white}
                  paddingRight={this.props.transcript ? 0 : 12}>
                  {currentTimeString}
                </Text>
                {!!this.props.transcript && (
                  <TouchableOpacity
                    onPress={() => {
                      this.transcriptModal.showModal();
                    }}>
                    <MaterialCommunityIcons
                      name={'subtitles'}
                      color={colors.white}
                      size={24}
                      style={{paddingHorizontal: 8}}
                    />
                  </TouchableOpacity>
                )}
              </RowContainer>
            )}
          </RowContainer>
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
  darker: PropTypes.bool,
  white: PropTypes.bool,
  showTime: PropTypes.bool,
  showText: PropTypes.bool,
  enablePressControl: PropTypes.bool,
  text: PropTypes.string,
  transcript: PropTypes.string,
  onLoadDone: PropTypes.func,
  isPresentation: PropTypes.bool,
};

EmbedAudio.defaultProps = {
  isUser: false,
  autoPlay: true,
  isSquare: false,
  darker: false,
  white: false,
  showTime: true,
  showText: false,
  text: '',
  transcript: null,
  enablePressControl: true,
  onLoadDone: () => {},
  isPresentation: false,
};

const styles = {
  controlWrap: {
    // backgroundColor: colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    zIndex: 100,
    position: 'absolute',
    left: 0,
    // top: 7,
    // paddingVertical: 4,
  },
  userControlWrap: {
    // backgroundColor: colors.white,
  },
  square: {
    borderRadius: 0,
  },
  controls: {
    backgroundColor: colors.mainBgColor,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    overflow: 'hidden',
    marginVertical: 16,
    paddingLeft: 40,
    flex: 1,
    position: 'relative',
  },
  userControls: {
    backgroundColor: colors.primary,
    marginVertical: 0,
  },
  controlIconPlay: {
    color: colors.white,
    fontSize: 20,
    marginLeft: 3,
  },
  controlIconPause: {
    color: colors.white,
    fontSize: 18,
    marginLeft: 1,
  },
  userControl: {
    color: colors.primary,
  },
  sound: {
    height: 26,
    opacity: 0.5,
  },
  currentTime: {
    position: 'absolute',
    right: 0,
  },
  userCurrentTime: {
    color: colors.white,
  },
  bgProgress: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: 'rgba(226,230,239,0.5)',
    width: 0,
    zIndex: -1,
  },
  userBgProgress: {
    backgroundColor: colors.primary_overlay,
  },
  loading: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  darker: {
    backgroundColor: 'rgba(226,230,239, 0.6)',
  },
  white: {
    backgroundColor: 'white',
  },
  darkerProgress: {
    backgroundColor: 'rgba(226,231,242, 1)',
  },
};
