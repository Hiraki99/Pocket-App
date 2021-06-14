import React, {useMemo, useCallback} from 'react';
import {StyleSheet, View, Image} from 'react-native';
import PropTypes from 'prop-types';

import {Text} from '~/BaseComponent';
import {images} from '~/themes';

const LinkingSoundText = (props) => {
  const {text} = props;

  const listWords = useMemo(() => {
    const list = text.split('_') || [];
    return list;
  }, [text]);

  const renderLinkingSymbol = useCallback((showSymbol) => {
    if (showSymbol) {
      return (
        <View>
          <Text>{'  '}</Text>
          <Image
            style={styles.linkingSymbol}
            source={images.intonation_falling_rising}
            resizeMode={'contain'}
          />
        </View>
      );
    }
    return null;
  }, []);

  const renderContent = useCallback(() => {
    let firstWord = true;
    return (
      <View style={styles.mainTextWrapper}>
        {listWords.map((it, idx) => {
          const hasLinking = firstWord ? false : true;
          firstWord = false;
          return (
            <View style={styles.mainTextWrapper} key={idx}>
              {renderLinkingSymbol(hasLinking)}
              <Text style={styles.textNormalStyle} h5>
                {it}
              </Text>
            </View>
          );
        })}
      </View>
    );
  }, []);

  return renderContent();
};

const styles = StyleSheet.create({
  mainTextWrapper: {
    flexDirection: 'row',
  },
  textNormalStyle: {
    fontSize: 19,
  },
  linkingSymbol: {
    position: 'absolute',
    bottom: -5,
    left: -3,
    height: 10,
    width: 15,
  },
});

LinkingSoundText.propTypes = {
  text: PropTypes.string,
};

LinkingSoundText.defaultProps = {
  text: '',
};

export default LinkingSoundText;
