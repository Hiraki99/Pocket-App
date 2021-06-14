import React, {useEffect} from 'react';
import {
  View,
  Animated,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import Sound from 'react-native-sound';

import {SText, RowContainer} from '../../../base/CommonContainer';

import {images} from '~/themes';

export const PronunciationRow = (props) => {
  const {item} = props;
  const value = React.useRef(new Animated.Value(34)).current;
  const soundIpa = React.useRef(null);
  useEffect(() => {
    return () => {
      if (soundIpa.current) {
        soundIpa.current.release();
      }
    };
  }, []);

  useEffect(() => {
    if (
      props.selectedItem &&
      props.selectedItem.key !== props.item.key &&
      soundIpa.current
    ) {
      soundIpa.current.stop();
    }
  }, [props.item.key, props.selectedItem]);

  const initAudio = () => {
    if (props.item.info) {
      if (!soundIpa.current) {
        soundIpa.current = new Sound(props.item.info.audio, '', (error) => {
          if (!error) {
            soundIpa.current.play();
          }
        });
      } else {
        soundIpa.current.play();
      }
    }
  };

  const onLayout = (e) => {
    if (Math.round(e.nativeEvent.layout.height) !== 34) {
      Animated.timing(value, {
        toValue: e.nativeEvent.layout.height,
        duration: 100,
      }).start();
    }
  };

  return (
    <RowContainer alignItems={'flex-start'}>
      <Animated.View
        paddingVertical={4}
        style={[
          styles.phoneContainer,
          {
            height: value,
          },
        ]}>
        <SText h5 paddingHorizontal={20}>
          {item.word}
        </SText>
      </Animated.View>
      <Animated.View
        style={[
          styles.phoneIpaContainer,
          {
            height: value,
          },
        ]}>
        <SText
          h5
          good={item.good}
          passable={item.passable}
          average={item.average}
          bad={item.bad}>
          {`/${item.phone_ipa}/`}
        </SText>
      </Animated.View>
      <View style={styles.evaluationContainer} onLayout={onLayout}>
        <RowContainer justifyContent={'space-between'}>
          <SText
            h5
            bold
            good={item.good}
            passable={item.passable}
            average={item.average}
            bad={item.bad}>
            {item.comment}
          </SText>
          {props.item.info && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                initAudio();
                props.fSelectedItem(props.item);
              }}>
              <Image
                source={images.sound_2}
                style={{width: 16, height: 16, marginVertical: 4}}
              />
            </TouchableOpacity>
          )}
        </RowContainer>
        {item.info && !(item.good || item.passable) && (
          <SText fontSize={14}>{item.info.text}</SText>
        )}
      </View>
    </RowContainer>
  );
};

const styles = StyleSheet.create({
  phoneContainer: {
    width: 80,
    borderColor: '#E7E8EB',
    borderWidth: 0.5,
    paddingVertical: 8,
  },
  phoneIpaContainer: {
    paddingVertical: 8,
    flexDirection: 'row',
    width: 100,
    borderColor: '#E7E8EB',
    borderWidth: 0.5,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingRight: 12,
    paddingLeft: 20,
  },
  evaluationContainer: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    flex: 1,
    borderColor: '#E7E8EB',
    borderWidth: 0.5,
  },
});
