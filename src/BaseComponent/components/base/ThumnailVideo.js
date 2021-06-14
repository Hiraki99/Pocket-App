import React from 'react';
import navigator from '~/navigation/customNavigator';
import FastImage from 'react-native-fast-image';
import {getDimensionVideo169} from '~/utils/utils';
import {Image, TouchableOpacity} from 'react-native';
import {images} from '~/themes';
import PropTypes from 'prop-types';
import {OS} from '~/constants/os';
import LinearGradient from 'react-native-linear-gradient';

const ThumbnailVideo = (props) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        navigator.navigate('Youtube', {
          video: {
            videoId: props.attachment.path.id,
            start: props.attachment.path.start,
            end: props.attachment.path.end,
          },
        });
      }}>
      <FastImage
        source={
          !props.attachment.path.id
            ? typeof props.image === 'number'
              ? props.image
              : {uri: props.image}
            : {
                uri: `https://img.youtube.com/vi/${props.attachment.path.id}/sddefault.jpg`,
              }
        }
        resizeMode={'cover'}
        style={{
          width: props.attachmentWidth,
          height: getDimensionVideo169(props.attachmentWidth),
          borderRadius: props.border ? 16 : 0,
        }}
      />
      <LinearGradient
        style={{
          width: props.attachmentWidth,
          height: getDimensionVideo169(props.attachmentWidth),
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          borderRadius: props.border ? 16 : 0,
        }}
        colors={[
          'rgba(0, 0, 0, 0.05)',
          'rgba(0, 0, 0, 0.1)',
          'rgba(0, 0, 0, 0.3)',
          'rgba(0, 0, 0, 0.5)',
        ]}>
        <Image
          source={images.playAudio}
          style={{width: 40, height: 40, opacity: 0.9}}
        />
      </LinearGradient>
    </TouchableOpacity>
  );
};

ThumbnailVideo.propTypes = {
  attachmentWidth: PropTypes.number,
  image: PropTypes.any,
  attachment: PropTypes.object,
};
ThumbnailVideo.defaultProps = {
  attachmentWidth: OS.WIDTH,
  image: null,
  attachment: {path: {}},
};

export default ThumbnailVideo;
