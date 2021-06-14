import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import AutoHeightImage from 'react-native-auto-height-image';
import FastImage from 'react-native-fast-image';

import EmbedAudio from '~/BaseComponent/components/elements/script/EmbedAudio';
import {attachmentWidth} from '~/BaseComponent/components/elements/script/activityStyles';
import ThumbnailVideo from '~/BaseComponent/components/base/ThumnailVideo';
import {FlexContainer, RowContainer, Text} from '~/BaseComponent';
import {truncateStr} from '~/utils/utils';
import navigator from '~/navigation/customNavigator';
import {colors} from '~/themes';
import {translate} from '~/utils/multilanguage';

export default class InlineAttachment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingLayout: false,
      height: 0,
    };
  }

  onLayout = (event) => {
    const {height} = event.nativeEvent.layout;
    this.setState({
      height: height > 100 ? height : 100,
      loadingLayout: true,
    });
  };

  render() {
    const {attachment} = this.props;
    if (!attachment) {
      return null;
    }

    return (
      <View>
        {attachment && attachment.type === 'image' && (
          <AutoHeightImage
            source={{uri: attachment.path}}
            width={attachmentWidth}
            style={{marginBottom: 10}}
          />
        )}

        {attachment && attachment.type === 'reading' && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              navigator.navigate('ReadingAttachment', {attachment});
            }}>
            <RowContainer
              onLayout={this.onLayout}
              backgroundColor={colors.white}
              alignItems={'flex-start'}
              style={{borderRadius: 24, overflow: 'hidden', flex: 1}}>
              <FastImage
                source={{uri: attachment.item.image}}
                style={{width: 100, height: 100}}
              />

              <FlexContainer
                paddingHorizontal={8}
                paddingVertical={8}
                justifyContent={'space-between'}
                style={{flex: 1, height: 100}}>
                <Text color={colors.helpText} bold h5>
                  {truncateStr(attachment.item.content, 30)}
                </Text>
                <Text color={colors.placeHolder} fontSize={12}>
                  {translate('Reading')}
                </Text>
              </FlexContainer>
            </RowContainer>
          </TouchableOpacity>
        )}

        {attachment && attachment.type === 'video' && (
          <View style={this.props.styleThumbnail}>
            <ThumbnailVideo
              attachment={attachment}
              attachmentWidth={attachmentWidth}
            />
          </View>
        )}

        {attachment &&
          (attachment.type === 'audio_background' ||
            attachment.type === 'audio') && (
            <View style={{width: attachmentWidth}}>
              <EmbedAudio
                ref={(ref) => (this.audioRef = ref)}
                audio={attachment.path || attachment.item.audio}
                autoPlay={this.props.autoPlay}
                darker={this.props.darker}
              />
            </View>
          )}
      </View>
    );
  }
}

InlineAttachment.propTypes = {
  attachment: PropTypes.object,
  styleThumbnail: PropTypes.object,
  autoPlay: PropTypes.bool,
  darker: PropTypes.bool,
};

InlineAttachment.defaultProps = {
  autoPlay: true,
  darker: false,
  styleThumbnail: {},
};
