import React from 'react';
import {useDispatch} from 'react-redux';
import PropTypes from 'prop-types';
import {TextInput, ViewPropTypes, StyleSheet} from 'react-native';

import {RowContainer} from '~/BaseComponent/components/base/CommonContainer';
import {Text} from '~/BaseComponent/index';
import {doneQuestion} from '~/features/activity/ActivityAction';
import {increaseScore} from '~/features/script/ScriptAction';
import {colors} from '~/themes';
import {playAudioAnswer} from '~/utils/utils';

const LookListenAndNumber = (props) => {
  const {data, action, showResult, inputStyle} = props;
  const dispatch = useDispatch();
  const [value, setValue] = React.useState(null);
  const [done, setDone] = React.useState(false);
  const [isChange, setIsChange] = React.useState(false);
  const [bonus, setBonus] = React.useState(false);

  const onChangeText = React.useCallback((text) => {
    setIsChange(true);
    setValue(text);
  }, []);

  const onEndEditing = React.useCallback(() => {
    if (!done) {
      dispatch(doneQuestion());
      setDone(true);
    }
    if (!bonus) {
      if (parseInt(value, 10) === data.answer) {
        setBonus(true);
        dispatch(increaseScore(1, 1, 0));
      }
    }
    if (isChange) {
      playAudioAnswer(parseInt(value, 10) === data.answer);
    }
    setIsChange(false);
  }, [done, dispatch, bonus, value, data.answer, isChange]);

  if (showResult) {
    return (
      <RowContainer style={[props.containerStyle, styles.answerContainer]}>
        {parseInt(value, 10) === data.answer ? (
          <Text
            fontSize={inputStyle.fontSize || 17}
            bold
            color={colors.successChoice}>
            {value}
          </Text>
        ) : (
          <>
            {!!value && (
              <Text
                bold
                lineThrough
                fontSize={inputStyle.fontSize || 17}
                color={colors.danger}
                paddingRight={8}>
                {value}
              </Text>
            )}
            <Text
              bold
              fontSize={inputStyle.fontSize || 17}
              color={colors.successChoice}>
              {data.answer}
            </Text>
          </>
        )}
      </RowContainer>
    );
  }

  return (
    <RowContainer style={props.containerStyle}>
      <TextInput
        value={value}
        maxLength={1}
        onChangeText={onChangeText}
        onFocus={action}
        onEndEditing={onEndEditing}
        keyboardType={'numeric'}
        style={props.inputStyle}
      />
    </RowContainer>
  );
};
LookListenAndNumber.propTypes = {
  data: PropTypes.object,
  showResult: PropTypes.bool,
  containerStyle: ViewPropTypes.style,
  inputStyle: ViewPropTypes.style,
  action: PropTypes.func,
};
LookListenAndNumber.defaultProps = {
  data: {},
  containerStyle: {},
  inputStyle: {},
  showResult: false,
  action: () => {},
};

const styles = StyleSheet.create({
  answerContainer: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderColor: colors.normalText,
    backgroundColor: colors.white,
    borderWidth: 1,
  },
});
export default LookListenAndNumber;
