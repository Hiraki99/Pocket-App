import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import split from 'lodash/split';

import {Text} from '~/BaseComponent';
import {colors} from '~/themes';
import {normalizeAnswerFillInBlankNormal} from '~/utils/utils';
import {translate} from '~/utils/multilanguage';

export default class FillInBlankTextItem extends React.Component {
  render() {
    const {
      item,
      onSelected,
      showCorrectAnswer,
      answer,
      index,
      totalQuestion,
      isCardMode,
    } = this.props;

    const parts = split(item.question, /\[.*?]/);
    const corrects = item.question.match(/\[.*?]/g);
    const correctAnswers = corrects.map((o) =>
      normalizeAnswerFillInBlankNormal(o).toLowerCase(),
    );
    console.log('correctAnswers ', correctAnswers);

    return (
      <View
        style={{
          flexDirection: isCardMode ? 'column' : 'row',
          paddingHorizontal: isCardMode ? 24 : 0,
          marginBottom: isCardMode ? 0 : 20,
          paddingRight: 20,
        }}>
        {isCardMode && (
          <Text
            h5
            color={isCardMode ? colors.white : colors.helpText}
            bold
            uppercase
            style={{marginBottom: 5}}>
            {translate('Question %s/%s', {
              s1: `${index + 1}`,
              s2: `${totalQuestion}`,
            })}
          </Text>
        )}

        {!isCardMode && (
          <Text
            h5
            color={isCardMode ? colors.white : colors.helpText}
            style={{marginRight: 5}}>
            {index < 9 ? '0' + (index + 1) : index + 1}.
          </Text>
        )}

        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}>
          {parts.map((item, k) => {
            return (
              <React.Fragment key={`part_${k}`}>
                {split(item, ' ').map((o, l) => {
                  return (
                    <Text
                      key={`normal_${k}_${l}`}
                      h5
                      color={isCardMode ? colors.white : colors.helpText}
                      center>
                      {o}{' '}
                    </Text>
                  );
                })}

                {k <= parts.length - 1 && answer[k] && !showCorrectAnswer && (
                  <TouchableOpacity
                    key={`answer_${k}`}
                    activeOpacity={0.75}
                    onPress={() => onSelected(k)}>
                    <Text
                      h5
                      bold
                      warning={isCardMode}
                      primary={!isCardMode}
                      center>
                      {answer[k]}
                    </Text>
                  </TouchableOpacity>
                )}

                {k < parts.length - 1 && !answer[k] && !showCorrectAnswer && (
                  <TouchableOpacity
                    key={`blank_${k}`}
                    activeOpacity={0.75}
                    onPress={() => onSelected(k)}
                    style={{
                      backgroundColor: isCardMode
                        ? 'transparent'
                        : 'rgba(89, 95, 255, 0.1)',
                      borderBottomColor: isCardMode
                        ? colors.white
                        : colors.helpText,
                      borderBottomWidth: 1,
                      width: 60,
                    }}
                  />
                )}

                {k < parts.length - 1 && showCorrectAnswer && (
                  <React.Fragment key={`result_${k}`}>
                    {answer[k] &&
                      !correctAnswers[k]
                        .split('/')
                        .includes(answer[k].toLowerCase()) && (
                        <Text
                          key={`warning_${k}`}
                          h5
                          bold
                          warning={isCardMode}
                          wrongChoice={!isCardMode}
                          lineThrough
                          center>
                          {answer[k]}{' '}
                        </Text>
                      )}
                    <Text
                      key={`correct_${k}`}
                      h5
                      bold
                      color={isCardMode ? colors.white : colors.successChoice}
                      center>
                      {correctAnswers[k]}
                    </Text>
                  </React.Fragment>
                )}
              </React.Fragment>
            );
          })}
        </View>
      </View>
    );
  }
}

FillInBlankTextItem.propTypes = {
  index: PropTypes.number,
  item: PropTypes.object.isRequired,
  onSelected: PropTypes.func,
  answer: PropTypes.array,
  showCorrectAnswer: PropTypes.bool,
  totalQuestion: PropTypes.number,
  isCardMode: PropTypes.bool,
};

FillInBlankTextItem.defaultProps = {
  index: 0,
  onSelected: () => {},
  showCorrectAnswer: false,
  answer: [],
  totalQuestion: 1,
  isCardMode: true,
};
