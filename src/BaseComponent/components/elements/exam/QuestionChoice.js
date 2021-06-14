import React from 'react';
import {TouchableWithoutFeedback, View} from 'react-native';
import PropTypes from 'prop-types';

import {RowContainer, Text, Option} from '~/BaseComponent';
import {colors} from '~/themes';
import {OS} from '~/constants/os';
import {matchAllRegex} from '~/utils/utils';

export const QuestionChoice = (props) => {
  const isSelected = props.idSelected.includes(props.item.key);
  const colorSelected = isSelected ? colors.primary : '#232B38';
  const colorSelectedFail = isSelected ? colors.milanoRed : '#232B38';
  const colorShow = props.showResult
    ? props.item.isAnswer
      ? colors.successChoice
      : colorSelectedFail
    : colorSelected;

  const renderText = React.useCallback(() => {
    const pronunciationRegex = /<.*?>/g;
    const listCmpText = [];
    const listMatchAll = matchAllRegex(pronunciationRegex, props.item.text);
    if (listMatchAll.length === 0) {
      return (
        <Text h5 color={colorShow} paddingHorizontal={16}>
          {`${String.fromCharCode(65 + props.index)}. ${props.item.text}`}
        </Text>
      );
    }
    listMatchAll.map((it, index) => {
      if (index === 0 && it.index > 0) {
        listCmpText.push(
          <Text h5 color={colorShow}>
            {it.input.slice(0, it.index).trim()}
          </Text>,
        );
      }
      listCmpText.push(
        <Text h5 color={colorShow} bold>
          {it[0].replace(/[<|>]/g, '').trim()}
        </Text>,
      );
      if (index === listMatchAll.length - 1) {
        listCmpText.push(
          <Text h5 color={colorShow}>
            {it.input.slice(it[0].length + it.index).trim()}
          </Text>,
        );
      } else {
        listCmpText.push(
          <Text h5 color={colorShow}>
            {it.input
              .slice(it.index + it[0].length, listMatchAll[index + 1].index)
              .trim()}
          </Text>,
        );
      }
    });

    return (
      <RowContainer paddingHorizontal={16}>
        <Text h5 color={colorShow}>
          {`${String.fromCharCode(65 + props.index)}. `}
        </Text>
        {listCmpText}
      </RowContainer>
    );
  }, [props.item, props.index, colorShow]);

  return (
    <TouchableWithoutFeedback
      activeOpacity={0.7}
      disabled={props.showResult}
      onPress={() => props.action(props.item, props.question)}>
      <RowContainer
        paddingHorizontal={16}
        alignItems={'flex-start'}
        style={{
          width: OS.WIDTH - 56,
          paddingBottom: 8,
        }}>
        <View marginTop={4}>
          <Option
            selected={isSelected || (props.showResult && props.item.isAnswer)}
            colorOption={colorShow}
          />
        </View>
        {renderText()}
      </RowContainer>
    </TouchableWithoutFeedback>
  );
};
QuestionChoice.propTypes = {
  item: PropTypes.object,
  question: PropTypes.object,
  action: PropTypes.func,
  idSelected: PropTypes.array,
  showResult: PropTypes.bool,
};
QuestionChoice.defaultProps = {
  item: {},
  question: {},
  action: () => {},
  idSelected: [],
  showResult: false,
};
