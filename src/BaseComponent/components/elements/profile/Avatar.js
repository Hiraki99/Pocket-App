import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Image} from 'react-native-animatable';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {colors} from '~/themes';

const defaultAvatar = require('~/assets/images/defaultAvatar.png');

const Avatar = (props) => {
  const {onPressAvatar, update, uri} = props;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      disable={!update}
      onPress={onPressAvatar}>
      <SView {...props}>
        <SImage
          source={uri ? {uri} : defaultAvatar}
          resizeMode="cover"
          {...props}
        />
        {update && (
          <LinearGradient
            style={{
              width: '100%',
              height: props.size / 3,
              position: 'absolute',
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.6)']}>
            <Ionicons name={'camera'} color={colors.white} size={24} />
          </LinearGradient>
        )}
      </SView>
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

const SView = styled(View)`
  width: ${(props) => props.size}
  height: ${(props) => props.size}
  borderRadius: ${(props) => props.size / 2}
  overflow: hidden;
`;
