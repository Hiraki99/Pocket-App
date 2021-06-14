import React, {useMemo, useCallback} from 'react';
import {View, StyleSheet, Text as TextRN} from 'react-native';
import PropTypes from 'prop-types';

import {Text} from '~/BaseComponent';
import {matchAllRegex} from '~/utils/utils';
import {colors} from '~/themes';

const StressWord = (props) => {
  const {word, ipa, showIPA, resultStressWord} = props;

  const textSplits = useMemo(() => {
    const mainText = word;
    const regex = /<.*?>/g;
    const listMatchAll = matchAllRegex(regex, mainText);
    let cursorIndex = 0;
    let listItems = [];

    listMatchAll.map((it) => {
      const itemLength = it[0].length;
      const indexItem = it.index;

      const stringValue = it[0].replace('<', '').replace('>', '');

      if (cursorIndex < indexItem) {
        const subString = mainText.substr(cursorIndex, indexItem - cursorIndex);
        listItems.push({value: subString, isFocus: false});
      }

      listItems.push({value: stringValue, isFocus: true});

      cursorIndex = indexItem + itemLength;
    });

    if (cursorIndex <= mainText.length - 1) {
      const subString = mainText.substr(
        cursorIndex,
        mainText.length - 1 - cursorIndex + 1,
      );
      listItems.push({value: subString, isFocus: false});
    }
    return listItems;
  }, [word]);

  const renderMainText = useCallback(() => {
    const showCorrect = resultStressWord.length > 0;
    let isCorrect = true;
    if (showCorrect) {
      resultStressWord.map((it) => {
        if (!it.isCorrect) {
          isCorrect = false;
        }
      });
    }
    return (
      <View style={styles.bottomWrapper}>
        <TextRN style={styles.mainTextWrapper}>
          {textSplits.map((it, idx) => {
            const textColor = showCorrect
              ? isCorrect
                ? colors.good
                : colors.bad
              : colors.primary;

            if (it.isFocus) {
              return (
                <Text h2 color={textColor} bold key={idx}>
                  {it.value}
                </Text>
              );
            }
            return (
              <Text h4 bold key={idx}>
                {it.value}
              </Text>
            );
          })}
        </TextRN>
        {showIPA && <Text style={styles.ipaText}>{ipa}</Text>}
      </View>
    );
  }, [textSplits, ipa, showIPA, resultStressWord]);

  return renderMainText();
};

const styles = StyleSheet.create({
  bottomWrapper: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  mainTextWrapper: {
    flexWrap: 'wrap',
    textAlign: 'center',
    paddingTop: 10,
  },
  ipaText: {
    fontSize: 17,
    color: 'rgb(182,184,188)',
  },
});

StressWord.propTypes = {
  word: PropTypes.string,
  ipa: PropTypes.string,
  showIPA: PropTypes.bool,
  resultStressWord: PropTypes.array,
};

StressWord.defaultProps = {
  word: '',
  ipa: '',
  showIPA: true,
  resultStressWord: [],
};

export default StressWord;
