import React from 'react';
import PropTypes from 'prop-types';
import {Image, StyleSheet, View, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import TrackPlayer from 'react-native-track-player';

import {OS} from '~/constants/os';
import {NoFlexContainer, Text} from '~/BaseComponent';
import {colors, images} from '~/themes';

class VocabularyWordMeditationItem extends React.Component {
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

  playAudio = async (item) => {
    const {lessonIndex, partIndex} = this.props;
    const unitTitle =
      lessonIndex + 1 < 10
        ? `Unit 0${lessonIndex + 1}`
        : `Unit ${lessonIndex + 1}`;
    const partTitle =
      lessonIndex + 1 < 10 ? `Part 0${partIndex + 1}` : `Part ${partIndex + 1}`;
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

  componentWillUnmount(): void {
    this.removeAudio();
  }

  removeAudio = () => {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    if (this.sound) {
      this.sound.pause();
      this.sound.release();
      this.sound = null;
    }
    if (this.soundExample) {
      this.soundExample.pause();
      this.soundExample.release();
      this.soundExample = null;
    }
  };

  render() {
    const {item, shadow, width} = this.props;

    return (
      <NoFlexContainer
        alignItems={'center'}
        backgroundColor={colors.white}
        style={[styles.question, shadow ? styles.shadow : null, {width}]}>
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
            <Text
              color={colors.primary}
              h3
              bold
              center
              style={{marginBottom: 8}}>
              {item.name}
            </Text>
            <Text color={colors.helpText} h5 center>
              {item.example}
            </Text>
          </NoFlexContainer>
        </View>
      </NoFlexContainer>
    );
  }
}

VocabularyWordMeditationItem.propTypes = {
  item: PropTypes.object,
  updateTimeListened: PropTypes.func,
  updateListPlayTrack: PropTypes.func,
  active: PropTypes.bool,
  shadow: PropTypes.bool,
  width: PropTypes.number,
  partIndex: PropTypes.number,
  lessonIndex: PropTypes.number,
  textComponent: PropTypes.elementType,
};

VocabularyWordMeditationItem.defaultProps = {
  item: {},
  updateTimeListened: () => {},
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
    // height: 500,
    borderRadius: 16,
    marginBottom: 30,
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
    height: 200,
  },
});

export default VocabularyWordMeditationItem;
