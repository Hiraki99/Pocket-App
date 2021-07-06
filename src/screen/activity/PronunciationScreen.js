import {Buffer} from 'buffer';

import React from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components';
import {FlatList, Image, UIManager, View} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';
import Sound from 'react-native-sound';

import {Button, SeparatorVertical} from '~/BaseComponent';
import ConversationActivity from '~/BaseComponent/components/elements/script/ConversationActivity';
import RecordModal from '~/BaseComponent/components/elements/script/RecordModal';
import ConversationRecordActivity from '~/BaseComponent/components/elements/script/ConversationRecordActivity';
import OverLayResult from '~/BaseComponent/components/elements/result/OverlayResult';
import EmbedAudioAnimate from '~/BaseComponent/components/elements/result/EmbedAudioAnimate';
import PronunciationHeader from '~/BaseComponent/components/elements/pronunciation/element/PronunciationHeader';
import ScriptWrapper from '~/BaseComponent/components/elements/script/ScriptWrapper';
import {
  setTotalQuestion,
  doneQuestion,
} from '~/features/activity/ActivityAction';
import {
  changeCurrentScriptItem,
  resetAction,
  increaseScore,
} from '~/features/script/ScriptAction';
import speakApi from '~/features/speak/SpeakApi';
import {colors, images} from '~/themes';
import navigator from '~/navigation/customNavigator';
import {makeid} from '~/utils/utils';
import {OS} from '~/constants/os';
import {translate} from '~/utils/multilanguage';

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

const initState = {
  listActions: [],
  conversations: [],
  isListAll: false,
  currentTime: 0,
  isShowTranslation: false,
  isShowResult: false,
  translateItem: null,
  doneCount: 0,
  star: 0,
  countSuccess: 0,
  countPlay: 0,
  playing: false,
  itemReplay: null,
  itemChooseRecord: null,
  firstWarningError: false,
  playOriginalAudio: false,
  audioConcatRoleplay: null,
  navigateOutScreen: false,
};

class PronunciationScreen extends React.Component {
  constructor(props) {
    super(props);
    const {conversations} = props;
    const already = !props.attachment || props.attachment.type === 'none';

    let constructState = {
      ...initState,
      already,
    };
    this.version = makeid(16);
    this.pathAudioConcat = `${
      RNFS.DocumentDirectoryPath
    }/rolePlayRecorder/${makeid(8)}.mp3`;
    this.roleChoose = navigator.getParam('roleChoose', null);

    if (conversations[0] && conversations[0].role) {
      constructState = {
        ...constructState,
        conversations: conversations.slice(1),
      };
      if (already) {
        constructState = {
          ...constructState,
          conversations: conversations.slice(1),
          itemChooseRecord: conversations[0],
        };
      }
    } else {
      constructState = {
        ...constructState,
        conversations,
      };
    }
    this.state = constructState;
  }

  componentDidMount = async () => {
    const {currentScriptItem, conversations} = this.props;
    const checkExistedFolder = await RNFS.exists(
      RNFS.DocumentDirectoryPath + '/rolePlayRecorder',
    );
    if (!checkExistedFolder) {
      RNFS.mkdir(RNFS.DocumentDirectoryPath + '/rolePlayRecorder');
    }
    const totalQuestion = this.props.conversations.filter((item) => item.role)
      .length;
    this.props.setTotalQuestion(totalQuestion);
    if (conversations[0] && conversations[0].role && this.state.already) {
      this.modalRef.showModal();
    }
    this.sound = new Sound(currentScriptItem.audio, '', (err) => {
      if (!err && !conversations[0].role && this.state.already) {
        this.sound.play(this.onPlaySuccess);
      }
    });
    this.initInterval();
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state.isListAll !== nextState.isListAll ||
      this.state.listActions.length !== nextState.listActions.length ||
      this.state.conversations.length !== nextState.conversations.length ||
      this.state.playing !== nextState.playing ||
      this.state.already !== nextState.already
    ) {
      return true;
    }
    return this.state.currentTime === nextState.currentTime;
  }

  componentWillUnmount() {
    this.sound.release();
    if (this.onEndTimeout) {
      clearTimeout(this.onEndTimeout);
    }
    RNFS.unlink(
      `${RNFS.DocumentDirectoryPath}/rolePlayRecorder`,
    ).then(() => {});
    RNFS.unlink(this.pathAudioConcat);
  }

  initInterval = () => {
    this.interval = setInterval(
      () => {
        if (this.sound) {
          this.sound.getCurrentTime(async (seconds) => {
            const {
              itemReplay,
              itemChooseRecord,
              playOriginalAudio,
            } = this.state;
            if (itemReplay && (itemReplay.end <= seconds || !itemReplay.end)) {
              this.sound.pause();
              this.setState({itemReplay: null});
            }
            if (
              itemChooseRecord &&
              playOriginalAudio &&
              seconds >= itemChooseRecord.end - 0.1
            ) {
              this.sound.pause();
              this.sound.setCurrentTime(itemChooseRecord.start);
              this.setState({playOriginalAudio: false});
            }
            if (this.state.already && !playOriginalAudio) {
              this.onTimeChange(seconds);
            }
          });
        }
      },
      OS.IsAndroid ? 100 : 50,
    );
  };

  onPlaySuccess = async () => {
    if (this.interval) {
      clearInterval(this.interval);
    }
    await this.setState({isListAll: true});
    const res = await speakApi.getRolePlayAudio({
      version: this.version,
    });
    if (res.ok && res.data) {
      const base44 = Buffer.from(res.data, 'base64').toString('base64');
      await RNFetchBlob.fs
        .writeFile(this.pathAudioConcat, base44, 'base64')
        .then(() => {
          this.setState({audioConcatRoleplay: this.pathAudioConcat});
        });
    }
  };

  reloadRolePlay = async () => {
    this.version = makeid(16);
    RNFS.unlink(this.pathAudioConcat).then(() => {
      this.pathAudioConcat = `${OS.IsAndroid ? 'file://' : ''}${
        RNFS.DocumentDirectoryPath
      }/rolePlayRecorder/${makeid(8)}.mp3`;
    });

    const roleChoose = navigator.getParam('roleChoose', null);
    const {currentScriptItem} = this.props;
    const conversations = currentScriptItem.conversations.map((item) => {
      return {
        ...item,
        role: item.speaker.name === roleChoose.name,
      };
    });
    await this.setState(initState);
    if (conversations[0] && conversations[0].role) {
      await this.setState({
        itemChooseRecord: conversations[0],
        conversations: conversations.slice(1),
      });
      this.modalRef.showModal();
    } else {
      await this.setState({conversations});
      this.sound.play(this.onPlaySuccess);
    }
    this.initInterval();
  };

  onTimeChange = async (time) => {
    let removeCount = 0;
    const {listActions, conversations} = this.state;
    const lengthAction = listActions.length;

    const actions = [];
    this.setState({currentTime: time});
    if (
      lengthAction > 0 &&
      listActions[lengthAction - 1].data.start < time &&
      listActions[lengthAction - 1].data.end > time
    ) {
      return;
    }

    conversations.every((item) => {
      if (item.start <= time) {
        const action = {
          key: makeid(),
          data: item,
        };
        if (item.role) {
          this.sound.pause();
          this.setState({itemChooseRecord: item});
          this.modalRef.showModal();
        } else {
          actions.push(action);
        }
        removeCount++;
      } else {
        return false;
      }
    });

    let arr = [...this.state.conversations];

    arr.splice(0, removeCount);

    await this.setState(
      {
        listActions: this.state.listActions.concat(actions),
        conversations: arr,
      },
      () => {},
    );
  };

  onRecorded = (filePath, duration) => {
    const {itemChooseRecord, conversations, listActions} = this.state;
    const actionPush = {
      key: makeid(30),
      data: {
        ...itemChooseRecord,
        audio: filePath,
        duration,
      },
    };
    listActions.push(actionPush);
    const conversationUpdate = conversations.filter(
      (item) => item.id !== itemChooseRecord.id,
    );
    this.setState({
      listActions,
      conversations: conversationUpdate,
    });
  };

  onEffect = (success) => {
    console.log('vao day onEffct');
    this.props.doneQuestion();
    if (success) {
      this.props.increaseScore(1, 1, 0);
    } else {
      this.props.increaseScore(0, 0, 1);
    }
  };

  onEndPlayRecorded = () => {
    const {itemChooseRecord} = this.state;
    if (itemChooseRecord && this.sound) {
      this.sound.setCurrentTime(parseFloat(itemChooseRecord.end));
      this.sound.play(this.onPlaySuccess);
      this.setState({itemChooseRecord: null});
    }
  };

  onUpdateRoleplay = (isCorrect) => {
    const {star, countSuccess, countPlay} = this.state;
    this.setState({countPlay: countPlay + 1});
    if (isCorrect) {
      this.setState({countSuccess: countSuccess + 1, star: star + 1});
    }
  };

  onFirstWarning = () => {
    this.setState({firstWarningError: true});
  };

  onMoveToEnd = () => {
    setTimeout(() => {
      if (!this.state.isListAll) {
        this.flatListRef.scrollToEnd({animated: true});
      }
    }, 200);
  };

  showResult = () => {
    this.setState({isShowResult: true});
  };

  onReplay = (data) => {
    this.setState({itemReplay: data});
    this.sound.pause();
    this.sound.setCurrentTime(parseFloat(data.start));
    setTimeout(() => {
      this.sound.play(this.onPlaySuccess);
    }, 200);
  };

  onPause = () => {
    if (this.sound) {
      this.sound.pause();
    }
  };

  onPlayOriginalAudio = async () => {
    const {itemChooseRecord} = this.state;
    await this.setState({playOriginalAudio: true});
    if (this.sound) {
      this.sound.setCurrentTime(parseFloat(itemChooseRecord.start));
      this.sound.play();
    }
  };

  renderItem = ({item}) => {
    const {currentTime, isListAll} = this.state;
    return (
      <View style={{paddingHorizontal: 12}}>
        {item.data.role ? (
          <ConversationRecordActivity
            conversation={item.data}
            endActivity={isListAll}
            onEndPlayRecorded={this.onEndPlayRecorded}
          />
        ) : (
          <ConversationActivity
            conversation={item.data}
            currentTime={currentTime}
            replay
            endActivity={isListAll}
            onReplay={this.onReplay}
          />
        )}
      </View>
    );
  };

  renderResult = () => {
    return (
      <OverLayResult
        show={this.state.isListAll}
        title={`${translate('THẦY MIKE')}`}
        subtitle={`${translate(
          'Tốt lắm! Bạn đã làm xong đoạn hội thoại. Bạn có thể nghe lại thành quả hoặc tiếp tục nhé!',
        )}`}
        titleStyle={{
          color: colors.primary,
          fontSize: 14,
          fontWeight: 'bold',
        }}
        subtitleStyle={{
          fontSize: 17,
          color: colors.helpText,
          paddingBottom: 16,
        }}
        headerIconComponent={
          <Image source={images.teacher} style={styles.avatar} />
        }
        audioComponent={
          <EmbedAudioAnimate
            audio={this.state.audioConcatRoleplay}
            modalResult
            navigateOutScreen={this.state.navigateOutScreen}
          />
        }
        onRequestClose={() => {}}
        cancellable={false}>
        <Button
          primary
          transparent
          outline
          block
          rounded
          large
          marginBottom={12}
          shadow={!OS.IsAndroid}
          icon
          reloadIcon
          uppercase
          bold
          onPress={this.reloadRolePlay}>
          {`${translate('Làm lại')}`}
        </Button>
        <Button
          primary
          rounded
          large
          marginBottom={24}
          shadow={!OS.IsAndroid}
          icon
          uppercase
          bold
          onPress={() => {
            const {star, countSuccess, countPlay} = this.state;
            this.setState({navigateOutScreen: true});
            navigator.navigate('GameAchievement', {
              countSuccess: countSuccess,
              countAllItems: countPlay,
              starIncrease: star,
              NumberQuestionOnceGame: countPlay,
            });
          }}>
          {`${translate('Tiếp tục')}`}
        </Button>
      </OverLayResult>
    );
  };

  setAlready = () => {
    setTimeout(() => {
      this.setState(
        {
          already: true,
        },
        () => {
          const {conversations} = this.props;
          if (conversations[0] && conversations[0].role) {
            this.setState({
              itemChooseRecord: conversations[0],
            });
            this.modalRef.showModal();
          } else {
            if (this.sound) {
              this.sound.play();
            }
          }
        },
      );
    }, 500);
  };

  renderHeader = () => {
    const {attachment} = this.props;
    if (!attachment || attachment.type === 'none') {
      return null;
    }
    return (
      <PronunciationHeader
        attachment={attachment}
        already={this.state.already}
        setAlready={this.setAlready}
      />
    );
  };

  renderFooter = () => {
    return <SeparatorVertical lg />;
  };

  render() {
    const {listActions} = this.state;
    const {currentScriptItem, currentActivity} = this.props;
    return (
      <ScriptWrapper>
        <SFlatList
          ref={(ref) => {
            this.flatListRef = ref;
          }}
          data={listActions}
          renderItem={this.renderItem}
          keyExtractor={(item) => item.key}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={this.renderHeader}
          attachment={
            this.props.attachment && this.props.attachment.type !== 'none'
          }
          onContentSizeChange={this.onMoveToEnd}
          ListFooterComponent={this.renderFooter}
          // removeClippedSubviews
          // maxToRenderPerBatch={5}
        />

        <RecordModal
          ref={(ref) => (this.modalRef = ref)}
          data={this.state.itemChooseRecord || {}}
          onRecorded={this.onRecorded}
          onEffect={this.onEffect}
          firstWarningError={this.state.firstWarningError}
          onUpdateRoleplay={this.onUpdateRoleplay}
          onFirstWarning={this.onFirstWarning}
          onPlayOriginalAudio={this.onPlayOriginalAudio}
          onPause={this.onPause}
          version={this.version}
          activity_id={currentActivity ? currentActivity._id : ''}
          script_id={currentScriptItem ? currentScriptItem.id : ''}
          googleApiKey={this.props.stt.api_key}
          activity_type={this.props.activity_type}
          fromWordGroup={this.props.fromWordGroup}
        />
        {this.state.isListAll && this.renderResult()}
      </ScriptWrapper>
    );
  }
}

const SFlatList = styled(FlatList)`
  margin-top: ${(props) => {
    if (props.attachment) {
      return 0;
    }
    return 24;
  }}
  padding-horizontal: 0
`;

const styles = {
  activityList: {
    marginTop: 24,
    paddingHorizontal: 12,
  },
  avatar: {
    height: 64,
    width: 64,
    borderRadius: 32,
  },
};

const mapStateToProps = (state) => {
  const roleChoose = navigator.getParam('roleChoose', null);
  const scriptConversation = state.script.currentScriptItem
    ? state.script.currentScriptItem.conversations
    : [];

  const conversations = scriptConversation.map((item) => {
    return {
      ...item,
      role: item.speaker && roleChoose && item.speaker.name === roleChoose.name,
    };
  });

  return {
    score: state.auth.user.score || 0,
    currentActivity: state.activity.currentActivity,
    currentScriptItem: state.script.currentScriptItem,
    conversations,
    attachment: state.script.currentScriptItem
      ? state.script.currentScriptItem.attachment
      : null,
    stt: state.stt.stt,
    activity_type: state.activity.tabActivity,
    fromWordGroup: state.vocabulary.fromWordGroup,
  };
};

export default connect(mapStateToProps, {
  changeCurrentScriptItem,
  resetAction,
  increaseScore,
  setTotalQuestion,
  doneQuestion,
})(PronunciationScreen);
