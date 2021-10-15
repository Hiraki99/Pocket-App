import React from 'react';
import {View, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {Icon} from 'native-base';

import {colors} from '~/themes';
import {RowContainer} from '~/BaseComponent';
import {OS} from '~/constants/os';
import TextBase, {
  TextBaseStyle,
} from '~/BaseComponent/components/base/text-base/TextBase';

export default class LessonSliderItem extends React.PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  image = () => {
    const {
      data: {featured_image},
    } = this.props;
    return (
      <FastImage
        resizeMode={'contain'}
        imageStyle={styles.image}
        style={styles.image}
        source={{uri: featured_image}}
      />
    );
  };

  render() {
    const {
      data: {display_name, status, order},
      onChange,
    } = this.props;
    return (
      <TouchableWithoutFeedback onPress={onChange}>
        <View style={styles.slideInnerContainer}>
          <RowContainer paddingHorizontal={14} justifyContent={'space-between'}>
            <TextBase style={[TextBaseStyle.primary, TextBaseStyle.bold]}>
              {`Unit ${order + 1}`.toUpperCase()}
            </TextBase>
            <View style={styles.processContainer}>
              <AnimatedCircularProgress
                size={24}
                width={3}
                fill={25}
                tintColor={colors.primary}
                backgroundColor={'rgb(9, 171, 142, 0.1)'}
                rotation={0}
              />
              {!status && (
                <Icon
                  name={'check'}
                  type="Entypo"
                  style={styles.iconProcessDone}
                />
              )}
            </View>
          </RowContainer>
          <View style={styles.imageContainer}>{this.image()}</View>
          <View style={styles.textContainer}>
            <TextBase
              style={[
                TextBaseStyle.h5,
                TextBaseStyle.bold,
                TextBaseStyle.center,
              ]}>
              {display_name}
            </TextBase>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  slideInnerContainer: {
    width: (OS.WIDTH - 64) / 2,
    marginHorizontal: 8,
    shadowColor: colors.black,
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowOpacity: 0.09,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: OS.IsAndroid ? 0 : 0.1,
    borderRadius: 16,
    marginTop: OS.IsAndroid ? 2 : 0,
    paddingVertical: 12,
    backgroundColor: colors.white,
    minHeight: 232,
  },
  image: {width: 140, height: 100, marginTop: 8, marginBottom: 16},
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    flex: 1,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  processContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconProcessDone: {color: colors.primary, fontSize: 16, position: 'absolute'},
});
