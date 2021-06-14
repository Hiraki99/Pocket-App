import React from 'react';
import {connect} from 'react-redux';
import {View} from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';

import ActivityBoardWrapper from '~/BaseComponent/components/elements/actvityBoard/ActivityBoardWrapper';
import {Text} from '~/BaseComponent';
import {colors} from '~/themes';
import {OS} from '~/constants/os';
import images from '~/themes/images';
import {playAudio} from '~/utils/utils';
import {processUserDoneActivity} from '~/utils/script';
import {translate} from '~/utils/multilanguage';

class PerfectScoreStreakScreen extends React.PureComponent {
  nextNavigation = () => {
    processUserDoneActivity('PerfectScoreStreak');
  };

  componentDidMount(): void {
    playAudio('levelUp');
  }

  render() {
    return (
      <ActivityBoardWrapper
        nextNavigation={this.nextNavigation}
        mainContentStyle={styles.mainContent}>
        <View style={{marginBottom: 32}}>
          <AutoHeightImage source={images.perfectScoreStreak} width={175} />
        </View>
        <Text
          color={colors.white}
          bold
          fontSize={24}
          center
          style={{marginBottom: 5}}>
          {`${translate('Tuyệt! 3 lần điểm 10 liên tiếp')}`}
        </Text>

        <Text
          center
          h5
          color="rgba(255,255,255,0.6)"
          style={{width: Math.min(OS.WIDTH - 60, 300)}}>
          {translate(
            'Chúc mừng! 3 lần điểm tuyệt đối liên tiếp. Bạn xứng đáng nhận được chiếc huy chương này. Giữ vững phong độ nhé!',
          )}
        </Text>
      </ActivityBoardWrapper>
    );
  }
}

const styles = {
  mainContent: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
};

const mapStateToProps = (state) => {
  return {
    score: state.script.score,
    levelProgress: state.progress.levelProgress,
    nextLevel: state.progress.nextLevel,
    currentLevel: state.progress.currentLevel,
  };
};

export default connect(mapStateToProps, null)(PerfectScoreStreakScreen);
