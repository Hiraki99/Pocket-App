import React from 'react';
import {connect} from 'react-redux';
import {FlatList, View} from 'react-native';

// import isEqual from 'lodash/isEqual';
import {Button} from '~/BaseComponent';
import ScriptWrapper from '~/BaseComponent/components/elements/script/ScriptWrapper';
import CommonAttachment from '~/BaseComponent/components/elements/script/attachment/CommonAttachment';
import FillInBlankTextItem from '~/BaseComponent/components/elements/script/fillInBlank/FillInBlankTextItem';
import WritingInputExam from '~/BaseComponent/components/elements/exam/modal/WritingInputExam';
import {generateNextActivity} from '~/utils/script';
import {setMaxCorrect, increaseScore} from '~/features/script/ScriptAction';
import {translate} from '~/utils/multilanguage';

class FillInBlankWritingScreen extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isDone: false,
      currentIndex: 0,
      answers: [],
      currentBlankIndex: 0,
      selectedItem: null,
    };
  }

  onSelected = (index, blankIndex, item) => {
    if (this.writingRef) {
      this.writingRef.show();
    }

    this.setState({
      currentIndex: index,
      currentBlankIndex: blankIndex,
      selectedItem: item,
    });
  };

  checkAnswer = () => {
    const {answers} = this.state;
    const {increaseScore} = this.props;
    let score = 0,
      correctCount = 0;

    answers.forEach((item) => {
      if (item.isCorrect) {
        score += parseInt(item.score || 0);
        correctCount++;
      }
    });

    increaseScore(score, correctCount, answers.length - correctCount);

    this.setState({
      isDone: true,
    });
  };

  renderHeaderFlatList = () => {
    const {currentScriptItem} = this.props;

    return (
      <CommonAttachment
        attachment={currentScriptItem.attachment}
        key={currentScriptItem.key}
        text={translate('Điền từ vào chỗ trống')}
      />
    );
  };

  renderItem = ({item, index}) => {
    const {currentScriptItem} = this.props;
    const {answers, isDone} = this.state;

    const answer = answers.find((o) => o.index === index);
    const currentAnswer = answer ? answer.answer : [];

    return (
      <FillInBlankTextItem
        key={item.key}
        item={item}
        index={index}
        totalQuestion={currentScriptItem.items.length}
        onSelected={(blankIndex) => this.onSelected(index, blankIndex, item)}
        answer={currentAnswer}
        showCorrectAnswer={isDone}
        isCardMode={false}
      />
    );
  };

  renderFooterFlatList = () => {
    const {isDone, answers} = this.state;
    const {currentScriptItem} = this.props;

    let correctCount = 0;
    currentScriptItem.items.forEach((item) => {
      const corrects = item.question.match(/\[.*?\]/g);
      correctCount += corrects.length;
    });

    let answerCount = 0;
    answers.forEach((item) => {
      answerCount += item.answer.length;
    });

    const disabled = answerCount < correctCount;

    return (
      <View style={{paddingHorizontal: 24, marginBottom: 20, paddingTop: 20}}>
        {!isDone && (
          <Button
            disabled={disabled}
            large
            primary
            rounded
            block
            uppercase
            bold
            icon
            onPress={this.checkAnswer}>
            {translate('Kiểm tra')}
          </Button>
        )}

        {isDone && (
          <Button
            large
            primary
            rounded
            block
            uppercase
            bold
            icon
            onPress={this.nextActivity}>
            {translate('Tiếp tục')}
          </Button>
        )}
      </View>
    );
  };

  nextActivity = () => {
    generateNextActivity();
  };

  checkIsEqual = (corrects = [], answers = []) => {
    if (corrects.length !== answers.length) {
      return false;
    }
    let res = true;
    for (let i = 0; i < corrects.length; i++) {
      const answerItem = answers[i] || '';
      const arrayAnswerCorrects = corrects[i].split('/');
      if (arrayAnswerCorrects.includes(answerItem)) {
        continue;
      }
      return false;
    }
    return res;
  };

  onAnswer = (text) => {
    const {currentScriptItem} = this.props;
    const {currentIndex, answers, currentBlankIndex} = this.state;

    const cloneArr = [...answers];
    const searchIndex = cloneArr.findIndex(
      (item) => item.index === currentIndex,
    );

    const corrects = currentScriptItem.items[currentIndex].question.match(
      /\[.*?\]/g,
    );

    const correctAnswers = corrects.map((o) =>
      o
        .replace('[', '')
        .replace(']', '')
        .replace("'", '’')
        .trim()
        .toLowerCase(),
    );
    if (searchIndex !== -1) {
      cloneArr[searchIndex].answer[currentBlankIndex] = text.trim();
      cloneArr[searchIndex].isCorrect = this.checkIsEqual(
        correctAnswers,
        cloneArr[searchIndex].answer.map((o) => o.trim().toLowerCase()),
      );
    } else {
      let answer = [];
      answer[currentBlankIndex] = text.trim();

      const obj = {
        index: currentIndex,
        answer: answer,
        isCorrect: this.checkIsEqual(
          correctAnswers,
          answer.map((o) => o.trim().toLowerCase()),
        ),
        score: currentScriptItem.items[currentIndex].score,
      };

      cloneArr.push(obj);
    }

    this.setState({
      answers: cloneArr,
    });
  };

  render() {
    const {currentScriptItem} = this.props;

    if (
      !currentScriptItem ||
      currentScriptItem.type !== 'fill_in_blank_writing'
    ) {
      return null;
    }

    return (
      <ScriptWrapper showProgress={false}>
        <FlatList
          ListHeaderComponent={this.renderHeaderFlatList}
          data={currentScriptItem.items}
          renderItem={this.renderItem}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          extraData={this.props}
          contentContainerStyle={{paddingHorizontal: 24}}
        />

        {this.renderFooterFlatList()}

        <WritingInputExam
          questionComp={() => {
            const {selectedItem, currentIndex} = this.state;
            if (!this.state.selectedItem) {
              return null;
            }
            return (
              <FillInBlankTextItem
                key={selectedItem.key}
                item={selectedItem}
                index={currentIndex}
                totalQuestion={currentScriptItem.items.length}
                isCardMode={false}
              />
            );
          }}
          ref={(ref) => (this.writingRef = ref)}
          onSubmit={this.onAnswer}
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
})(FillInBlankWritingScreen);
