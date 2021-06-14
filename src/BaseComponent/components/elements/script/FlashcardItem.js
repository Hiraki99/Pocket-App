import React from 'react';
import {
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Button, FlexContainer, Text} from '~/BaseComponent';
import PropTypes from 'prop-types';
import VideoPlayer from '~/BaseComponent/components/elements/script/VideoPlayer';
import Sound from 'react-native-sound';
import EmbedAudio from '~/BaseComponent/components/elements/script/EmbedAudio';
import {PreloadVideoComponent} from '~/BaseComponent/components/elements/script/video/PreloadVideoComponent';
import {connect} from 'react-redux';

import styles from './flashcardStyles';

import {OS} from '~/constants/os';
import {getDimensionVideo169} from '~/utils/utils';
import {doneQuestion} from '~/features/activity/ActivityAction';
import {colors, images} from '~/themes';
import {translate} from '~/utils/multilanguage';

const {width} = Dimensions.get('window');

class FlashcardItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      videoHeight: 0,
      autoplay: false,
    };

    this.playAudio = this.playAudio.bind(this);
  }

  componentDidMount() {
    const {item} = this.props;
    if (this.props.activeScreen) {
      this.playAudio(item.audio);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.activeScreen !== prevProps.activeScreen) {
      if (this.props.activeScreen) {
        this.playAudio(this.props.item.audio);
      } else {
        if (this.player) {
          this.player.pause();
        }
      }
    }
  }

  componentWillUnmount(): void {
    if (this.player) {
      this.player.release();
      this.player = null;
    }
  }

  playAudio(audio) {
    if (this.player) {
      this.player.play(this.playSuccess);
    } else {
      this.player = new Sound(audio, '', (error) => {
        if (!error) {
          this.playAudio();
        }
      });
    }
  }

  playSuccess = () => {
    setTimeout(async () => {
      await this.setState({autoplay: true});
    }, 1000);
  };

  calculateHeight = (event) => {
    const {height} = event.nativeEvent.layout;
    this.setState({
      videoHeight:
        OS.HEIGHT - height - OS.statusBarHeight - (OS.IsAndroid ? 110 : 20),
    });
  };

  nextItem = () => {
    const {onNext, doneQuestion} = this.props;

    doneQuestion();
    onNext();
  };

  render() {
    const {item, activeScreen} = this.props;

    if (!activeScreen) {
      return null;
    }
    if (item.attachment.type === 'video') {
      return (
        <FlexContainer>
          {this.props.activeScreen ? (
            <VideoPlayer
              videoId={item.attachment.item.video.id}
              start={item.attachment.item.video.start}
              end={item.attachment.item.video.end}
              height={getDimensionVideo169(OS.WIDTH)}
            />
          ) : (
            <PreloadVideoComponent />
          )}
          <View
            style={[styles.videoFlashcard, styles.videoContentFlashCard]}
            onLayout={this.calculateHeight}>
            <Text h2 center bold primary>
              {item.mainWord}
            </Text>

            {item.pronunciation && item.attachment.type !== 'audio' && (
              <Text h5 center>
                {item.pronunciation}
              </Text>
            )}
            {item.typeWord && (
              <Text h5 center bold primary>
                ({item.typeWord})
              </Text>
            )}
            <View
              style={{
                justifyContent: 'space-between',
                flex: 1,
                marginBottom: 48,
              }}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={{flexGrow: 0}}>
                <Text
                  center
                  color={colors.helpText2}
                  h5
                  style={{marginVertical: 10}}>
                  {item.attachment.item.wordMeaning}
                </Text>

                <Text center h5 style={{marginBottom: 60}}>
                  {item.attachment.item.example}
                </Text>
              </ScrollView>
              <Button
                shadow={false}
                large
                primary
                rounded
                block
                uppercase
                bold
                icon
                onPress={this.nextItem}>
                {translate('OK, đã hiểu')}
              </Button>
            </View>
          </View>
        </FlexContainer>
      );
    }

    return (
      <View style={styles.wrap}>
        <View justifyContent={'center'} alignItems={'center'}>
          {(item.attachment.type === 'image' ||
            item.attachment.type === 'audio') && (
            <FastImage
              source={{
                uri:
                  item.attachment.item.image || item.attachment.item.background,
              }}
              style={{width: width, height: OS.GameImageWater - 10}}
              blurRadius={1}
              resizeMode="cover"
            />
          )}
          {item.attachment.type === 'definition' && (
            <Image
              source={{
                uri:
                  item.attachment.item.image || item.attachment.item.background,
              }}
              style={{width: width, height: OS.GameImageWater - 10}}
              blurRadius={1.5}
              resizeMode="cover"
            />
          )}

          {item.attachment.type === 'definition' && (
            <View
              style={[
                styles.overlay,
                {justifyContent: 'center', paddingTop: 0},
              ]}>
              <View>
                <Text center h2 bold color={colors.white}>
                  {translate('Definition')}
                </Text>
                <Text
                  center
                  fontSize={19}
                  medium
                  color={colors.white}
                  paddingVertical={16}>
                  {item.attachment.item.definition}
                </Text>
              </View>
            </View>
          )}
        </View>
        {item.attachment.type === 'video' && (
          <>
            {this.props.activeScreen ? (
              <VideoPlayer
                videoId={item.attachment.item.video.id}
                start={item.attachment.item.video.start}
                end={item.attachment.item.video.end}
                height={getDimensionVideo169(OS.WIDTH)}
              />
            ) : (
              <PreloadVideoComponent />
            )}
          </>
        )}

        <View
          style={[
            styles.bottomCard,
            item.attachment.type === 'video' ? styles.videoFlashcard : null,
            item.attachment.type === 'definition'
              ? {
                  height: OS.HEIGHT - OS.GameImageWater - OS.statusBarHeight,
                }
              : null,
          ]}
          onLayout={this.calculateHeight}>
          {item.attachment.type !== 'video' && (
            <TouchableOpacity
              style={styles.listen}
              activeOpacity={0.75}
              onPress={this.playAudio}>
              <Image source={images.sound_2} style={{width: 40, height: 40}} />
            </TouchableOpacity>
          )}

          <Text h2 center bold primary>
            {item.mainWord}
          </Text>
          {item.pronunciation && item.attachment.type !== 'audio' && (
            <Text h5 center>
              {item.pronunciation}
            </Text>
          )}
          {item.typeWord && (
            <Text h5 center bold primary>
              ({item.typeWord})
            </Text>
          )}
          <ScrollView showsVerticalScrollIndicator={false}>
            {item.attachment.type === 'audio' && (
              <>
                <EmbedAudio
                  audio={item.attachment.item.audio}
                  autoPlay={this.state.autoplay}
                />
                <Text center h5 style={{marginVertical: 10}}>
                  {item.attachment.item.sentence}
                </Text>
                <Text
                  center
                  h5
                  color={colors.helpText2}
                  style={{marginBottom: 60}}>
                  {item.attachment.item.translation}
                </Text>
              </>
            )}

            {item.attachment.type !== 'audio' && (
              <>
                <Text
                  center
                  color={colors.helpText2}
                  h5
                  style={{marginVertical: 10}}>
                  {item.attachment.item.wordMeaning}
                </Text>

                <Text center h5 style={{marginBottom: 60}}>
                  {item.attachment.type !== 'definition' &&
                    item.attachment.item.example}
                </Text>
              </>
            )}
          </ScrollView>
          <Button
            large
            primary
            rounded
            block
            uppercase
            bold
            icon
            onPress={this.nextItem}>
            {translate('OK, đã hiểu')}
          </Button>
        </View>
      </View>
    );
  }
}

FlashcardItem.propTypes = {
  item: PropTypes.object.isRequired,
  activeScreen: PropTypes.bool.isRequired,
  onNext: PropTypes.func,
};

FlashcardItem.defaultProps = {
  onNext: () => {},
};

export default connect(null, {
  doneQuestion,
})(FlashcardItem);
