import React from 'react';
import {StyleSheet, TouchableWithoutFeedback} from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';

import {NoFlexContainer, Text} from '~/BaseComponent';
import {colors} from '~/themes';
import {OS} from '~/constants/os';

export const QuestionImageExam = (props) => {
  const isSelected = props.idSelected.includes(props.item.key);
  const colorSelected = isSelected ? colors.primary : '#909396';
  const colorSelectedFail = isSelected ? colors.milanoRed : '#909396';
  const colorShow = props.showResult
    ? props.item.isAnswer
      ? colors.successChoice
      : colorSelectedFail
    : colorSelected;

  return (
    <TouchableWithoutFeedback
      activeOpacity={0.7}
      onPress={() => {
        props.action(props.item, props.question);
      }}
      disabled={props.showResult}>
      <NoFlexContainer
        justifyContent={'center'}
        alignItems={'center'}
        style={[
          styles.container,
          {
            borderColor: colorShow,
            borderWidth: isSelected || props.showResult ? 3 : 1,
          },
        ]}>
        <FastImage
          source={{uri: props.item.url}}
          resizeMode={'contain'}
          style={styles.image}
        />
        <Text h5 color={colors.helpText} bold style={{paddingTop: 8}}>
          {String.fromCharCode(65 + props.index)}
        </Text>
      </NoFlexContainer>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    width: (OS.WIDTH - 90) / 2,
    height: 120,
    borderRadius: 8,
    borderWidth: 1,
    marginLeft: 16,
  },
  image: {
    marginTop: 8,
    width: 80,
    height: 60,
  },
});
QuestionImageExam.propTypes = {
  item: PropTypes.object,
  index: PropTypes.number,
  question: PropTypes.object,
  action: PropTypes.func,
  idSelected: PropTypes.array,
  showResult: PropTypes.bool,
};
QuestionImageExam.defaultProps = {
  action: () => {},
  item: {},
  index: 0,
  question: {},
  idSelected: [],
  showResult: false,
};
