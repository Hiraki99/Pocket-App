import React from 'react';
import {connect} from 'react-redux';

import {
  RowContainer,
  BlankHeader,
  FilterButton,
  SeparatorVertical,
  BottomTabContainer,
} from '~/BaseComponent';
import {colors} from '~/themes';
import LessonContainer from '~/features/lessons/container/LessonContainer';
import LessonPrimaryContainer from '~/features/lessons/container/LessonPrimaryContainer';
import {BUTTON_STUDENT, BUTTON_STUDENT_PRIMARY} from '~/constants/student';
import navigator from '~/navigation/customNavigator';
import CourseIndexContainer from '~/features/course/container/CourseIndexContainer';

const getButtons = (isVip, course_primary) => {
  if (course_primary) {
    return BUTTON_STUDENT_PRIMARY;
  }
  return isVip
    ? BUTTON_STUDENT
    : BUTTON_STUDENT.filter(
        (item) => item.toLowerCase().trim() !== 'luyện nói',
      );
};

class StudyScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected:
        props.currentCourse.layout !== 'high_school'
          ? BUTTON_STUDENT_PRIMARY[0]
          : BUTTON_STUDENT[0],
      buttons: getButtons(
        props.user.is_vip,
        props.currentCourse.layout !== 'high_school',
      ),
    };
  }

  componentDidMount() {
    const {navigation} = this.props;
    navigation.addListener('focus', () => {
      const params = navigator.getParam('selected', null);
      if (params) {
        this.setSelected(params);
      }
    });
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.user.is_vip !== nextProps.user.is_vip) {
      const buttons = getButtons(nextProps.user.is_vip);
      this.setSelected({buttons});
    }
    if (
      nextProps.currentCourse &&
      JSON.stringify(this.props.currentCourse) !==
        JSON.stringify(nextProps.currentCourse)
    ) {
      this.setState({
        selected:
          nextProps.currentCourse.layout !== 'high_school'
            ? BUTTON_STUDENT_PRIMARY[0]
            : BUTTON_STUDENT[0],
        buttons: getButtons(
          nextProps.user.is_vip,
          nextProps.currentCourse.layout !== 'high_school',
        ),
      });
    }
    return true;
  }

  setSelected = (value) => {
    this.setState({selected: value});
  };

  render() {
    const {selected, buttons} = this.state;

    return (
      <BottomTabContainer backgroundColor={colors.mainBgColor}>
        <BlankHeader color={colors.mainBgColor} dark />
        <SeparatorVertical lg />
        <RowContainer paddingHorizontal={24}>
          <FilterButton
            buttons={buttons}
            selected={selected}
            onSelected={this.setSelected}
          />
        </RowContainer>
        {selected === BUTTON_STUDENT_PRIMARY[0] && <LessonPrimaryContainer />}
        {selected === BUTTON_STUDENT_PRIMARY[1] && (
          <LessonPrimaryContainer isExam />
        )}
        {selected === BUTTON_STUDENT[0] && <LessonContainer />}
        {selected === BUTTON_STUDENT[1] && <LessonContainer isExam />}
        {selected === BUTTON_STUDENT[2] && this.props.user.is_vip && (
          <CourseIndexContainer />
        )}
      </BottomTabContainer>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.auth.user || {},
    currentCourse: state.course.currentCourse || {},
  };
};
export default connect(mapStateToProps)(StudyScreen);
