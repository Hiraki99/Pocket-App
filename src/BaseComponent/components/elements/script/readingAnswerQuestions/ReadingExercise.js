import React from 'react';
import PropTypes from 'prop-types';

import SingleChoiceQuestion from '~/BaseComponent/components/elements/script/question/SingleChoiceQuestion';
import {generateNextActivity} from '~/utils/script';
import MultiChoiceQuestion from '~/BaseComponent/components/elements/script/question/MultiChoiceQuestion';
import GivenWordsQuestion from '~/BaseComponent/components/elements/script/question/GivenWordsQuestion';
import Answer from '~/BaseComponent/components/elements/result/Answer';

export default class ReadingExercise extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentIndex: 0,
      showAward: false,
    };
  }

  doneQuestion = (isCorrect) => {
    if (isCorrect) {
      this.setState({showAward: true});
    }
    const {questions} = this.props;
    const {currentIndex} = this.state;

    if (currentIndex < questions.length - 1) {
      if (isCorrect) {
        setTimeout(() => {
          this.setState({
            currentIndex: this.state.currentIndex + 1,
            showAward: false,
          });
        }, 3000);
      } else {
        this.setState({
          currentIndex: this.state.currentIndex + 1,
        });
      }
    } else {
      setTimeout(
        () => {
          this.setState({showAward: false});
          generateNextActivity();
        },
        isCorrect ? 3000 : 500,
      );
    }
  };

  renderAward = () => {
    if (!this.state.showAward) {
      return null;
    }
    return <Answer isCorrect={true} />;
  };

  render() {
    const {questions} = this.props;
    const {currentIndex, showAward} = this.state;

    if (questions.length === 0) {
      return null;
    }

    return (
      <>
        {showAward && this.renderAward()}
        {questions[currentIndex].type === 'single_choice' && (
          <SingleChoiceQuestion
            key={questions[currentIndex].key}
            item={questions[currentIndex]}
            index={currentIndex}
            length={questions.length}
            onDone={this.doneQuestion}
          />
        )}
        {questions[currentIndex].type === 'multi_choice' && (
          <MultiChoiceQuestion
            key={questions[currentIndex].key}
            item={questions[currentIndex]}
            index={currentIndex}
            length={questions.length}
            onDone={this.doneQuestion}
          />
        )}
        {questions[currentIndex].type === 'given_words' && (
          <GivenWordsQuestion
            key={questions[currentIndex].key}
            item={questions[currentIndex]}
            index={currentIndex}
            length={questions.length}
            onDone={this.doneQuestion}
          />
        )}
      </>
    );
  }
}

ReadingExercise.propTypes = {
  questions: PropTypes.array.isRequired,
};
