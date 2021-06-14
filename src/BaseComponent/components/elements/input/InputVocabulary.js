import React, {useRef, useImperativeHandle, forwardRef} from 'react';
import {TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';

import {RowContainer} from '~/BaseComponent';
import {colors} from '~/themes';
import {OS} from '~/constants/os';

const InputVocabulary = (props, ref) => {
  const inputRef = useRef(null);
  useImperativeHandle(ref, () => ({
    focus: () => {
      if (inputRef && inputRef.current) {
        inputRef.current.focus();
      }
    },
    blur: () => {
      if (inputRef && inputRef.current) {
        inputRef.current.blur();
      }
    },
  }));

  return (
    <RowContainer
      marginHorizontal={24}
      backgroundColor={props.backgroundColor}
      justifyContent={'space-between'}
      style={styles.container}>
      <TextInput
        ref={inputRef}
        placeholder={props.placeHolderText}
        style={props.white ? styles.textInputWhite : styles.textInput}
        onChangeText={(text) => props.onChangeValue(text)}
        value={props.value}
        onFocus={props.onFocus}
      />
      {props.primary && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={props.onSearch}
          style={styles.primaryIcon}>
          <Ionicons color={colors.white} size={24} name={'ios-search'} />
        </TouchableOpacity>
      )}
      {props.default && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={props.onSearch}
          style={styles.defaultIcon}>
          <Ionicons
            color={'rgba(31, 38, 49, 0.38)'}
            size={20}
            name={'ios-search'}
          />
        </TouchableOpacity>
      )}
    </RowContainer>
  );
};

const InputForward = forwardRef(InputVocabulary);

InputForward.propTypes = {
  primary: PropTypes.bool,
  white: PropTypes.bool,
  default: PropTypes.bool,
  action: PropTypes.func,
  value: PropTypes.string,
  onChangeValue: PropTypes.func,
  onFocus: PropTypes.func,
  onSearch: PropTypes.func,
  backgroundColor: PropTypes.string,
  placeHolderText: PropTypes.string,
};

InputForward.defaultProps = {
  primary: false,
  white: false,
  default: false,
  action: () => {},
  value: '',
  onChangeValue: () => {},
  onFocus: () => {},
  onSearch: () => {},
  backgroundColor: 'rgba(243, 245, 249, 0.5)',
  placeHolderText: 'Tìm kiếm bộ từ...',
};

InputForward.displayName = 'InputForward';

const styles = StyleSheet.create({
  container: {borderRadius: 8, marginVertical: 16},
  defaultIcon: {paddingHorizontal: 16},
  primaryIcon: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 11,
    fontSize: 14,
  },
  textInputWhite: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: OS.IsAndroid ? 11 : 15,
    fontSize: 16,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    backgroundColor: colors.white,
  },
});

export default InputForward;
