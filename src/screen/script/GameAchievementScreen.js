import React from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {Button, Card, Logo, Text, CommonHeader} from '~/BaseComponent';
import {colors, images} from '~/themes';
import navigator from '~/navigation/customNavigator';
import {increaseScore} from '~/features/script/ScriptAction';
import {formatsMinuteOptions} from '~/utils/utils';
import {generateNextActivity} from '~/utils/script';
import {translate} from '~/utils/multilanguage';

class GameAchievementScreen extends React.PureComponent {
  render() {
    const countAllItems = navigator.getParam('countAllItems', 0);
    const countSuccess = navigator.getParam('countSuccess', 0);
    const type = navigator.getParam('type', null);
    const timeListened = navigator.getParam('timeListened', 0);
    const NumberQuestionOnceGame = navigator.getParam(
      'NumberQuestionOnceGame',
      0,
    );

    const denominator =
      countAllItems < NumberQuestionOnceGame
        ? NumberQuestionOnceGame
        : countAllItems;

    const score100 =
      countAllItems === 0 ? 0 : Math.round((countSuccess / denominator) * 100);

    return (
      <>
        <CommonHeader
          title={`${translate('Kết quả')}`}
          close
          themeWhite
          back={false}
          onClose={() => {
            navigator.navigate(
              this.props.isActivityVip
                ? 'LessonPracticeSpeakDetail'
                : 'Activity',
            );
          }}
        />
        <View style={styles.container}>
          <View style={styles.containerItem}>
            <Logo images={images.logoSimple} />
            <Card style={styles.cardContainer} hasArrow={true}>
              <Text center fontSize={24} bold color={colors.helpText}>
                {`${translate('Hoàn thành')}`}
              </Text>
              {type === 'vocabulary_meditation' ? (
                <>
                  <Text
                    center
                    h5
                    style={{
                      paddingTop: 12,
                      paddingBottom: 4,
                    }}
                    color={colors.helpText}>
                    {`${translate('Số lượt nghe từ')}`}
                  </Text>
                  <Text
                    accented
                    center
                    bold
                    fontSize={32}
                    color={colors.primary}>
                    {countAllItems}
                  </Text>

                  <Image source={images.award.award} style={styles.award} />
                  <Text center h5 color={colors.helpText}>
                    {`${translate('Thời gian nghe')}`}
                  </Text>
                  <Text
                    accented
                    center
                    fontSize={32}
                    bold
                    color={colors.heartActive}>
                    {formatsMinuteOptions(timeListened)}
                  </Text>
                </>
              ) : (
                <>
                  <Text
                    center
                    h5
                    style={{
                      paddingTop: 12,
                      paddingBottom: 4,
                    }}
                    color={colors.helpText}>
                    {`${translate('Điểm số')}`}
                  </Text>
                  <Text
                    accented
                    center
                    bold
                    fontSize={32}
                    color={colors.primary}>
                    {`${score100}/100`}
                  </Text>

                  <Image
                    source={
                      score100 >= 60
                        ? images.archiment_gold
                        : images.award.award
                    }
                    style={styles.award}
                  />
                  <Text center h5 color={colors.helpText}>
                    {`${translate('Số lượt làm đúng')}`}
                  </Text>
                  <Text
                    accented
                    center
                    fontSize={32}
                    bold
                    style={{paddingBottom: 16}}
                    color={colors.primary}>
                    {`${countSuccess}/${denominator}`}
                  </Text>
                </>
              )}
            </Card>
          </View>
          <View style={styles.containerItem}>
            <Button
              large
              primary
              rounded
              block
              uppercase
              bold
              icon
              onPress={() => {
                // increaseScore(
                //   starIncrease,
                //   countSuccess,
                //   countAllItems - countSuccess,
                // );
                // navigator.navigate('ActivityBoard');
                generateNextActivity();
              }}>
              {`${translate('Tiếp tục')}`}
            </Button>
          </View>
        </View>
      </>
    );
  }
}

GameAchievementScreen.propTypes = {
  modalVisiable: PropTypes.bool,
  countSuccess: PropTypes.number,
  countAllItems: PropTypes.number,
};

GameAchievementScreen.defaultProps = {
  modalVisiable: false,
  countSuccess: 0,
  countAllItems: 0,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.mainBgColor,
    justifyContent: 'space-between',
    paddingVertical: 48,
  },
  containerItem: {
    paddingHorizontal: 24,
  },
  cardContainer: {
    paddingVertical: 48,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  award: {
    width: 84,
    height: 64,
    marginTop: 32,
    marginBottom: 8,
  },
});
const mapStateToProps = (state) => {
  return {isActivityVip: state.activity.isActivityVip};
};
export default connect(mapStateToProps, {
  increaseScore,
})(GameAchievementScreen);
