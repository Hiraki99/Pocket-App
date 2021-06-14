import React from 'react';
import ModalWrapper from 'react-native-modal-wrapper';
import PropTypes from 'prop-types';
import {View} from 'react-native';

import {Button, Text} from '~/BaseComponent';
import {translate} from '~/utils/multilanguage';

export default class FillInBlankGivenWordsModal extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
    };
  }

  showModal = () => {
    this.setState({
      showModal: true,
    });
  };

  closeModal = () => {
    this.setState({
      showModal: false,
    });
  };

  checkAnswer = (item, index) => {
    const {onAnswer} = this.props;

    onAnswer(index);
    this.closeModal();
  };

  renderOptions() {
    const {options, userAnswers} = this.props;

    return (
      <View
        style={{
          marginTop: 24,
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}>
        {options.map((o, index) => {
          const selected =
            userAnswers.findIndex((item) => item === index) !== -1;

          return (
            <View style={{marginBottom: 8, marginRight: 8}} key={o.key}>
              <Button
                pill
                outline={!selected}
                primary
                onPress={() => this.checkAnswer(o, index)}>
                {o.text}
              </Button>
            </View>
          );
        })}
      </View>
    );
  }

  render() {
    return (
      <ModalWrapper
        containerStyle={{
          flexDirection: 'row',
          alignItems: 'flex-end',
        }}
        onRequestClose={this.closeModal}
        shouldAnimateOnRequestClose={true}
        style={{
          flex: 1,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          padding: 24,
        }}
        visible={this.state.showModal}>
        <Text h5 uppercase bold>
          {translate('Chọn đáp án')}
        </Text>
        {this.renderOptions()}
      </ModalWrapper>
    );
  }
}

FillInBlankGivenWordsModal.propTypes = {
  options: PropTypes.array,
  onAnswer: PropTypes.func,
  userAnswers: PropTypes.array,
};

FillInBlankGivenWordsModal.defaultProps = {
  options: [],
  userAnswers: [],
  onAnswer: () => {},
};
