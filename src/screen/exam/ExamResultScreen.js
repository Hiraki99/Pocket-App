import React from 'react';
import {connect} from 'react-redux';
import {ScrollView, View, Image, TouchableOpacity} from 'react-native';

import {
  GeneralStatusBar,
  Text,
  Card,
  BottomTabContainer,
} from '~/BaseComponent';
import {
  resetExam,
  setCurrentSection,
  showResult,
  resetPart,
} from '~/features/exam/ExamAction';
import {colors} from '~/themes';
import {OS} from '~/constants/os';
import images from '~/themes/images';
import navigator from '~/navigation/customNavigator';
import {SCORE_LEVEL} from '~/constants/teacher';
import {EXAM_TYPE} from '~/constants/exam';
import {translate} from '~/utils/multilanguage';

class ExamResultScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    const {questions} = props;
    let examQuestions = [];
    for (let key in questions) {
      if (
        questions[key].childIdsQuestion &&
        questions[key].type !== EXAM_TYPE.select_answer_sentence
      ) {
        questions[key].childIdsQuestion.forEach((it) => {
          examQuestions.push(questions[it]);
        });
        continue;
      }
      if (questions[key].parentId) {
        continue;
      }
      if (
        questions[key].childIdsQuestion &&
        questions[key].type === EXAM_TYPE.select_answer_sentence
      ) {
        let statusAnswerQuestion = true;
        questions[key].childIdsQuestion.forEach((it) => {
          statusAnswerQuestion =
            statusAnswerQuestion && it.statusAnswerQuestion;
        });
        examQuestions.push({
          ...questions[key],
          statusAnswerQuestion,
        });
      } else {
        examQuestions.push(questions[key]);
      }
    }
    this.state = {
      examQuestions,
      numberQuestion: examQuestions.length,
      numberCorrectAnswer: examQuestions.filter((it) => it.statusAnswerQuestion)
        .length,
    };
    // console.log('examQuestions ', examQuestions);
  }

  renderTitle = () => {
    return (
      <>
        <Text fontSize={32} color={colors.white} bold accented>
          {`${translate('Điểm số')}`}
        </Text>
        <Text color={'rgba(255,255,255,0.3)'} fontSize={14}>
          {`${translate('Kết quả bài kiểm tra của bạn')}`}
        </Text>
      </>
    );
  };

  renderScore = () => {
    const level = this.getLevel(this.props.score / this.props.numberQuestion);
    return (
      <Card style={styles.card}>
        <Text fontSize={40} bold accented color={colors.white}>
          {`${this.state.numberCorrectAnswer}/${this.state.numberQuestion}`}
        </Text>

        <Text
          fontSize={17}
          uppercase
          color={'rgba(255,255,255,0.6)'}
          style={{marginTop: 12}}>
          {`${translate('Cấp độ')}`}
        </Text>

        <Text fontSize={24} bold color={colors.white} style={{marginTop: 6}}>
          {level.name}
        </Text>
      </Card>
    );
  };

  getLevel = (score) => {
    if (SCORE_LEVEL.master.score <= score) {
      return SCORE_LEVEL.master;
    }
    if (
      SCORE_LEVEL.master.score > score &&
      score >= SCORE_LEVEL.profiency.score
    ) {
      return SCORE_LEVEL.profiency;
    }
    if (
      SCORE_LEVEL.profiency.score > score &&
      score >= SCORE_LEVEL.advanced.score
    ) {
      return SCORE_LEVEL.advanced;
    }
    if (
      SCORE_LEVEL.advanced.score > score &&
      score >= SCORE_LEVEL.intermediate.score
    ) {
      return SCORE_LEVEL.intermediate;
    }
    if (
      SCORE_LEVEL.intermediate.score > score &&
      score >= SCORE_LEVEL.preIntermediate.score
    ) {
      return SCORE_LEVEL.preIntermediate;
    }
    return SCORE_LEVEL.elementary;
  };

  endExam = () => {
    const {introExam} = this.props;
    const {examQuestions} = this.state;
    let data = {
      test_id: introExam._id,
    };
    let result = [];
    examQuestions.forEach((item) => {
      if (item.type === EXAM_TYPE.select_answer_paragraph) {
        result.push({
          question: item.parentId,
          answer: {
            text: item.answerSelectedKey
              ? ''
              : item.answers.filter(
                  (it) => it.key === item.answerSelectedKey,
                )[0]?.text || '',
          },
          is_true: item.statusAnswerQuestion || false,
        });
      }
      if (item.type === EXAM_TYPE.select_answer_sentence) {
        result.push({
          question: item.parentId,
          answer: {
            text: [
              item.answerSelectedKey
                ? ''
                : item.answers.filter(
                    (it) => it.key === item.answerSelectedKey,
                  )[0]?.text || '',
            ],
          },
          is_true: item.statusAnswerQuestion || false,
        });
      }
      if (item.type === EXAM_TYPE.question_with_order) {
        result.push({
          question: item._id,
          answer: item.userOrderAnswer || [],
          is_true: item.statusAnswerQuestion || false,
        });
      }
      if (item.type === EXAM_TYPE.fill_in_blank_sentence) {
        let answer = item?.userAnswers[0]?.text;
        result.push({
          question: item._id,
          answer,
          is_true: item.statusAnswerQuestion || false,
        });
      }
      if (item.type === EXAM_TYPE.fill_in_blank) {
        let answer = [];
        Object.entries(item.correctAnswers).forEach(([key]) => {
          answer.push({
            text: item?.userAnswers[key]?.text || '',
          });
        });
        result.push({
          question: item._id,
          answer,
          is_true: item.statusAnswerQuestion || false,
        });
      }
      if (item.type === EXAM_TYPE.rewrite_base_suggested) {
        result.push({
          question: item._id,
          answer: item.userAnswerText,
          is_true: item.statusAnswerQuestion || false,
        });
      }
      if (
        item.type === EXAM_TYPE.single_choice_inline ||
        item.type === EXAM_TYPE.single_choice_picture
      ) {
        result.push({
          question: item._id,
          answer: (item.idSelected || [])[0] || '',
          is_true: item.statusAnswerQuestion || false,
        });
      }
      if (item.type === EXAM_TYPE.multi_choice_inline) {
        result.push({
          question: item._id,
          answer: item.idSelected || [],
          is_true: item.statusAnswerQuestion || false,
        });
      }
    });
    data = {
      ...data,
      examQuestions,
    };
    this.props.resetExam(data);
    navigator.navigate('MainStack', {
      screen: 'BottomTabExam',
    });
  };

  renderLevel = () => {
    const level = this.state.numberQuestion
      ? this.getLevel(
          this.state.numberCorrectAnswer / this.state.numberQuestion,
        )
      : SCORE_LEVEL.elementary;
    return (
      <View style={styles.levelWrap}>
        <Image source={images.maxLevelTest} style={styles.levelOneImg} />
        <View style={[styles.level, styles.levelOne]} />
        <View
          style={[
            styles.level,
            styles.levelTwo,
            level.name === SCORE_LEVEL.master.name ? styles.levelActive : {},
          ]}>
          <Text center color={colors.white} fontSize={12}>
            {`${translate('Masters (54-60)')}`}
          </Text>
        </View>
        <View
          style={[
            styles.level,
            styles.levelThree,
            level.name === SCORE_LEVEL.profiency.name ? styles.levelActive : {},
          ]}>
          <Text center color={colors.white} fontSize={12}>
            {`${translate('Profiency (46-53)')}`}
          </Text>
        </View>
        <View
          style={[
            styles.level,
            styles.levelFour,
            level.name === SCORE_LEVEL.advanced.name ? styles.levelActive : {},
          ]}>
          <Text center color={colors.white} fontSize={12}>
            {`${translate('Advanced (32-45)')}`}
          </Text>
        </View>
        <View
          style={[
            styles.level,
            styles.levelFive,
            level.name === SCORE_LEVEL.intermediate.name
              ? styles.levelActive
              : {},
          ]}>
          <Text center color={colors.white} fontSize={12} bold>
            {`${translate('Intermediate (22-31)')}`}
          </Text>
        </View>
        <View
          style={[
            styles.level,
            styles.levelSix,
            level.name === SCORE_LEVEL.preIntermediate.name
              ? styles.levelActive
              : {},
          ]}>
          <Text center color={colors.white} fontSize={12}>
            {`${translate('Pre-Intermediate (7-21)')}`}
          </Text>
        </View>
        <View
          style={[
            styles.level,
            styles.levelSeven,
            level.name === SCORE_LEVEL.elementary.name
              ? styles.levelActive
              : {},
          ]}>
          <Text center color={colors.white} fontSize={12}>
            {`${translate('Elementary (4-6)')}`}
          </Text>
        </View>
      </View>
    );
  };

  renderButtons = () => {
    return (
      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.button, styles.buttonBlue]}
          activeOpacity={0.7}
          onPress={() => {
            this.props.resetPart();
            this.props.showResult();
            this.props.setCurrentSection(this.props.sections[0]);
            navigator.navigate('SectionExam');
          }}>
          <Text center bold fontSize={16} uppercase color={colors.white}>
            {`${translate('Đáp án')}`}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonWhite]}
          activeOpacity={0.7}
          onPress={this.endExam}>
          <Text center bold fontSize={16} uppercase>
            {`${translate('Tiếp tục')}`}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    return (
      <BottomTabContainer backgroundColor={colors.primary} style={{flex: 1}}>
        <GeneralStatusBar
          backgroundColor={colors.primary}
          barStyle={'light-content'}
        />

        <ScrollView contentContainerStyle={styles.backgroundContainer}>
          {this.renderTitle()}
          {this.renderScore()}
          {this.renderLevel()}
        </ScrollView>

        {this.renderButtons()}
      </BottomTabContainer>
    );
  }
}

const SPACE = 40;

const styles = {
  backgroundContainer: {
    paddingTop: 40,
    flex: 1,
    height: '100%',
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  card: {
    width: OS.WIDTH - 48,
    borderRadius: 8,
    backgroundColor: colors.primary_overlay,
    shadowColor: 'transparent',
    paddingTop: 24,
    paddingBottom: 36,
    paddingHorizontal: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 16,
  },
  levelWrap: {
    alignItems: 'center',
  },
  levelOneImg: {
    width: 106,
    height: 114,
    marginBottom: -50,
    zIndex: 1,
  },
  level: {
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    marginBottom: 4,
  },
  levelActive: {
    backgroundColor: '#FFB300',
  },
  levelOne: {
    width: 80,
  },
  levelTwo: {
    width: 80 + SPACE,
  },
  levelThree: {
    width: 80 + SPACE * 2,
  },
  levelFour: {
    width: 80 + SPACE * 3,
  },
  levelFive: {
    width: 80 + SPACE * 4,
  },
  levelSix: {
    width: 80 + SPACE * 5,
  },
  levelSeven: {
    width: 80 + SPACE * 6,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 48,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 15,
    width: (OS.WIDTH - 48 - 8) / 2,
    marginRight: 8,
  },
  buttonBlue: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  buttonWhite: {
    backgroundColor: colors.white,
  },
};

const mapStateToProps = (state) => {
  return {
    user: state.auth.user || {},
    sections: state.exam.sections,
    introExam: state.exam.introExam,
    questions: state.exam.questions,
    score: state.exam.score,
    numberQuestion: Object.keys(state.exam.questions).length,
  };
};
export default connect(mapStateToProps, {
  resetExam,
  showResult,
  setCurrentSection,
  resetPart,
})(ExamResultScreen);
