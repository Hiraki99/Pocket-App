import React, {useCallback} from 'react';
import {FlatList, View} from 'react-native';
import PropTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';

import {FlexContainer, SeparatorVertical, Text} from '~/BaseComponent/index';
import EmbedAudio from '~/BaseComponent/components/elements/script/EmbedAudio';
import ListenAndCheckQuestionItem from '~/BaseComponent/components/elements/listen/ListenAndCheckQuestionItem';
import {doneQuestion} from '~/features/activity/ActivityAction';
import {colors} from '~/themes';
import {OS} from '~/constants/os';
import {currentScriptSelector} from '~/selector/activity';
import {translate} from '~/utils/multilanguage';

const ListenAndCheck = (props) => {
  const question = useSelector(currentScriptSelector);
  const [answer, setAnswer] = React.useState(null);
  const [scoreBonus, setScoreBonus] = React.useState(0);
  const dispatch = useDispatch();
  const {data} = props;

  const setAns = useCallback(
    (ans) => {
      setAnswer(ans);
      if (!answer) {
        dispatch(doneQuestion());
      }
      setTimeout(() => {
        props.doneQuestion();
      }, 500);
    },
    [answer, dispatch, props.doneQuestion],
  );
  const renderItem = useCallback(
    ({item, index}) => {
      return (
        <ListenAndCheckQuestionItem
          data={item}
          index={index}
          answer={answer}
          setAnswer={setAns}
          scoreBonus={scoreBonus}
          setScoreBonus={setScoreBonus}
        />
      );
    },
    [answer, setAns, scoreBonus, setScoreBonus],
  );
  if (!props.isFocus) {
    return null;
  }
  return (
    <FlexContainer
      backgroundColor={colors.mainBgColor}
      paddingHorizontal={24}
      paddingTop={24}
      paddingBottom={OS.hasNotch ? 48 : 24}>
      <FlatList
        data={data.answers}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        // scrollEnabled={false}
        ItemSeparatorComponent={() => <SeparatorVertical md />}
        showsVerticalScrollIndicator={false}
      />
      <View>
        {question.type === 'listen_and_check' && (
          <>
            <SeparatorVertical md />
            <EmbedAudio
              white
              autoPlay={false}
              audio={data.audio}
              showText
              text={translate('Nhấn vào đây để nghe')}
            />
            <SeparatorVertical md />
          </>
        )}

        {question.type === 'read_and_tick' && (
          <>
            <Text h2 primary bold center>
              {data.text}{' '}
            </Text>
            <SeparatorVertical height={32} />
          </>
        )}
      </View>
    </FlexContainer>
  );
};
ListenAndCheck.propTypes = {
  doneQuestion: PropTypes.func,
  isFocus: PropTypes.bool,
};
ListenAndCheck.defaultProps = {
  doneQuestion: () => {},
  isFocus: false,
};
export default ListenAndCheck;
