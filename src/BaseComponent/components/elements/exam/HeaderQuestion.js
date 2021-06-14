import React from 'react';
import PropTypes from 'prop-types';

import {
  NoFlexContainer,
  RowContainer,
  SeparatorVertical,
  Text,
} from '~/BaseComponent';
import {colors} from '~/themes';
import {makeid, matchAllRegex} from '~/utils/utils';
import {translate} from '~/utils/multilanguage';
const characterEnds = ['.', ',', "'", '!', '?'];

export const HeaderQuestion = (props) => {
  const renderText = React.useCallback(() => {
    const pronunciationRegex = /<.*?>/g;
    const listCmpText = [];
    const listMatchAll = matchAllRegex(pronunciationRegex, props.desc);

    if (listMatchAll.length === 0) {
      return (
        <Text color={colors.helpText} h5>
          {props.desc}
        </Text>
      );
    }

    listMatchAll.map((it, index) => {
      if (index === 0 && it.index > 0) {
        const startDesc = it.input.slice(0, it.index).trim().split(' ');
        startDesc.forEach((i) => {
          listCmpText.push(
            <Text
              h5
              key={makeid(16)}
              color={colors.helpText}
              style={characterEnds.includes(i) ? {marginLeft: -4} : null}>
              {i}{' '}
            </Text>,
          );
        });
      }
      const primaryText = it[0].replace(/[<|>]/g, '').trim().split(' ');
      primaryText.forEach((i) => {
        listCmpText.push(
          <Text h5 key={makeid(16)} color={colors.primary} bold>
            {i}{' '}
          </Text>,
        );
      });

      if (index === listMatchAll.length - 1) {
        const endDesc = it.input
          .slice(it[0].length + it.index)
          .trim()
          .split(' ');
        endDesc.forEach((i) => {
          listCmpText.push(
            <Text
              h5
              key={makeid(16)}
              color={colors.helpText}
              style={characterEnds.includes(i) ? {marginLeft: -4} : null}>
              {i}{' '}
            </Text>,
          );
        });
      } else {
        const midDesc = it.input
          .slice(it.index + it[0].length, listMatchAll[index + 1].index)
          .trim()
          .split(' ');
        midDesc.forEach((i) => {
          listCmpText.push(
            <Text
              h5
              color={colors.helpText}
              key={makeid(16)}
              style={characterEnds.includes(i) ? {marginLeft: -4} : null}>
              {i}{' '}
            </Text>,
          );
        });
      }
    });
    return listCmpText;
  }, [props.desc]);

  return (
    <RowContainer alignItems={'flex-start'}>
      <RowContainer
        justifyContent={'center'}
        alignItem={'center'}
        style={{
          width: 20,
          height: 20,
          borderRadius: 10,
          backgroundColor: colors.primary,
          marginTop: 4,
        }}>
        <Text fontSize={10} style={{lineHeight: 12}} bold color={colors.white}>
          {props.indexQuestion}
        </Text>
      </RowContainer>
      <NoFlexContainer paddingHorizontal={16}>
        <Text color={colors.helpText} h5 bold>
          {translate('Question %s', {s1: props.indexQuestion})}
        </Text>
        {props.desc ? (
          <RowContainer style={{flexWrap: 'wrap'}} paddingTop={8}>
            {renderText(props.desc)}
          </RowContainer>
        ) : (
          <SeparatorVertical sm />
        )}
      </NoFlexContainer>
    </RowContainer>
  );
};

HeaderQuestion.propTypes = {
  indexQuestion: PropTypes.number,
  desc: PropTypes.string,
};

HeaderQuestion.defaultProps = {
  indexQuestion: 0,
  desc: '',
};
