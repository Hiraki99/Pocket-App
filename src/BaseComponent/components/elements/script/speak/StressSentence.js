import React, {useMemo, useCallback, useRef} from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Text as TextRN,
} from 'react-native';
import PropTypes from 'prop-types';

import {Text} from '~/BaseComponent';
import {matchAllRegex} from '~/utils/utils';
import {colors} from '~/themes';

const StressSentence = (props) => {
  const listWords = useRef(null);
  const {sentence, onPress, resultStressSentence} = props;

  const sentenceSplits = useMemo(() => {
    const regex = /<s>.*?<\/s>/g;
    const listMatchAll = matchAllRegex(regex, sentence);
    let cursorIndex = 0;
    let listItems = [];
    let displaySentence = '';

    listMatchAll.map((it) => {
      const itemLength = it[0].length;
      const indexItem = it.index;

      const stringValue = it[0].replace('<s>', '').replace('</s>', '');

      if (cursorIndex < indexItem) {
        const subString = sentence.substr(cursorIndex, indexItem - cursorIndex);
        listItems.push({value: subString, isFocus: false});
        displaySentence += subString;
      }

      listItems.push({value: stringValue, isFocus: true});
      displaySentence += stringValue;

      cursorIndex = indexItem + itemLength;
    });

    if (cursorIndex <= sentence.length - 1) {
      const subString = sentence.substr(
        cursorIndex,
        sentence.length - 1 - cursorIndex + 1,
      );
      listItems.push({value: subString, isFocus: false});
      displaySentence += subString;
    }
    listWords.current = displaySentence.split(' ');
    return listItems;
  }, [sentence]);

  const renderResultStressSentence = useCallback(() => {
    if (resultStressSentence && resultStressSentence.length > 0) {
      let firstWord = true;
      return (
        <TouchableWithoutFeedback onPress={onPress}>
          <View style={styles.bottomWrapper}>
            <TextRN style={styles.mainTextWrapper}>
              {resultStressSentence.map((it, idx) => {
                const itWord = it.word;
                const word = firstWord ? itWord : ' ' + itWord;
                firstWord = false;
                if (it.isStress) {
                  return (
                    <Text
                      style={styles.textStressStyle}
                      color={it.isCorrect ? colors.good : colors.bad}
                      key={idx}>
                      {word}
                    </Text>
                  );
                }
                return (
                  <Text style={styles.textNormalStyle} h5 key={idx}>
                    {word}
                  </Text>
                );
              })}
            </TextRN>
          </View>
        </TouchableWithoutFeedback>
      );
    }
  }, [resultStressSentence, onPress]);

  const renderSentence = useCallback(() => {
    return (
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={styles.bottomWrapper}>
          <TextRN style={styles.mainTextWrapper}>
            {sentenceSplits.map((it, idx) => {
              if (it.isFocus) {
                return (
                  <Text style={styles.textStressStyle} primary key={idx}>
                    {it.value}
                  </Text>
                );
              }
              return (
                <Text style={styles.textNormalStyle} h5 key={idx}>
                  {it.value}
                </Text>
              );
            })}
          </TextRN>
        </View>
      </TouchableWithoutFeedback>
    );
  }, [sentenceSplits, onPress]);

  const renderContent = useCallback(() => {
    if (resultStressSentence && resultStressSentence.length > 0) {
      return renderResultStressSentence();
    } else {
      return renderSentence();
    }
  }, [resultStressSentence, renderSentence, renderResultStressSentence]);

  return renderContent();
};

const styles = StyleSheet.create({
  bottomWrapper: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 16,
  },
  mainTextWrapper: {
    flexWrap: 'wrap',
    textAlign: 'center',
    paddingTop: 5,
  },
  textStressStyle: {
    fontSize: 19,
    fontWeight: 'bold',
  },
  textNormalStyle: {
    fontSize: 19,
  },
});

StressSentence.propTypes = {
  sentence: PropTypes.string,
  onPress: PropTypes.func,
  resultStressSentence: PropTypes.array,
};

StressSentence.defaultProps = {
  sentence: '',
  onPress: () => {},
  resultStressSentence: null,
};

export default StressSentence;
