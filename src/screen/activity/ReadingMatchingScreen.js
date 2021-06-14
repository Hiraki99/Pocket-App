import React from 'react';
import {connect} from 'react-redux';

import ReadingTabContainer from '~/BaseComponent/components/elements/script/readingAnswerQuestions/ReadingTabContainer';
import ReadingMatchingExercise from '~/BaseComponent/components/elements/script/readingAnswerQuestions/ReadingMatchingExercise';

class ReadingMatchingScreen extends React.PureComponent {
  render() {
    const {currentScriptItem} = this.props;

    if (!currentScriptItem || currentScriptItem.type !== 'reading_matching') {
      return null;
    }

    return (
      <ReadingTabContainer
        currentScriptItem={currentScriptItem}
        exerciseComponent={
          <ReadingMatchingExercise questions={currentScriptItem.items} />
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

export default connect(mapStateToProps, null)(ReadingMatchingScreen);
