import React from 'react';
import {connect} from 'react-redux';
import Carousel from 'react-native-snap-carousel';
import shuffle from 'lodash/shuffle';

import VocabularyMatchWordDefinitionItem from '~/BaseComponent/components/elements/vocabulary/VocabularyMatchWordDefinitionItem';
import ScriptWrapper from '~/BaseComponent/components/elements/script/ScriptWrapper';
import {FlexContainer} from '~/BaseComponent/components/base/CommonContainer';
import {changeCurrentCourse, fetchCourse} from '~/features/course/CourseAction';
import {incrementQuestion} from '~/features/activity/ActivityAction';
import {OS} from '~/constants/os';
import navigator from '~/navigation/customNavigator';
import {genOtherAnswer, makeid} from '~/utils/utils';
import {colors} from '~/themes';

class VocabularyMatchWordsWithDefinitionContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      star: 0,
      activeSlide: 0,
      loading: false,
      data: this.initData(this.genData(props.words)),
    };
  }
  componentDidMount(): void {
    setTimeout(() => {
      this.setState({loading: true});
    }, 100);
  }

  updateStar = (value) => {
    const {star} = this.state;
    this.setState({star: star + value});
  };

  shouldComponentUpdate(nextProps) {
    if (
      this.props.words.length !== nextProps.words.length ||
      this.props.errorGame !== nextProps.errorGame
    ) {
      const data = this.initData(this.genData(nextProps.words));
      this.setState({data});
    }
    return true;
  }

  initData = (data) => {
    return shuffle(data);
  };

  addIncorrectAnswer = (item) => {
    const {data} = this.state;
    this.setState({
      data: [...data, item],
    });
  };

  genData = (data) => {
    let result = [];
    const lengthVocabulary = data.length;
    const arrayIndex = Array.from(Array(lengthVocabulary).keys());
    for (let i = 0; i < lengthVocabulary; i++) {
      const dataItem = [];
      const listOtherKey = arrayIndex.filter((item) => item !== i);
      dataItem.push({
        text: data[i].name,
        isAnswer: true,
        id: makeid(15),
      });
      const listKeyOtherAnswer = genOtherAnswer(
        listOtherKey,
        listOtherKey.length,
        2,
      );
      listKeyOtherAnswer.forEach((iter) => {
        dataItem.push({
          text: data[iter].name,
          isAnswer: false,
          id: makeid(15),
        });
      });
      result.push({
        question: data[i].definition,
        answers: shuffle(dataItem),
      });
    }

    this.props.incrementQuestion(result.length);
    return result;
  };

  nextQuestion = () => {
    this.carouselQuestion.snapToNext();
    if (this.state.activeSlide === this.state.data.length - 1) {
      navigator.navigate('GameAchievement', {
        countSuccess: this.state.star,
        countAllItems: this.state.data.length,
        starIncrease: this.state.star,
      });
    }
  };

  renderQuestionItem = ({item}) => {
    return (
      <VocabularyMatchWordDefinitionItem
        item={item}
        onNext={this.nextQuestion}
        updateStar={this.updateStar}
        addIncorrectAnswer={this.addIncorrectAnswer}
      />
    );
  };

  renderQuestion = () => {
    return (
      <Carousel
        ref={(c) => {
          this.carouselQuestion = c;
        }}
        onSnapToItem={(index) => this.setState({activeSlide: index})}
        data={this.state.data}
        extraData={this.state.activeSlide}
        renderItem={this.renderQuestionItem}
        sliderWidth={OS.WIDTH}
        itemWidth={OS.WIDTH}
        firstItem={0}
        inactiveSlideScale={0.9}
        inactiveSlideOpacity={0.7}
        scrollEnabled={false}
        containerCustomStyle={{zIndex: 5}}
        loop={false}
      />
    );
  };

  render() {
    return (
      <ScriptWrapper showProgress={false}>
        {this.state.loading && (
          <FlexContainer backgroundColor={colors.mainBgColor}>
            {this.renderQuestion()}
          </FlexContainer>
        )}
      </ScriptWrapper>
    );
  }
}

const mapStateToProps = (state) => {
  let words = state.vocabulary.wordGroup || [];
  return {
    words: shuffle(words),
    score: state.auth.user.score || 0,
  };
};

export default connect(mapStateToProps, {
  fetchCourse,
  changeCurrentCourse,
  incrementQuestion,
})(VocabularyMatchWordsWithDefinitionContainer);
