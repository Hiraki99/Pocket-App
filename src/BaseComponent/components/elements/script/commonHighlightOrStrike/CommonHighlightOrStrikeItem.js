import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {TouchableOpacity, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';

import {RowContainer, Text} from '~/BaseComponent';
import {HighLightText} from '~/BaseComponent/components/elements/script/HighLightText';
import {ARRAY_DISABLE_CLICK_CHARACTER} from '~/constants/threshold';
import {colors} from '~/themes';
import {playAudio} from '~/utils/utils';

const CommonHighlightOrStrikeItem = (props) => {
  const [itemChoose, setItemChoose] = useState({});

  useEffect(() => {
    setItemChoose({});
  }, [props.id]);

  const checker = (o) => {
    let answerAgg = true;
    let newItemChoose;
    if (itemChoose[o.id]) {
      delete itemChoose[o.id];
      setItemChoose({...itemChoose});
      if (
        Object.keys(itemChoose).length === 0 &&
        itemChoose.constructor === Object
      ) {
        props.decreaseCountAnswer();
      }
      newItemChoose = itemChoose;
    } else {
      newItemChoose = {...itemChoose, [o.id]: o};
      setItemChoose(newItemChoose);
      if (
        Object.keys(itemChoose).length === 0 &&
        itemChoose.constructor === Object
      ) {
        props.increaseCountAnswer();
      }
    }
    if (Object.keys(newItemChoose).length === 0) {
      answerAgg = false;
    } else {
      for (let key in newItemChoose) {
        answerAgg = newItemChoose[key].isAnswer && answerAgg;
      }
      answerAgg =
        Object.keys(newItemChoose).length === props.content.numWordSuccess &&
        answerAgg;
    }
    playAudio('selected');
    props.updateArrAnswer({[props.content.key]: answerAgg});
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
          const selected = itemChoose[o.id]
            ? itemChoose[o.id].id === o.id
            : false;
          const strikethroughtStyle = props.question_type === 'strikethrought';

          if (o.isExample) {
            return (
              <TouchableOpacity
                activeOpacity={0.8}
                disable={
                  o.isExample ||
                  props.showAnswer ||
                  ARRAY_DISABLE_CLICK_CHARACTER.includes(o.word)
                }
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
                disabled={
                  o.isExample ||
                  props.showAnswer ||
                  ARRAY_DISABLE_CLICK_CHARACTER.includes(o.word)
                }
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
            <TouchableOpacity
              activeOpacity={0.8}
              disabled={
                o.isExample ||
                props.showAnswer ||
                ARRAY_DISABLE_CLICK_CHARACTER.includes(o.word)
              }
              key={`${props.id}_${o.id}_${o.isAnswer}_${props.showAnswer}`}
              onPress={() => {
                checker(o);
              }}>
              <HighLightText>{o.word}</HighLightText>
              <Text
                style={
                  selected
                    ? strikethroughtStyle
                      ? styles.dotHorizontal
                      : {}
                    : {}
                }
                h5
                bold={selected}
                color={selected ? colors.primary : colors.helpText}
                paddingHorizontal={2}>
                {o.word}
              </Text>
              <BottomView selected={selected} />
            </TouchableOpacity>
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
