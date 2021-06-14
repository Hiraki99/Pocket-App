import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {Card} from 'native-base';
import AutoHeightImage from 'react-native-auto-height-image';
import {useDispatch} from 'react-redux';

import EmbedAudio from '~/BaseComponent/components/elements/script/EmbedAudio';
import {
  Button,
  FlexContainer,
  RowContainer,
  SeparatorHorizontal,
  SeparatorVertical,
  Text,
} from '~/BaseComponent/index';
import OptionSquare from '~/BaseComponent/components/base/OptionSquare';
import {doneQuestion} from '~/features/activity/ActivityAction';
import {colors} from '~/themes';
import {OS} from '~/constants/os';
// import {currentScriptSelector} from '~/selector/activity';
import {playAudioAnswer} from '~/utils/utils';
import {increaseScore} from '~/features/script/ScriptAction';
import {translate} from '~/utils/multilanguage';

const ListenAndTickOrCross = (props) => {
  const [answer, setAnswer] = React.useState(null);
  const [scoreBonus, setScoreBonus] = React.useState(0);
  const dispatch = useDispatch();
  const {data} = props;

  React.useEffect(() => {
    if (typeof answer === 'boolean') {
      playAudioAnswer(data.isCorrect === answer);
      if (data.isCorrect === answer) {
        if (scoreBonus === 0) {
          dispatch(increaseScore(1, 1, 0));
        }
        setScoreBonus(1);
      } else {
        dispatch(
          increaseScore(scoreBonus === 0 ? 0 : -1, 0, scoreBonus === 0 ? 1 : 0),
        );
        setScoreBonus(0);
      }
    }
  }, [answer, data, dispatch, scoreBonus]);

  if (!props.isFocus) {
    return null;
  } else {
    console.log('data ', data, data.isCorrect);
  }

  return (
    <FlexContainer
      backgroundColor={colors.mainBgColor}
      paddingHorizontal={24}
      paddingTop={24}
      paddingBottom={OS.hasNotch ? 48 : 24}>
      <Card style={styles.container}>
        <View>
          <AutoHeightImage
            resizeMode={'contain'}
            source={{uri: data.image}}
            width={OS.WIDTH - 192 - 48}
            style={{
              marginVertical: 10,
              height: MapObject.CONTAINER_HEIGHT - 73,
            }}
          />
        </View>
      </Card>
      <RowContainer justifyContent={'center'} paddingTop={24}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            setAnswer(true);
          }}>
          <RowContainer>
            <OptionSquare
              success={typeof answer === 'boolean' && answer === true}
            />
            <Text h5 bold paddingLeft={8}>
              {translate('Đúng')}
            </Text>
          </RowContainer>
        </TouchableOpacity>
        <SeparatorHorizontal slg />
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            setAnswer(false);
          }}>
          <RowContainer>
            <OptionSquare
              wrong={typeof answer === 'boolean' && answer === false}
            />
            <Text h5 bold paddingLeft={8}>
              {translate('Sai')}
            </Text>
          </RowContainer>
        </TouchableOpacity>
      </RowContainer>

      <View>
        <SeparatorVertical md />
        <EmbedAudio
          white
          autoPlay={false}
          audio={data.audio}
          showText
          text={translate('Nhấn vào đây để nghe')}
        />
        <SeparatorVertical slg />

        <Button
          large
          primary
          rounded
          block
          uppercase
          bold
          icon
          onPress={() => {
            dispatch(doneQuestion());
            props.doneQuestion();
          }}>
          {translate('Tiếp tục')}
        </Button>
      </View>
    </FlexContainer>
  );
};
ListenAndTickOrCross.propTypes = {
  doneQuestion: PropTypes.func,
  isFocus: PropTypes.bool,
};
ListenAndTickOrCross.defaultProps = {
  doneQuestion: () => {},
  isFocus: false,
};
const PADDING_NO_NOTCH = 230 + OS.headerHeight;
const PADDING_NOTCH = 278 + OS.headerHeight;
const MapObject = {
  CONTAINER_HEIGHT:
    OS.hasNotch || OS.IsAndroid
      ? (OS.HEIGHT - PADDING_NOTCH) / 2
      : (OS.HEIGHT - PADDING_NO_NOTCH) / 2,
};

const styles = StyleSheet.create({
  container: {
    // height: 263,
    height: MapObject.CONTAINER_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  image: {width: OS.WIDTH - 48, height: MapObject.CONTAINER_HEIGHT - 73},
  answer: {position: 'absolute', top: 16, right: 20},
  index: {
    backgroundColor: colors.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
});
export default ListenAndTickOrCross;
