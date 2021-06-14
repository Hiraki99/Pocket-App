import React from 'react';
import {View} from 'react-native-animatable';
import {Dimensions, Animated} from 'react-native';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';

import {RowContainer, Text} from '~/BaseComponent';
import {PronunciationWord} from '~/BaseComponent/components/elements/pronunciation/element/PronunciationWord';
import EmbedAudio from '~/BaseComponent/components/elements/script/EmbedAudio';
import {colors} from '~/themes';
import {translate} from '~/utils/multilanguage';

const {width} = Dimensions.get('window');
const infoWidth = width - 24 * 2 - 24 * 2 - 8 * 2;

export default class ConversationActivityRoleVip extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      progress: new Animated.Value(0),
      doneAnimation: false,
      duration: (props.conversation.end - props.conversation.start) * 1000,
    };
  }

  render() {
    const {conversation} = this.props;
    return (
      <View
        onLayout={this.onLayout}
        style={styles.wrapRecorder}
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
        <View style={styles.mainInfo}>
          <Text color={colors.primary} uppercase bold>
            {conversation.speaker ? conversation.speaker.name : ''}
          </Text>
          <EmbedAudio
            audio={conversation.audio}
            darker
            modalResult
            autoPlay={false}
          />
          <RowContainer>
            <Text h5>{`${translate('Điểm số:')}`}</Text>
            <Text h5 bold color={colors.helpText} paddingHorizontal={4}>
              {`${Math.round(conversation.scoreRecognize * 100)}/100`}
            </Text>
          </RowContainer>
          <PronunciationWord
            data={conversation.analysis}
            viewDetail
            containerStyle={{
              flexWrap: 'wrap',
              paddingVertical: 16,
              paddingHorizontal: 16,
              marginVertical: 16,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              backgroundColor: colors.white,
            }}
          />
        </View>
      </View>
    );
  }
}

ConversationActivityRoleVip.propTypes = {
  conversation: PropTypes.object.isRequired,
};

ConversationActivityRoleVip.defaultProps = {
  conversation: {},
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
