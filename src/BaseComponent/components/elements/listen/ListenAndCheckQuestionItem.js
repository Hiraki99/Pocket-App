import React, {useRef} from 'react';
import PropTypes from 'prop-types';
import {TouchableWithoutFeedback, View, StyleSheet} from 'react-native';
import * as Animatable from 'react-native-animatable';
import AutoHeightImage from 'react-native-auto-height-image';
import styled from 'styled-components';
import {useDispatch} from 'react-redux';

import {RowContainer, Text} from '~/BaseComponent/index';
import OptionSquare from '~/BaseComponent/components/base/OptionSquare';
import {colors} from '~/themes';
import {playAudioAnswer} from '~/utils/utils';
import {increaseScore} from '~/features/script/ScriptAction';
import {OS} from '~/constants/os';

const ListenAndCheckQuestionItem = (props) => {
  const {data, answer, scoreBonus, setScoreBonus} = props;
  const dispatch = useDispatch();
  const viewRef = useRef(null);
  React.useEffect(() => {
    if (answer && answer.key === data.key) {
      if (viewRef && viewRef.current) {
        viewRef.current
          .animate(data.isAnswer ? 'bounce' : 'tada', 800)
          .then(() => {
            viewRef.current.setNativeProps({
              style: {
                zIndex: 0,
              },
            });
          });
        playAudioAnswer(data.isAnswer);
        if (data.isAnswer) {
          if (scoreBonus === 0) {
            dispatch(increaseScore(1, 1, 0));
          }
          setScoreBonus(1);
        } else {
          dispatch(
            increaseScore(
              scoreBonus === 0 ? 0 : -1,
              0,
              scoreBonus === 0 ? 1 : 0,
            ),
          );
          setScoreBonus(0);
        }
      }
    }
  }, [answer, viewRef, data, dispatch, scoreBonus, setScoreBonus]);

  return (
    <TouchableWithoutFeedback
      disabled={answer}
      onPress={() => {
        props.setAnswer(data);
      }}>
      <SCard
        style={styles.container}
        success={answer && answer.key === data.key && data.isAnswer}
        wrong={answer && answer.key === data.key && !data.isAnswer}>
        <Animatable.View ref={viewRef} useNativeDriver={true}>
          <AutoHeightImage
            resizeMode={'contain'}
            source={{uri: data.url}}
            width={OS.WIDTH - 192 - 48}
            style={{
              marginVertical: 10,
              height: MapObject.CONTAINER_HEIGHT - 73,
            }}
          />
        </Animatable.View>

        <RowContainer style={styles.answer}>
          <View style={styles.index}>
            <Text h5 center color={colors.white} paddingHorizontal={4}>
              {`${String.fromCharCode(65 + props.index)}`}
            </Text>
          </View>

          <OptionSquare
            success={answer && answer.key === data.key && data.isAnswer}
            wrong={answer && answer.key === data.key && !data.isAnswer}
          />
        </RowContainer>
      </SCard>
    </TouchableWithoutFeedback>
  );
};
ListenAndCheckQuestionItem.propTypes = {
  data: PropTypes.object,
  index: PropTypes.number,
  answer: PropTypes.object,
  setAnswer: PropTypes.func,
};
ListenAndCheckQuestionItem.defaultProps = {
  data: {},
  index: 0,
  answer: null,
  setAnswer: () => {},
};
const SCard = styled(View)`
  border-color: ${(props) => {
    if (props.wrong) {
      return colors.red_brick;
    }
    if (props.success) {
      return colors.successChoice;
    }
    return '#ccc';
  }};
  background-color: white;
`;

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
export default ListenAndCheckQuestionItem;
