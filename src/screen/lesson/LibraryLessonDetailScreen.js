import React from 'react';
import {FlatList} from 'react-native';
import {connect} from 'react-redux';
import Sound from 'react-native-sound';
import FastImage from 'react-native-fast-image';

import {
  CommonHeader,
  FlexContainer,
  NoFlexContainer,
  SeparatorVertical,
  Text,
  ThumbnailVideo,
} from '~/BaseComponent';
import ActivityItem from '~/BaseComponent/components/elements/activity/ActivityItem';
import {
  changeCurrentActivity,
  fetchActivityGrammar,
  fetchActivityCommunication,
  fetchActivityVocabulary,
  setTabActivity,
  setScreenActivity,
  fetchActivitySong,
} from '~/features/activity/ActivityAction';
import {
  changeCurrentScriptItem,
  resetAction,
} from '~/features/script/ScriptAction';
import {
  fetchWordGroup,
  setInWordGroup,
} from '~/features/vocalbulary/VocabularyAction';
import {colors} from '~/themes';
import {getDimensionVideo169} from '~/utils/utils';
import {OS} from '~/constants/os';
import navigator from '~/navigation/customNavigator';
import {translate} from '~/utils/multilanguage';

// const DESCRIPTION = translate(
//   'Chương trình sẽ hướng dẫn chi tiết các bước giảng dạy các kĩ năng tiếng Anh ở trên lớp như: phát âm, nghe, nói, đọc, viết,… đặc biệt là ứng dụng công nghệ media vào việc giảng dạy tiếng Anh',
// );

class LibraryLessonDetailScreen extends React.PureComponent {
  componentDidMount() {
    this.props.setScreenActivity('LibraryLessonDetail');
    Sound.enableInSilenceMode(true);
    Sound.setCategory('Playback');
    const audio = require('~/assets/media/Complete-Activity.wav');
    this.sound = new Sound(audio, () => {});
    const params = navigator.getParam('params', {});
    if (params.grammar) {
      this.props.fetchActivityGrammar({
        grammar_id: params._id,
        length: -1,
      });
    }
    if (params.communication) {
      this.props.fetchActivityCommunication({
        communication_id: params._id,
        length: -1,
      });
    }
    if (params.song) {
      this.props.fetchActivitySong({
        song_id: params._id,
        length: -1,
      });
    }
    if (params.vocabulary) {
      this.props.fetchActivityVocabulary({
        word_group_id: params._id,
        length: -1,
      });
      this.props.fetchWordGroup({word_group_id: params._id, length: -1});
    }

    this.props.setInWordGroup(true);
  }

  componentWillUnmount() {
    this.props.setInWordGroup(false);
    this.props.setTabActivity(null);
  }

  playAudioSuccess = () => {
    if (this.sound) {
      this.sound.play();
    }
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

  keyExtractor = (item) => item._id;

  renderHeader = () => {
    const params = navigator.getParam('params', {});
    return (
      <>
        {params.attachment && params.attachment.type === 'video' ? (
          <ThumbnailVideo
            attachment={params.attachment}
            attachmentWidth={OS.WIDTH}
          />
        ) : (
          <FastImage
            source={{uri: params.featured_image}}
            resizeMode={'cover'}
            style={{
              width: OS.WIDTH,
              height: getDimensionVideo169(OS.WIDTH),
            }}
          />
        )}

        <NoFlexContainer paddingVertical={32} paddingHorizontal={24}>
          <Text h4 color={colors.helpText} bold>
            {params.name}
          </Text>
          <Text
            color={colors.primary}
            fontSize={14}
            fontWeight={'500'}
            paddingVertical={8}>
            {translate('%s từ, %s lượt học', {
              s1: params.words ? params.words.length : 0,
              s2: params.learn_count || 0,
            })}
          </Text>
          {/*<Text fontSize={14} color={colors.helpText}>*/}
          {/*  {params.description || DESCRIPTION}*/}
          {/*</Text>*/}
        </NoFlexContainer>
      </>
    );
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

  renderListFooterComponent = () => {
    return <SeparatorVertical slg />;
  };

  render() {
    const params = navigator.getParam('params', {});

    return (
      <>
        <CommonHeader themeWhite title={params.name} />
        <FlexContainer backgroundColor={colors.mainBgColor}>
          <FlatList
            data={this.props.activities}
            ListHeaderComponent={this.renderHeader}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderItem}
            ListFooterComponent={this.renderListFooterComponent}
            showsVerticalScrollIndicator={false}
          />
        </FlexContainer>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    wordGroup: state.vocabulary.wordGroup,
    activities: state.activity.activities,
  };
};

export default connect(mapStateToProps, {
  changeCurrentActivity,
  changeCurrentScriptItem,
  resetAction,
  fetchWordGroup,
  setInWordGroup,
  fetchActivityGrammar,
  fetchActivityCommunication,
  fetchActivityVocabulary,
  fetchActivitySong,
  setTabActivity,
  setScreenActivity,
})(LibraryLessonDetailScreen);
