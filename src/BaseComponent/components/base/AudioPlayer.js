import React from 'react';
import {View, TouchableOpacity, Image, Animated} from 'react-native';
import {Icon} from 'native-base';
import Sound from 'react-native-sound';
import LottieView from 'lottie-react-native';
import {TapGestureHandler} from 'react-native-gesture-handler';
import PropTypes from 'prop-types';

import {OS} from '~/constants/os';
import {colors, images} from '~/themes';

export default class AudioPlayer extends React.Component {
  constructor() {
    super();
    this.state = {
      playState: 'paused',
      done: false,
      playSeconds: 0,
      duration: 0,
      progress: new Animated.Value(0),
    };

    this.playComplete = this.playComplete.bind(this);
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
  }

  componentDidMount() {
    Sound.enableInSilenceMode(true);
    this.startPlayAudio();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.filePath && this.props.filePath !== prevProps.filePath) {
      this.removePlayAudio();
      this.startPlayAudio();
    }

    if (prevState.playSeconds !== this.state.playSeconds) {
      this.props.onTimeChange(this.state.playSeconds);
    }
    if (this.state.done) {
      this.doneAnimation();
    }
  }

  componentWillUnmount() {
    this.removePlayAudio();
  }

  next() {
    if (this.sound) {
      const {playSeconds, duration} = this.state;
      let time = playSeconds + 5 < duration ? playSeconds + 5 : duration;
      this.sound.setCurrentTime(time);
      this.props.getStatusAudio('paused');
      this.setState({playSeconds: time});
      this.props.getStatusAudio('playing');
      this.reCaculateAnimation(time, duration);
    }
  }

  onSingleTap = async ({nativeEvent}) => {
    this.props.getStatusAudio('paused');
    const {duration} = this.state;
    const {x} = nativeEvent;
    this.pause();
    const time = (x / OS.WIDTH) * duration;
    if (this.sound) {
      await this.setState({playSeconds: time, isDone: false});
      this.state.progress.setValue(x / OS.WIDTH);
      this.sound.setCurrentTime(time);
      this.props.getStatusAudio('playing');
      this.reCaculateAnimation(time, duration);
      this.play();
    }
  };

  prev() {
    if (this.sound) {
      const {playSeconds, duration} = this.state;
      let time = playSeconds - 5 > 0 ? playSeconds - 5 : 0;
      this.sound.setCurrentTime(time);
      this.props.getStatusAudio('paused');
      this.setState({playSeconds: time});
      this.props.getStatusAudio('playing');
      this.reCaculateAnimation(time, duration);
    }
  }

  reCaculateAnimation = (time, duration) => {
    this.state.progress.stopAnimation(() => {
      this.state.progress.setValue((time / duration) * OS.WIDTH);
      Animated.timing(this.state.progress, {
        toValue: OS.WIDTH,
        duration: (this.sound.getDuration() - time) * 1000,
        useNativeDriver: false,
      }).start(this.doneAnimation);
    });
  };

  doneAnimation = () => {
    if (this.state.done) {
      this.state.progress.setValue(0);
    }
  };

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
    if (this.playCompleteTimeout) {
      clearTimeout(this.playCompleteTimeout);
    }
  };

  play = async () => {
    if (this.sound) {
      const {duration, playSeconds} = this.state;
      this.sound.play(this.playComplete);
      this.setState({playState: 'playing', done: false});
      this.props.getStatusAudio('playing');
      Animated.timing(this.state.progress, {
        toValue: OS.WIDTH,
        duration: (duration - playSeconds) * 1000,
        useNativeDriver: false,
      }).start(this.doneAnimation);
    } else if (this.props.filePath) {
      this.sound = new Sound(this.props.filePath, '', (error) => {
        if (error) {
          this.setState({playState: 'paused'});
        } else {
          if (this.sound) {
            this.setState({
              playState: 'playing',
              duration: this.sound.getDuration(),
              done: false,
            });
            Animated.timing(this.state.progress, {
              toValue: OS.WIDTH,
              duration: this.sound.getDuration() * 1000,
              useNativeDriver: false,
            }).start(this.doneAnimation);
            this.props.getStatusAudio('playing');
            this.playCompleteTimeout = setTimeout(() => {
              if (this.sound) {
                this.sound.play(this.playComplete);
              }
            }, 150);
          }
        }
      });
    }
  };

  playComplete = () => {
    if (this.sound) {
      if (
        Math.round(this.state.playSeconds) >= Math.round(this.state.duration)
      ) {
        this.setState({playSeconds: 0});
        this.sound.setCurrentTime(0);

        // if (this.state.duration !== 0) {
        //   this.props.onEnd();
        // }
      }
      this.setState({playState: 'paused', done: true});
      this.props.getStatusAudio('paused');
      this.props.onEnd();
    }
  };

  pause = () => {
    if (this.sound) {
      this.sound.pause();
    }
    this.props.getStatusAudio('paused');
    this.setState({playState: 'paused'});
    Animated.timing(this.state.progress).stop();
  };

  render() {
    const {duration} = this.state;

    return (
      <View
        style={[
          styles.wrap,
          duration ? {justifyItems: 'center', alignItems: 'center'} : {},
        ]}>
        <TapGestureHandler onHandlerStateChange={this.onSingleTap}>
          <View
            style={{backgroundColor: colors.primary, height: 6, width: '100%'}}>
            <Animated.View
              style={{
                backgroundColor: colors.warning,
                height: 6,
                width: this.state.progress,
              }}
            />
          </View>
        </TapGestureHandler>
        {!duration && (
          <View
            style={{height: 115, justifyItems: 'center', alignItems: 'center'}}>
            <LottieView
              source={require('~/assets/animate/loading')}
              autoPlay
              loop
              style={{alignSelf: 'center', height: 80, width: 120}}
            />
          </View>
        )}
        {duration > 0 && (
          <View style={styles.controls}>
            <TouchableOpacity style={styles.controlWrap} onPress={this.prev}>
              <Icon
                name="controller-jump-to-start"
                type="Entypo"
                style={styles.control}
              />
            </TouchableOpacity>

            {this.state.playState === 'playing' && (
              <TouchableOpacity
                style={[styles.controlWrap]}
                onPress={this.pause}>
                <Image
                  source={images.pauseAudio}
                  style={{width: 51, height: 51}}
                />
              </TouchableOpacity>
            )}

            {this.state.playState === 'paused' && (
              <TouchableOpacity
                style={[styles.controlWrap]}
                onPress={this.play}>
                <Image
                  source={images.playAudio}
                  style={{width: 51, height: 51}}
                />
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.controlWrap} onPress={this.next}>
              <Icon
                name="controller-next"
                type="Entypo"
                style={styles.control}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}

AudioPlayer.propTypes = {
  filePath: PropTypes.string,
  onTimeChange: PropTypes.func,
  getStatusAudio: PropTypes.func,
  onEnd: PropTypes.func,
};

AudioPlayer.defaultProps = {
  filePath: null,
  onTimeChange: () => {},
  getStatusAudio: () => {},
  onEnd: () => {},
};

const styles = {
  wrap: {
    backgroundColor: '#1F2631',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 40,
  },
  controlWrap: {
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  control: {
    color: '#fff',
    opacity: 0.75,
    fontSize: 28,
  },
  iconPause: {
    color: '#fff',
    opacity: 0.75,
    fontSize: 28,
  },
  iconPlay: {
    color: '#fff',
    opacity: 0.75,
    fontSize: 28,
    marginLeft: 2,
  },
  progress: {
    // marginBottom: 24,
  },
};
