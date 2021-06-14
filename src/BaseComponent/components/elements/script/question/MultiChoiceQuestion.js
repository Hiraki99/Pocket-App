import React from 'react';
import {TouchableOpacity, ScrollView} from 'react-native';
import RadioForm from 'react-native-simple-radio-button';
import PropTypes from 'prop-types';
import CheckBox from 'react-native-check-box';
import isEqual from 'lodash/isEqual';

import activityStyles from '~/BaseComponent/components/elements/script/activityStyles';
import {BottomWrapper, Button, FlexContainer, Text} from '~/BaseComponent';
import {dispatchAnswerQuestion} from '~/utils/script';
import {colors} from '~/themes';
import {playAudio} from '~/utils/utils';
import {translate} from '~/utils/multilanguage';

export default class MultiChoiceQuestion extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      checkedArr: [],
      isDone: false,
    };
  }

  checkResult = () => {
    const {needCheckAll} = this.props;

    if (!needCheckAll) {
      this.setState({
        isDone: true,
      });
    }
  };

  toggleItem = (item, index) => {
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
    playAudio('selected');
  };

  next = () => {
    const {onDone, needCheckAll, item} = this.props;
    const {checkedArr} = this.state;

    if (!needCheckAll) {
      const correctAnswer = [];

      item.answers.forEach((o, index) => {
        if (o.isAnswer) {
          correctAnswer.push(index);
        }
      });

      const isCorrect = isEqual(correctAnswer.sort(), checkedArr.sort());

      dispatchAnswerQuestion(isCorrect, item.score);
    }

    onDone();
  };

  render() {
    const {index, length, item, showResult, needCheckAll} = this.props;
    const {checkedArr, isDone} = this.state;

    return (
      <>
        <ScrollView
          style={{marginBottom: 24, paddingHorizontal: 24, paddingTop: 24}}>
          <Text bold h5>
            {translate('Câu %s %s', {s1: `${index + 1}`, s2: `${length}`})}
          </Text>
          <Text h5 style={{marginBottom: 10}}>
            {item.question}
          </Text>

          <RadioForm formHorizontal={false} animation={true}>
            {item.answers.map((o, i) => {
              const checkedIndex = checkedArr.findIndex((o) => o === i);

              return (
                <TouchableOpacity
                  activeOpacity={0.65}
                  style={[
                    activityStyles.inlineActionItem,
                    activityStyles.inlineActionItemLast,
                    {
                      flexDirection: 'row',
                    },
                  ]}
                  key={o.key}
                  onPress={() => {
                    if (isDone || showResult) {
                      return;
                    }

                    this.toggleItem(o, i);
                  }}>
                  <CheckBox
                    checkBoxColor={
                      (isDone || showResult) && o.isAnswer
                        ? colors.success
                        : colors.primary
                    }
                    style={{marginRight: 10, marignTop: 2}}
                    onClick={() => {}}
                    isChecked={
                      checkedIndex !== -1 ||
                      ((isDone || showResult) && o.isAnswer)
                    }
                  />
                  <FlexContainer marginHorizontal={24}>
                    <Text
                      h5
                      lineThrough={
                        checkedIndex !== -1 &&
                        (isDone || showResult) &&
                        !o.isAnswer
                      }
                      primary={checkedIndex !== -1}
                      success={(isDone || showResult) && o.isAnswer}>
                      {o.text}
                    </Text>
                  </FlexContainer>
                  <Text />
                </TouchableOpacity>
              );
            })}
          </RadioForm>
        </ScrollView>

        {!needCheckAll && !isDone && (
          <BottomWrapper paddingHorizontal={24}>
            <Button
              disabled={checkedArr.length === 0}
              large
              primary
              rounded
              block
              uppercase
              bold
              icon
              onPress={this.checkResult}>
              {translate('Kiểm tra')}
            </Button>
          </BottomWrapper>
        )}

        {!needCheckAll && isDone && (
          <BottomWrapper paddingHorizontal={24}>
            <Button
              large
              primary
              rounded
              block
              uppercase
              bold
              icon
              onPress={this.next}>
              {translate('Tiếp tục')}
            </Button>
          </BottomWrapper>
        )}
      </>
    );
  }
}

MultiChoiceQuestion.propTypes = {
  index: PropTypes.number,
  length: PropTypes.number,
  item: PropTypes.object.isRequired,
  showResult: PropTypes.bool,
  onChooseAnswer: PropTypes.func,
  onDone: PropTypes.func,
  needCheckAll: PropTypes.bool,
};

MultiChoiceQuestion.defaultProps = {
  index: 0,
  length: 1,
  showResult: false,
  onChooseAnswer: () => {},
  needCheckAll: false,
  onDone: () => {},
};
