import React, {useCallback, useState, useEffect, useRef} from 'react';
import {shallowEqual, useSelector, useDispatch} from 'react-redux';
import FastImage from 'react-native-fast-image';
import {TouchableWithoutFeedback, View, StyleSheet} from 'react-native';
import Sound from 'react-native-sound';
import {View as AnimateView} from 'react-native-animatable';

import {Text} from '~/BaseComponent/index';
import ScriptWrapper from '~/BaseComponent/components/elements/script/ScriptWrapper';
import Button from '~/BaseComponent/components/base/Button';
import {matchAllRegex} from '~/utils/utils';
import {OS} from '~/constants/os';
import {colors} from '~/themes';
import {generateNextActivity} from '~/utils/script';
import {increaseScore} from '~/features/script/ScriptAction';
import {translate} from '~/utils/multilanguage';

const PrimaryPointAndSayBubbleScreen = () => {
  const dispatch = useDispatch();
  const [mapAnswer, setMapAnswer] = useState(new Map());
  const [listAudios, setListAudios] = useState([]);
  const audioIndex = useRef(0);
  const soundRef = useRef(null);
  const clickedObjectMap = useRef(new Map());
  const [currentObjectID, setCurrentObjectID] = useState(null);

  const stopAndReleaseCurrentSound = useCallback(() => {
    if (soundRef.current) {
      soundRef.current.stop();
      soundRef.current.release();
      soundRef.current = null;
    }
  }, []);

  useEffect(() => {
    Sound.enableInSilenceMode(true);
    Sound.setCategory('Playback');

    return () => {
      stopAndReleaseCurrentSound();
    };
  }, [stopAndReleaseCurrentSound]);

  const currentScriptItem = useSelector(
    (state) => state.script.currentScriptItem,
    shallowEqual,
  );

  const playNextAudio = useCallback(() => {
    if (audioIndex.current < listAudios.length) {
      soundRef.current = new Sound(
        listAudios[audioIndex.current],
        '',
        (error) => {
          if (!error) {
            soundRef.current.play(() => {
              playNextAudio();
            });
          } else {
            soundRef.current = null;
          }
        },
      );
      audioIndex.current += 1;
    }
  }, [listAudios]);

  useEffect(() => {
    stopAndReleaseCurrentSound();
    if (listAudios && listAudios.length > 0) {
      playNextAudio();
    }
  }, [listAudios, playNextAudio, stopAndReleaseCurrentSound]);

  const renderBackground = useCallback(() => {
    const {
      backgroundUrl,
      backgroundWidth,
      backgroundHeight,
    } = currentScriptItem;
    const backgroundRatio = backgroundHeight / backgroundWidth;
    return (
      <FastImage
        style={{
          width: OS.WIDTH,
          height: OS.WIDTH * backgroundRatio,
        }}
        source={{
          uri: backgroundUrl,
        }}
      />
    );
  }, [currentScriptItem]);

  const renderQuestions = useCallback(() => {
    const {
      backgroundWidth,
      backgroundHeight,
      default_text_size,
    } = currentScriptItem;
    const ratio = currentScriptItem.backgroundRatio;
    const backgroundRatio = backgroundHeight / backgroundWidth;
    const parentSize = {
      width: OS.WIDTH,
      height: OS.WIDTH * backgroundRatio,
    };

    const {questions} = currentScriptItem;
    const fontSize = Math.floor(
      default_text_size * (OS.WIDTH / (backgroundWidth / ratio)),
    );

    return questions.map((question) => {
      const answer = mapAnswer.get(question.id);
      return (
        <QuestionItem
          question={question}
          answer={answer}
          parentSize={parentSize}
          fontSize={fontSize}
        />
      );
    });
  }, [currentScriptItem, mapAnswer]);

  const setCurrentAnswer = useCallback((objectID, answers, score) => {
    let mapUpdate = new Map();
    let audios = [];
    answers.map((item) => {
      mapUpdate.set(item.question.id, item.text);
      audios.push(item.audio);
    });
    setCurrentObjectID(objectID);
    setMapAnswer(mapUpdate);
    audioIndex.current = 0;
    setListAudios(audios);
    clickedObjectMap.current.set(objectID, score);
  }, []);

  const renderObjects = useCallback(() => {
    const {objects, backgroundHeight, backgroundWidth} = currentScriptItem;
    const backgroundRatio = backgroundHeight / backgroundWidth;
    const parentSize = {
      width: OS.WIDTH,
      height: OS.WIDTH * backgroundRatio,
    };
    return objects.map((object) => {
      return (
        <ObjectItem
          object={object}
          setCurrentAnswer={setCurrentAnswer}
          parentSize={parentSize}
          currentObjectID={currentObjectID}
        />
      );
    });
  }, [currentScriptItem, currentObjectID, setCurrentAnswer]);

  const handleContinue = useCallback(() => {
    if (soundRef.current) {
      soundRef.current.stop();
    }
    let totalScore = 0;
    if (clickedObjectMap.current) {
      clickedObjectMap.current.forEach((scoreIt) => {
        totalScore += parseInt(scoreIt);
      });
    }
    dispatch(increaseScore(totalScore, 1, 0));
    generateNextActivity();
  }, []);

  if (!currentScriptItem) {
    return null;
  }

  return (
    <ScriptWrapper mainBgColor={colors.white}>
      <View style={styles.mainContent}>
        {renderBackground()}
        {renderQuestions()}
        {renderObjects()}
      </View>
      <View style={styles.bottomWrapper}>
        <Button
          large
          primary
          rounded
          block
          uppercase
          bold
          icon
          onPress={handleContinue}>
          {`${translate('Tiếp tục')}`}
        </Button>
      </View>
    </ScriptWrapper>
  );
};

const QuestionItem = (props) => {
  const [childs, setChilds] = useState([]);
  const [answers, setAnswers] = useState([]);
  const {question, answer, parentSize, fontSize} = props;
  const {id, text, x, y, width} = question;

  useEffect(() => {
    if (answer) {
      const list = answer.split('|') || [];
      setAnswers(list);
    } else {
      setAnswers([]);
    }
  }, [answer]);

  useEffect(() => {
    const inputText = text;

    let textParts = [];
    let currentPointer = 0;

    const answerRegex = /\[.*?]/g;
    const matchs = matchAllRegex(answerRegex, inputText);
    let childKey = 0;

    (matchs || []).forEach((it) => {
      const itemLength = it[0].length;
      const indexItem = it.index;

      if (currentPointer < indexItem) {
        const subString = inputText.substr(
          currentPointer,
          indexItem - currentPointer,
        );
        textParts.push({text: subString, isBlank: false, key: `${childKey}`});
        childKey += 1;
      }

      textParts.push({text: '_____', isBlank: true, key: `${childKey}`});
      childKey += 1;

      currentPointer = indexItem + itemLength;
    });
    if (currentPointer <= inputText.length - 1) {
      const subString = inputText.substr(
        currentPointer,
        inputText.length - 1 - currentPointer + 1,
      );
      textParts.push({text: subString, isBlank: false, key: `${childKey}`});
      childKey += 1;
    }
    setChilds(textParts);
  }, [text]);

  const renderChilds = useCallback(() => {
    const stylesText = {fontSize: fontSize};
    let currentBlankIndex = 0;
    return childs.map((it) => {
      if (it.isBlank) {
        let blankText = it.text;
        if (currentBlankIndex < answers.length) {
          blankText = answers[currentBlankIndex];
        }
        currentBlankIndex += 1;
        return (
          <Text style={stylesText} key={it.key} primary>
            {blankText}
          </Text>
        );
      }
      return (
        <Text style={stylesText} key={it.key}>
          {it.text}
        </Text>
      );
    });
  }, [childs, answers, fontSize]);

  const stylesView = [
    styles.question,
    {
      position: 'absolute',
      left: x * parentSize.width,
      top: y * parentSize.height,
      width: (width || 1.0) * parentSize.width + 15 * 2,
    },
  ];

  return (
    <View style={stylesView} key={id}>
      {renderChilds()}
    </View>
  );
};

const ObjectItem = (props) => {
  const {object, setCurrentAnswer, parentSize, currentObjectID} = props;
  const [animated, setAnimated] = useState(0);
  const animatedRef = useRef(0);
  const onPress = useCallback(() => {
    const {id, answers, score} = object;
    setCurrentAnswer(id, answers, score);
    setAnimated(animatedRef.current + 1);
    animatedRef.current = animatedRef.current + 1;
  }, [object, setCurrentAnswer]);

  const renderImage = useCallback(() => {
    const {id, url, x, y, height, width} = object;
    const style = {
      position: 'absolute',
      top: y * parentSize.height,
      left: x * parentSize.width,
      width: width * parentSize.width,
      height: height * parentSize.height,
    };
    const styleImage = {
      position: 'absolute',
      top: -5,
      left: -5,
      width: width * parentSize.width + 10,
      height: height * parentSize.height + 10,
    };
    const isSelected = currentObjectID === id;
    if (!isSelected) {
      return (
        <TouchableWithoutFeedback onPress={onPress} key={id}>
          <View style={style} />
        </TouchableWithoutFeedback>
      );
    } else {
      return (
        <TouchableWithoutFeedback onPress={onPress} key={`${id}_${animated}`}>
          <AnimateView
            style={style}
            animation="pulse"
            useNativeDriver={true}
            easing="ease-in-out"
            duration={300}>
            <FastImage
              style={styleImage}
              source={{
                uri: url,
              }}
              resizeMode={'contain'}
            />
          </AnimateView>
        </TouchableWithoutFeedback>
      );
    }
  }, [object, parentSize, onPress, currentObjectID, animated]);

  return renderImage();
};
const styles = StyleSheet.create({
  question: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors.primary,
    paddingHorizontal: 15,
  },
  mainContent: {
    flex: 1,
  },
  bottomWrapper: {
    paddingHorizontal: 25,
    marginBottom: OS.hasNotch ? 48 : 24,
  },
});
export default PrimaryPointAndSayBubbleScreen;
