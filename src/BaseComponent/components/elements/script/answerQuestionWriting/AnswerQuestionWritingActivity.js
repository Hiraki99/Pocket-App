import React from 'react';
import {connect} from 'react-redux';
import {TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {View} from 'react-native-animatable';

import {Text} from '~/BaseComponent';
import activityStyles from '~/BaseComponent/components/elements/script/activityStyles';
import InlineActivityWrapper from '~/BaseComponent/components/elements/script/InlineActivityWrapper';
import {HighLightText} from '~/BaseComponent/components/elements/script/HighLightText';
import {makeAction} from '~/utils/action';
import * as actionTypes from '~/constants/actionTypes';
import {addAction, processUserAnswer} from '~/utils/script';
import {colors} from '~/themes';
import {normalizedAnswer} from '~/utils/utils';
import {translate} from '~/utils/multilanguage';

const Diff = require('diff');

class AnswerQuestionWritingActivity extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      isDone: false,
    };
  }

  componentDidMount() {
    const {activity} = this.props;
    const {delay} = activity.data;

    if (delay && delay !== 0) {
      this.timeout = setTimeout(() => {
        this.setState({
          show: true,
        });
      }, delay);
    } else {
      this.setState({
        show: true,
      });
    }
  }

  componentDidUpdate(prevProps) {
    const {activity} = this.props;
    const {data} = activity;

    if (
      this.props.writingText !== '' &&
      this.props.writingText !== prevProps.writingText &&
      !this.state.isDone &&
      !data.showResult
    ) {
      const action = makeAction(actionTypes.INLINE_SENTENCE, {
        isUser: true,
        content: this.props.writingText,
      });

      addAction(action);
      const listAnswers = data.answer.split('/');
      const isCorrect =
        listAnswers.filter(
          (item) =>
            normalizedAnswer(item) === normalizedAnswer(this.props.writingText),
        ).length > 0;
      processUserAnswer(
        isCorrect,
        data.score,
        false,
        null,
        null,
        this.props.writingText,
      );

      this.setState({
        isDone: true,
      });
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  showModal = () => {
    const {onShowWritingInput, activity} = this.props;

    onShowWritingInput(activity);
  };

  render() {
    const {activity, loadingCompleted} = this.props;
    const {show} = this.state;
    const {data} = activity;
    const {content, delay, showResult, answer, userAnswer} = data;

    if (!show) {
      return null;
    }

    let diff = [];
    if (showResult && userAnswer) {
      diff = Diff.diffWords(answer, userAnswer, {ignoreCase: true});
    }

    return (
      <InlineActivityWrapper delay={delay} loadingCompleted={loadingCompleted}>
        <View
          style={[activityStyles.mainInfo, activityStyles.mainInfoNoPadding]}>
          <View style={activityStyles.contentWrap}>
            <Text primary uppercase bold>
              {translate('Mike')}
            </Text>
            <Text h5 bold>
              {data.title}
            </Text>
            {/*<TranslateText*/}
            {/*  textVI={data.title_vn}*/}
            {/*  textEN={data.title}*/}
            {/*  RenderComponent={(props) => (*/}
            {/*    <Text h5 bold>*/}
            {/*      {props.content}*/}
            {/*    </Text>*/}
            {/*  )}*/}
            {/*/>*/}
            <Text h5>
              <HighLightText content={content} />
            </Text>
            {showResult && (
              <View>
                <Text h5 bold style={{marginTop: 10}}>
                  {translate('Đáp án')}
                </Text>

                <Text h5>
                  {diff.map((item) => {
                    const color = item.added
                      ? colors.danger
                      : item.removed
                      ? colors.success
                      : colors.helpText;

                    return (
                      <>
                        <Text h5 color={color} lineThrough={item.added}>
                          {item.value}
                        </Text>
                        <Text h5> </Text>
                      </>
                    );
                  })}
                </Text>
              </View>
            )}
          </View>

          {!showResult && (
            <TouchableOpacity
              style={activityStyles.embedBtn}
              activeOpacity={0.6}
              onPress={this.showModal}>
              <Text primary h5 center>
                {translate('Viết câu trả lời')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </InlineActivityWrapper>
    );
  }
}

AnswerQuestionWritingActivity.propTypes = {
  activity: PropTypes.object.isRequired,
  loadingCompleted: PropTypes.func,
  onShowWritingInput: PropTypes.func,
  writingText: PropTypes.string,
};

AnswerQuestionWritingActivity.defaultProps = {
  loadingCompleted: () => {},
  onShowWritingInput: () => {},
  writingText: '',
};

export default connect(null, {})(AnswerQuestionWritingActivity);
