import React, {useRef} from 'react';
import {
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import FastImage from 'react-native-fast-image';

import ScriptWrapper from '~/BaseComponent/components/elements/script/ScriptWrapper';
import {Button, RowContainer, SeparatorVertical} from '~/BaseComponent/index';
import EmbedAudioAnimate from '~/BaseComponent/components/elements/result/EmbedAudioAnimate';
import TextKaraoke from '~/BaseComponent/components/elements/karaoke/TextKaraoke';
import {currentScriptListenAndChantSelector} from '~/selector/activity';
import {OS} from '~/constants/os';
import navigator from '~/navigation/customNavigator';
import {generateNextActivity} from '~/utils/script';
import {colors, images} from '~/themes';
import {
  doneQuestion,
  setTotalQuestion,
} from '~/features/activity/ActivityAction';
import {increaseScore} from '~/features/script/ScriptAction';
import {translate} from '~/utils/multilanguage';

const equal = (prev, next) => {
  return !(prev.active !== next.active);
};

const TextKaraokeMemo = React.memo(TextKaraoke, equal);

const PrimaryListenAndChantScreen = () => {
  const audioRef = useRef(null);
  const flatlistRef = useRef(null);
  const question = useSelector(currentScriptListenAndChantSelector);
  const [sentence, setPlaySentence] = React.useState(null);
  const [listActive, setListActive] = React.useState(new Map());
  const [audioState, setAudioState] = React.useState('paused');
  const [indexScrolled, setListIndexScrolled] = React.useState([]);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  React.useEffect(() => {
    dispatch(doneQuestion());
    dispatch(setTotalQuestion());
    dispatch(increaseScore(1, 1, 0));
  }, [dispatch]);

  React.useEffect(() => {
    if (!isFocused) {
      if (audioRef && audioRef.current) {
        audioRef.current.pause();
      }
    }
  }, [isFocused]);

  const actionGetTextActive = React.useCallback(
    (time) => {
      const details = question?.detailAllText || [];
      let mapUpdate = new Map();
      if (time === 0) {
        return setListActive(mapUpdate);
      }
      if (time < question.startTimeAudio) {
        return;
      }
      if (time > question.endTimeAudio) {
        if (listActive.size !== details.length) {
          details
            .filter((item) => item.start <= time)
            .map((item) => {
              if (!sentence) {
                mapUpdate.set(item.key, true);
              } else {
                mapUpdate.set(item.key, sentence.id === item.sentenceId);
              }
            });
          setListActive(mapUpdate);
        }
        return;
      }
      details
        .filter((item) => item.start <= time)
        .map((item) => {
          if (!sentence) {
            mapUpdate.set(item.key, true);
          } else {
            mapUpdate.set(item.key, sentence.id === item.sentenceId);
          }
        });
      setListActive(mapUpdate);
    },
    [question, listActive, sentence],
  );

  const playKaraokeSentence = React.useCallback(
    (item, index) => {
      setListActive(new Map());
      setListIndexScrolled((old) => {
        return old.filter((it) => it < index);
      });
      if (!sentence || (sentence && sentence.id !== item.id)) {
        setPlaySentence({
          id: item.id,
          start: item.start,
          end: item.end,
        });
      } else {
        if (sentence.id === item.id && audioState === 'playing') {
          audioRef.current.pause();
        }
        if (sentence.id === item.id && audioState === 'paused') {
          audioRef.current.playSentence();
        }
      }
    },
    [sentence, audioRef, audioState],
  );

  const playYoutube = React.useCallback(() => {
    navigator.navigate('Youtube', {
      video: {
        videoId: question?.object?.youtube?.id,
      },
    });
  }, [question]);

  const onContinue = React.useCallback(() => {
    generateNextActivity();
  }, []);

  const onScrollToSentence = React.useCallback(
    (index) => {
      if (
        flatlistRef &&
        flatlistRef.current &&
        !indexScrolled.includes(index)
      ) {
        flatlistRef.current.scrollToIndex({
          animated: true,
          index: index,
        });
        setListIndexScrolled((old) => [...new Set([...old, index])]);
      }
    },
    [indexScrolled],
  );

  const onPlayEffect = React.useCallback(
    (time) => {
      return setPlaySentence(() => {
        const details = question?.detailAllText || [];
        let mapUpdate = new Map();
        details
          .filter((item) => item.start <= time)
          .map((item) => {
            mapUpdate.set(item.key, true);
          });
        setListActive(mapUpdate);
        return null;
      });
    },
    [question],
  );

  const onEndEffect = React.useCallback(() => {
    setPlaySentence(null);
    setListActive(new Map());
    setListIndexScrolled([]);
  }, []);
  const renderItem = React.useCallback(
    ({item, index}) => {
      return (
        <RowContainer
          alignItems={'flex-start'}
          paddingHorizontal={24}
          justifyContent={'space-between'}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              playKaraokeSentence(item, index);
            }}>
            <View style={styles.wrap}>
              {item.detailWord.map((word) => {
                return (
                  <RowContainer key={word.key} paddingRight={6}>
                    {word.data.map((detailItem) => {
                      return (
                        <TextKaraokeMemo
                          key={detailItem.key}
                          item={detailItem}
                          active={listActive.get(detailItem.key)}
                          index={index}
                          onScrollToSentence={onScrollToSentence}
                        />
                      );
                    })}
                  </RowContainer>
                );
              })}
            </View>
          </TouchableOpacity>
        </RowContainer>
      );
    },
    [listActive, playKaraokeSentence, onScrollToSentence],
  );

  const renderHeader = React.useCallback(() => {
    return (
      <View>
        <FastImage
          source={{uri: question.backgroundUrl}}
          style={styles.background}
        />
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={playYoutube}
          style={styles.youtube}>
          <View>
            <Image
              source={images.primary_play_video}
              style={styles.imageAction}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }, [question, playYoutube]);

  const renderSeparator = React.useCallback(() => {
    return <SeparatorVertical md />;
  }, []);
  return (
    <ScriptWrapper mainBgColor={'#1F2631'}>
      <EmbedAudioAnimate
        ref={audioRef}
        isUser
        isSquare
        audio={question?.object?.audio}
        getCurrentTime={actionGetTextActive}
        sentence={sentence}
        onPlayEffect={onPlayEffect}
        onEndEffect={onEndEffect}
        setSentence={setPlaySentence}
        getAudioState={setAudioState}
        fullWidth
      />
      {renderHeader()}
      <FlatList
        ref={flatlistRef}
        data={question.chants}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={renderSeparator}
        marginVertical={24}
        showsVerticalScrollIndicator={false}
        bounces={false}
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
          onPress={onContinue}>
          {translate('Tiếp tục')}
        </Button>
      </View>
    </ScriptWrapper>
  );
};

const styles = StyleSheet.create({
  background: {
    width: OS.WIDTH,
    height: (OS.WIDTH * 1080) / 1440,
    position: 'relative',
    zIndex: 1,
  },
  selected: {borderColor: colors.primary, borderWidth: 1},
  imageAction: {width: 40, height: 40},
  youtube: {position: 'absolute', bottom: 30, right: 10, zIndex: 20},
  wrap: {flex: 1, flexWrap: 'wrap', flexDirection: 'row'},
});

export default PrimaryListenAndChantScreen;
