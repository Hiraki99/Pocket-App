import React from 'react';
import {connect} from 'react-redux';
import split from 'lodash/split';
import shuffle from 'lodash/shuffle';
import {TouchableOpacity, View, ScrollView} from 'react-native';

import ScriptWrapper from '~/BaseComponent/components/elements/script/ScriptWrapper';
import CommonAttachment from '~/BaseComponent/components/elements/script/attachment/CommonAttachment';
import {Button, Loading, Text} from '~/BaseComponent';
import FillInBlankGivenWordsModal from '~/BaseComponent/components/elements/script/fillInBlank/FillInBlankGivenWordsModal';
import {
  setMaxCorrect,
  increaseScore,
  answerQuestion,
} from '~/features/script/ScriptAction';
import {generateNextActivity} from '~/utils/script';
import {makeid, matchAllRegex} from '~/utils/utils';
import {colors} from '~/themes';
import {OS} from '~/constants/os';
import {translate} from '~/utils/multilanguage';

class FillInBlankParagraphWithGivenWordsScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      isDone: false,
      answers: [],
      corrects: [],
      correctAnswers: [],
      shuffleAnswers: [],
      parts: [],
      showCorrectAnswer: false,
      currentIndex: -1,
    };
  }

  componentDidMount(): void {
    if (this.checkScriptType()) {
      const {currentScriptItem} = this.props;
      const {question} = currentScriptItem;

      const findRegex = /(\[.*?\]\{\d\})|(\[.*?\])/g;
      const corrects = question.match(findRegex);
      const correctAnswers = [];
      corrects.forEach((item) => {
        const matches = item.match(/\[(.*?)\]/);
        const matches_1 = item.match(/\{(\d)\}/);

        correctAnswers.push({
          text: matches[1],
          score: matches_1 ? matches_1[1] : 1,
          key: makeid(8),
        });
      });
      const splitRegex = /(\[.*?\]\{\d\})|(\[.*?\])/;

      const parts = split(question, splitRegex).filter(
        (item) => item && !corrects.includes(item),
      );

      this.setState({
        corrects,
        correctAnswers,
        shuffleAnswers: shuffle(correctAnswers),
        answers: correctAnswers.map(() => null),
        parts,
      });
      setTimeout(() => {
        this.setState({loading: false});
      }, 300);
    }
  }

  checkScriptType = () => {
    const {currentScriptItem} = this.props;

    if (
      currentScriptItem &&
      currentScriptItem.type === 'fill_in_blank_paragraph_with_given_words'
    ) {
      return true;
    }

    return false;
  };

  onSelected = (index) => {
    if (this.modalRef) {
      this.setState({
        currentIndex: index,
      });

      this.modalRef.showModal();
    }
  };

  onAnswer = (index) => {
    const arr = [...this.state.answers];
    const selectedIndex = arr.findIndex((item) => item === index);

    if (selectedIndex !== -1) {
      arr[selectedIndex] = null;
    }

    arr[this.state.currentIndex] = index;
    this.setState({
      answers: arr,
    });
  };

  checkAnswer = () => {
    this.setState({
      isDone: true,
    });
  };

  next = () => {
    const {answers, correctAnswers, shuffleAnswers} = this.state;
    const {currentScriptItem, setMaxCorrect, increaseScore} = this.props;

    let score = 0,
      maxCorrect = 0;

    correctAnswers.forEach((item, index) => {
      if (item.text === shuffleAnswers[answers[index]].text) {
        score += parseInt(item.score);
        maxCorrect++;
      }
    });

    setMaxCorrect(maxCorrect);
    increaseScore(score, maxCorrect, correctAnswers.length - maxCorrect);
    generateNextActivity();
  };

  renderMetaWord = (item) => {
    return (
      <>
        {split(item, ' ').map((o) => {
          if (o.indexOf('\n') !== -1) {
            const breakLineArr = split(o, '\n');
            return breakLineArr.map((breakLine, breakIndex) => {
              return (
                <>
                  <Text h5 key={makeid(8)}>
                    {breakLine}{' '}
                  </Text>

                  {breakIndex < breakLineArr.length - 1 && (
                    <View key={makeid(8)} style={{width: '100%', height: 10}} />
                  )}
                </>
              );
            });
          } else {
            return (
              <Text key={makeid(8)} h5>
                {o}{' '}
              </Text>
            );
          }
        })}
      </>
    );
  };

  renderItem = (item) => {
    if (!item) {
      return null;
    }
    const mainKeyRegex = /\<.*?\>/g;
    const regexReplace = /<|>/g;
    // const y = [...item.matchAll(mainKeyRegex)];
    const y = matchAllRegex(mainKeyRegex, item);
    return (
      <>
        {mainKeyRegex.test(item) &&
          y.map((it, index) => {
            let content;
            if (index === y.length - 1) {
              content = it.input.slice(it[0].length + it.index).trim();
            } else {
              content = it.input
                .slice(it.index + it[0].length, y[index + 1].index)
                .trim();
            }
            return (
              <>
                <Text key={makeid(8)} h5 primary bold>
                  {it[0].replace(regexReplace, '')}
                </Text>
                {index === y.length - 1 && (
                  <View key={makeid(8)} style={{width: '100%', height: 20}} />
                )}
                {this.renderMetaWord(content)}
              </>
            );
          })}
        {!mainKeyRegex.test(item) && this.renderMetaWord(item)}
      </>
    );
  };

  renderFillInBlank = () => {
    const {answers, isDone, shuffleAnswers, correctAnswers, parts} = this.state;

    return (
      <View style={{flexDirection: 'row', marginBottom: 22}}>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}>
          {parts.map((item, k) => {
            const correct = correctAnswers[k] ? correctAnswers[k].text : '';
            return (
              <>
                {this.renderItem(item)}
                {k <= parts.length - 1 &&
                  answers &&
                  typeof answers[k] !== 'undefined' &&
                  answers[k] !== null &&
                  !isDone && (
                    <TouchableOpacity
                      activeOpacity={0.75}
                      key={makeid(8)}
                      onPress={() => this.onSelected(k)}>
                      <Text h5 bold primary center>
                        {shuffleAnswers[answers[k]].text}
                      </Text>
                    </TouchableOpacity>
                  )}

                {k <= parts.length - 1 &&
                  (!answers || answers[k] === null) &&
                  !isDone && (
                    <TouchableOpacity
                      activeOpacity={0.75}
                      onPress={() => this.onSelected(k)}
                      key={makeid(8)}
                      style={{
                        backgroundColor: 'rgba(89, 95, 255, 0.1)',
                        borderBottomWidth: 1,
                        borderBottomColor: colors.helpText,
                        width: 80,
                        height: 22,
                      }}
                    />
                  )}

                {k <= parts.length - 1 && isDone && (
                  <>
                    {answers &&
                      typeof answers[k] !== 'undefined' &&
                      answers[k] !== null &&
                      shuffleAnswers[answers[k]].text !== correct && (
                        <Text h5 bold wrongChoice lineThrough key={makeid(8)}>
                          {shuffleAnswers[answers[k]].text}{' '}
                        </Text>
                      )}
                    <Text h5 bold successChoice key={makeid(8)}>
                      {correct}
                    </Text>
                  </>
                )}
              </>
            );
          })}
        </View>
      </View>
    );
  };

  renderCheckBtn = () => {
    const {answers, isDone} = this.state;
    let disabled = true;

    if (
      answers.length > 0 &&
      answers.findIndex((item) => item === null) === -1
    ) {
      disabled = false;
    }

    return (
      <View
        style={{
          marginVertical: 20,
          paddingHorizontal: 24,
        }}>
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
            shadow
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
            shadow
            onPress={this.next}>
            {translate('Tiếp tục')}
          </Button>
        )}
      </View>
    );
  };

  render() {
    const {currentScriptItem} = this.props;
    const {shuffleAnswers, answers} = this.state;

    if (!this.checkScriptType()) {
      return null;
    }

    return (
      <ScriptWrapper showProgress={false}>
        {this.state.loading ? (
          <Loading
            style={{
              paddingTop: OS.HEIGHT / 2 - 120,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
        ) : (
          <>
            <ScrollView
              contentContainerStyle={{
                paddingHorizontal: 24,
              }}>
              <CommonAttachment
                attachment={currentScriptItem.attachment}
                key={currentScriptItem.key}
                text={translate('Điền từ vào chỗ trống')}
              />

              {this.renderFillInBlank()}
            </ScrollView>

            {this.renderCheckBtn()}
          </>
        )}

        <FillInBlankGivenWordsModal
          ref={(ref) => (this.modalRef = ref)}
          options={shuffleAnswers}
          userAnswers={answers}
          onAnswer={this.onAnswer}
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
})(FillInBlankParagraphWithGivenWordsScreen);
