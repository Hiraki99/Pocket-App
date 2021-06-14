import React from 'react';
import ModalWrapper from 'react-native-modal-wrapper';
import PropTypes from 'prop-types';
import {View} from 'react-native';

import FillInBlankItem from '~/BaseComponent/components/elements/script/fillInBlank/FillInBlankItem';
import {Button} from '~/BaseComponent';
import {OS} from '~/constants/os';

export default class FillInBlankModal extends React.Component {
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

  checkAnswer = (item) => {
    const {onAnswer} = this.props;

    onAnswer(item);
    this.closeModal();
  };

  renderOptions() {
    const {item} = this.props;

    return (
      <View
        style={{
          marginTop: 24,
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}>
        {item.answers.map((o) => {
          return (
            <View
              style={{marginBottom: 8, width: (OS.WIDTH - 15 - 24 * 2) / 2}}>
              <Button pill outline primary onPress={() => this.checkAnswer(o)}>
                {o.text}
              </Button>
            </View>
          );
        })}
      </View>
    );
  }

  render() {
    const {item, questionIndex} = this.props;

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
        {item && (
          <>
            <FillInBlankItem item={item} index={questionIndex} />
            {this.renderOptions()}
          </>
        )}
      </ModalWrapper>
    );
  }
}

FillInBlankModal.propTypes = {
  item: PropTypes.object,
  questionIndex: PropTypes.number,
  blankIndex: PropTypes.number,
  onAnswer: PropTypes.func,
};

FillInBlankModal.defaultProps = {
  item: null,
  questionIndex: -1,
  blankIndex: -1,
  onAnswer: () => {},
};
