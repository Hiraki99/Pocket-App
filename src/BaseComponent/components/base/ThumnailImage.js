import React from 'react';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';
import {getDimensionVideo169} from '~/utils/utils';
import {Image, TouchableOpacity, View} from 'react-native';
import {images} from '~/themes';
import {OS} from '~/constants/os';

const ThumbnailImage = (props) => {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={props.action}>
      <FastImage
        source={props.source}
        resizeMode={'cover'}
        style={{
          width: props.attachmentWidth,
          height: getDimensionVideo169(props.attachmentWidth),
          borderRadius: props.border ? 16 : 0,
        }}
      />
      <View
        style={{
          width: props.attachmentWidth,
          height: getDimensionVideo169(props.attachmentWidth),
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
        }}>
        {props.showButton && (
          <Image
            source={images.playAudioMix}
            style={{width: 40, height: 40, opacity: 0.9}}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

ThumbnailImage.propTypes = {
  source: PropTypes.any.isRequired,
  action: PropTypes.func,
  attachmentWidth: PropTypes.number,
  showButton: PropTypes.bool,
};
ThumbnailImage.defaultProps = {
  action: () => {},
  attachmentWidth: OS.WIDTH,
  showButton: true,
};

export default ThumbnailImage;
