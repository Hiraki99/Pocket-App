import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, ImageBackground, View} from 'react-native';

import {NoFlexContainer, Text} from '~/BaseComponent';
import {OS} from '~/constants/os';
import {colors, images} from '~/themes';

class CommonMatchExpressionWithPicturesTextItem extends React.PureComponent {
  render() {
    const {item, shadow, width, textComponent} = this.props;

    return (
      <NoFlexContainer
        justifyContent={'center'}
        alignItems={'center'}
        backgroundColor={'#4A50F1'}
        style={[styles.question, shadow ? styles.shadow : null, {width}]}>
        <View style={[styles.questionImageBg, width]}>
          <ImageBackground
            source={images.question_under}
            style={[styles.questionImage, {width}]}
          />
        </View>
        {textComponent !== null && textComponent}

        {!textComponent && (
          <Text
            fontSize={item.question.length > 20 ? 19 : 24}
            bold={item.question.length <= 20}
            color={colors.white}
            center
            paddingHorizontal={16}>
            {item.question}
          </Text>
        )}
      </NoFlexContainer>
    );
  }
}

CommonMatchExpressionWithPicturesTextItem.propTypes = {
  item: PropTypes.object,
  onNext: PropTypes.func,
  active: PropTypes.bool,
  shadow: PropTypes.bool,
  width: PropTypes.number,
  textComponent: PropTypes.any,
};

CommonMatchExpressionWithPicturesTextItem.defaultProps = {
  item: {},
  onNext: () => {},
  active: false,
  shadow: false,
  width: OS.WIDTH - 60,
  textComponent: null,
};

const styles = StyleSheet.create({
  question: {
    height: 200,
    borderRadius: 16,
  },
  shadow: {
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 2,
  },
  questionImageBg: {
    height: 200,
    position: 'absolute',
    borderRadius: 16,
    overflow: 'hidden',
  },
  questionImage: {
    height: 200,
  },
  answerImgContainer: {
    overflow: 'hidden',
    top: 0,
    height: (OS.HEIGHT * 60) / 100,
    width: '100%',
    position: 'absolute',
    zIndex: 2,
  },
  responseContainer: {
    position: 'absolute',
    zIndex: 4,
    width: '100%',
    top: 0,
    height: OS.GameImageWater,
    backgroundColor: ' rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeOutContainer: {
    position: 'absolute',
    zIndex: 1001,
    width: '100%',
    top: 0,
    height: '100%',
    backgroundColor: ' rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CommonMatchExpressionWithPicturesTextItem;
