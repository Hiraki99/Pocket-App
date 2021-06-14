import React from 'react';
import {View, TextInput, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PropTypes from 'prop-types';
import ModalWrapper from 'react-native-modal-wrapper';

import {RowContainer, SeparatorVertical} from '~/BaseComponent';
import {colors} from '~/themes';
import {OS} from '~/constants/os';
import {translate} from '~/utils/multilanguage';

export default class WritingInputExam extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      text: '',
    };
  }

  show = (text = '') => {
    this.setState({show: true, text: text ? text : ''});
    setTimeout(() => {
      if (this.inputRef) {
        this.inputRef.focus();
      }
    }, 100);
  };

  hide = () => {
    if (this.inputRef) {
      this.inputRef.blur();
    }
    this.setState({show: false, text: ''});
    this.props.setActiveIndex(null);
  };

  submit = () => {
    const {text} = this.state;
    this.props.onSubmit(text.trim(), this.props.indexActive);
    this.hide();
  };

  renderContent = () => {
    const {text} = this.state;
    const btnActive = text.trim() !== '';

    return (
      <View style={styles.controlInner}>
        {this.props.questionComp && (
          <>
            <SeparatorVertical lg />
            <View paddingHorizontal={16}>{this.props.questionComp()}</View>
          </>
        )}
        <SeparatorVertical lg />
        <View style={styles.controlInner}>
          <RowContainer>
            <TextInput
              ref={(ref) => (this.inputRef = ref)}
              style={styles.input}
              placeholder={this.props.placeHolderText}
              autoCapitalize="none"
              value={text}
              onChangeText={(t) => this.setState({text: t})}
            />
            <TouchableOpacity
              onPress={this.submit}
              activeOpacity={0.65}
              style={[styles.sendBtn, btnActive ? styles.btnActive : null]}
              disabled={!btnActive}>
              <Icon name="send" size={28} style={{color: colors.primary}} />
            </TouchableOpacity>
          </RowContainer>
        </View>
      </View>
    );
  };
  //
  render() {
    return (
      <ModalWrapper
        containerStyle={{
          flexDirection: 'row',
          alignItems: 'flex-end',
        }}
        onRequestClose={this.hide}
        shouldAnimateOnRequestClose={true}
        style={{
          width: OS.WIDTH,
          borderTopRightRadius: 24,
          borderTopLeftRadius: 24,
          zIndex: 1000000,
        }}
        visible={this.state.show}>
        {this.renderContent()}
      </ModalWrapper>
    );
  }
}

const styles = {
  controlInner: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 12,
    // paddingTop: 24,
    paddingBottom: 15,
    overflow: 'hidden',
    backgroundColor: colors.white,
  },
  input: {
    backgroundColor: colors.mainBgColor,
    borderRadius: 20,
    paddingVertical: 10,
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

WritingInputExam.propTypes = {
  onSubmit: PropTypes.func,
  questionComp: PropTypes.func,
  setActiveIndex: PropTypes.func,
  indexActive: PropTypes.number,
  placeHolderText: PropTypes.string,
  text: PropTypes.string,
};

WritingInputExam.defaultProps = {
  onSubmit: () => {},
  questionComp: null,
  setActiveIndex: () => {},
  indexActive: 0,
  placeHolderText: translate('Điền từ thích hợp...'),
  text: '',
};
