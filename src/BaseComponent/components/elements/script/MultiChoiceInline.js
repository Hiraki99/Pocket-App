import React from 'react';
import {connect} from 'react-redux';
import {TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {View} from 'react-native-animatable';
import CheckBox from 'react-native-check-box';
import isEqual from 'lodash/isEqual';

import activityStyles from '~/BaseComponent/components/elements/script/activityStyles';
import {FlexContainer, Text, TranslateText} from '~/BaseComponent';
import InlineActivityWrapper from '~/BaseComponent/components/elements/script/InlineActivityWrapper';
import InlineAttachment from '~/BaseComponent/components/elements/script/attachment/InlineAttachment';
import {HighLightText} from '~/BaseComponent/components/elements/script/HighLightText';
import {playAudio} from '~/utils/utils';
import * as actionTypes from '~/constants/actionTypes';
import {makeAction} from '~/utils/action';
import {addAction, processUserAnswer} from '~/utils/script';
import {colors} from '~/themes';

class MultiChoiceInline extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isDone: false,
      checkedArr: [],
    };

    this.renderOptions = this.renderOptions.bind(this);
    this.showAnswer = this.showAnswer.bind(this);
  }

  componentWillUnmount(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  toggleItem(item, index) {
    if (!this.state.isDone) {
      let selectedIndex = this.state.checkedArr.findIndex((o) => o === index);
      if (selectedIndex !== -1) {
        let arr = [...this.state.checkedArr];
        arr.splice(selectedIndex, 1);

        this.setState({
          checkedArr: arr,
        });
      } else {
        this.setState({
          checkedArr: [...this.state.checkedArr, index],
        });
      }
    }
  }

  selectChoice = (showResult, item, index) => {
    if (showResult) {
      return;
    }

    this.toggleItem(item, index);
    playAudio('selected');
  };

  renderOptions() {
    const {activity} = this.props;
    const {data} = activity;
    const {showResult} = data;

    return data.options.map((item, index) => {
      const selectedIndex = this.state.checkedArr.findIndex((o) => o === index);

      return (
        <TouchableOpacity
          activeOpacity={0.65}
          style={[
            activityStyles.inlineActionItem,
            {
              flexDirection: 'row',
            },
            index === data.options.length - 1
              ? activityStyles.inlineActionItemLast
              : null,
          ]}
          key={item.key}
          onPress={() => this.selectChoice(showResult, item, index)}>
          <CheckBox
            checkBoxColor={
              showResult && item.isAnswer ? colors.success : colors.primary
            }
            style={{marginLeft: 16, marginTop: 2}}
            onClick={() => this.selectChoice(showResult, item, index)}
            isChecked={showResult ? item.isAnswer : selectedIndex !== -1}
          />
          <FlexContainer paddingHorizontal={16}>
            <Text
              h5
              primary={!showResult}
              success={showResult && item.isAnswer}>
              {item.text}
            </Text>
          </FlexContainer>
          <Text />
        </TouchableOpacity>
      );
    });
  }

  showAnswer() {
    playAudio('messageSent');
    if (!this.state.isDone) {
      this.setState({
        isDone: true,
      });

      const {activity} = this.props;
      const {data} = activity;
      const {options, score} = data;
      const correctAnswer = [];

      options.forEach((item, index) => {
        if (item.isAnswer) {
          correctAnswer.push(index);
        }
      });

      const isCorrect = isEqual(
        correctAnswer.sort(),
        this.state.checkedArr.sort(),
      );

      // todo show answer
      const userAnswers = options.filter((item, index) => {
        return this.state.checkedArr.includes(index);
      });

      userAnswers.forEach((item) => {
        const action = makeAction(actionTypes.INLINE_SENTENCE, {
          isUser: true,
          content: item.text,
        });

        addAction(action);
      });
      // todo check answer and feedback
      processUserAnswer(isCorrect, score, true, () => {
        const action = makeAction(actionTypes.MULTI_CHOICE_INLINE, data);

        this.timeout = setTimeout(() => {
          addAction(action);
        }, 2500);
      });
    }
  }

  render() {
    const {activity, loadingCompleted} = this.props;
    const {data} = activity;
    const {showResult} = data;

    return (
      <InlineActivityWrapper loadingCompleted={loadingCompleted}>
        <View
          style={[activityStyles.mainInfo, activityStyles.mainInfoNoPadding]}>
          <View style={activityStyles.contentWrap}>
            <Text primary uppercase bold>
              Mike
            </Text>

            <InlineAttachment
              attachment={data.attachment}
              darker
              autoPlay={false}
            />
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
              <HighLightText content={data.content} />
            </Text>
          </View>

          <View style={activityStyles.inlineActionWrap}>
            {this.renderOptions()}

            {!showResult && (
              <TouchableOpacity
                onPress={() => this.showAnswer()}
                activeOpacity={0.65}
                style={{
                  backgroundColor: colors.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 10,
                }}>
                <Text h5 center uppercase color={colors.white}>
                  OK
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </InlineActivityWrapper>
    );
  }
}

MultiChoiceInline.propTypes = {
  activity: PropTypes.object.isRequired,
  loadingCompleted: PropTypes.func,
};

MultiChoiceInline.defaultProps = {
  loadingCompleted: () => {},
};

export default connect(null, {})(MultiChoiceInline);
