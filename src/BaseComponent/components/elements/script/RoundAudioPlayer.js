import React from 'react';
import {Image, TouchableOpacity, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {View} from 'react-native-animatable';
import LottieView from 'lottie-react-native';
import Sound from 'react-native-sound';
import ProgressCircle from 'react-native-progress-circle';

import {colors, images} from '~/themes';

export default class RoundAudioPlayer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      playState: 'paused',
      playSeconds: 0,
      duration: 0,
      isDone: false,
    };

    this.play = this.play.bind(this);
    this.playComplete = this.playComplete.bind(this);
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
          if (this.sound) {
            this.setState({
              duration: this.sound.getDuration(),
            });

            if (autoPlay) {
              this.setState(
                {
                  playState: 'playing',
                },
                () => {
                  this.sound.play(this.playComplete);
                },
              );
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
      this.setState({playState: 'paused'});
    }
  };

  pause = () => {
    if (this.sound) {
      this.sound.pause();
    }

    this.setState({playState: 'paused'});
  };

  toggle = () => {
    const {playState} = this.state;

    if (playState === 'playing') {
      this.pause();
    } else {
      this.play();
    }
  };

  render() {
    const {duration, playSeconds} = this.state;
    const {themeMode} = this.props;
    let processWidth = 0;
    if (duration && duration > 0 && playSeconds) {
      processWidth = (playSeconds / duration) * 100;
    }

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
          <View style={[themeMode === 'card' ? null : styles.bound]}>
            <TouchableOpacity
              style={styles.controlWrap}
              onPress={this.toggle}
              activeOpacity={0.65}>
              <View style={styles.container}>
                <ProgressCircle
                  percent={processWidth}
                  radius={50}
                  borderWidth={8}
                  color={
                    themeMode === 'card' ? colors.white : colors.successChoice
                  }
                  shadowColor={
                    themeMode === 'card' ? '#ffb300' : colors.primary
                  }
                  bgColor={themeMode === 'card' ? '#ffb300' : colors.primary}
                />
              </View>
              {this.state.playState === 'paused' ? (
                <Image
                  resizeMode="contain"
                  source={
                    themeMode === 'card'
                      ? images.playAudioYellow
                      : images.playAudio
                  }
                  style={styles.sound}
                />
              ) : (
                <Image
                  resizeMode="contain"
                  source={
                    themeMode === 'card'
                      ? images.pauseAudioYellow
                      : images.pauseAudio
                  }
                  style={styles.sound}
                />
              )}
            </TouchableOpacity>
          </View>
        )}
      </>
    );
  }
}

RoundAudioPlayer.propTypes = {
  audio: PropTypes.string.isRequired,
  autoPlay: PropTypes.bool,
  themeMode: PropTypes.oneOf(['card', 'normal']),
};

RoundAudioPlayer.defaultProps = {
  autoPlay: true,
  themeMode: 'card',
};

const styles = StyleSheet.create({
  controlWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bound: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(84,104,255,0.05)',
  },
  sound: {
    height: 90,
    width: 90,
  },
  loading: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  container: {
    opacity: 1,
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  },
});
