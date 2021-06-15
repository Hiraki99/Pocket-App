import PropTypes from 'prop-types';
import React, {useEffect} from 'react';
import {StyleSheet, View, ActivityIndicator, ViewPropTypes} from 'react-native';
import ImageResizer from 'react-native-image-resizer';
import FastImage from 'react-native-fast-image';

import {OS} from '~/constants/os';

const ImageOptimize = (props) => {
  const {source, resizeMode, imageStyle, quality} = props;
  const [showFallback, setShowFallBack] = React.useState(true);
  const [imagePathOptimize, setImagePathOptimize] = React.useState(null);

  useEffect(() => {
    const getImageResize = async () => {
      ImageResizer.createResizedImage(
        source,
        imageStyle.width * 2,
        imageStyle.height * 2,
        !OS.IsAndroid ? 'PNG' : 'WEBP',
        quality,
        0,
        undefined,
        true,
        {},
      )
        .then((response) => {
          setImagePathOptimize(response.uri);
          setShowFallBack(false);
        })
        .catch(() => {
          setShowFallBack(true);
        });
    };
    getImageResize();
  }, [source, imageStyle, quality]);

  return (
    <View style={props.imageStyle}>
      {imagePathOptimize && (
        <FastImage
          resizeMode={resizeMode}
          source={{uri: imagePathOptimize}}
          style={[props.imageStyle]}
        />
      )}
      {showFallback && (
        <View style={[styles.placeholder, props.imageStyle]}>
          <ActivityIndicator />
        </View>
      )}
    </View>
  );
};

const styles = {
  container: {
    backgroundColor: 'transparent',
    position: 'relative',
  },
  placeholderContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
};

ImageOptimize.propTypes = {
  source: PropTypes.any,
  resizeMode: PropTypes.string,
  imageStyle: ViewPropTypes.style,
  local: PropTypes.bool,
  quality: PropTypes.number,
};
ImageOptimize.defaultProps = {
  source: null,
  resizeMode: 'cover',
  imageStyle: {},
  local: false,
  quality: 50,
};

export default ImageOptimize;
