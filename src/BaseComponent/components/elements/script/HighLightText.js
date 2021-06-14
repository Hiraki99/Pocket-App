import React from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';

import {Text} from '~/BaseComponent/index';
import {makeid, matchAllRegex} from '~/utils/utils';
import {colors} from '~/themes';

export const HighLightText = (props) => {
  const {content} = props;

  const contentAnalysis = React.useMemo(() => {
    if (!content) {
      return [];
    }
    const pronunciationRegex = /<.*?>/g;
    const listCmpText = [];
    const listMatchAll = matchAllRegex(pronunciationRegex, content);
    if (listMatchAll.length === 0) {
      return [
        <Text color={colors.helpText} accented key={makeid(16)} {...props}>
          {content}
        </Text>,
      ];
    }
    listMatchAll.map((it, index) => {
      if (index === 0 && it.index > 0) {
        const startDesc = it.input.slice(0, it.index);
        listCmpText.push(
          <Text
            // h5
            accented
            key={makeid(16)}
            color={colors.helpText}
            // paddingRight={4}
            {...props}>
            {startDesc}
          </Text>,
        );
      }
      const primaryText = it[0].replace(/[<|>]/g, '');
      listCmpText.push(
        <Text
          fontSize={props.fontSize}
          accented
          key={makeid(16)}
          bold
          color={props.colorHighLight}>
          {primaryText}
        </Text>,
      );

      if (index === listMatchAll.length - 1) {
        const endDesc = it.input.slice(it[0].length + it.index);
        listCmpText.push(
          <Text
            // h5
            key={makeid(16)}
            color={colors.helpText}
            accented
            // paddingRight={4}
            {...props}>
            {endDesc}
          </Text>,
        );
      } else {
        const midDesc = it.input.slice(
          it.index + it[0].length,
          listMatchAll[index + 1].index,
        );
        listCmpText.push(
          <Text
            // h5
            color={colors.helpText}
            key={makeid(16)}
            // paddingRight={4}
            accented
            {...props}>
            {midDesc}
          </Text>,
        );
      }
    });
    return listCmpText;
  }, [content, props]);

  if (!content) {
    return <View />;
  }
  return contentAnalysis;
};
HighLightText.propTypes = {
  content: PropTypes.string,
  fontSize: PropTypes.number,
  bold: PropTypes.bool,
  primary: PropTypes.bool,
  center: PropTypes.bool,
  colorHighLight: PropTypes.string,
};
HighLightText.defaultProps = {
  content: null,
  fontSize: 17,
  bold: false,
  primary: false,
  center: false,
  colorHighLight: colors.primary,
};
