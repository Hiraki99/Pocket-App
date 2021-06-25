import React from 'react';
import {View, FlatList} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/Foundation';
import Sound from 'react-native-sound';

import {
  FlexContainer,
  CommonHeader,
  Button,
  CommonAlert,
  Loading,
  Text,
  SeparatorVertical,
} from '~/BaseComponent';
import ActivityItem from '~/BaseComponent/components/elements/script/ActivityItem';
import ActivityLevelModal from '~/BaseComponent/components/elements/activity/ActivityLevelModal';
import {
  fetchActivity,
  changeCurrentActivity,
  setScreenActivity,
} from '~/features/activity/ActivityAction';
import {colors} from '~/themes';
import navigator from '~/navigation/customNavigator';
import {
  changeCurrentScriptItem,
  resetAction,
} from '~/features/script/ScriptAction';
import {generateNextActivity} from '~/utils/script';
import {HARD_LEVEL} from '~/constants/threshold';
import {translate} from '~/utils/multilanguage';

class ActivityScreen extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      showAlert: false,
      message: translate('Phần này chưa có bài tập rồi, bạn quay lại sau nhé!'),
      selectedItem: null,
    };
  }

  componentDidMount() {
    Sound.enableInSilenceMode(true);
    Sound.setCategory('Playback');
    this.loadActivities();
    this.props.setScreenActivity('Activity');
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
    this.props.fetchActivity({
      start: 0,
      length: -1,
      part_id: currentPart._id,
      with_status: true,
    });
  };

  setSelectedItem = (item) => {
    this.setState({itemSelected: item});
    if (item.word_group_level === HARD_LEVEL.BAD) {
      this.acticityLevelRef.showModal();
    } else {
      this.navigateToScript(item);
    }
  };

  navigateToScript = (item) => {
    this.props.changeCurrentActivity(item);
    this.props.changeCurrentScriptItem(null);
    this.props.resetAction();

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
        if (
          script[0].type === 'summary review' ||
          script[0].type === 'summary_vocabulary'
        ) {
          generateNextActivity();
        } else {
          navigator.navigate('MainScript');
        }
      }
    } else {
      this.setState({
        showAlert: true,
        message: translate(
          'Phần này chưa có bài tập rồi, bạn quay lại sau nhé!',
        ),
      });
    }
    this.acticityLevelRef.closeModal();
  };

  renderItem = ({item}) => {
    return (
      <ActivityItem
        item={item}
        playAudioSuccess={this.playAudioSuccess}
        onSelected={this.setSelectedItem}
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
    const {currentPart, loading} = this.props;

    return (
      <>
        <View style={styles.partInfo}>
          <Text h4 bold style={{paddingBottom: 8}}>
            {currentPart.name}
          </Text>
          <Text color={colors.helpText2}>{currentPart.display_name}</Text>
        </View>
        {loading && (
          <FlexContainer
            style={{justifyContent: 'center', alignItems: 'center'}}>
            <Loading />
          </FlexContainer>
        )}
      </>
    );
  };

  render() {
    const {activities, lessonIndex} = this.props;
    let displayIndex =
      lessonIndex + 1 < 10 ? '0' + (lessonIndex + 1) : lessonIndex + 1;

    return (
      <FlexContainer backgroundColor={colors.backgroundActivity}>
        <CommonHeader
          themeWhite
          title={`${translate('Unit %s', {s1: displayIndex})}`.toUpperCase()}
          border
          uppercase={false}
        />
        {this.renderAlert()}
        <FlatList
          ListHeaderComponent={this.renderHeaderFlatList}
          ListFooterComponent={() => <View style={{height: 48}} />}
          ItemSeparatorComponent={() => <SeparatorVertical height={12} />}
          data={activities}
          renderItem={this.renderItem}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          style={{zIndex: 10}}
          initialNumToRender={3}
        />
        <ActivityLevelModal
          ref={(refs) => (this.acticityLevelRef = refs)}
          data={this.state.itemSelected}
          action={this.navigateToScript}
        />
      </FlexContainer>
    );
  }
}

const styles = {
  partInfo: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 32,
  },
  partName: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    width: 58,
    height: 58,
    shadowColor: '#5468FF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 8,
    borderRadius: 15,
    marginBottom: 24,
  },
};

const mapStateToProps = (state) => {
  return {
    currentPart: state.part.currentPart || {},
    parts: state.part.parts,
    activities: state.activity.activities,
    loading: state.activity.loading,
    errorMessage: state.activity.errorMessage,
    partIndex: state.part.parts.findIndex(
      (item) =>
        item._id ===
        (state.part && state.part.currentPart
          ? state.part.currentPart._id
          : ''),
    ),
    lessonIndex: (state.course.currentCourse?.lesson || []).findIndex(
      (item) =>
        item._id ===
        (state.lesson && state.lesson.currentLesson
          ? state.lesson.currentLesson._id
          : ''),
    ),
  };
};

export default connect(mapStateToProps, {
  fetchActivity,
  changeCurrentActivity,
  changeCurrentScriptItem,
  resetAction,
  setScreenActivity,
})(ActivityScreen);
