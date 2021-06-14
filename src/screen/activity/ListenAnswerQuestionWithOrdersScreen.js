import React from 'react';
import {connect} from 'react-redux';
import {TouchableOpacity, View} from 'react-native';

import ScriptWrapper from '~/BaseComponent/components/elements/script/ScriptWrapper';
import CommonAttachment from '~/BaseComponent/components/elements/script/attachment/CommonAttachment';
import {Text} from '~/BaseComponent';
import activityStyles from '~/BaseComponent/components/elements/script/activityStyles';
import GivenWordModal from '~/BaseComponent/components/elements/script/GivenWordModal';
import {
  setMaxCorrect,
  increaseScore,
  answerQuestion,
} from '~/features/script/ScriptAction';
import {generateNextActivity} from '~/utils/script';
import {translate} from '~/utils/multilanguage';

class ListenAnswerQuestionWithOrdersScreen extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      currentIndex: 0,
    };
  }

  showModal = () => {
    if (this.modalRef && !this.state.isDone) {
      this.modalRef.showModal();
    }
  };

  onDone = (isCorrect) => {
    const {currentScriptItem} = this.props;
    setTimeout(() => {
      const {currentIndex} = this.state;
      this.props.answerQuestion(
        isCorrect,
        currentScriptItem.items[currentIndex].score,
      );
      // if (isCorrect) {
      //   increaseScore(currentScriptItem.items[currentIndex].score);
      // }

      if (currentIndex < currentScriptItem.items.length - 1) {
        this.setState({
          currentIndex: currentIndex + 1,
        });
      } else {
        generateNextActivity();
      }
    }, 2500);
  };

  render() {
    const {currentScriptItem} = this.props;
    const {currentIndex} = this.state;

    if (
      !currentScriptItem ||
      currentScriptItem.type !== 'listen_answer_question_with_order'
    ) {
      return null;
    }

    return (
      <ScriptWrapper>
        <View style={{paddingHorizontal: 24}}>
          {currentScriptItem.audio && !currentScriptItem.attachment && (
            <CommonAttachment
              attachment={{type: 'audio', path: currentScriptItem.audio}}
              key={currentScriptItem.key}
              text={translate('Câu hỏi %s/%s', {
                s1: currentIndex + 1,
                s2: currentScriptItem.items.length,
              })}
            />
          )}

          {currentScriptItem.attachment && (
            <CommonAttachment
              attachment={currentScriptItem.attachment}
              key={currentScriptItem.key}
              text={translate('Câu hỏi %s/%s', {
                s1: currentIndex + 1,
                s2: currentScriptItem.items.length,
              })}
            />
          )}
          {!currentScriptItem.attachment && (
            <Text h5 bold style={{marginTop: 32, marginBottom: 18}}>
              {translate('Câu hỏi %s/%s', {
                s1: currentIndex + 1,
                s2: currentScriptItem.items.length,
              })}
            </Text>
          )}
          <Text h5 style={{marginTop: !currentScriptItem.attachment ? 0 : -15}}>
            {currentScriptItem.items[currentIndex].question}
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
        </View>

        <GivenWordModal
          ref={(ref) => (this.modalRef = ref)}
          key={currentScriptItem.items[currentIndex].key}
          options={currentScriptItem.items[currentIndex].answers}
          score={currentScriptItem.items[currentIndex].score}
          inInlineMode={false}
          onDone={this.onDone}
        />
      </ScriptWrapper>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentScriptItem: state.script.currentScriptItem,
  };
};

export default connect(mapStateToProps, {
  setMaxCorrect,
  increaseScore,
  answerQuestion,
})(ListenAnswerQuestionWithOrdersScreen);
