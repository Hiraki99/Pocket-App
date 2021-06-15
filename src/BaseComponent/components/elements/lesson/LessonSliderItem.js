import React from 'react';
import {View, TouchableNativeFeedback, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';

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
      data: {name, display_name},
      onChange,
    } = this.props;

    return (
      <TouchableNativeFeedback activeOpacity={1} onPress={onChange}>
        <View style={styles.slideInnerContainer}>
          <RowContainer paddingHorizontal={14}>
            <TextBase style={[TextBaseStyle.primary, TextBaseStyle.bold]}>
              {name.replace('Bài', 'unit').toUpperCase()}
            </TextBase>
          </RowContainer>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 4,
            }}>
            {this.image()}
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
        </View>
      </TouchableNativeFeedback>
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
      height: 8,
    },
    shadowOpacity: 0.09,
    shadowRadius: 10,

    elevation: 3,
    borderWidth: 0.01,
    borderRadius: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
  },
  image: {width: 140, height: 100, marginTop: 8, marginBottom: 16},
});
