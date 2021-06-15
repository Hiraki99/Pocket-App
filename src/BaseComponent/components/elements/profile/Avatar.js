import React from 'react';
import {TouchableOpacity} from 'react-native';
import {Image} from 'react-native-animatable';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const defaultAvatar = require('~/assets/images/defaultAvatar.png');

const Avatar = (props) => {
  const {onPress, update, uri} = props;

  return (
    <TouchableOpacity activeOpacity={0.85} disable={!update} onPress={onPress}>
      <SImage
        source={uri ? {uri} : defaultAvatar}
        resizeMode="cover"
        {...props}
      />
    </TouchableOpacity>
  );
};

Avatar.propTypes = {
  onPressAvatar: PropTypes.func,
  update: PropTypes.bool,
  size: PropTypes.number,
};

Avatar.defaultProps = {
  onPressAvatar: () => {},
  update: false,
  size: 50,
};

export default Avatar;

const SImage = styled(Image)`
  width: ${(props) => props.size}
  height: ${(props) => props.size}
  borderRadius: ${(props) => props.size / 2}
`;
