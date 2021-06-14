import React, {useMemo, useCallback} from 'react';
import {View, StyleSheet, Text as TextRN} from 'react-native';
import PropTypes from 'prop-types';

import LinkingSoundText from '~/BaseComponent/components/elements/script/speak/LinkingSoundText';
import {OS} from '~/constants/os';

const LinkingSoundSentence = (props) => {
  const {sentence} = props;

  const listWords = useMemo(() => {
    const list = sentence.split(' ') || [];
    return list;
  }, [sentence]);

  const renderContent = useCallback(() => {
    let firstWord = true;
    return (
      <View style={styles.bottomWrapper}>
        <TextRN style={styles.mainTextWrapper}>
          {listWords.map((it, idx) => {
            const word = firstWord ? it : ' ' + it;
            firstWord = false;
            return <LinkingSoundText text={word} key={idx} />;
          })}
        </TextRN>
      </View>
    );
  }, []);

  return renderContent();
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
  textNormalStyle: {
    fontSize: 19,
  },
});

LinkingSoundSentence.propTypes = {
  sentence: PropTypes.string,
};

LinkingSoundSentence.defaultProps = {
  sentence: '',
};

export default LinkingSoundSentence;
