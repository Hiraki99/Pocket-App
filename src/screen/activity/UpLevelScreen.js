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

class UpLevelScreen extends React.Component {
  nextNavigation = () => {
    processUserDoneActivity('UpLevel');
  };

  componentDidMount(): void {
    playAudio('levelUp');
  }

  render() {
    const {currentLevel, nextLevel, levelProgress} = this.props;

    return (
      <ActivityBoardWrapper
        nextNavigation={this.nextNavigation}
        mainContentStyle={styles.mainContent}>
        <View style={{marginBottom: 32}}>
          <AutoHeightImage
            source={
              levelProgress === 0.5 ? images.result_50 : images.result_100
            }
            width={175}
          />
          <View style={styles.level}>
            <Text uppercase bold fontSize={16} center>
              {levelProgress === 0.5
                ? currentLevel
                  ? currentLevel.name
                  : `${translate('Cấp 0')}`
                : nextLevel.name}
            </Text>
          </View>
        </View>
        <Text
          color={colors.white}
          bold
          fontSize={24}
          center
          style={{marginBottom: 5}}>
          {levelProgress === 0.5
            ? `${translate('Tốt lắm, 1/2 chặng rồi')}`
            : `${translate('Tuyệt vời! Đã lên %s', {s1: nextLevel.name})}`}
        </Text>

        <Text
          center
          h5
          color="rgba(255,255,255,0.6)"
          style={{width: Math.min(OS.WIDTH - 60, 300)}}>
          {levelProgress === 0.5
            ? `${translate(
                'Bạn đã hoàn thành được 50% %s, hãy cố gắng giữ nhịp học đều để có thể sớm lên %s bạn nhé!\n Try your best!',
                {s1: nextLevel.name, s2: nextLevel.name},
              )}`
            : `${translate(
                'Tuyệt lắm, bạn đã lên %s rồi. \n Hãy cố gắng giữ nhịp độ học nhé!',
                {s1: nextLevel.name},
              )}`}
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
  level: {
    marginTop: -40,
    backgroundColor: colors.white,
    paddingVertical: 17,
    paddingHorizontal: 30,
    borderRadius: 27,
    width: 110,
    alignSelf: 'center',
    shadowColor: 'rgba(60,128,209,0.09)',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
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

export default connect(mapStateToProps, null)(UpLevelScreen);
