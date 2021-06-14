import React from 'react';
import {View} from 'react-native-animatable';
import FastImage from 'react-native-fast-image';
import {Image, Dimensions, Animated} from 'react-native';
import PropTypes from 'prop-types';
import {Button} from 'native-base';
import Sound from 'react-native-sound';

import {colors, images} from '~/themes';
import {Text} from '~/BaseComponent';

const {width} = Dimensions.get('window');
const infoWidth = width - 24 * 2 - 24 * 2 - 8 * 2;

export default class ConversationRecordActivity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: new Animated.Value(0),
      doneAnimation: false,
      pauseAnimation: false,
      duration: props.conversation.duration
        ? props.conversation.duration * 1000
        : (props.conversation.end - props.conversation.start) * 1000,
    };
  }

  componentDidMount() {
    const {onEndPlayRecorded, conversation, endActivity} = this.props;
    if (conversation.audio) {
      this.sound = new Sound(conversation.audio, '', (err) => {
        if (!err && endActivity) {
          this.sound.play();
          Animated.timing(this.state.progress, {
            toValue: infoWidth,
            duration: this.state.duration,
            useNativeDriver: false,
          }).start(this.doneAnimation);
        } else {
          onEndPlayRecorded();
        }
      });
    } else {
      Animated.timing(this.state.progress, {
        toValue: infoWidth,
        duration: this.state.duration,
        useNativeDriver: false,
      }).start(this.doneAnimation);
    }
  }

  async shouldComponentUpdate(nextProps): boolean {
    const {currentTime, conversation} = nextProps;
    if (
      this.props.playing !== nextProps.playing &&
      !nextProps.playing &&
      this.state.progress._value < infoWidth
    ) {
      await this.setState({pauseAnimation: true});
      Animated.timing(this.state.progress).stop();
      this.state.progress.setValue(this.state.progress._value);
    }

    if (
      this.props.playing !== nextProps.playing &&
      nextProps.playing &&
      this.state.progress._value < infoWidth
    ) {
      await this.setState({pauseAnimation: false});
      Animated.timing(this.state.progress, {
        toValue: infoWidth,
        duration: (conversation.end - currentTime) * 1000,
        // useNativeDriver: true,
      }).start(this.doneAnimation);
    }

    if (currentTime >= conversation.end && !nextProps.endActivity) {
      this.state.progress.setValue(infoWidth);
    }

    return true;
  }

  doneAnimation = () => {
    if (!this.state.pauseAnimation) {
      this.setState({doneAnimation: true});
    }
    this.props.onEndPlayRecorded();
  };

  onReplay = () => {
    this.state.progress.setValue(0);
    this.sound.setCurrentTime(0);
    this.sound.play();
    Animated.timing(this.state.progress, {
      toValue: infoWidth,
      duration: this.state.duration,
      useNativeDriver: false,
    }).start();
  };

  componentWillUnmount(): void {
    if (this.sound) {
      this.sound.release();
    }
  }

  render() {
    const {
      conversation,
      endActivity,
      onShowTranslation,
      translation,
    } = this.props;
    const {progress} = this.state;
    return (
      <View
        style={styles.wrapRecorder}
        animation={'fadeInLeft'}
        useNativeDriver
        easing="ease-in-out"
        delay={500}
        duration={1000}>
        {endActivity && (
          <Button
            transparent
            onPress={this.onReplay}
            style={styles.translateWrap}>
            <Image source={images.speaker_record} style={styles.speaker} />
          </Button>
        )}
        {translation && (
          <Button
            transparent
            onPress={onShowTranslation}
            style={styles.translateWrap}>
            <Image source={images.translate} style={styles.translate} />
          </Button>
        )}

        <View style={styles.mainInfoRecorder}>
          <Text color={colors.white} uppercase bold>
            {conversation.speaker ? conversation.speaker.name : ''}
          </Text>
          <Text h5 color={colors.white}>
            {conversation.content}
          </Text>
          {!this.state.doneAnimation && (
            <Animated.View
              style={[
                conversation.role
                  ? styles.bgProgressRecorder
                  : styles.bgProgress,
                {width: progress},
              ]}
            />
          )}
        </View>
        {conversation?.speaker?.avatar && (
          <FastImage
            source={{
              uri: conversation.speaker ? conversation.speaker.avatar : '',
            }}
            style={styles.avatar}
          />
        )}
      </View>
    );
  }
}

ConversationRecordActivity.propTypes = {
  conversation: PropTypes.object.isRequired,
  onEndPlayRecorded: PropTypes.func,
  onShowTranslation: PropTypes.func,
  currentTime: PropTypes.number,
  endActivity: PropTypes.bool,
  translation: PropTypes.bool,
};

ConversationRecordActivity.defaultProps = {
  conversation: {},
  onEndPlayRecorded: () => {},
  onShowTranslation: () => {},
  endActivity: false,
  translation: false,
  currentTime: 0,
};

const styles = {
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignSelf: 'flex-end',
  },
  wrap: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  wrapRecorder: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  mainInfoRecorder: {
    position: 'relative',
    borderRadius: 20,
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 16,
    width: infoWidth,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  translateWrap: {
    alignSelf: 'center',
  },
  speaker: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  bgProgressRecorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 0,
    backgroundColor: '#595FFF',
    zIndex: -1,
  },
  translate: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
};
