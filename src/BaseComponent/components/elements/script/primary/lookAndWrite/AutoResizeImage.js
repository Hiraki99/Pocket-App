import React, {useCallback, useState} from 'react';
import {StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';

import {OS} from '~/constants/os';

const AutoResizeImage = (props) => {
  const {url, marginTop, imageWidth} = props;
  const [imageHeight, setImageHeight] = useState(imageWidth);

  const loadImageFinish = useCallback((e) => {
    const width = e.nativeEvent.width;
    const height = e.nativeEvent.height;
    if (width > 0 && height > 0) {
      const ratio = height / width;
      setImageHeight(imageWidth * ratio);
    }
  }, []);

  const renderImage = useCallback(
    (url) => {
      const additionStyles = {height: imageHeight, marginTop: marginTop};
      return (
        <FastImage
          style={[styles.itemImage, additionStyles]}
          source={{
            uri: url,
          }}
          onLoad={loadImageFinish}
          resizeMode={FastImage.resizeMode.contain}
        />
      );
    },
    [marginTop, imageHeight, loadImageFinish],
  );
  return renderImage(url);
};

const styles = StyleSheet.create({
  itemImage: {
    backgroundColor: 'rgb(243,245,249)',
  },
});

export default AutoResizeImage;

AutoResizeImage.propTypes = {
  url: PropTypes.string.isRequired,
  imageWidth: PropTypes.number,
  marginTop: PropTypes.number,
};
AutoResizeImage.defaultProps = {
  url: '',
  imageWidth: OS.WIDTH,
  marginTop: 0,
};
