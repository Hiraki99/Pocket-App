import React from 'react';
import PropTypes from 'prop-types';
import {
  ViewPropTypes,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {RowContainer} from '~/BaseComponent/components/base/CommonContainer';
import {colors} from '~/themes';

const Input = (props) => {
  const [blur, setOnBlur] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(props.secureTextEntry);

  return (
    <RowContainer style={props.containerStyle}>
      {props.accountIcon && (
        <MaterialCommunityIcons
          color={props.colorIcon}
          name={'account'}
          size={24}
        />
      )}
      {props.emailIcon && (
        <MaterialCommunityIcons
          color={props.colorIcon}
          name={'email'}
          size={24}
        />
      )}
      {props.passwordIcon && (
        <Ionicons color={props.colorIcon} name={'key-sharp'} size={20} />
      )}
      <TextInput
        editable={props.enableEdit}
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
        secureTextEntry={showPassword}
        style={[styles.input, props.inputStyle]}
      />
      {!!props.value && !blur && !props.secureTextEntry && props.enableEdit && (
        <TouchableWithoutFeedback onPress={() => props.onChangeText('')}>
          <Ionicons
            name={'close'}
            size={24}
            color={colors.placeHolder}
            style={styles.icon}
          />
        </TouchableWithoutFeedback>
      )}
      {props.secureTextEntry && !!props.value && (
        <TouchableWithoutFeedback
          onPress={() => {
            setShowPassword((old) => {
              return !old;
            });
          }}>
          <Ionicons
            name={!showPassword ? 'ios-eye' : 'ios-eye-off'}
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
  inputStyle: ViewPropTypes.style,
  containerStyle: ViewPropTypes.style,
  secureTextEntry: PropTypes.bool,
  enableEdit: PropTypes.bool,
  colorIcon: PropTypes.string,
  accountIcon: PropTypes.bool,
  passwordIcon: PropTypes.bool,
  emailIcon: PropTypes.bool,
};
Input.defaultProps = {
  placeholder: '',
  value: '',
  onChangeText: () => {},
  enableEdit: true,
  secureTextEntry: false,
  accountIcon: false,
  passwordIcon: false,
  emailIcon: false,
  colorIcon: colors.black,
  containerStyle: {},
  inputStyle: {
    shadowColor: 'rgb(60,128,209)',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.05,
    shadowRadius: 3,
    borderWidth: 0,
    width: 'auto',
  },
};

const styles = StyleSheet.create({
  input: {
    fontSize: 17,
    lineHeight: 22,
    paddingVertical: 17,
    paddingHorizontal: 16,
    flex: 1,
    fontFamily: 'CircularStd-Book',
  },
  icon: {
    paddingHorizontal: 8,
  },
});
export default Input;
