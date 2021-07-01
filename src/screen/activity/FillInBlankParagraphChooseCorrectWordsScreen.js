import React from 'react';
import {connect} from 'react-redux';
import split from 'lodash/split';
import {
  TouchableOpacity,
  View,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import ScriptWrapper from '~/BaseComponent/components/elements/script/ScriptWrapper';
import CommonAttachment from '~/BaseComponent/components/elements/script/attachment/CommonAttachment';
import {Button, Text} from '~/BaseComponent';
import FillInBlankChooseCorrectWordsModal from '~/BaseComponent/components/elements/script/fillInBlank/FillInBlankChooseCorrectWordsModal';
import {generateNextActivity} from '~/utils/script';
import {setMaxCorrect, increaseScore} from '~/features/script/ScriptAction';
import {colors} from '~/themes';
import {makeid, matchAllRegex, playAudio, playAudioAnswer} from '~/utils/utils';
import {translate} from '~/utils/multilanguage';

class FillInBlankParagraphChooseCorrectWordsScreen extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isDone: false,
      answers: [],
      correctAnswers: [],
      showCorrectAnswer: false,
      currentIndex: 0,
      loadingActivity: true,
    };
  }

  componentDidMount(): void {
    if (this.checkScriptType()) {
      const {currentScriptItem} = this.props;

      const {question} = currentScriptItem;
      const findRegex = /\[.*?]/g;
      const corrects = question.match(findRegex);
      const correctAnswers = [];

      corrects.forEach((item) => {
        const matches = item.match(/\[(.*?)]/);
        const matchesCorrect = item.match(/\((.*?)\)/);

        const options = split(matches[1], '/').map((item) => {
          return item.trim().replace('(', '').replace(')', '');
        });

        correctAnswers.push({
          text: matchesCorrect[1],
          options,
          score: 1,
        });
      });

      this.setState({
        correctAnswers,
        answers: correctAnswers.map(() => null),
      });
    }
    setTimeout(() => {
      this.setState({loadingActivity: false});
    }, 200);
  }

  checkScriptType = () => {
    const {currentScriptItem} = this.props;

    return (
      currentScriptItem &&
      currentScriptItem.type === 'fill_in_blank_paragraph_choose_correct_words'
    );
  };

  onSelected = (index) => {
    if (this.modalRef) {
      this.setState({
        currentIndex: index,
      });

      this.modalRef.showModal(this.state.answers[index]);
    }
    playAudio('selected');
  };

  onAnswer = (text) => {
    const arr = [...this.state.answers];
    arr[this.state.currentIndex] = text;

    this.setState({
      answers: arr,
    });
  };

  getCount = () => {
    const {answers, correctAnswers} = this.state;

    let score = 0,
      maxCorrect = 0,
      totalCorrect = 0;
    correctAnswers.forEach((item, index) => {
      if (item.text === answers[index]) {
        score += parseInt(item.score);
        maxCorrect++;
        totalCorrect++;
      }
    });
    const numPercent = answers.length > 0 ? score / answers.length : 0;
    return {
      maxCorrect,
      score,
      numPercent,
      totalCorrect,
      totalWrong: correctAnswers.length - totalCorrect,
    };
  };

  checkAnswer = () => {
    this.setState({
      isDone: true,
    });
    const data = this.getCount();
    playAudioAnswer(data.numPercent >= 0.6);
  };

  next = () => {
    const data = this.getCount();
    this.props.setMaxCorrect(data.maxCorrect);
    this.props.increaseScore(data.score, data.totalCorrect, data.totalWrong);

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
                  <Text key={`${breakLine}_${breakLine}`} h5 lineHeight={30}>
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
              <Text key={makeid(8)} h5 lineHeight={30}>
                {o}{' '}
              </Text>
            );
          }
        })}
      </>
    );
  };

  renderItem = (item) => {
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
                <Text key={makeid(8)} h5 primary bold lineHeight={30}>
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
    const {answers, isDone, correctAnswers} = this.state;
    const {currentScriptItem} = this.props;
    const {question} = currentScriptItem;

    const splitRegex = /\[.*?\]\{\d\}/;

    const parts = split(question, splitRegex);

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
                      key={`${answers[k]}_${k}`}
                      onPress={() => this.onSelected(k)}>
                      <Text h5 bold primary lineHeight={30}>
                        {answers[k]}
                      </Text>
                    </TouchableOpacity>
                  )}

                {k <= parts.length - 1 &&
                  (!answers || answers[k] === null) &&
                  !isDone && (
                    <Text key={`${correctAnswers[k]}_${k}`} h5>
                      {' '}
                    </Text>
                  )}

                {k <= parts.length - 1 &&
                  (!answers || answers[k] === null) &&
                  !isDone && (
                    <TouchableOpacity
                      activeOpacity={0.75}
                      onPress={() => this.onSelected(k)}
                      key={`${answers[k]}_${k}_${k}`}
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
                  <View key={`${answers[k]}_${correct}_${k}_${isDone}`}>
                    {answers &&
                      typeof answers[k] !== 'undefined' &&
                      answers[k] !== null &&
                      answers[k] !== correct && (
                        <Text h5 bold wrongChoice lineThrough lineHeight={30}>
                          {answers[k]}{' '}
                        </Text>
                      )}
                    <Text h5 bold successChoice lineHeight={30}>
                      {correct}
                    </Text>
                  </View>
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
    const {correctAnswers, answers, currentIndex} = this.state;

    if (!this.checkScriptType()) {
      return null;
    }

    return (
      <ScriptWrapper showProgress={false}>
        {this.state.loadingActivity ? (
          <ActivityIndicator size={'large'} center style={{marginTop: 24}} />
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

        <FillInBlankChooseCorrectWordsModal
          ref={(ref) => (this.modalRef = ref)}
          options={
            correctAnswers[currentIndex]
              ? correctAnswers[currentIndex].options
              : []
          }
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
})(FillInBlankParagraphChooseCorrectWordsScreen);
