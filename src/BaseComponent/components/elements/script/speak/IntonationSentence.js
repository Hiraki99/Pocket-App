import React, {useMemo, useCallback} from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Text as TextRN,
} from 'react-native';
import PropTypes from 'prop-types';

import {matchAllRegex} from '~/utils/utils';
import IntonationWord from '~/BaseComponent/components/elements/script/speak/IntonationWord';
import {OS} from '~/constants/os';

export const IntonationType = {
  NEUTRAL: 0,
  RISING: 1,
  FALLING: 2,
  RISING_FALLING: 3,
  FALLING_RISING: 4,
};

const IntonationSentence = (props) => {
  const {sentence, onPress, resultIntonationSentence} = props;

  const listWords = useMemo(() => {
    let list = [];
    const regex = /(<f>.*?<\/f>)|(<r>.*?<\/r>)|(<fr>.*?<\/fr>)|(<rf>.*?<\/rf>)|(<n>.*?<\/n>)/g;
    const listMatchAll = matchAllRegex(regex, sentence);
    let cursorIndex = 0;

    const splitText = (text, type) => {
      let listTemp = [];
      const components = text.split(' ') || [];
      components.map((it) => {
        if (it.length > 0) {
          listTemp.push({value: it, type});
        }
      });
      return listTemp;
    };

    listMatchAll.map((it) => {
      const itemLength = it[0].length;
      const indexItem = it.index;

      const stringValue = it[0];

      if (cursorIndex < indexItem) {
        const subString = sentence.substr(cursorIndex, indexItem - cursorIndex);
        list.push(...splitText(subString, IntonationType.NEUTRAL));
      }
      if (stringValue.startsWith('<f>')) {
        const value = stringValue.replace('<f>', '').replace('</f>', '');
        list.push({value, type: IntonationType.FALLING});
      } else if (stringValue.startsWith('<r>')) {
        const value = stringValue.replace('<r>', '').replace('</r>', '');
        list.push({value, type: IntonationType.RISING});
      } else if (stringValue.startsWith('<rf>')) {
        const value = stringValue.replace('<rf>', '').replace('</rf>', '');
        list.push({value, type: IntonationType.RISING_FALLING});
      } else if (stringValue.startsWith('<fr>')) {
        const value = stringValue.replace('<fr>', '').replace('</fr>', '');
        list.push({value, type: IntonationType.FALLING_RISING});
      } else if (stringValue.startsWith('<n>')) {
        const value = stringValue.replace('<n>', '').replace('</n>', '');
        list.push({value, type: IntonationType.NEUTRAL});
      } else {
        list.push({value: stringValue, type: IntonationType.NEUTRAL});
      }
      cursorIndex = indexItem + itemLength;
    });

    if (cursorIndex <= sentence.length - 1) {
      const subString = sentence.substr(
        cursorIndex,
        sentence.length - 1 - cursorIndex + 1,
      );
      list.push(...splitText(subString, IntonationType.NEUTRAL));
    }
    return list;
  }, [sentence]);

  const renderSentence = useCallback(() => {
    const mapUsed = new Map();
    const getResult = (wordValue) => {
      let itFound = null;
      if (resultIntonationSentence && resultIntonationSentence.length > 0) {
        resultIntonationSentence.map((it, idx) => {
          if (!mapUsed.has(idx)) {
            if (it.word.toLowerCase() === wordValue.toLowerCase()) {
              mapUsed.set(idx, '');
              itFound = it;
              return;
            }
          }
        });
      }
      return itFound;
    };
    return (
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={styles.bottomWrapper}>
          <TextRN style={styles.mainTextWrapper}>
            {listWords.map((it, idx) => {
              const resultIt = getResult(it.value);
              return (
                <IntonationWord
                  word={it}
                  hasSpace={idx !== 0}
                  key={idx}
                  result={resultIt}
                />
              );
            })}
          </TextRN>
        </View>
      </TouchableWithoutFeedback>
    );
  }, [listWords, onPress, resultIntonationSentence]);

  return renderSentence();
};

const styles = StyleSheet.create({
  bottomWrapper: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingBottom: 16,
    paddingTop: OS.IsAndroid ? 16 : 20,
  },
  mainTextWrapper: {
    flexWrap: 'wrap',
    textAlign: 'center',
  },
  textStressStyle: {
    fontSize: 19,
    fontWeight: 'bold',
  },
  textNormalStyle: {
    fontSize: 19,
  },
});

IntonationSentence.propTypes = {
  sentence: PropTypes.string,
  onPress: PropTypes.func,
  resultIntonationSentence: PropTypes.array,
};

IntonationSentence.defaultProps = {
  sentence: '',
  onPress: () => {},
  resultIntonationSentence: null,
};

export default IntonationSentence;
