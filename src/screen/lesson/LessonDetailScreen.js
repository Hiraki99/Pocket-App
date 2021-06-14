import React from 'react';
import {connect} from 'react-redux';

import {BlankHeader, BottomTabContainer, PartTimeline} from '~/BaseComponent';
import {customNavigationOptions} from '~/navigation/navigationHelper';
import {fetchPart, changeCurrentPart} from '~/features/part/PartAction';
import {colors} from '~/themes';
import navigator from '~/navigation/customNavigator';

class LessonDetailScreen extends React.PureComponent {
  static navigationOptions = customNavigationOptions;

  constructor(props) {
    super(props);

    this.state = {
      activeIndex: 0,
    };
  }

  componentDidMount() {
    this.loadParts();
  }

  loadParts = () => {
    const {fetchPart, currentLesson} = this.props;

    fetchPart({
      start: 0,
      length: -1,
      lesson_id: currentLesson._id,
    });
  };

  changePart = (part) => {
    this.props.changeCurrentPart(part);
    navigator.navigate('Activity');
  };

  render() {
    const {currentLesson, parts} = this.props;

    return (
      <>
        <BottomTabContainer backgroundColor={colors.mainBgColor}>
          <PartTimeline
            data={parts}
            onChangePart={this.changePart}
            currentLesson={currentLesson || {}}
            loading={this.props.loading}
          />
        </BottomTabContainer>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentLesson: state.lesson.currentLesson,
    parts: state.part.parts,
    loading: state.part.loading,
    errorMessage: state.part.errorMessage,
  };
};

export default connect(mapStateToProps, {fetchPart, changeCurrentPart})(
  LessonDetailScreen,
);
