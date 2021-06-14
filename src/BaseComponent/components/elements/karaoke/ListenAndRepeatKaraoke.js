import React, {useRef} from 'react';
import {StyleSheet, FlatList, TouchableOpacity, View} from 'react-native';
import {Icon} from 'native-base';
import PropTypes from 'prop-types';
import {useDispatch} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';

import {
  Button,
  FlexContainer,
  RowContainer,
  SeparatorVertical,
} from '~/BaseComponent/index';
import EmbedAudioAnimate from '~/BaseComponent/components/elements/result/EmbedAudioAnimate';
import TextKaraoke from '~/BaseComponent/components/elements/karaoke/TextKaraoke';
import {getArrFromText, matchAllRegex} from '~/utils/utils';
import {OS} from '~/constants/os';
import {colors} from '~/themes';
import {increaseScore} from '~/features/script/ScriptAction';
import {doneQuestion} from '~/features/activity/ActivityAction';
import {translate} from '~/utils/multilanguage';

const equal = (prev, next) => {
  return !(
    prev.sentence !== next.sentence ||
    (prev.currentTime !== next.currentTime &&
      next.currentTime >= next.item.start) ||
    (prev.currentTime !== next.currentTime &&
      next.currentTime < next.item.start)
  );
};

const TextKaraokeMemo = React.memo(TextKaraoke, equal);

const ListenAndRepeatKaraoke = (props) => {
  const {rawData, showRecord} = props;
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [sentence, setPlaySentence] = React.useState(null);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const data = React.useMemo(() => {
    const res = [];
    const getDetail = (item) => {
      const pronunciationRegex = /<.*?>/g;
      const rawContent = item.text.replace(/[<|>]/g, '').trim();
      const jump =
        (parseFloat(item.end) - parseFloat(item.start)) / rawContent.length;
      const listMatchAll = matchAllRegex(pronunciationRegex, item.text);
      let arr = [];
      if (listMatchAll.length === 0) {
        arr = [...arr, ...getArrFromText(item.text)];
      } else {
        listMatchAll.map((it, index) => {
          if (index === 0 && it.index > 0) {
            arr = [...arr, ...getArrFromText(it.input.slice(0, it.index))];
          }
          arr = [...arr, ...getArrFromText(it[0].replace(/[<|>]/g, ''), true)];
          if (index === listMatchAll.length - 1) {
            arr = [
              ...arr,
              ...getArrFromText(it.input.slice(it[0].length + it.index)),
            ];
          } else {
            arr = [
              ...arr,
              ...getArrFromText(
                it.input.slice(
                  it.index + it[0].length,
                  listMatchAll[index + 1].index,
                ),
              ),
            ];
          }
        });
      }
      arr = arr.map((arrItem, index) => {
        return {
          ...arrItem,
          start: parseFloat(item.start) + jump * index,
          end: parseFloat(item.start) + jump * (index + 1),
        };
      });
      return {
        ...item,
        detail: arr,
        start: parseFloat(item.start),
        end: parseFloat(item.end),
      };
    };
    if (rawData.word) {
      res.push(getDetail(rawData.word));
    }
    if (rawData.sentence) {
      res.push(getDetail(rawData.sentence));
    }
    if (rawData.letter) {
      res.push(getDetail(rawData.letter));
    }

    return res;
  }, [rawData]);

  React.useEffect(() => {
    if (!isFocused) {
      if (audioRef && audioRef.current) {
        audioRef.current.pause();
      }
    }
  }, [isFocused]);

  const playKaraokeSentence = React.useCallback((item) => {
    setPlaySentence(item);
  }, []);

  const renderItem = React.useCallback(
    ({item}) => {
      return (
        <FlexContainer alignItems={'center'} marginHorizontal={24}>
          <RowContainer justifyContent={'center'} style={styles.container}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                playKaraokeSentence(item);
              }}>
              <RowContainer
                style={{flex: 1, flexWrap: 'wrap'}}
                paddingVertical={8}>
                {item.detail.map((detailItem) => {
                  return (
                    <TextKaraokeMemo
                      key={detailItem.key}
                      currentTime={currentTime}
                      item={detailItem}
                      isSelectSentence={sentence && item.id === sentence.id}
                      sentence={sentence}
                      theme={'white'}
                    />
                  );
                })}
              </RowContainer>
            </TouchableOpacity>
          </RowContainer>
          {!!item.letter && (
            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                marginTop: 48,
              }}
              onPress={() => {
                showRecord(item);
                audioRef.current.pause();
              }}>
              <View
                alignItems={'center'}
                justifyContent={'center'}
                backgroundColor={'#E2E6EF'}
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                }}>
                <View
                  alignItems={'center'}
                  justifyContent={'center'}
                  backgroundColor={colors.primary}
                  style={{width: 100, height: 100, borderRadius: 50}}>
                  <Icon
                    name="microphone"
                    type="FontAwesome"
                    style={{color: colors.white, fontSize: 57}}
                  />
                </View>
              </View>
            </TouchableOpacity>
          )}
        </FlexContainer>
      );
    },
    [sentence, currentTime, playKaraokeSentence, showRecord, audioRef],
  );

  return (
    <FlexContainer backgroundColor={colors.mainBgColor}>
      <EmbedAudioAnimate
        ref={audioRef}
        isUser
        isSquare
        audio={rawData.audio}
        getCurrentTime={setCurrentTime}
        sentence={sentence}
        setSentence={setPlaySentence}
        fullWidth
      />
      <FlexContainer justifyContent={'space-between'}>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <SeparatorVertical md />}
          style={{flexGrow: 0, paddingVertical: 24}}
        />
        <View paddingHorizontal={24} paddingBottom={OS.hasNotch ? 48 : 24}>
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
              if (
                !props.selectedItem ||
                (props.selectedItem && !props.selectedItem.isCorrect)
              ) {
                dispatch(increaseScore(0, 0, 1));
              }
              props.onNext();
            }}>
            {translate('Tiếp tục')}
          </Button>
        </View>
      </FlexContainer>
    </FlexContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.white,
    borderRadius: 20,
    backgroundColor: colors.white,
  },
  selected: {borderColor: colors.primary, borderWidth: 1},
});

ListenAndRepeatKaraoke.propTypes = {
  rawData: PropTypes.object,
  selectedItem: PropTypes.object,
  onNext: PropTypes.func,
  showRecord: PropTypes.func,
};

ListenAndRepeatKaraoke.defaultProps = {
  rawData: {},
  selectedItem: null,
  onNext: () => {},
  showRecord: () => {},
};

export default ListenAndRepeatKaraoke;
