import React from 'react';
import {View} from 'react-native-animatable';
import {Image, Dimensions, Animated} from 'react-native';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';
import {Button} from 'native-base';

import {Text} from '~/BaseComponent';
import {colors, images} from '~/themes';

const {width} = Dimensions.get('window');
const infoWidth = width - 24 * 2 - 24 * 2 - 8 * 2;

export default class ConversationActivity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: new Animated.Value(0),
      doneAnimation: false,
      duration: (props.conversation.end - props.conversation.start) * 1000,
    };
  }

  componentDidMount() {
    const {currentTime, conversation} = this.props;

    if (currentTime >= conversation.end) {
      this.state.progress.setValue(infoWidth);
    } else {
      Animated.timing(this.state.progress, {
        toValue: infoWidth,
        duration: this.state.duration,
        useNativeDriver: false,
      }).start(this.doneAnimate);
    }
  }

  shouldComponentUpdate(nextProps): boolean {
    const {currentTime, conversation} = nextProps;
    if (
      this.props.playing !== nextProps.playing &&
      !nextProps.playing &&
      this.state.progress._value < infoWidth
    ) {
      Animated.timing(this.state.progress).stop();
      this.state.progress.setValue(this.state.progress._value);
    }

    if (
      this.props.playing !== nextProps.playing &&
      nextProps.playing &&
      this.state.progress._value < infoWidth
    ) {
      Animated.timing(this.state.progress, {
        toValue: infoWidth,
        duration: (conversation.end - currentTime) * 1000,
        // useNativeDriver: true,
      }).start(this.doneAnimate);
    }

    if (currentTime >= conversation.end && !nextProps.endActivity) {
      this.state.progress.setValue(infoWidth);
    }

    return true;
  }

  doneAnimate = () => {
    this.setState({doneAnimation: true});
  };

  replay = () => {
    const {conversation, onReplay} = this.props;
    this.state.progress.setValue(0);
    Animated.timing(this.state.progress, {
      toValue: infoWidth,
      duration:
        (parseFloat(conversation.end) - parseFloat(conversation.start)) * 1000,
      useNativeDriver: false,
    }).start();
    onReplay(conversation);
  };
  render() {
    const {conversation, onShowTranslation, replay, endActivity} = this.props;
    const {progress} = this.state;
    return (
      <View
        onLayout={this.onLayout}
        style={styles.wrap}
        animation={'fadeInRight'}
        useNativeDriver
        easing="ease-in-out"
        delay={500}
        duration={1000}>
        <FastImage
          source={{
            uri: conversation.speaker ? conversation.speaker.avatar : '',
          }}
          style={styles.avatar}
        />
        <View
          style={conversation.role ? styles.mainInfoRecorder : styles.mainInfo}>
          <Text
            color={conversation.role ? colors.white : colors.primary}
            uppercase
            bold>
            {conversation.speaker ? conversation.speaker.name : ''}
          </Text>
          <Text h5 color={conversation.role ? colors.white : colors.helpText}>
            {conversation.content}
          </Text>
          {!this.state.doneAnimation && (
            <Animated.View style={[styles.bgProgress, {width: progress}]} />
          )}
        </View>

        {replay ? (
          <>
            {endActivity && (
              <Button
                transparent
                onPress={this.replay}
                style={styles.translateWrap}>
                <Image source={images.speaker_gray} style={styles.speaker} />
              </Button>
            )}
          </>
        ) : (
          <Button
            transparent
            onPress={onShowTranslation}
            style={styles.translateWrap}>
            <Image source={images.translate} style={styles.translate} />
          </Button>
        )}
      </View>
    );
  }
}

ConversationActivity.propTypes = {
  conversation: PropTypes.object.isRequired,
  currentTime: PropTypes.number,
  playing: PropTypes.bool,
  onShowTranslation: PropTypes.func,
  onReplay: PropTypes.func,
  replay: PropTypes.bool,
  speakerRecord: PropTypes.bool,
  endActivity: PropTypes.bool,
  primary: PropTypes.bool,
};

ConversationActivity.defaultProps = {
  conversation: {},
  currentTime: 0,
  onShowTranslation: () => {},
  onReplay: () => {},
  playing: false,
  replay: false,
  endActivity: false,
  primary: false,
};

const styles = {
  wrap: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  wrapRecorder: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    // alignItems: 'center',
    marginBottom: 16,
  },
  mainInfo: {
    position: 'relative',
    borderRadius: 20,
    backgroundColor: '#F3F5F9',
    paddingVertical: 16,
    paddingHorizontal: 16,
    width: infoWidth,
    marginHorizontal: 8,
    overflow: 'hidden',
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
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignSelf: 'flex-end',
  },
  translateWrap: {
    alignSelf: 'center',
  },
  translate: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  speaker: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  bgProgress: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 0,
    backgroundColor: 'rgba(226,230,239,0.5)',
    zIndex: -1,
  },
  bgProgressRecorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 0,
    backgroundColor: '#595FFF',
    zIndex: -1,
    borderRadius: 20,
  },
};
