import React from 'react';
import {View, FlatList, Image} from 'react-native';
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
} from '~/BaseComponent';
import ActivityItem from '~/BaseComponent/components/elements/script/ActivityItem';
import ActivityLevelModal from '~/BaseComponent/components/elements/activity/ActivityLevelModal';
import {
  fetchActivity,
  changeCurrentActivity,
  setScreenActivity,
} from '~/features/activity/ActivityAction';
import {colors, images} from '~/themes';
import navigator from '~/navigation/customNavigator';
import {
  changeCurrentScriptItem,
  resetAction,
} from '~/features/script/ScriptAction';
import {generateNextActivity} from '~/utils/script';
import {OS} from '~/constants/os';
import {HARD_LEVEL} from '~/constants/threshold';
import {PRIMARY_FOOTER_IMAGES} from '~/themes/footer';
import {translate} from '~/utils/multilanguage';

class ActivityPrimaryScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showAlert: false,
      message: translate('Phần này chưa có bài tập rồi, bạn quay lại sau nhé!'),
      itemSelected: null,
      imageFooter:
        PRIMARY_FOOTER_IMAGES[
          Math.round(Math.random() * (PRIMARY_FOOTER_IMAGES.length - 1))
        ],
    };
  }

  componentDidMount() {
    Sound.enableInSilenceMode(true);
    Sound.setCategory('Playback');
    this.loadActivities();
    this.props.setScreenActivity('ActivityPrimary');
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
    const {loading} = this.props;

    return (
      <>
        <View alignItems={'center'} paddingVertical={16}>
          <Image
            source={{uri: this.props.currentPart.featured_image}}
            style={{width: OS.WIDTH - 48, height: 200, borderRadius: 8}}
          />
        </View>
        <Text
          h5
          uppercase
          primary
          paddingTop={8}
          paddingBottom={16}
          bold
          paddingHorizontal={24}>
          {translate('Nội dung bài học')}
        </Text>
        {loading && (
          <FlexContainer
            style={{justifyContent: 'center', alignItems: 'center'}}>
            <Loading />
          </FlexContainer>
        )}
      </>
    );
  };

  renderFooter = () => {
    return (
      <View>
        <Image
          source={this.state.imageFooter}
          style={{
            width: OS.WIDTH,
            height: 240,
            marginTop: 24,
          }}
        />
      </View>
    );
  };
  render() {
    const {activities} = this.props;

    return (
      <>
        <CommonHeader themeWhite title={this.props.currentPart?.name} />
        <FlexContainer backgroundColor={colors.mainBgColor} marginTop={1}>
          {this.renderAlert()}
          <FlatList
            ListHeaderComponent={this.renderHeaderFlatList}
            ListFooterComponent={this.renderFooter}
            bounces={false}
            data={activities}
            renderItem={this.renderItem}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{flexGrow: 1}}
            ListFooterComponentStyle={{flex: 1, justifyContent: 'flex-end'}}
            extraData={this.props}
            initialNumToRender={3}
          />
        </FlexContainer>
        <ActivityLevelModal
          ref={(refs) => (this.acticityLevelRef = refs)}
          data={this.state.itemSelected}
          action={this.navigateToScript}
        />
      </>
    );
  }
}

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
    lessonIndex: state.lesson.lessons.findIndex(
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
})(ActivityPrimaryScreen);
