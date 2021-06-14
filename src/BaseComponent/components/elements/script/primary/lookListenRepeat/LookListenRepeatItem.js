import React, {useEffect, useRef, useMemo, useCallback, useState} from 'react';
import {StyleSheet, View, TouchableWithoutFeedback, Text} from 'react-native';
import FastImage from 'react-native-fast-image';
import Sound from 'react-native-sound';
import PropTypes from 'prop-types';

import {OS} from '~/constants/os';
import EmbedAudioAnimate from '~/BaseComponent/components/elements/result/EmbedAudioAnimate';
import {RowContainer} from '~/BaseComponent';
import TextKaraoke from '~/BaseComponent/components/elements/karaoke/TextKaraoke';

const equal = (prev, next) => {
  return !(prev.active !== next.active);
};

const TextKaraokeMemo = React.memo(TextKaraoke, equal);

const LookListenRepeatItem = (props) => {
  const fullAudioRef = useRef(null);
  const audioRef = useRef(null);
  const clipInfoRef = useRef(null);
  const mapDoneRef = useRef({});
  const timer = useRef(null);
  const mapActiveRef = useRef(new Map());
  const [listActive, setListActive] = React.useState(new Map());

  const [fullAudioState, setFullAudioState] = useState(null);
  const {item, setCanContinue, stopAllSoundRef} = props;
  const itemIndex = props.index;
  const data = item.object;
  const conversations = data.conversations;
  const karaokeItems = item.karaokeItems;
  const audioUrl = data.audio;
  const {backgroundUrl, backgroundHeight, backgroundWidth} = item;

  const timeEndConversation = useMemo(() => {
    let timeEnd = 0;
    if (conversations && conversations.length > 0) {
      conversations.forEach((it) => {
        if (it.end > timeEnd) {
          timeEnd = it.end;
        }
      });
      return timeEnd;
    }
    return 0;
  }, [conversations]);

  useEffect(() => {
    if (props.index === props.pageIndex) {
      setTimeout(() => {
        fullAudioRef?.current?.play();
      }, 500);
    } else {
      fullAudioRef?.current?.pause();
    }
  }, [props.index, props.pageIndex]);

  const stopAndReleaseCurrentSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.stop();
      audioRef.current.release();
      audioRef.current = null;
    }
    if (fullAudioRef.current && fullAudioRef.current.stop) {
      fullAudioRef.current.stop();
      fullAudioRef.current.release();
      fullAudioRef.current = null;
    }
  }, []);

  const pauseCurrentSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (fullAudioRef.current && fullAudioRef.current.pause) {
      fullAudioRef.current.pause();
    }
  }, []);

  useEffect(() => {
    stopAllSoundRef.current = {
      ...stopAllSoundRef.current,
      [itemIndex]: {pauseAll: pauseCurrentSound},
    };
  }, [itemIndex, pauseCurrentSound, stopAllSoundRef]);

  const updateActiveMaps = useCallback(
    (time) => {
      let mapUpdate = new Map();
      let hasDiff = false;
      karaokeItems.map((it) => {
        it.detail.map((wordItem) => {
          wordItem.map((charItem) => {
            const value = time >= charItem.end;
            mapUpdate.set(charItem.key, value);
            if (!hasDiff) {
              hasDiff = !(value === mapActiveRef.current.get(charItem.key));
            }
          });
        });
      });
      if (hasDiff) {
        mapActiveRef.current = mapUpdate;
        setListActive(mapUpdate);
      }
    },
    [karaokeItems],
  );

  const updateEmbedPlayerTime = useCallback(
    (second) => {
      if (second > 0) {
        updateActiveMaps(second);
        if (timeEndConversation > 0 && second >= timeEndConversation - 1) {
          setCanContinue();
        }
      }
    },
    [updateActiveMaps, setCanContinue, timeEndConversation],
  );

  useEffect(() => {
    Sound.enableInSilenceMode(true);
    Sound.setCategory('Playback');
    timer.current = setInterval(() => {
      if (audioRef.current && clipInfoRef.current) {
        audioRef.current.getCurrentTime((second) => {
          if (second > 0) {
            updateActiveMaps(second);
            if (clipInfoRef.current) {
              if (second >= clipInfoRef.current.end - 1) {
                audioRef.current.stop();
                const id = clipInfoRef.current.id;
                mapDoneRef.current[id] = 'done';
                clipInfoRef.current = null;
                if (
                  Object.keys(mapDoneRef.current).length ===
                  conversations.length
                ) {
                  pauseCurrentSound();
                  setCanContinue();
                }
              }
            }
          }
        });
      }
    }, 300);
    return () => {
      clearInterval(timer.current);
      timer.current = null;
      stopAndReleaseCurrentSound();
    };
  }, [
    stopAndReleaseCurrentSound,
    conversations.length,
    setCanContinue,
    pauseCurrentSound,
    updateActiveMaps,
  ]);
  useEffect(() => {
    if (fullAudioState === 'playing') {
      if (clipInfoRef.current && audioRef.current && audioRef.current.stop) {
        audioRef.current.stop();
        clipInfoRef.current = null;
      }
    }
  }, [fullAudioState]);
  useEffect(() => {
    audioRef.current = new Sound(audioUrl, '', (error) => {
      if (error) {
      }
    });
  }, [audioUrl]);

  const defaultTextSize = Math.floor(
    data.default_text_size * (OS.WIDTH / backgroundWidth),
  );

  const styleContent = {
    width: OS.WIDTH,
    height: OS.WIDTH * (backgroundHeight / backgroundWidth),
  };

  const playAudio = useCallback((clipInfo) => {
    if (fullAudioRef.current && fullAudioRef.current.pause) {
      fullAudioRef.current.pause();
    }
    if (audioRef.current) {
      clipInfoRef.current = null;
      audioRef.current.pause();
      audioRef.current.setCurrentTime(clipInfo.start);
      audioRef.current.play();
      clipInfoRef.current = {...clipInfo};
    }
  }, []);

  const renderAudioPlayer = useCallback(() => {
    return (
      <EmbedAudioAnimate
        ref={fullAudioRef}
        autoPlay={false}
        audio={audioUrl}
        isUser
        isSquare
        fullWidth
        getAudioState={setFullAudioState}
        getCurrentTime={updateEmbedPlayerTime}
      />
    );
  }, [audioUrl, updateEmbedPlayerTime]);

  const renderConversations = useCallback(() => {
    return (
      <>
        {conversations.map((it, idx) => {
          return (
            <SentenceItem
              key={idx}
              data={it}
              parentSize={styleContent}
              defaultTextSize={defaultTextSize}
              playAudio={playAudio}
              karaokeItem={karaokeItems[idx]}
              listActive={listActive}
            />
          );
        })}
      </>
    );
  }, [
    conversations,
    defaultTextSize,
    styleContent,
    playAudio,
    karaokeItems,
    listActive,
  ]);
  return (
    <View style={stylesItem.item}>
      {renderAudioPlayer()}
      <View>
        <FastImage
          style={styleContent}
          source={{
            uri: backgroundUrl,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
        {renderConversations()}
      </View>
    </View>
  );
};
const SentenceItem = (props) => {
  const {
    data,
    parentSize,
    defaultTextSize,
    playAudio,
    karaokeItem,
    listActive,
  } = props;
  const {x, y, width, start, end, id} = data;
  const styleView = {
    position: 'absolute',
    left: x * parentSize.width,
    top: y * parentSize.height,
    width: (width || 1.0) * parentSize.width,
  };

  const onPress = useCallback(() => {
    playAudio({start: parseFloat(start), end: parseFloat(end), id: id});
  }, [playAudio, start, end, id]);

  const renderChars = useCallback(
    (word, hasSpace) => {
      return (
        <>
          {hasSpace && <Text> </Text>}
          <RowContainer>
            {word.map((detailItem) => {
              if (detailItem.text === '>' || detailItem.text === '<') {
                return null;
              }
              return (
                <TextKaraokeMemo
                  theme="white"
                  key={detailItem.key}
                  active={listActive.get(detailItem.key)}
                  item={detailItem}
                  customStyle={{
                    fontSize: defaultTextSize,
                    lineHeight: defaultTextSize * 1.25,
                    fontFamily: 'CircularStd-Book',
                    fontWeight: '500',
                  }}
                />
              );
            })}
          </RowContainer>
        </>
      );
    },
    [defaultTextSize, listActive],
  );
  const renderWords = useCallback(() => {
    const {detail} = karaokeItem;
    return (
      <RowContainer style={stylesConversationItem.wordWrap}>
        {detail.map((wordItem, index) => {
          return renderChars(wordItem, index > 0);
        })}
      </RowContainer>
    );
  }, [renderChars, karaokeItem]);
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styleView}>{renderWords()}</View>
    </TouchableWithoutFeedback>
  );
};

const stylesItem = StyleSheet.create({
  item: {
    flex: 1,
  },
});
const stylesConversationItem = {
  wordWrap: {
    flexWrap: 'wrap',
  },
};
export default LookListenRepeatItem;

LookListenRepeatItem.propTypes = {
  item: PropTypes.object.isRequired,
  setCanContinue: PropTypes.func,
  stopAllSoundRef: PropTypes.object,
  index: PropTypes.number,
};

LookListenRepeatItem.defaultProps = {
  item: {},
  setCanContinue: () => {},
  stopAllSoundRef: {},
  index: 0,
};
