import React from 'react';
import ModalWrapper from 'react-native-modal-wrapper';
import PropTypes from 'prop-types';
import Feather from 'react-native-vector-icons/Feather';
import {View, TouchableOpacity, Dimensions} from 'react-native';
import shuffle from 'lodash/shuffle';

import activityStyles from '~/BaseComponent/components/elements/script/activityStyles';
import {Text} from '~/BaseComponent';
import BottomResult from '~/BaseComponent/components/elements/script/FlashCard/BottomResult';
import {colors} from '~/themes';
import {addAction, processUserAnswer} from '~/utils/script';
import {makeAction} from '~/utils/action';
import * as actionTypes from '~/constants/actionTypes';
import {playAudio, playAudioAnswer} from '~/utils/utils';
import {translate} from '~/utils/multilanguage';

const {width} = Dimensions.get('window');

export default class GivenWordModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      selected: [],
      shuffleOptions: [],
      showResult: false,
      isCorrect: false,
      correctAnswer: null,
    };
  }

  componentDidMount() {
    this.init();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.key !== this.props.key) {
      this.init();
    }
  }

  init = () => {
    const {options} = this.props;
    const shuffleOptions = shuffle(options);
    this.setState({
      shuffleOptions,
      showModal: false,
      selected: [],
      showResult: false,
      isCorrect: false,
      correctAnswer: null,
    });
  };

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

  onSelectItem = (item, isSelected) => {
    if (isSelected) {
      const {selected} = this.state;
      const index = selected.findIndex((o) => o.key === item.key);

      const newSelected = [...selected];
      newSelected.splice(index, 1);
      this.setState({
        selected: newSelected,
      });
    } else {
      this.setState({
        selected: [...this.state.selected, item],
      });
    }
    playAudio('selected');
  };

  removeLastItem = () => {
    if (this.state.selected.length > 0) {
      const selected = [...this.state.selected];
      selected.splice(selected.length - 1, 1);

      this.setState({
        selected,
      });
    }
  };

  checkAnswer = () => {
    const {options, score, onDone, inInlineMode, usingStore} = this.props;
    const {selected} = this.state;

    const correctOptions = options.filter((item) => item.isAnswer);
    const correctAnswer = correctOptions.map((item) => item.text).join(' ');
    const answer = selected.map((item) => item.text).join(' ');
    const listSelectedKeys = selected.map((it) => {
      return it.key;
    });
    const isCorrect = correctAnswer === answer;
    this.setState({
      correctAnswer,
      isCorrect,
      showResult: true,
    });

    onDone(isCorrect, answer, listSelectedKeys);
    if (usingStore) {
      playAudioAnswer(isCorrect);
      if (inInlineMode) {
        const action = makeAction(actionTypes.INLINE_SENTENCE, {
          isUser: true,
          content: answer,
        });

        this.closeModal();

        addAction(action);
        processUserAnswer(isCorrect, score, false);
      } else {
        setTimeout(() => this.closeModal(), 1900);
      }
    }
  };

  renderOptions = () => {
    const {shuffleOptions, selected} = this.state;

    return (
      <View style={activityStyles.aqOptions}>
        {shuffleOptions.map((item) => {
          const index = selected.findIndex((o) => o.key === item.key);
          return (
            <TouchableOpacity
              onPress={() => this.onSelectItem(item, index !== -1)}
              activeOpacity={0.65}
              key={item.key}
              style={activityStyles.aqOption}>
              <Text
                h5
                color={index !== -1 ? colors.helpText3 : colors.helpText}>
                {item.text}
              </Text>
            </TouchableOpacity>
          );
        })}

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            onPress={this.checkAnswer}
            activeOpacity={0.65}
            style={[
              activityStyles.aqOption,
              {width: width - 24 * 2 - 90, backgroundColor: colors.primary},
            ]}>
            <Text h5 color={colors.white}>
              {translate('OK')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={this.removeLastItem}
            activeOpacity={0.65}
            style={[activityStyles.aqOption, {width: 70, marginRight: 0}]}>
            <Feather name="delete" size={20} style={{fontSize: 20}} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  render() {
    const {selected, showResult, isCorrect, correctAnswer} = this.state;
    const {inInlineMode} = this.props;
    const selectedText = selected.map((item) => item.text).join(' ');

    return (
      <ModalWrapper
        containerStyle={{
          flexDirection: 'row',
          alignItems: 'flex-end',
        }}
        onRequestClose={this.closeModal}
        shouldAnimateOnRequestClose={true}
        style={{flex: 1, borderTopRightRadius: 24, borderTopLeftRadius: 24}}
        visible={this.state.showModal}>
        <View style={activityStyles.modal}>
          <Text uppercase h5 bold>
            {translate('Câu trả lời')}
          </Text>

          <View style={activityStyles.paragraph}>
            <Text h5>{selectedText}</Text>

            <View style={activityStyles.paragraphBg}>
              <View style={activityStyles.paragraphBgImg} />
              <View style={activityStyles.paragraphBgImg} />
              <View style={activityStyles.paragraphBgImg} />
              <View style={activityStyles.paragraphBgImg} />
              <View style={activityStyles.paragraphBgImg} />
              <View style={activityStyles.paragraphBgImg} />
            </View>
          </View>

          {this.renderOptions()}

          {showResult && !inInlineMode && (
            <BottomResult isCorrect={isCorrect} correctAnswer={correctAnswer} />
          )}
        </View>
      </ModalWrapper>
    );
  }
}

GivenWordModal.propTypes = {
  options: PropTypes.array.isRequired,
  score: PropTypes.number,
  onDone: PropTypes.func.isRequired,
  inInlineMode: PropTypes.bool,
  usingStore: PropTypes.bool,
};

GivenWordModal.defaultProps = {
  options: [],
  score: 0,
  onDone: () => {},
  inInlineMode: true,
  usingStore: true,
};
