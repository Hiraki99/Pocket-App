import React from 'react';
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {Button, RowContainer, Text} from '../../..';

import {colors, images} from '~/themes';
import {fetchCourse, changeCurrentCourse} from '~/features/course/CourseAction';
import {OS} from '~/constants/os';
import {LANGUAGE} from '~/constants/lang';

class Question extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      lang: LANGUAGE.EN,
    };
  }

  changeText = () => {
    this.setState((old) => {
      return {
        lang: old.lang === LANGUAGE.VI ? LANGUAGE.EN : LANGUAGE.VI,
      };
    });
  };

  renderItem = ({item}) => {
    const {onAnswer} = this.props;
    return (
      <View style={[styles.buttonContainer]}>
        <Button
          shadow={false}
          rounded
          outline
          uppercase
          primary
          bold
          style={{paddingVertical: 3.15}}
          onPress={() => {
            onAnswer(item.isAnswer);
          }}>
          {item.text}
        </Button>
      </View>
    );
  };
  renderOptions = () => {
    const {data} = this.props;
    return (
      <View style={styles.answer}>
        <FlatList
          keyExtractor={(item) => `${item.key || item.id}`}
          data={data.answers || []}
          renderItem={this.renderItem}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  };

  render = () => {
    const {autoHeight} = this.props;
    return (
      <View
        style={[styles.container, autoHeight ? {height: 'auto'} : {}]}
        {...this.props}>
        <RowContainer>
          <Text center bold fontSize={19}>
            {this.state.lang === LANGUAGE.VI
              ? this.props.translateTitle
              : this.props.title}
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.translateWrap}
            onPress={this.changeText}>
            <Image source={images.translate} style={styles.translate} />
          </TouchableOpacity>
        </RowContainer>
        <View style={[styles.result]}>{this.renderOptions()}</View>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    height: OS.Game,
    width: '100%',
    backgroundColor: colors.white,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
    zIndex: 10,
  },
  result: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    width: '100%',
    backgroundColor: colors.white,
    paddingBottom: 32,
    zIndex: 10,
  },
  answer: {
    marginTop: 24,
  },
  buttonContainer: {
    marginBottom: 8,
  },
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

Question.propTypes = {
  data: PropTypes.object,
  onAnswer: PropTypes.func,
  title: PropTypes.string,
  translateTitle: PropTypes.string,
  autoHeight: PropTypes.bool,
};

Question.defaultProps = {
  data: {},
  onAnswer: () => {},
  title: 'What is the picture about?',
  translateTitle: 'Bức tranh nói về cái gì?',
  autoHeight: false,
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
  Question,
);
