import React from 'react';
import {Dimensions, Image, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {View} from 'react-native-animatable';
import LottieView from 'lottie-react-native';
import Sound from 'react-native-sound';
import {Icon} from 'native-base';

import {Button, Text} from '~/BaseComponent';
import navigator from '~/navigation/customNavigator';
import {colors, images} from '~/themes';
import {processListenAndAnswerGoToTest} from '~/utils/script';
import {translate} from '~/utils/multilanguage';

const {width} = Dimensions.get('window');
const infoWidth = width - 24 * 2 - 24 * 2 - 8 * 2 - 70;

export default class InlineAudioActivity extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playState: 'paused',
      playSeconds: 0,
      duration: 0,
      isDone: false,
    };

    this.play = this.play.bind(this);
    this.showTranslation = this.showTranslation.bind(this);
    this.playComplete = this.playComplete.bind(this);
  }

  componentDidMount() {
    Sound.enableInSilenceMode(true);

    this.startPlayAudio();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.activity && this.props.activity !== prevProps.activity) {
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
    if (this.sound) {
      this.sound.play(this.playComplete);
      this.setState({playState: 'playing'});
    } else if (this.props.activity.data.audio) {
      this.sound = new Sound(this.props.activity.data.audio, '', (error) => {
        if (error) {
          this.setState({playState: 'paused'});
        } else {
          if (this.sound) {
            this.setState(
              {
                playState: 'playing',
                duration: this.sound.getDuration(),
              },
              () => {
                this.sound.play(this.playComplete);
              },
            );
          }
        }
      });
    }
  };

  playComplete = (success) => {
    if (this.sound) {
      if (
        Math.floor(this.state.playSeconds) ===
          Math.floor(this.state.duration) ||
        Math.ceil(this.state.playSeconds) === Math.floor(this.state.duration)
      ) {
        this.setState({playSeconds: 0});
        this.sound.setCurrentTime(0);

        if (this.state.duration !== 0 && !this.state.isDone) {
          this.setState({isDone: true});

          processListenAndAnswerGoToTest();
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

  // eslint-disable-next-line class-methods-use-this
  getAudioTimeString(seconds) {
    const m = parseInt((seconds % (60 * 60)) / 60, 10);
    const s = parseInt(seconds % 60, 10);

    return `${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}`;
  }

  showTranslation() {
    this.pause();
    navigator.navigate('Transcript');
  }

  render() {
    const {duration, playSeconds} = this.state;
    const currentTimeString = this.getAudioTimeString(playSeconds);

    let processWidth = 0;
    if (duration && duration > 0 && playSeconds) {
      processWidth = (playSeconds / duration) * infoWidth;
    }

    return (
      <View
        style={styles.wrap}
        animation="fadeInUp"
        useNativeDriver
        easing="ease-in-out"
        delay={500}
        duration={500}>
        <Image source={images.teacher} style={styles.avatar} />

        <View style={styles.mainInfo}>
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
            <View style={styles.controls}>
              {this.state.playState === 'playing' && (
                <TouchableOpacity
                  style={[styles.controlWrap, styles.controlPause]}
                  onPress={this.pause}>
                  <Icon
                    name="controller-paus"
                    type="Entypo"
                    style={styles.control}
                  />
                </TouchableOpacity>
              )}

              {this.state.playState === 'paused' && (
                <TouchableOpacity
                  style={[styles.controlWrap, styles.controlPlay]}
                  onPress={this.play}>
                  <Icon
                    name="controller-play"
                    type="Entypo"
                    style={styles.control}
                  />
                </TouchableOpacity>
              )}

              <Image
                source={images.sound}
                style={styles.sound}
                resizeMode="contain"
              />

              <Text h5 style={styles.currentTime}>
                {currentTimeString}
              </Text>

              <View style={[styles.bgProgress, {width: processWidth}]} />
            </View>
          )}
        </View>

        {duration > 0 && (
          <Button
            transparent
            shadow={false}
            primary
            onPress={this.showTranslation}>
            <Text primary>{translate('Phụ đề')}</Text>
          </Button>
        )}
      </View>
    );
  }
}

InlineAudioActivity.propTypes = {
  activity: PropTypes.object.isRequired,
};

const styles = {
  wrap: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  mainInfo: {
    position: 'relative',
    borderRadius: 20,
    backgroundColor: '#F3F5F9',
    overflow: 'hidden',
    marginHorizontal: 8,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignSelf: 'flex-end',
  },
  controlWrap: {
    backgroundColor: colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controls: {
    width: infoWidth,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  control: {
    color: colors.white,
    fontSize: 16,
  },
  sound: {
    height: 26,
  },
  currentTime: {
    position: 'absolute',
    right: 10,
  },
  bgProgress: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 0,
    backgroundColor: 'rgba(226,230,239,0.6)',
    zIndex: -1,
  },
  loading: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
};
