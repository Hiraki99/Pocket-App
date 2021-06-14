import React from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import TrackPlayer from 'react-native-track-player';
import {View as AnimatedView} from 'react-native-animatable';

import {FlexContainer, NoFlexContainer, Text} from '~/BaseComponent';
import {OS} from '~/constants/os';
import {colors, images} from '~/themes';
import {translate} from '~/utils/multilanguage';

class VocabularyWordSummary extends React.Component {
  componentDidMount(): void {
    const {item, active} = this.props;
    if (active) {
      this.playAudio(item);
    }
  }

  shouldComponentUpdate(nextProps) {
    if (
      this.props.active !== nextProps.active &&
      nextProps.active &&
      !nextProps.outScreen
    ) {
      this.playAudio(nextProps.item);
    }
    if (
      (this.props.active !== nextProps.active && !nextProps.active) ||
      (this.props.outScreen !== nextProps.outScreen && nextProps.outScreen)
    ) {
      this.removeAudio();
    }
    return true;
  }

  componentWillUnmount() {
    this.removeAudio();
  }

  playAudio = async (item) => {
    const {lessonIndex, partIndex} = this.props;
    const unitTitle =
      lessonIndex + 1 < 10
        ? translate('Unit 0%s', {s1: `${lessonIndex + 1}`})
        : translate('Unit %s', {s1: `${lessonIndex + 1}`});
    const partTitle =
      lessonIndex + 1 < 10
        ? translate('Part 0%s', {s1: `${partIndex + 1}`})
        : translate('Part %s', {s1: `${partIndex + 1}`});
    const list = [];
    list.push({
      id: item._id,
      url: item.audio_pronunciation,
      title: unitTitle,
      artist: partTitle,
      artwork: require('~/assets/images/logoBackground.png'),
    });
    if (item.audios && item.audios.length > 0) {
      list.push({
        id: item.audios[0].key,
        url: item.audios[0].audio,
        title: unitTitle,
        artist: partTitle,
        artwork: require('~/assets/images/logoBackground.png'),
      });
    }
    this.props.updateListPlayTrack(list);
    await TrackPlayer.add(list);
    TrackPlayer.play();
  };

  removeAudio = () => {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    TrackPlayer.stop();
    TrackPlayer.reset();
  };

  render() {
    const {item, width} = this.props;
    return (
      <AnimatedView
        animation="fadeInUp"
        useNativeDriver={true}
        easing="ease-in-out"
        duration={300}
        backgroundColor={'rgba(0, 0, 0, 0.6)'}
        style={[styles.question]}>
        <TouchableWithoutFeedback
          onPress={() => {
            this.props.onClose();
          }}>
          <Image source={images.closeModal} style={styles.closeModal} />
        </TouchableWithoutFeedback>
        <FlexContainer
          justifyContent={'center'}
          alignItems={'center'}
          style={{zIndex: 1}}>
          <View style={[styles.questionImageBg, width]}>
            <FastImage
              source={{uri: item.images[0]}}
              style={{width: OS.WIDTH - 60, height: OS.HEIGHT * 0.365}}
            />
            <NoFlexContainer
              paddingHorizontal={16}
              paddingVertical={32}
              justifyContent={'center'}
              alignItems={'center'}
              style={styles.textContainer}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.iconAudioContainer}>
                <Image source={images.sound_2} style={styles.iconAudio} />
              </TouchableOpacity>

              <Text color={colors.primary} h3 bold center paddingTop={16}>
                {item.name}
              </Text>
              <Text color={colors.helpText2} h5 center paddingBottom={4}>
                {item.pronunciation}
              </Text>
              <Text color={colors.helpText} h5 center>
                {item.example}
              </Text>
            </NoFlexContainer>
          </View>
        </FlexContainer>
      </AnimatedView>
    );
  }
}

VocabularyWordSummary.propTypes = {
  item: PropTypes.object,
  updateTimeListened: PropTypes.func,
  onClose: PropTypes.func,
  updateListPlayTrack: PropTypes.func,
  active: PropTypes.bool,
  width: PropTypes.number,
  partIndex: PropTypes.number,
  lessonIndex: PropTypes.number,
  textComponent: PropTypes.elementType,
};

VocabularyWordSummary.defaultProps = {
  item: {},
  updateTimeListened: () => {},
  onClose: () => {},
  updateListPlayTrack: () => {},
  active: true,
  shadow: false,
  width: OS.WIDTH - 60,
  lessonIndex: 0,
  partIndex: 0,
  textComponent: null,
};

const styles = StyleSheet.create({
  question: {
    position: 'absolute',
    // flexDirection: 'column',
    // justifyContent: 'center',
    // alignItems: 'center',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    borderRadius: 16,
  },
  closeModal: {
    width: 24,
    height: 24,
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
  },
  shadow: {
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 2,
  },
  questionImageBg: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.white,
    width: OS.WIDTH - 60,
  },
  answerImgContainer: {
    overflow: 'hidden',
    top: 0,
    height: (OS.HEIGHT * 60) / 100,
    width: '100%',
    position: 'absolute',
    zIndex: 2,
  },
  responseContainer: {
    position: 'absolute',
    zIndex: 4,
    width: '100%',
    top: 0,
    height: OS.GameImageWater,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeOutContainer: {
    position: 'absolute',
    zIndex: 1001,
    width: '100%',
    top: 0,
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconAudioContainer: {
    position: 'absolute',
    top: -20,
    left: (OS.WIDTH - 60) / 2 - 20,
  },
  iconAudio: {width: 40, height: 40},
  textContainer: {
    maxHeight: 350,
    paddingVertical: 16,
  },
});

export default VocabularyWordSummary;
