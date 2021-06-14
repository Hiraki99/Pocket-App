import React, {
  useRef,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react';
import PropTypes from 'prop-types';
import {Icon} from 'native-base';
import {Image, TouchableOpacity, View, Animated, Easing} from 'react-native';
import * as Animatable from 'react-native-animatable';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {OS} from '~/constants/os';
import {colors, images} from '~/themes';

const WIDTH_CONTAINER = OS.WIDTH;
const HEIGHT_CONTAINER = (OS.WIDTH * 1080) / 1440 + 3;
const WIDTH_IMAGE = OS.WIDTH - 80;
const HEIGHT_IMAGE = (WIDTH_IMAGE * 1080) / 1440 + 3;

const ListenAndPoint = (props, ref) => {
  const {data, setAnswer, answer} = props;
  const [checked, setChecked] = React.useState(false);
  const scalePhone = useRef(new Animated.Value(0)).current;
  useImperativeHandle(ref, () => ({
    show: () => {
      show();
    },
    hide: () => {
      hide();
    },
  }));

  const widthContainer = scalePhone.interpolate({
    inputRange: [0, 1],
    outputRange: [0, WIDTH_CONTAINER],
  });

  const heightContainer = scalePhone.interpolate({
    inputRange: [0, 1],
    outputRange: [0, HEIGHT_CONTAINER],
  });

  const widthImage = scalePhone.interpolate({
    inputRange: [0, 1],
    outputRange: [data.width * WIDTH_CONTAINER, WIDTH_IMAGE],
  });

  const heightImage = scalePhone.interpolate({
    inputRange: [0, 1],
    outputRange: [data.height * HEIGHT_CONTAINER, HEIGHT_IMAGE],
  });

  const translateY = scalePhone.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -1 * data.y * HEIGHT_CONTAINER],
  });

  const translateX = scalePhone.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -1 * data.x * WIDTH_CONTAINER],
  });

  const translateYY = scalePhone.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 30 - data.y * HEIGHT_CONTAINER],
  });

  const translateXX = scalePhone.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 40 - data.x * WIDTH_CONTAINER],
  });

  const show = useCallback(() => {
    setChecked(true);
    setAnswer(data);
    Animated.timing(scalePhone, {
      toValue: 1,
      duration: 500,
      easing: Easing.inOut(Easing.sin),
    }).start();
  }, [data, setAnswer, scalePhone]);

  const hide = useCallback(() => {
    setAnswer(null);
    setChecked(false);
    Animated.timing(scalePhone, {
      toValue: 0,
      duration: 500,
      easing: Easing.inOut(Easing.sin),
    }).start();
  }, [scalePhone, setAnswer]);

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          if (checked) {
            // return hide();
          } else {
            props.onEffectPlay(data);
            show();
          }
        }}
        style={{zIndex: answer && answer.id === data.id ? 101 : 10}}>
        <Animatable.Image
          resizeMode={'contain'}
          source={{uri: data.url}}
          style={{
            width: widthImage,
            height: heightImage,
            opacity: scalePhone,
            position: 'absolute',
            top: data.y * HEIGHT_CONTAINER,
            left: data.x * WIDTH_CONTAINER,
            transform: [{translateY: translateYY}, {translateX: translateXX}],
          }}
        />
      </TouchableOpacity>
      <Animated.View
        backgroundColor={colors.mainBgColor}
        style={{
          width: widthContainer,
          height: heightContainer,
          opacity: scalePhone,
          position: 'absolute',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          top: data.y * HEIGHT_CONTAINER,
          left: data.x * WIDTH_CONTAINER,
          transform: [{translateY}, {translateX}],
        }}>
        {checked && (
          <>
            <TouchableOpacity
              style={{
                position: 'absolute',
                top: 10,
                right: 12,
              }}
              onPress={() => {
                hide();
              }}>
              <View>
                <AntDesign
                  name={'closecircle'}
                  size={24}
                  color={colors.placeHolder}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                position: 'absolute',
                bottom: 10,
                right: 10,
              }}
              onPress={() => {
                props.playAudioObject(data);
              }}>
              <Image
                source={images.primary_play_audio}
                style={{width: 32, height: 32}}
              />
            </TouchableOpacity>
            {props.enableRecord && (
              <View
                style={{
                  position: 'absolute',
                  bottom: 10,
                  left: 10,
                  zIndex: 103,
                }}>
                <TouchableOpacity onPress={() => props.onRecord(props.data)}>
                  <View
                    alignItems={'center'}
                    justifyContent={'center'}
                    backgroundColor={'#E2E6EF'}
                    style={{width: 30, height: 30, borderRadius: 15}}>
                    <View
                      alignItems={'center'}
                      justifyContent={'center'}
                      backgroundColor={colors.primary}
                      style={{width: 24, height: 24, borderRadius: 12}}>
                      <Icon
                        name="microphone"
                        type="FontAwesome"
                        style={{
                          color: colors.white,
                          fontSize: 15,
                          marginLeft: 1,
                        }}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </Animated.View>
    </>
  );
};
const ListenAndPointRef = forwardRef(ListenAndPoint);

ListenAndPointRef.propTypes = {
  data: PropTypes.object,
  index: PropTypes.number,
  currentTime: PropTypes.number,
  answer: PropTypes.object,
  setAnswer: PropTypes.func,
  enableRecord: PropTypes.bool,
  autoPlay: PropTypes.bool,
  onRecord: PropTypes.func,
  setAutoPlay: PropTypes.func,
  playAudioObject: PropTypes.func,
  onEffectPlay: PropTypes.func,
};
ListenAndPointRef.defaultProps = {
  data: {},
  index: 0,
  currentTime: 0,
  answer: null,
  setAnswer: () => {},
  enableRecord: false,
  autoPlay: true,
  onRecord: () => {},
  setAutoPlay: () => {},
  playAudioObject: () => {},
  onEffectPlay: () => {},
};

export default ListenAndPointRef;
