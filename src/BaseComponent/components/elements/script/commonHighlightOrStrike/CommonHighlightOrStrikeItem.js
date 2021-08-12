import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {TouchableOpacity, StyleSheet, Text as NativeText} from 'react-native';
import PropTypes from 'prop-types';

import {
  RowContainer,
  Text,
  TouchableOpacityPreventDoubleClick,
} from '~/BaseComponent';
import {TextBaseStyle} from '~/BaseComponent/components/base/text-base/TextBase';
import {HighLightText} from '~/BaseComponent/components/elements/script/HighLightText';
import {colors} from '~/themes';
import {playAudio} from '~/utils/utils';

const CommonHighlightOrStrikeItem = (props) => {
  const [itemChoose, setItemChoose] = useState(new Map());

  useEffect(() => {
    setItemChoose(new Map());
  }, [props.id]);

  const checker = (o) => {
    if (o.word === '/') {
      return;
    }
    let answerAgg = false;
    let newItemChoose;
    if (itemChoose.has(o.id)) {
      if (itemChoose.size === 0) {
        props.decreaseCountAnswer();
      }
      itemChoose.delete(o.id);
      setItemChoose(itemChoose);
      newItemChoose = itemChoose;
    } else {
      if (itemChoose.size === 0) {
        props.increaseCountAnswer();
      }
      itemChoose.set(o.id, o);
      newItemChoose = itemChoose;
      setItemChoose(newItemChoose);
    }
    if (newItemChoose.size === 0) {
      answerAgg = false;
    } else {
      answerAgg = true;
      for (let key in newItemChoose) {
        answerAgg = (newItemChoose.get(key) || {}).isAnswer && answerAgg;
      }
      answerAgg =
        newItemChoose.size === props.content.numWordSuccess && answerAgg;
    }
    playAudio('selected');
    props.updateArrAnswer({
      [props.content.key]: {
        answer: answerAgg,
        numWordSuccess: props.content.numWordSuccess,
      },
    });
  };

  return (
    <RowContainer alignItems={'flex-start'}>
      {!props.paragraph && (
        <Text h5 color={colors.helpText}>
          {props.index + 1 > 10 ? props.index + 1 : `0${props.index + 1}`}
          .&nbsp;
        </Text>
      )}

      <RowContainer style={styles.container}>
        {(props.content ? props.content.questions || [] : []).map((o) => {
          const selected = itemChoose.has(o.id)
            ? (itemChoose.get(o.id) || {}).id === o.id
            : false;
          const strikethroughtStyle = props.question_type === 'strikethrought';

          if (o.isExample) {
            return (
              <TouchableOpacity
                activeOpacity={0.8}
                disable={o.isExample || props.showAnswer}
                key={`${props.id}_${o.id}_${o.isAnswer}_${props.showAnswer}`}
                onPress={() => {
                  checker(o);
                }}>
                <Text
                  h5
                  bold
                  color={colors.successChoice}
                  paddingVertical={4}
                  paddingHorizontal={2}>
                  {o.word}
                </Text>
                <BottomView isExample={strikethroughtStyle} />
              </TouchableOpacity>
            );
          }

          if (props.showAnswer) {
            return (
              <TouchableOpacity
                activeOpacity={0.8}
                disabled={o.isExample || props.showAnswer}
                key={`${props.id}_${o.id}_${o.isAnswer}_${props.showAnswer}`}
                onPress={() => {
                  checker(o);
                }}>
                <Text
                  style={
                    strikethroughtStyle &&
                    (selected || (props.showAnswer && o.isAnswer))
                      ? styles.dotHorizontal
                      : {}
                  }
                  h5
                  bold={o.isAnswer || selected}
                  color={
                    selected
                      ? o.isAnswer
                        ? colors.successChoice
                        : colors.heartActive
                      : o.isAnswer
                      ? colors.primary
                      : colors.helpText
                  }
                  paddingHorizontal={2}>
                  {o.word}
                </Text>
                <BottomView />
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacityPreventDoubleClick
              disabled={o.isExample || props.showAnswer}
              key={`${props.id}_${o.id}_${o.isAnswer}_${props.showAnswer}`}
              onPress={() => {
                checker(o);
              }}>
              <HighLightText>{o.word}</HighLightText>
              <NativeText
                style={[
                  selected
                    ? strikethroughtStyle
                      ? styles.dotHorizontal
                      : {}
                    : {},
                  TextBaseStyle.h5,
                  TextBaseStyle.normal,
                  selected
                    ? [TextBaseStyle.bold, {color: colors.primary}]
                    : {color: colors.helpText},
                  {paddingHorizontal: 2},
                ]}>
                {o.word}
              </NativeText>
              <BottomView selected={selected} />
            </TouchableOpacityPreventDoubleClick>
          );
        })}
      </RowContainer>
    </RowContainer>
  );
};

const styles = StyleSheet.create({
  dotHorizontal: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'dashed',
  },
  container: {flexWrap: 'wrap', flex: 1},
});

CommonHighlightOrStrikeItem.propTypes = {
  content: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  question_type: PropTypes.string.isRequired,
  paragraph: PropTypes.bool.isRequired,
  showAnswer: PropTypes.bool.isRequired,
  increaseCountAnswer: PropTypes.func.isRequired,
  decreaseCountAnswer: PropTypes.func.isRequired,
  updateArrAnswer: PropTypes.func.isRequired,
};

const BottomView = styled.View`
  borderBottomWidth: ${(props) => {
    if (props.showAnswer || props.selected || props.isExample) {
      return 2;
    }
    return 0;
  }}
  paddingBottom: ${(props) => {
    if (props.showAnswer || props.selected || props.isExample) {
      return 2;
    }
    return 4;
  }}
  borderBottomColor: ${(props) => {
    if (props.showAnswer || props.isExample) {
      return colors.success;
    }
    if (props.selected) {
      return colors.primary;
    }
    return 0;
  }}
`;
export default CommonHighlightOrStrikeItem;
