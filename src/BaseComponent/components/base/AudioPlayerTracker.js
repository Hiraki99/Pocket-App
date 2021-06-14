import React from 'react';
import TrackPlayer from 'react-native-track-player';
import {View, TouchableOpacity, ActivityIndicator} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Icon} from 'native-base';
import Slider from '@react-native-community/slider';
import Sound from 'react-native-sound';
import PropTypes from 'prop-types';

import Text from './Text';

const AudioState = {
  pause: 'paused',
  playing: 'playing',
};

export default class AudioPlayerTracker extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      playState: AudioState.pause,
      playSeconds: 0,
      duration: 0,
    };
  }

  async componentDidMount() {
    Sound.enableInSilenceMode(true);
    this.playAudio();
    this.listener = TrackPlayer.addEventListener(
      'playback-state',
      async (data) => {
        if (data.state === TrackPlayer.STATE_PLAYING) {
          let duration = await TrackPlayer.getDuration();
          this.setState({
            playState: AudioState.playing,
            loadingFileDone: true,
            duration,
          });
          return;
        }
        if (data.state === TrackPlayer.STATE_PAUSED) {
          let duration = await TrackPlayer.getDuration();
          this.setState({playState: AudioState.pause, duration});
          return;
        }
        this.setState({playSeconds: 0, duration: 0});
      },
    );
    TrackPlayer.addEventListener('remote-next', () => {
      this.props.onNext();
    });

    TrackPlayer.addEventListener('remote-previous', () => {
      this.props.onPrev();
    });
  }

  componentWillUnmount() {
    this.removePlayAudio();
    if (this.listener) {
      this.listener.remove();
    }
    TrackPlayer.reset();
  }

  playAudio = async () => {
    const {item} = this.props;
    const listAddTrack = [];
    listAddTrack.push({
      id: item.id || item.published_timestamp.toString(),
      url: item.tts_audio_url,
      title: item.title,
      artist: item.domain || item.source_name,
      artwork: require('~/assets/images/logo/logo.png'),
    });
    await TrackPlayer.add(listAddTrack);
    await TrackPlayer.play();
    this.startTimerAudio();
  };

  onSliderEditStart = () => {
    this.sliderEditing = true;
  };

  onSliderEditEnd = () => {
    this.sliderEditing = false;
  };

  onSliderEditing = (value) => {
    TrackPlayer.seekTo(value);
    this.setState({playSeconds: value});
  };

  getAudioTimeString(seconds) {
    const h = parseInt(seconds / (60 * 60), 10);
    const m = parseInt((seconds % (60 * 60)) / 60, 10);
    const s = parseInt(seconds % 60, 10);

    return `${h < 10 ? `0${h}` : h}:${m < 10 ? `0${m}` : m}:${
      s < 10 ? `0${s}` : s
    }`;
  }

  startTimerAudio = () => {
    this.timeout = setInterval(async () => {
      const {playSeconds, duration} = this.state;
      const position = await TrackPlayer.getPosition();
      if (duration > 0 && playSeconds <= position) {
        this.setState({playSeconds: position});
        if (Math.round(position) === Math.round(duration)) {
          setTimeout(() => {
            this.props.onNext();
          }, 2000);
          this.setState({duration: 0, playSeconds: 0});
        }
      }
    }, 100);
  };

  removePlayAudio = () => {
    if (this.timeout) {
      clearInterval(this.timeout);
      this.setState({playSeconds: 0, duration: 0});
    }
  };

  play = () => {
    TrackPlayer.play();
  };

  pause = () => {
    TrackPlayer.pause();
  };

  next = () => {
    this.props.onNext();
  };

  prev = () => {
    this.props.onPrev();
  };

  render() {
    const currentTimeString = this.getAudioTimeString(this.state.playSeconds);
    const durationString = this.getAudioTimeString(this.state.duration);

    return (
      <LinearGradient style={styles.wrap} colors={['#4A4A4A', '#15182A']}>
        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlWrap} onPress={this.prev}>
            <Icon
              name="controller-jump-to-start"
              type="Entypo"
              style={styles.control}
            />
          </TouchableOpacity>

          {!this.state.loadingFileDone ? (
            <TouchableOpacity style={[styles.controlWrap, styles.controlPause]}>
              <ActivityIndicator size={'small'} color={'white'} />
            </TouchableOpacity>
          ) : (
            <>
              {this.state.playState === AudioState.playing && (
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

              {this.state.playState === AudioState.pause && (
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
            </>
          )}

          <TouchableOpacity style={styles.controlWrap} onPress={this.next}>
            <Icon name="controller-next" type="Entypo" style={styles.control} />
          </TouchableOpacity>
        </View>

        <View style={styles.timeline}>
          <Text style={{color: 'white', alignSelf: 'center'}}>
            {currentTimeString}
          </Text>
          <Slider
            onTouchStart={this.onSliderEditStart}
            onTouchEnd={this.onSliderEditEnd}
            onValueChange={this.onSliderEditing}
            value={this.state.playSeconds}
            maximumValue={this.state.duration}
            maximumTrackTintColor="gray"
            minimumTrackTintColor="white"
            thumbTintColor="white"
            thumbImage={null}
            style={styles.slider}
          />
          <Text style={styles.duration}>{durationString}</Text>
        </View>
      </LinearGradient>
    );
  }
}

AudioPlayerTracker.propTypes = {
  filePath: PropTypes.string,
  onNext: PropTypes.func,
  onPrev: PropTypes.func,
  currentIndex: PropTypes.number,
  endIndex: PropTypes.number,
  loadMore: PropTypes.func,
  item: PropTypes.object,
};

AudioPlayerTracker.defaultProps = {
  filePath: null,
  onNext: () => {},
  onPrev: () => {},
  currentIndex: 0,
  endIndex: 1,
  loadMore: () => {},
  item: {},
};

const styles = {
  wrap: {
    paddingVertical: 20,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlWrap: {
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  control: {
    color: '#fff',
    opacity: 0.75,
    fontSize: 26,
  },
  controlPlay: {
    borderWidth: 1,
    borderRadius: 20,
    width: 40,
    height: 40,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  controlPause: {
    borderWidth: 1,
    borderRadius: 20,
    width: 40,
    height: 40,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 5,
  },
  timeline: {
    marginTop: 15,
    marginHorizontal: 15,
    flexDirection: 'row',
  },
  slider: {
    flex: 1,
    alignSelf: 'center',
    marginHorizontal: 5,
  },
  duration: {color: 'white', alignSelf: 'center'},
};
