import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PropTypes from 'prop-types';

import {colors} from '~/themes';
import {OS} from '~/constants/os';
import {translate} from '~/utils/multilanguage';

export default class WritingInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      text: '',
    };
  }

  show = (text = '') => {
    if (this.inputRef) {
      this.inputRef.focus();

      this.setState({show: true, text: text ? text : ''});
    }
  };

  hide = () => {
    this.inputRef.blur();
    this.setState({show: false, text: ''});
    Keyboard.dismiss();
  };

  submit = () => {
    const {onSubmit} = this.props;
    const {text} = this.state;

    onSubmit(text.trim());
    this.hide();
  };

  renderContent = () => {
    const {show, text} = this.state;
    const btnActive = text.trim() !== '';

    return (
      <View style={[styles.wrap, show ? styles.show : null]}>
        <TouchableOpacity style={styles.overlay} onPress={this.hide} />
        <View style={styles.controls}>
          <View style={styles.controlInner}>
            <TextInput
              ref={(ref) => (this.inputRef = ref)}
              style={styles.input}
              placeholder={translate('Điền từ thích hợp')}
              autoCapitalize="none"
              blurOnSubmit={false}
              value={text}
              onBlur={() => {
                this.hide();
              }}
              onChangeText={(text) => this.setState({text: text})}
            />
            <TouchableOpacity
              onPress={this.submit}
              activeOpacity={0.65}
              style={[styles.sendBtn, btnActive ? styles.btnActive : null]}
              disabled={!btnActive}>
              <Icon name="send" style={{color: colors.primary, fontSize: 28}} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  render() {
    if (!OS.IsAndroid) {
      return (
        <KeyboardAvoidingView behavior="position" keyboardVerticalOffset="0">
          {this.renderContent()}
        </KeyboardAvoidingView>
      );
    } else {
      return this.renderContent();
    }
  }
}

const styles = {
  show: {
    height: OS.HEIGHT,
    zIndex: 999999,
    opacity: 1,
  },
  wrap: {
    height: 0,
    width: OS.WIDTH,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: -1,
    opacity: 0,
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    flex: 1,
  },
  controls: {
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  controlInner: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 12,
    paddingTop: 24,
    paddingBottom: 15,
    overflow: 'hidden',
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    backgroundColor: colors.mainBgColor,
    borderRadius: 20,
    paddingVertical: OS.IsAndroid ? 16 : 10,
    paddingHorizontal: 20,
    fontSize: 17,
    fontFamily: 'CircularStd-Book',
    flex: 1,
  },
  sendBtn: {
    padding: 5,
    marginLeft: 10,
    opacity: 0.3,
  },
  btnActive: {
    opacity: 1,
  },
};

WritingInput.propTypes = {
  onSubmit: PropTypes.func,
};

WritingInput.defaultProps = {
  onSubmit: () => {},
};
