import React from 'react';
import {Image, View} from 'react-native';
import * as Progress from 'react-native-progress';
import {connect} from 'react-redux';
import sortBy from 'lodash/sortBy';
import PropTypes from 'prop-types';

import {Text} from '~/BaseComponent';
import {colors, images} from '~/themes';
import {resetAction} from '~/features/script/ScriptAction';
import {doneActivity} from '~/features/activity/ActivityAction';
import {updateLevel} from '~/features/progress/ProgressAction';
import {translate} from '~/utils/multilanguage';

class ActivityNotice extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      progress: 0,
      levelMin: null,
      levelMax: null,
      allScore: 0,
      neededScore: 0,
      currentScoreLevel: 0,
    };
  }

  componentDidMount(): void {
    const {levels, totalScore, score, updateLevel, onLevelUp} = this.props;
    const currentScore = totalScore + parseInt(score);
    let levelMin = null,
      levelMax = null;

    sortBy(levels, 'score').forEach((item) => {
      if (item.score >= currentScore) {
        if (!levelMin) {
          levelMin = item;
        }
      } else {
        levelMax = item;
      }
    });
    const maxScore = levelMax ? levelMax.score : 0;
    const minScore = levelMin ? levelMin.score : 0;
    const average = (maxScore + minScore) / 2;
    const neededScore = minScore - currentScore;
    const allScore = minScore - maxScore;
    const currentScoreLevel = currentScore - maxScore;

    if (totalScore < average && currentScore >= average) {
      updateLevel(0.5, levelMin, levelMax);
      onLevelUp();
    }

    if (totalScore < minScore && currentScore >= minScore) {
      updateLevel(1, levelMin, levelMax);
      onLevelUp();
    }

    this.setState({
      levelMin,
      levelMax,
      allScore,
      neededScore,
      currentScoreLevel,
    });

    setTimeout(() => {
      this.setState({
        progress: currentScoreLevel / allScore,
      });
    }, 1000);
  }

  render() {
    const {
      progress,
      levelMin,
      allScore,
      neededScore,
      currentScoreLevel,
    } = this.state;

    const {totalCorrect, totalWrong} = this.props;
    const totalQuestion = totalCorrect + totalWrong;
    let str = translate('Tệ nhỉ, cố lên bạn!');

    if (totalQuestion !== 0) {
      const score = totalCorrect / totalQuestion;

      if (score < 0.65) {
        str = translate('Tệ nhỉ, cố lên bạn!');
      } else if (score >= 0.65 && score < 0.9) {
        str = translate('Cũng khá đấy chứ!');
      } else {
        str = translate('Quá đỉnh cao!');
      }
    }

    if (!levelMin) {
      return null;
    }

    return (
      <View>
        <Text center color={colors.white} h2 bold style={{marginTop: 30}}>
          {str}
        </Text>
        <Progress.Bar
          progress={progress}
          color="#FFB300"
          unfilledColor="rgba(255,255,255,0.2)"
          width={100}
          height={12}
          borderWidth={0}
          borderRadius={6}
          useNativeDriver={true}
          animationType={'timing'}
          style={{alignSelf: 'center', marginTop: 12}}
        />

        <Text
          color="rgba(255,255,255, 0.3)"
          center
          style={{marginTop: 8, marginBottom: 36}}>
          {`${translate('Lên %s cần', {s1: levelMin.name})} `}
          <Text color={colors.white}>
            {neededScore}{' '}
            <Image
              source={images.starSm}
              style={{width: 13, height: 13, marginTop: 3}}
              resizeMode="contain"
            />
          </Text>{' '}
          ({currentScoreLevel}/{allScore})
        </Text>
      </View>
    );
  }
}

ActivityNotice.propTypes = {
  onLevelUp: PropTypes.func,
};

ActivityNotice.defaultProps = {
  onLevelUp: () => {},
};

const mapStateToProps = (state) => {
  return {
    score: state.script.score,
    maxCorrect: state.script.maxCorrect,
    totalWrong: state.script.totalWrong,
    totalCorrect: state.script.totalCorrect,
    totalScore: state.auth.user ? state.auth.user.score : 0,
    levels: state.auth.levels,
  };
};

export default connect(mapStateToProps, {
  resetAction,
  doneActivity,
  updateLevel,
})(ActivityNotice);
