import React from 'react';
import PropTypes from 'prop-types';
import {
  ViewPropTypes,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {RowContainer} from '~/BaseComponent/components/base/CommonContainer';

import {colors} from '~/themes';
import {OS} from '~/constants/os';

const Input = (props) => {
  const [blur, setOnBlur] = React.useState(false);

  return (
    <RowContainer>
      <TextInput
        placeholder={props.placeholder}
        autoCapitalize="none"
        value={props.value}
        borderRadius={0}
        onChangeText={(text) => {
          props.onChangeText(text);
          setOnBlur(false);
        }}
        placeholderTextColor={colors.placeHolder}
        allowFontScaling={false}
        onBlur={() => setOnBlur(true)}
        secureTextEntry={props.secureTextEntry}
        style={[styles.input, OS.IsAndroid ? {} : props.style]}
      />
      {!!props.value && !blur && (
        <TouchableWithoutFeedback onPress={() => props.onChangeText('')}>
          <Ionicons
            name={'close'}
            size={24}
            color={colors.placeHolder}
            style={styles.icon}
          />
        </TouchableWithoutFeedback>
      )}
    </RowContainer>
  );
};
Input.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChangeText: PropTypes.func,
  style: ViewPropTypes.style,
  secureTextEntry: PropTypes.bool,
};
Input.defaultProps = {
  placeholder: '',
  value: '',
  onChangeText: () => {},
  secureTextEntry: false,
  style: {
    shadowColor: 'rgb(60,128,209)',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 0,
    width: 'auto',
  },
};

const styles = StyleSheet.create({
  input: {
    fontSize: 17,
    lineHeight: 22,
    paddingVertical: 17,
    paddingHorizontal: 24,
    flex: 1,
    fontFamily: 'CircularStd-Book',
  },
  icon: {
    paddingHorizontal: 8,
  },
});
export default Input;
