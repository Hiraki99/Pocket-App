import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import split from 'lodash/split';

import {Text} from '~/BaseComponent';
import {colors} from '~/themes';

export default class FillInBlankItem extends React.PureComponent {
  render() {
    const {
      item,
      index,
      showIndex,
      onSelected,
      answers,
      showCorrectAnswer,
    } = this.props;

    const parts = split(item.question, '[]');
    const correctAnswer = item.answers.find((o) => o.isAnswer);

    const correct = correctAnswer ? correctAnswer.text : '';

    return (
      <View style={{flexDirection: 'row', marginBottom: 22}}>
        {showIndex && (
          <Text h5>
            {index < 9 ? '0' + (index + 1) : index + 1}
            {'. '}
          </Text>
        )}
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            paddingRight: 24,
          }}>
          {parts.map((item, k) => {
            return (
              <>
                {split(item, ' ').map((o) => {
                  return <Text h5>{o} </Text>;
                })}

                {k <= parts.length - 1 &&
                  answers &&
                  answers['blank_' + k] &&
                  !showCorrectAnswer && (
                    <TouchableOpacity
                      activeOpacity={0.75}
                      onPress={() => onSelected(k)}>
                      <Text h5 bold primary>
                        {answers['blank_' + k].text}
                      </Text>
                    </TouchableOpacity>
                  )}

                {k < parts.length - 1 &&
                  (!answers || !answers['blank_' + k]) &&
                  !showCorrectAnswer && (
                    <TouchableOpacity
                      activeOpacity={0.75}
                      onPress={() => onSelected(k)}
                      style={{
                        backgroundColor: 'rgba(89, 95, 255, 0.1)',
                        borderBottomColor: colors.helpText,
                        borderBottomWidth: 1,
                        width: 60,
                      }}
                    />
                  )}

                {k < parts.length - 1 && showCorrectAnswer && (
                  <>
                    {answers &&
                      answers['blank_' + k] &&
                      answers['blank_' + k].text !== correct && (
                        <Text h5 bold danger lineThrough>
                          {answers['blank_' + k].text}{' '}
                        </Text>
                      )}
                    <Text h5 bold success>
                      {correct}
                    </Text>
                  </>
                )}
              </>
            );
          })}
        </View>
      </View>
    );
  }
}

FillInBlankItem.propTypes = {
  item: PropTypes.object.isRequired,
  index: PropTypes.number,
  showIndex: PropTypes.bool,
  onSelected: PropTypes.func,
  answers: PropTypes.object,
  showCorrectAnswer: PropTypes.bool,
};

FillInBlankItem.defaultProps = {
  index: 0,
  showIndex: true,
  onSelected: () => {},
  answers: null,
  showCorrectAnswer: false,
};
