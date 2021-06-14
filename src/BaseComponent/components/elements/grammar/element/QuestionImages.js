import React from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
} from 'react-native';
import {connect} from 'react-redux';
import FastImage from 'react-native-fast-image';
import {View as AnimateView} from 'react-native-animatable';
import PropTypes from 'prop-types';

import {RowContainer, Text} from '~/BaseComponent';
import {colors, images} from '~/themes';
import {fetchCourse, changeCurrentCourse} from '~/features/course/CourseAction';
import {OS} from '~/constants/os';
import {playAudio} from '~/utils/utils';
import {LANGUAGE, LANGUAGE_MAPPING} from '~/constants/lang';

class QuestionImages extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      itemSelected: {},
      lang: LANGUAGE.VI,
    };
  }

  changeText = () => {
    this.setState((old) => {
      return {
        lang: old.lang === LANGUAGE.VI ? LANGUAGE.EN : LANGUAGE.VI,
      };
    });
  };

  renderImageQuestionItem = ({item}) => {
    const {onAnswer, showAnswer} = this.props;
    const isSelected = item.key === this.state.itemSelected.key;
    const isCorrect = item.isAnswer;

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.buttonContainer}
        onPress={() => {
          onAnswer(item.isAnswer, item);
          this.setState({itemSelected: item});
          playAudio('selected');
        }}>
        <FastImage source={{uri: item.url}} style={styles.answerImage} />
        {showAnswer && (item.isAnswer || isSelected) && (
          <AnimateView
            animation="fadeInUp"
            useNativeDriver={true}
            easing="ease-in-out"
            style={isCorrect ? styles.resultBgSuccess : styles.resultBgFail}
            duration={300}>
            <ImageBackground
              source={isCorrect ? images.correctBg : images.wrongBg}
              resizeMode="cover"
              style={isCorrect ? styles.resultBgSuccess : styles.resultBgFail}>
              {isCorrect && (
                <Image source={images.checkSuccess} style={styles.checker} />
              )}

              {!isCorrect && (
                <Image source={images.wrong} style={styles.checker} />
              )}
            </ImageBackground>
          </AnimateView>
        )}
      </TouchableOpacity>
    );
  };

  renderImageQuestion = () => {
    const {data} = this.props;

    return (
      <FlatList
        data={data.answers || []}
        keyExtractor={(item, index) => `${item.key}_${index}`}
        renderItem={this.renderImageQuestionItem}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        style={styles.answer}
      />
    );
  };

  render = () => {
    return (
      <View style={styles.result}>
        <RowContainer paddingTop={32}>
          <Text center bold fontSize={19}>
            {this.state.lang === LANGUAGE.VI
              ? this.props.questionContent
              : this.props.translateQuestionContent}
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.translateWrap}
            onPress={this.changeText}>
            <Image source={images.translate} style={styles.translate} />
          </TouchableOpacity>
        </RowContainer>
        {this.renderImageQuestion()}
      </View>
    );
  };
}

const styles = StyleSheet.create({
  result: {
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    height: OS.Game,
    width: '100%',
    backgroundColor: colors.white,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  resultBgSuccess: {
    backgroundColor: colors.successChoice,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    left: 0,
    width: 40,
    height: 40,
  },
  resultBgFail: {
    backgroundColor: colors.heartActive,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    left: 0,
    width: 30,
    height: 40,
  },
  answer: {
    marginTop: 30,
    backgroundColor: 'transparent',
  },
  buttonContainer: {
    marginBottom: 8,
    borderRadius: 8,
    marginLeft: 8,
    overflow: 'hidden',
  },
  answerImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  checker: {width: 20, height: 20},
  translateWrap: {
    alignSelf: 'center',
    paddingHorizontal: 8,
  },
  translate: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
});

QuestionImages.propTypes = {
  data: PropTypes.object,
  onAnswer: PropTypes.func,
  questionContent: PropTypes.string,
  translateQuestionContent: PropTypes.string,
  image: PropTypes.bool,
  showAnswer: PropTypes.bool,
};

QuestionImages.defaultProps = {
  data: {},
  onAnswer: () => {},
  image: false,
  questionContent: LANGUAGE_MAPPING.vi.choose_the_correct_picture,
  translateQuestionContent: LANGUAGE_MAPPING.en.choose_the_correct_picture,
  showAnswer: false,
};

const mapStateToProps = (state) => {
  return {
    courses: state.course.courses,
    currentCourse: state.course.currentCourse,
    loading: state.course.loading,
    errorMessage: state.course.errorMessage,
    user: state.auth.user,
  };
};

export default connect(mapStateToProps, {fetchCourse, changeCurrentCourse})(
  QuestionImages,
);
