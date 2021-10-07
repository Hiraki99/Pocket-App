import React from 'react';
import {View, FlatList} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/Foundation';
import Sound from 'react-native-sound';

import {
  Button,
  CommonAlert,
  FlexContainer,
  CommonHeader,
  ActivityItem,
  SpeakActivityItem,
} from '~/BaseComponent';
import {
  fetchActivity,
  fetchActivityPracticeSpeak,
  changeCurrentActivity,
  setScreenActivity,
} from '~/features/activity/ActivityAction';
import {colors} from '~/themes';
import navigator from '~/navigation/customNavigator';
import {
  changeCurrentScriptItem,
  resetAction,
} from '~/features/script/ScriptAction';
import {translate} from '~/utils/multilanguage';

class LessonPracticeSpeakDetailScreen extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      showAlert: false,
      message: translate('Phần này chưa có bài tập rồi, bạn quay lại sau nhé!'),
    };
  }

  componentDidMount() {
    Sound.enableInSilenceMode(true);
    Sound.setCategory('Playback');
    this.loadActivities();
    this.props.setScreenActivity('LessonPracticeSpeakDetail');
    const audio = require('~/assets/media/Complete-Activity.wav');
    this.sound = new Sound(audio, () => {});
  }

  componentDidUpdate(prevProps) {
    const {currentPart} = this.props;
    if (
      (!prevProps.currentPart && currentPart) ||
      (currentPart &&
        prevProps.currentPart &&
        prevProps.currentPart._id !== currentPart._id)
    ) {
      this.loadActivities();
    }
  }

  playAudioSuccess = () => {
    if (this.sound) {
      this.sound.play();
    }
  };

  loadActivities = () => {
    const {currentPart} = this.props;
    this.props.fetchActivityPracticeSpeak({
      part_id: currentPart._id,
    });
  };

  navigateToScript = (item) => {
    const {
      changeCurrentActivity,
      changeCurrentScriptItem,
      resetAction,
    } = this.props;

    changeCurrentActivity(item);
    changeCurrentScriptItem(null);
    resetAction();

    const {script} = item;

    if (script && script.length > 0) {
      if (!item.enabled) {
        this.setState({
          showAlert: true,
          message: translate(
            'Bạn vui lòng hoàn thành các bài tập trước đã nhé!',
          ),
        });
      } else {
        navigator.navigate('MainScript');
      }
    } else {
      this.setState({
        showAlert: true,
        message: translate(
          'Phần này chưa có bài tập rồi, bạn quay lại sau nhé!',
        ),
      });
    }
  };

  renderItem = ({item}) => {
    return (
      <ActivityItem
        item={item}
        playAudioSuccess={this.playAudioSuccess}
        onSelected={this.navigateToScript}
      />
    );
  };

  renderAlert = () => {
    return (
      <CommonAlert
        theme="danger"
        show={this.state.showAlert}
        title={translate('Ôi không!')}
        subtitle={this.state.message}
        headerIconComponent={<Icon name="alert" color="#fff" size={30} />}
        onRequestClose={() => {}}
        cancellable={false}>
        <Button
          rounded
          large
          danger
          onPress={() => this.setState({showAlert: false})}>
          {translate('Quay lại')}
        </Button>
      </CommonAlert>
    );
  };

  renderHeaderFlatList = () => {
    const {currentPart} = this.props;

    return (
      <View style={{paddingVertical: 24}}>
        <SpeakActivityItem item={currentPart} onChange={() => {}} />
      </View>
    );
  };

  renderListFooterComponent = () => {
    return <View style={{height: 48}} />;
  };
  render() {
    const {activities, lessonIndex} = this.props;
    let displayIndex =
      lessonIndex + 1 < 10 ? '0' + (lessonIndex + 1) : lessonIndex + 1;

    return (
      <>
        <CommonHeader themeWhite title={`Unit ${displayIndex}`.toUpperCase()} />
        <FlexContainer style={{backgroundColor: colors.mainBgColor}}>
          {this.renderAlert()}
          <FlatList
            ListHeaderComponent={this.renderHeaderFlatList}
            ListFooterComponent={this.renderListFooterComponent}
            data={activities}
            renderItem={this.renderItem}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            initialNumToRender={3}
          />
        </FlexContainer>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentPart: state.part.currentPart,
    parts: state.part.parts,
    partsVip: state.part.partsVip,
    currentLessonPracticeSpeak: state.lesson.currentLessonPracticeSpeak,
    activities: state.activity.activities,
    loading: state.activity.loading,
    errorMessage: state.activity.errorMessage,
    lessonIndex: state.part.partsVip.findIndex(
      (item) => item._id === state.part.currentPart._id,
    ),
  };
};

export default connect(mapStateToProps, {
  fetchActivityPracticeSpeak,
  fetchActivity,
  changeCurrentActivity,
  changeCurrentScriptItem,
  resetAction,
  setScreenActivity,
})(LessonPracticeSpeakDetailScreen);
