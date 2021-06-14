import React from 'react';
import {StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import Carousel, {Pagination} from 'react-native-snap-carousel';

import {FlexContainer} from '~/BaseComponent/components/base/CommonContainer';
import CommonMatchExpressionWithPicturesTextItem from '~/BaseComponent/components/elements/grammar/element/CommonMatchExpressionWithPicturesTextItem';
import CommonMatchExpressionWithQuestionAnswerItem from '~/BaseComponent/components/elements/grammar/element/CommonMatchExpressionWithQuestionAnswerItem';
import ScriptWrapper from '~/BaseComponent/components/elements/script/ScriptWrapper';
import {fetchCourse, changeCurrentCourse} from '~/features/course/CourseAction';
import {OS} from '~/constants/os';
import navigator from '~/navigation/customNavigator';
import {colors} from '~/themes';

class CommonMatchExpressionWithPicturesContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      star: 0,
      activeSlide: 0,
      loading: false,
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

  renderQuestionTextItem = ({item}) => {
    return (
      <CommonMatchExpressionWithPicturesTextItem
        item={item}
        onNext={this.nextQuestion}
      />
    );
  };

  pagination = () => {
    const {item} = this.props;

    return (
      <Pagination
        dotsLength={item.length > 5 ? 5 : item.length}
        activeDotIndex={
          item.length > 5 ? this.state.activeSlide % 5 : this.state.activeSlide
        }
        containerStyle={{
          width: 10,
        }}
        dotContainerStyle={{
          paddingTop: 0,
          height: 12,
          justifyContent: 'center',
        }}
        dotStyle={{
          width: 12,
          height: 6,
          borderRadius: 3,
          backgroundColor: 'rgba(74,80,241, 0.75)',
        }}
        inactiveDotStyle={{
          width: 6,
          height: 6,
          borderRadius: 3,
        }}
        inactiveDotOpacity={0.3}
        inactiveDotScale={0.8}
      />
    );
  };

  nextQuestion = () => {
    this.carouselAnswer.snapToNext();
    this.carouselQuestion.snapToNext();
    if (this.state.activeSlide === this.props.item.length - 1) {
      navigator.navigate('GameAchievement', {
        countSuccess: this.state.star,
        countAllItems: this.props.item.length,
        starIncrease: this.state.star,
      });
    }
  };

  renderQuestionText = () => {
    const {item} = this.props;
    return (
      <>
        <Carousel
          ref={(c) => {
            this.carouselQuestion = c;
          }}
          onSnapToItem={(index) => this.setState({activeSlide: index})}
          data={item}
          extraData={this.state.activeSlide}
          renderItem={this.renderQuestionTextItem}
          sliderWidth={OS.WIDTH}
          itemWidth={OS.WIDTH - 60}
          firstItem={0}
          inactiveSlideScale={0.9}
          inactiveSlideOpacity={0.7}
          scrollEnabled={false}
          containerCustomStyle={{zIndex: 4}}
          loop={false}
        />
        {this.pagination()}
      </>
    );
  };

  renderQuestionItem = ({item, index}) => {
    return (
      <CommonMatchExpressionWithQuestionAnswerItem
        item={item}
        onNext={this.nextQuestion}
        updateStar={this.updateStar}
      />
    );
  };

  renderAnswer = () => {
    const {item} = this.props;
    return (
      <Carousel
        ref={(c) => {
          this.carouselAnswer = c;
        }}
        onSnapToItem={(index) => this.setState({activeSlide: index})}
        data={item}
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
      <ScriptWrapper>
        {this.state.loading && (
          <FlexContainer backgroundColor={colors.mainBgColor}>
            <View
              alignItems="center"
              justifyContent="center"
              backgroundColor="transparent"
              style={styles.container}>
              {this.renderQuestionText()}
            </View>
            <FlexContainer style={styles.questionContainer}>
              {this.renderAnswer()}
            </FlexContainer>
          </FlexContainer>
        )}
      </ScriptWrapper>
    );
  }
}

const mapStateToProps = (state) => {
  const answer =
    state.script.currentScriptItem && state.script.currentScriptItem.items
      ? state.script.currentScriptItem.items
      : [];
  return {
    item: answer,
    score: state.auth.user.score || 0,
    time:
      state.script.currentScriptItem && state.script.currentScriptItem.time
        ? state.script.currentScriptItem.time
        : 0,
  };
};

const styles = StyleSheet.create({
  wave: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    position: 'absolute',
    bottom: OS.Game - 24,
    zIndex: 3,
  },
  container: {
    paddingHorizontal: 0,
    paddingTop: 64,
  },
  control: {
    borderRadius: 16,
    position: 'absolute',
    zIndex: 5,
    top: 16,
    width: 300,
  },
  controlContainer: {
    width: 300,
    zIndex: 2,
    position: 'absolute',
  },
  icon: {paddingHorizontal: 4},
  answerImgContainer: {
    overflow: 'hidden',
    top: 0,
    height: (OS.HEIGHT * 60) / 100,
    width: '100%',
    position: 'absolute',
    zIndex: 1,
  },
  responseContainer: {
    position: 'absolute',
    zIndex: 5,
    width: '100%',
    top: 0,
    height: OS.GameImageWater,
    backgroundColor: ' rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeOutContainer: {
    position: 'absolute',
    zIndex: 1001,
    width: '100%',
    top: 0,
    height: '100%',
    backgroundColor: ' rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconVote: {
    width: 26,
    height: 24,
  },
  iconTimeout: {
    width: 56,
    height: 56,
  },
  questionContainer: {
    position: 'absolute',
    bottom: 0,
    height: OS.Game + 60,
  },
});
export default connect(mapStateToProps, {fetchCourse, changeCurrentCourse})(
  CommonMatchExpressionWithPicturesContainer,
);
