import React from 'react';
import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';

import {getDimensionVideo169} from '~/utils/common';
import {OS} from '~/constants/os';
import images from '~/themes/images';
import Text from '~/BaseComponent/components/base/Text';
import colors from '~/themes/colors';
import {RowContainer} from '~/BaseComponent';

export default class HottestExam extends React.PureComponent {
  render() {
    const {image, content, action, title} = this.props;

    return (
      <TouchableOpacity activeOpacity={0.7} onPress={action}>
        <View style={[styles.wrapper, this.props.containerStyle]}>
          <FastImage
            source={typeof image === 'string' ? {uri: image} : image}
            resizeMode={'cover'}
            style={styles.image}
          />
          <Image
            style={[styles.gradient, this.props.gradientStyle]}
            source={images.gradient}
            resizeMode="stretch"
          />
          <RowContainer justifyContent={'center'} style={styles.title}>
            <Text
              fontSize={14}
              color={colors.white}
              bold
              uppercase
              paddingHorizontal={4}>
              {title}
            </Text>
          </RowContainer>
          <RowContainer justifyContent={'center'} style={styles.content}>
            <Text
              h5
              center
              color={colors.white}
              bold
              uppercase
              paddingVertical={8}
              paddingHorizontal={4}>
              {content}
            </Text>
          </RowContainer>
        </View>
      </TouchableOpacity>
    );
  }
}

HottestExam.propTypes = {
  image: PropTypes.any,
  title: PropTypes.string,
  content: PropTypes.string,
  action: PropTypes.func,
};

HottestExam.defaultProps = {
  title: 'bài test',
  content: '',
  action: () => {},
};

const styles = StyleSheet.create({
  wrapper: {
    width: OS.WIDTH - 48,
    height: getDimensionVideo169(OS.WIDTH - 48),
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#3C80D1',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.09,
    shadowRadius: 19,
    elevation: 1,
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
    // borderRadius: 8,
  },
  title: {
    backgroundColor: colors.primary,
    width: 80,
  },
  content: {
    width: '100%',
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  containerDefault: {
    width: OS.WIDTH - 48,
    height: getDimensionVideo169(OS.WIDTH - 48),
  },
  gradient: {
    width: OS.WIDTH - 48,
    height: 92,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
