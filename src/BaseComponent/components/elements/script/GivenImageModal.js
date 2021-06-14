import React from 'react';
import ModalWrapper from 'react-native-modal-wrapper';
import PropTypes from 'prop-types';
import {Text, TranslateText} from '~/BaseComponent';
import {View, TouchableOpacity} from 'react-native';
import activityStyles from '~/BaseComponent/components/elements/script/activityStyles';
import FastImage from 'react-native-fast-image';

import {addAction, processUserAnswer} from '~/utils/script';
import {makeAction} from '~/utils/action';
import * as actionTypes from '~/constants/actionTypes';
import {playAudio} from '~/utils/utils';
import {LANGUAGE_MAPPING} from '~/constants/lang';

export default class GivenImageModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
    };

    this.showModal = this.showModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.renderOptions = this.renderOptions.bind(this);
    this.onSelectItem = this.onSelectItem.bind(this);
  }

  showModal() {
    this.setState({
      showModal: true,
    });
  }

  closeModal() {
    this.setState({
      showModal: false,
    });
  }

  onSelectItem(item) {
    const {score, onDone} = this.props;

    const action = makeAction(actionTypes.INLINE_IMAGE, {
      isUser: true,
      image: item.url,
    });

    onDone(item);

    this.closeModal();

    addAction(action);

    processUserAnswer(item.isAnswer, score, false);
    playAudio('selected');
  }

  renderOptions() {
    const {options} = this.props;

    return (
      <View
        style={{
          paddingVertical: 24,
          paddingHorizontal: 24,
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {options.map((item) => {
          return (
            <TouchableOpacity
              onPress={() => this.onSelectItem(item)}
              activeOpacity={0.65}>
              <FastImage
                source={{uri: item.url}}
                style={{
                  width: 100,
                  height: 100,
                  marginBottom: 10,
                  marginRight: 10,
                  borderRadius: 8,
                }}
              />
            </TouchableOpacity>
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
        style={{flex: 1, borderTopLeftRadius: 20, borderTopRightRadius: 20}}
        visible={this.state.showModal}>
        <View style={activityStyles.modal}>
          <TranslateText
            justifyContent={'center'}
            textVI={LANGUAGE_MAPPING.vi.choose_the_correct_picture}
            textEN={LANGUAGE_MAPPING.en.choose_the_correct_picture}
            RenderComponent={(props) => (
              <Text h5 bold center>
                {props.content}
              </Text>
            )}
          />
          {this.renderOptions()}
        </View>
      </ModalWrapper>
    );
  }
}

GivenImageModal.propTypes = {
  options: PropTypes.array.isRequired,
  score: PropTypes.number,
  onDone: PropTypes.func.isRequired,
};

GivenImageModal.defaultProps = {
  options: [],
  score: 0,
  onDone: () => {},
};
