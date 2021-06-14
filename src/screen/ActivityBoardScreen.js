import React from 'react';
import {Image, View, Dimensions} from 'react-native';
import {Icon} from 'native-base';
import LottieView from 'lottie-react-native';
import {connect} from 'react-redux';
import moment from 'moment';

import {Text, RowContainer, ColumnContainer} from '~/BaseComponent';
import ActivityNotice from '~/BaseComponent/components/elements/actvityBoard/ActivityNotice';
import ActivityBoardWrapper from '~/BaseComponent/components/elements/actvityBoard/ActivityBoardWrapper';
import {resetAction} from '~/features/script/ScriptAction';
import {doneActivity} from '~/features/activity/ActivityAction';
import {pushProgressHomework} from '~/features/homework/HomeworkAction';
import {makeStreakLogin} from '~/utils/utils';
import {colors, images} from '~/themes';
import {processUserDoneActivity} from '~/utils/script';
import {translate} from '~/utils/multilanguage';

const {width} = Dimensions.get('window');

class ActivityBoardScreen extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      showUpLevel: false,
    };
  }

  componentDidUpdate(prevProps) {
    const {doneLoading} = this.props;
    const {showUpLevel} = this.state;

    if (prevProps.doneLoading && !doneLoading) {
      processUserDoneActivity('ActivityBoard', showUpLevel);
    }
  }

  renderScore = () => {
    const {score, totalScore} = this.props;

    return (
      <RowContainer justifyContent="space-between">
        <View style={[styles.card, styles.half]}>
          <Text center h5 color={colors.white} style={styles.label}>
            {`${translate('Thưởng')}`}
          </Text>
          <Text center h3 color={colors.white} bold>
            +{score || 0}
            <LottieView
              source={require('~/assets/animate/star')}
              autoPlay
              loop
              style={{width: 40, height: 30}}
            />
          </Text>
        </View>

        <View style={[styles.card, styles.half]}>
          <Text center h5 color={colors.white} style={styles.label}>
            {`${translate('Tất cả')}`}
          </Text>
          <Text center h3 color={colors.white} bold>
            {totalScore + score || 0}{' '}
            <Image
              source={images.star}
              style={{width: 20, height: 20, marginTop: 5}}
              resizeMode="contain"
            />
          </Text>
        </View>
      </RowContainer>
    );
  };

  renderStreak = () => {
    const {loginStreaks} = this.props;
    let streaks = makeStreakLogin();
    let loginCount = 0,
      maxLoginCount = 0;

    for (let i = 0; i < streaks.length; i++) {
      const day = loginStreaks.find(
        (item) =>
          moment(item.created_at).startOf('d').valueOf() === streaks[i].time,
      );

      if (day && day.logged_in) {
        streaks[i].logged_in = true;
        loginCount++;
        maxLoginCount = Math.max(loginCount, maxLoginCount);
      } else {
        loginCount = 0;
      }
    }

    return (
      <View style={styles.card}>
        <Text center h5 color={colors.white} bold>
          <Icon
            name="fire"
            type="MaterialCommunityIcons"
            style={{color: colors.white, fontSize: 22}}
          />{' '}
          {maxLoginCount} {maxLoginCount > 1 ? 'STREAKS' : 'STREAK'}{' '}
          <Text h5 style={styles.label} color={colors.white}>
            {`${translate('Ngày học liên tiếp')}`}
          </Text>
        </Text>

        <RowContainer justifyContent="center">
          {streaks.map((item, index) => {
            return (
              <ColumnContainer
                key={`streak_${index}`}
                style={[
                  styles.checkboxWrap,
                  item.is_today ? styles.today : null,
                ]}>
                <View style={styles.checkbox}>
                  {!item.is_next && (
                    <Icon
                      name={item.logged_in ? 'check' : 'remove'}
                      type="FontAwesome"
                      style={styles.checkboxIcon}
                    />
                  )}

                  {item.is_next && <View style={styles.isNext} />}
                </View>
                <Text color={colors.white}>{item.text}</Text>
              </ColumnContainer>
            );
          })}
        </RowContainer>
      </View>
    );
  };

  renderListenTime = () => {
    return (
      <View style={[styles.card, styles.row]}>
        <View style={styles.roundWrap}>
          <Image source={images.listener} style={{height: 17, width: 15}} />
        </View>
        <View>
          <Text h5 color={colors.white} style={styles.label}>
            {`${translate('thời gian nghe')}`}
          </Text>
          <Text color={colors.white} h3 bold>
            00:00
          </Text>
        </View>
      </View>
    );
  };

  renderWordCount = () => {
    return (
      <View style={[styles.card, styles.row]}>
        <View style={styles.roundWrap}>
          <Image source={images.speaking} style={{height: 22, width: 28}} />
        </View>
        <View>
          <Text h5 color={colors.white} style={styles.label}>
            {`${translate('số câu đã nói')}`}
          </Text>
          <Text color={colors.white} h3 bold>
            {/*{`${this.props.words_speak || 0} câu`}*/}
            {`${translate('%s câu', {s1: this.props.words_speak || 0})}`}
          </Text>
        </View>
      </View>
    );
  };

  nextNavigation = () => {
    const {
      currentActivity,
      score,
      maxCorrect,
      totalWrong,
      totalCorrect,
      words,
    } = this.props;

    if (currentActivity) {
      let body = {
        activityId: currentActivity._id,
        part_id: currentActivity.part_id,
        score,
        maxStreak: maxCorrect,
        totalWrong,
        totalCorrect,
        words,
      };
      if (currentActivity.exercise) {
        body.exercise = currentActivity.exercise;
        this.props.pushProgressHomework({
          ...body,
          normal_score: totalCorrect / (totalCorrect + totalWrong),
        });
      }
      if (currentActivity.type) {
        body.activityType = currentActivity.type;
      }
      this.props.doneActivity(body);
    }
  };

  onUpLevel = () => {
    this.setState({showUpLevel: true});
  };

  render() {
    const {doneLoading} = this.props;

    return (
      <ActivityBoardWrapper
        nextNavigation={this.nextNavigation}
        loading={doneLoading}>
        <ActivityNotice onLevelUp={this.onUpLevel} />
        {this.renderScore()}
        {this.renderStreak()}
        {/*{this.renderListenTime()}*/}
        {this.renderWordCount()}
      </ActivityBoardWrapper>
    );
  }
}

const styles = {
  row: {
    flexDirection: 'row',
  },
  card: {
    borderRadius: 8,
    backgroundColor: colors.primary_overlay,
    marginBottom: 16,
    paddingVertical: 19,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  half: {
    width: (width - 24 * 2 - 15) / 2,
  },
  label: {
    opacity: 0.6,
    marginBottom: 8,
  },
  checkboxWrap: {
    backgroundColor: 'transparent',
    opacity: 0.3,
    paddingVertical: 5,
    paddingHorizontal: 5,
    marginTop: 5,
  },
  today: {
    opacity: 1,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  checkbox: {
    width: 24,
    height: 24,
    backgroundColor: colors.white,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  checkboxIcon: {
    color: colors.primary,
    fontSize: 14,
  },
  isNext: {
    width: 22,
    height: 22,
    backgroundColor: colors.primary,
    borderRadius: 11,
  },
  roundWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    marginRight: 12,
  },
};

const mapStateToProps = (state) => {
  return {
    score: state.script.score,
    maxCorrect: state.script.maxCorrect,
    totalCorrect: state.script.totalCorrect,
    words_speak: state.script.words_speak,
    totalWrong: state.script.totalWrong,
    doneLoading: state.script.doneLoading,
    words: state.script.words,
    currentActivity: state.activity.currentActivity,
    totalScore: state.auth.user.score,
    loginStreaks: state.auth.loginStreaks,
    perfectScoreStreak: state.progress.perfectScoreStreak,
    fromWordGroup: state.vocabulary.fromWordGroup,
  };
};

export default connect(mapStateToProps, {
  resetAction,
  doneActivity,
  pushProgressHomework,
})(ActivityBoardScreen);
