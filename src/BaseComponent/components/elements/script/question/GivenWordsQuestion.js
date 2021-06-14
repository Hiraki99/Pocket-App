import React from 'react';
import {TouchableOpacity, ScrollView} from 'react-native';
import PropTypes from 'prop-types';

import {Text} from '~/BaseComponent';
import GivenWordModal from '~/BaseComponent/components/elements/script/GivenWordModal';
import activityStyles from '~/BaseComponent/components/elements/script/activityStyles';
import {dispatchAnswerQuestion} from '~/utils/script';
import {translate} from '~/utils/multilanguage';

export default class GivenWordsQuestion extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: -1,
      isDone: false,
    };
  }

  showModal = () => {
    if (this.modalRef) {
      this.modalRef.showModal();
    }
  };

  next = (isCorrect) => {
    const {onDone, needCheckAll, item} = this.props;

    if (!needCheckAll) {
      dispatchAnswerQuestion(isCorrect, item.score);
    }

    setTimeout(() => onDone(), 2500);
  };

  render() {
    const {index, length, item} = this.props;

    return (
      <>
        <ScrollView
          style={{marginBottom: 24, paddingHorizontal: 24, paddingTop: 24}}>
          <Text bold h5>
            {translate('Câu %s %s', {s1: `${index + 1}`, s2: `${length}`})}
          </Text>
          <Text h5 style={{marginBottom: 10}}>
            {item.question}
          </Text>

          <TouchableOpacity
            activeOpacity={0.65}
            style={[
              activityStyles.embedButton,
              activityStyles.embedButtonRound,
            ]}
            onPress={this.showModal}>
            <Text h5>{translate('Sắp xếp từ/cụm từ để trả lời')}</Text>
          </TouchableOpacity>
        </ScrollView>

        <GivenWordModal
          ref={(ref) => (this.modalRef = ref)}
          options={item.answers}
          score={item.score}
          onDone={this.next}
          inInlineMode={false}
        />
      </>
    );
  }
}

GivenWordsQuestion.propTypes = {
  index: PropTypes.number,
  length: PropTypes.number,
  item: PropTypes.object.isRequired,
  showResult: PropTypes.bool,
  onChooseAnswer: PropTypes.func,
  onDone: PropTypes.func,
  needCheckAll: PropTypes.bool,
};

GivenWordsQuestion.defaultProps = {
  index: 0,
  length: 1,
  showResult: false,
  onChooseAnswer: () => {},
  needCheckAll: false,
  onDone: () => {},
};
