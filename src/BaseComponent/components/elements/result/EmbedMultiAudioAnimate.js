import React, {useRef, useCallback, useImperativeHandle} from 'react';
import {Image, TouchableOpacity, Animated} from 'react-native';
import Sound from 'react-native-sound';
import PropTypes from 'prop-types';
import {View} from 'react-native-animatable';
import {useIsFocused} from '@react-navigation/native';

import {colors, images} from '~/themes';
import {OS, STATE_AUDIO} from '~/constants/os';

const EmbedMultiAudioAnimateRef = (props, ref) => {
  const animationValue = useRef(new Animated.Value(0)).current;
  const sound = useRef();
  const isFocused = useIsFocused();
  const [playState, setPlayState] = React.useState(STATE_AUDIO.PAUSE);
  const [durationSound, setDurationSound] = React.useState(0);
  const {isUser, loadingDone, data, setPlayDone} = props;

  useImperativeHandle(ref, () => ({
    play: () => {
      play();
    },
    pause: () => {
      pause();
    },
    getCurrentTime: (cb) => {
      getCurrentTime(cb);
    },
    getPlayState: () => {
      return playState;
    },
    setCurrentTime: (time) => {
      setCurrentTime(time);
    },
  }));

  const playSuccess = React.useCallback(() => {
    setPlayState(STATE_AUDIO.STOP);
    setPlayDone();
  }, [setPlayDone]);

  React.useEffect(() => {
    if (!isFocused && sound && sound.current) {
      sound.current.pause();
    }
    return function () {
      if (sound && sound.current) {
        sound.current.release();
      }
    };
  }, [isFocused]);
  React.useEffect(() => {
    if (loadingDone && isFocused && !sound.current) {
      sound.current = new Sound(data.audio, '', () => {
        sound.current.play(playSuccess);
        setPlayState(STATE_AUDIO.PLAYING);
        setDurationSound(sound.current.getDuration());
      });
    }
  }, [loadingDone, data, isFocused, playState, playSuccess]);

  React.useEffect(() => {
    const playAnimation = async () => {
      if (sound && sound.current) {
        sound.current.getCurrentTime((second) => {
          if (playState === STATE_AUDIO.PLAYING) {
            Animated.timing(animationValue, {
              toValue: 1,
              duration: ((data.duration || durationSound) - second) * 1000,
            }).start();
          } else {
            if (playState === STATE_AUDIO.PAUSE) {
              Animated.timing(animationValue).stop();
            } else {
              Animated.timing(animationValue, {
                toValue: 0,
                duration: 100,
              }).start();
            }
          }
        });
      }
    };
    if (data.duration || durationSound) {
      playAnimation();
    }
  }, [data, playState, animationValue, durationSound]);

  const setCurrentTime = React.useCallback(
    (time) => {
      if (sound && sound.current) {
        sound.current.setCurrentTime(time);
        animationValue.setValue(time / data.duration);
        play(playSuccess);
      }
    },
    [data, animationValue, play, playSuccess],
  );

  const getCurrentTime = useCallback(
    (cb) => {
      if (sound && sound.current) {
        sound.current.getCurrentTime((playSecond) => cb(playSecond));
      }
    },
    [sound],
  );
  const play = useCallback(async () => {
    if (sound && sound.current) {
      sound.current.play(playSuccess);
      setPlayState(STATE_AUDIO.PLAYING);
    }
  }, [playSuccess]);

  const pause = useCallback(() => {
    if (sound && sound.current) {
      sound.current.pause();
      setPlayState(STATE_AUDIO.PAUSE);
    }
  }, []);

  const widthAnimated = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, OS.WIDTH],
  });

  return (
    <>
      <View style={[styles.controls, isUser ? styles.userControls : null]}>
        {playState === STATE_AUDIO.PLAYING && (
          <TouchableOpacity
            style={[
              styles.controlWrap,
              styles.controlPause,
              isUser ? styles.userControlWrap : null,
            ]}
            onPress={pause}>
            <Image
              source={isUser ? images.pauseAudioWhite : images.pauseAudio}
              style={{width: 32, height: 32}}
            />
          </TouchableOpacity>
        )}

        {playState !== STATE_AUDIO.PLAYING && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              play();
              props.setAutoPlay(true);
              if (props.selectedItem) {
                props.hideItemSelected(props.selectedItem.index);
              }
            }}
            style={[styles.controlWrap, styles.controlPlay]}>
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

        <Animated.View style={[styles.bgProgress, {width: widthAnimated}]} />
      </View>
    </>
  );
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
    // position: 'relative',
  },
  userControls: {
    backgroundColor: colors.primary,
    borderRadius: 0,
    marginVertical: 0,
    zIndex: 10,
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
    // width: 100,
    backgroundColor: '#595FFF',
    zIndex: -1,
  },
  userBgProgress: {
    backgroundColor: '#595FFF',
  },
  loading: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
};

const EmbedMultiAudioAnimate = React.forwardRef(EmbedMultiAudioAnimateRef);

EmbedMultiAudioAnimate.propTypes = {
  data: PropTypes.object,
  isUser: PropTypes.bool,
  autoPlay: PropTypes.bool,
  modalResult: PropTypes.bool,
  showTime: PropTypes.bool,
  navigateOutScreen: PropTypes.bool,
  setAutoPlay: PropTypes.func,
  hideItemSelected: PropTypes.func,
  setPlayDone: PropTypes.func,
};

EmbedMultiAudioAnimate.defaultProps = {
  data: {},
  isUser: false,
  autoPlay: true,
  showTime: false,
  modalResult: false,
  navigateOutScreen: false,
  setAutoPlay: () => {},
  hideItemSelected: () => {},
  setPlayDone: () => {},
};

export default EmbedMultiAudioAnimate;
