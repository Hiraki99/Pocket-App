import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';

import CommonImage from '../../base/Image';

import {Text} from '~/BaseComponent';
import {OS} from '~/constants/os';
import {colors, images} from '~/themes';

export default class VocabularyCard extends React.PureComponent {
  render() {
    const {image, title, size, subTitle, action} = this.props;
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={action}>
        <View style={[styles.wrapper, size === 'sm' ? styles.wrapperSm : null]}>
          <CommonImage
            source={typeof image === 'string' ? {uri: image} : image}
            style={styles.image}
            resizeMode="cover"
          />
          <FastImage
            style={[styles.gradient, size === 'sm' ? styles.gradientSm : null]}
            source={images.gradient}
            resizeMode="stretch"
          />

          <View
            style={[styles.content, size === 'sm' ? styles.contentSm : null]}>
            <Text
              color={colors.white}
              fontSize={19}
              bold
              uppercase={size === 'sm'}
              style={[size === 'sm' ? styles.titleSm : null]}>
              {title}
            </Text>

            {size === 'lg' && (
              <Text fontSize={14} color="rgba(255,255,255,0.6)">
                {subTitle}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

VocabularyCard.propTypes = {
  image: PropTypes.any,
  size: PropTypes.oneOf(['lg', 'sm']),
  title: PropTypes.string,
  subTitle: PropTypes.string,
  action: PropTypes.func,
};

VocabularyCard.defaultProps = {
  size: 'lg',
  subTitle: '',
  action: () => {},
};

const styles = {
  wrapper: {
    width: OS.WIDTH - 48,
    height: 184,
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: 16,
    shadowColor: '#3C80D1',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.09,
    shadowRadius: 19,
    elevation: 2,
  },
  wrapperSm: {
    width: 160,
    height: 80,
    marginBottom: 7,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 8,
  },
  gradient: {
    width: OS.WIDTH - 48,
    height: 92,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 8,
  },
  gradientSm: {
    width: 160,
    height: 40,
  },
  content: {
    padding: 24,
  },
  contentSm: {
    padding: 17,
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  titleSm: {
    width: 80,
    position: 'absolute',
    left: 17,
    bottom: 12,
    lineHeight: 18,
    fontSize: 12,
  },
};
