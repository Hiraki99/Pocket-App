import React from 'react';
import {connect} from 'react-redux';

import {increaseScore, setMaxCorrect} from '~/features/script/ScriptAction';
import ReadingExercise from '~/BaseComponent/components/elements/script/readingAnswerQuestions/ReadingExercise';
import ReadingTabContainer from '~/BaseComponent/components/elements/script/readingAnswerQuestions/ReadingTabContainer';

class ReadingAnswerQuestionScreen extends React.PureComponent {
  render() {
    const {currentScriptItem} = this.props;
    console.log('currentScriptItem ', currentScriptItem);
    if (
      !currentScriptItem ||
      currentScriptItem.type !== 'reading_answer_questions'
    ) {
      return null;
    }

    return (
      <ReadingTabContainer
        currentScriptItem={currentScriptItem}
        exerciseComponent={
          <ReadingExercise questions={currentScriptItem.items} />
        }
      />
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
})(ReadingAnswerQuestionScreen);
