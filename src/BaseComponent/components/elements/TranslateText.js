import React, {useState, useCallback} from 'react';
import PropTypes from 'prop-types';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';

import {images} from '~/themes';
import {RowContainer} from '~/BaseComponent/index';
import {LANGUAGE} from '~/constants/lang';

const TranslateText = (props) => {
  const [lang, setLang] = useState(LANGUAGE.EN);
  const {RenderComponent} = props;
  const changeText = useCallback(() => {
    setLang((oldLang) => (oldLang === LANGUAGE.VI ? LANGUAGE.EN : LANGUAGE.VI));
  }, []);

  return (
    <RowContainer {...props}>
      <RenderComponent
        content={lang === LANGUAGE.EN ? props.textEN : props.textVI}
      />
      <TouchableOpacity activeOpacity={0.7} onPress={changeText}>
        <Image source={images.translate} style={props.iconStyle} />
      </TouchableOpacity>
    </RowContainer>
  );
};
TranslateText.propTypes = {
  textVI: PropTypes.string,
  textEN: PropTypes.string,
  RenderComponent: PropTypes.element,
  iconStyle: Image.propTypes.style,
};
TranslateText.defaultProps = {
  text: 'I have a pencil',
  translateText: 'Tôi có một cây bút chì',
  iconStyle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginTop: 1,
  },
};

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  translateWrap: {
    alignItems: 'center',
  },
  translate: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginTop: 1,
  },
});
export default TranslateText;
