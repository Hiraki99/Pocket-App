import React from 'react';
import {connect} from 'react-redux';

import ReadingMatchingExercise from '~/BaseComponent/components/elements/script/readingAnswerQuestions/ReadingMatchingExercise';
import ScriptWrapper from '~/BaseComponent/components/elements/script/ScriptWrapper';

class CommonMatchingScreen extends React.PureComponent {
  render() {
    const {currentScriptItem} = this.props;

    if (!currentScriptItem || currentScriptItem.type !== 'common_matching') {
      return null;
    }

    return (
      <ScriptWrapper>
        <ReadingMatchingExercise questions={currentScriptItem.items} />
      </ScriptWrapper>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentScriptItem: state.script.currentScriptItem,
  };
};

export default connect(mapStateToProps, null)(CommonMatchingScreen);
