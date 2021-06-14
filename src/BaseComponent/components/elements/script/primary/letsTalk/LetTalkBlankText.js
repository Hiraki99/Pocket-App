import React, {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import PropTypes from 'prop-types';

import {colors} from '~/themes';
import {makeid, matchAllRegex} from '~/utils/utils';
import {Text} from '~/BaseComponent/index';
import {OS} from '~/constants/os';

const LetTalkBlankText = (props) => {
  const mainText = props.text;
  const blankText = props.blankText;
  const updateRecordText = props.updateRecordText;

  const renderText = useCallback(() => {
    const text = mainText;
    let recordText = '';
    const renderChildText = (childText) => {
      recordText += childText;
      return <Text style={stylesMainText.textBold}>{childText}</Text>;
    };

    const renderBlankText = () => {
      const displayText = blankText.length > 0 ? blankText : '    ';
      recordText += displayText;
      const renderBlank = () => {
        return (
          <>
            <Text style={[stylesMainText.textBold, stylesMainText.textInBlank]}>
              {displayText}
            </Text>
            <Text
              style={[
                stylesMainText.textBold,
                stylesMainText.textInBlankAbsolute,
              ]}>
              {displayText}
            </Text>
            <View style={stylesMainText.lineBottom} />
          </>
        );
      };
      if (OS.IsAndroid) {
        return <View>{renderBlank()}</View>;
      } else {
        return <View key={makeid(8)}>{renderBlank()}</View>;
      }
    };

    const regex = /\[.*?]/g;
    const listMatchAll = matchAllRegex(regex, text);
    let cursorIndex = 0;
    let listItems = [];

    listMatchAll.map((it) => {
      const itemLength = it[0].length;
      const indexItem = it.index;

      if (cursorIndex < indexItem) {
        const subString = text.substr(cursorIndex, indexItem - cursorIndex);
        listItems.push(renderChildText(subString));
      }

      listItems.push(renderBlankText());

      cursorIndex = indexItem + itemLength;
    });

    if (cursorIndex <= text.length - 1) {
      const subString = text.substr(
        cursorIndex,
        text.length - 1 - cursorIndex + 1,
      );
      listItems.push(renderChildText(subString));
    }
    updateRecordText(recordText);
    return (
      <View style={stylesMainText.parentView}>
        <View style={stylesMainText.contentView}>
          <Text style={stylesMainText.textWrap}>{listItems}</Text>
        </View>
      </View>
    );
  }, [mainText, blankText, updateRecordText]);

  return renderText();
};

const stylesMainText = StyleSheet.create({
  parentView: {
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  contentView: {
    marginTop: 60,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: colors.white,
    borderRadius: 25,
  },
  textWrap: {
    flexWrap: 'wrap',
  },
  textBold: {
    fontSize: 19,
    fontWeight: '700',
    color: 'rgb(74,79,241)',
  },
  textInBlank: {
    paddingHorizontal: 30,
    marginBottom: 0,
    opacity: 0,
  },
  textInBlankAbsolute: {
    position: 'absolute',
    left: 30,
    bottom: -3,
  },
  lineBottom: {
    backgroundColor: colors.black,
    height: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -5,
  },
});

export default LetTalkBlankText;

LetTalkBlankText.propTypes = {
  text: PropTypes.string.isRequired,
  blankText: PropTypes.string,
};
LetTalkBlankText.defaultProps = {
  text: '',
  blankText: '',
};
