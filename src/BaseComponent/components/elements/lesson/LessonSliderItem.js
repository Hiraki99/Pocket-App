import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';

import Button from '../../base/Button';

import styles from './lessonStyles';

import {truncateStr} from '~/utils/common';
import TextBase, {
  TextBaseStyle,
} from '~/BaseComponent/components/base/text-base/TextBase';
import ImageOptimize from '~/BaseComponent/components/base/ImageOptimize';
import {translate} from '~/utils/multilanguage';

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
      <ImageOptimize
        resizeMode={'contain'}
        imageStyle={styles.image}
        source={featured_image}
      />
    );
  };

  render() {
    const {
      data: {name, display_name, description},
      onChange,
    } = this.props;

    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.slideInnerContainer}
        onPress={onChange}>
        <View style={styles.imageContainer}>{this.image()}</View>
        <View style={styles.textContainer}>
          <TextBase style={[TextBaseStyle.primary, TextBaseStyle.bold]}>
            {name.replace('Bài', 'unit').toUpperCase()}
          </TextBase>
          <TextBase style={[TextBaseStyle.h4, TextBaseStyle.bold]}>
            {display_name}
          </TextBase>

          <TextBase style={{color: 'rgba(31,38,49,0.38)', paddingBottom: 24}}>
            {truncateStr(description, description.length > 30 ? 50 : 80)}
          </TextBase>

          <Button
            large
            primary
            rounded
            block
            uppercase
            bold
            icon
            onPress={onChange}>
            {translate('Tiếp tục')}
          </Button>
        </View>
      </TouchableOpacity>
    );
  }
}
