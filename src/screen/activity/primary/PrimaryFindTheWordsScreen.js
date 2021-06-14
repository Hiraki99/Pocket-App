import {SketchCanvas} from '@terrylinla/react-native-sketch-canvas';
import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';

import ScriptWrapper from '~/BaseComponent/components/elements/script/ScriptWrapper';
import {Button, FlexContainer, SeparatorVertical, Text} from '~/BaseComponent';
import {OS} from '~/constants/os';
import {doneQuestion} from '~/features/activity/ActivityAction';
import {increaseScore} from '~/features/script/ScriptAction';
import {currentScriptFindTheWordsSelector} from '~/selector/activity';
import {colors} from '~/themes';
import {generateNextActivity} from '~/utils/script';
import {playAudioAnswer} from '~/utils/utils';
import {translate} from '~/utils/multilanguage';

const color = 'rgba(0, 255, 84, 0.3)';

const PrimaryFindTheWordsScreen = () => {
  const canvasRef = React.useRef();
  const dispatch = useDispatch();
  const currentScriptItem = useSelector(
    currentScriptFindTheWordsSelector,
    shallowEqual,
  );
  const [startPoint, setStartPoint] = React.useState({});
  const [detailText, setDetailTextGame] = React.useState(
    currentScriptItem.detailText,
  );
  const [detailAnswer, setDetailAnswer] = React.useState(
    currentScriptItem.detailAnswer,
  );

  const styleCharacter = React.useMemo(() => {
    if (!currentScriptItem) {
      return {
        width: 1,
        height: 1,
      };
    }
    const rows = currentScriptItem?.rows || 1;
    return {
      width: (OS.WIDTH - 32) / rows,
      height: (OS.WIDTH - 32) / rows,
    };
  }, [currentScriptItem]);
  const [styleCanvas, setStyleCanvas] = React.useState({});
  const arrDetailText = React.useMemo(() => {
    return Object.keys(detailText).map((item) => detailText[item]);
  }, [detailText]);

  const onLayout = React.useCallback((e) => {
    const {
      nativeEvent: {
        layout: {x, y, width, height},
      },
    } = e;
    setStyleCanvas({top: y, left: x, width, height});
  }, []);

  const standardizedPoint = React.useCallback(
    (x, y, isEnd) => {
      if (!OS.IsAndroid) {
        const res = arrDetailText.filter((item) => {
          return (
            Math.pow(item.centerX - x, 2) + Math.pow(item.centerY - y, 2) <=
            Math.pow(styleCharacter.width / 2, 2)
          );
        });

        if (res.length > 0) {
          return {
            x: isEnd ? res[0].centerX + 36 : res[0].centerX - 16,
            y: isEnd ? res[0].centerY + 32 : res[0].centerY - 16,
          };
        }
      }

      return {x, y};
    },
    [arrDetailText, styleCharacter],
  );

  const renderItem = React.useCallback(
    ({item, index}) => {
      return (
        <View
          justifyContent={'center'}
          alignItems={'center'}
          style={[styles.characterItem, styleCharacter]}
          onLayout={() => {
            const row = Math.floor(index / (currentScriptItem?.rows || 1));
            const column = index % (currentScriptItem?.rows || 1);
            const top = Math.ceil(16 + row * styleCharacter.width);
            const left = Math.ceil(16 + column * styleCharacter.height);
            setDetailTextGame((old) => {
              return {
                ...old,
                [item.id]: {
                  ...old[item.id],
                  top,
                  left,
                  centerY: top + styleCharacter.width / 2,
                  centerX: left + styleCharacter.width / 2,
                  width: styleCharacter.width,
                  height: styleCharacter.height,
                },
              };
            });
          }}>
          <Text h3 bold uppercase>
            {item.text}
          </Text>
        </View>
      );
    },
    [currentScriptItem, styleCharacter],
  );
  const renderAnswer = React.useCallback(
    ({item}) => {
      return (
        <View
          justifyContent={'center'}
          alignItems={'center'}
          style={[
            styles.answersItem,
            detailAnswer[item.text].isBonus
              ? {borderColor: colors.primary}
              : {},
          ]}>
          <Text
            h5
            uppercase
            bold={detailAnswer[item.text].isBonus}
            color={
              detailAnswer[item.text].isBonus ? colors.primary : colors.helpText
            }>
            {item.text}
          </Text>
          {detailAnswer[item.text].isBonus && (
            <View style={styles.checker}>
              <Ionicons
                name={'md-checkmark-sharp'}
                size={20}
                color={colors.white}
              />
            </View>
          )}
        </View>
      );
    },
    [detailAnswer],
  );

  const renderSeparator = React.useCallback(
    (height = 1, backgroundColor = null) => {
      return () => {
        return (
          <SeparatorVertical
            height={height}
            backgroundColor={backgroundColor}
          />
        );
      };
    },
    [],
  );

  const onStrokeStart = React.useCallback((x, y) => {
    setStartPoint({x, y});
  }, []);

  const checkInside = (point, vs) => {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

    let x = point.x,
      y = point.y;

    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      let xi = vs[i].x,
        yi = vs[i].y;
      let xj = vs[j].x,
        yj = vs[j].y;

      let intersect =
        yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) {
        inside = !inside;
      }
    }

    return inside;
  };

  const doOverlap = React.useCallback((l1 = {}, r1 = {}, l2 = {}, r2 = {}) => {
    const centerCheck = {
      x: (l2.x + r2.x) / 2,
      y: (l2.y + r2.y) / 2,
    };
    let direction = 'any';
    let topLeftPoint, topRightPoint, bottomLeftPoint, bottomRightPoint;
    let sum = false;
    if (Math.abs(l1.x - r1.x) <= 50) {
      direction = 'vertical';
    }
    if (Math.abs(l1.y - r1.y) <= 50) {
      direction = 'horizontal';
    }

    if (direction === 'vertical') {
      topLeftPoint = {
        x: l1.x - 25,
        y: l1.y,
      };
      topRightPoint = {
        x: l1.x + 25,
        y: l1.y,
      };
      bottomLeftPoint = {
        x: l1.x - 25,
        y: r1.y + 32,
      };
      bottomRightPoint = {
        x: l1.x + 25,
        y: r1.y + 32,
      };
      sum = checkInside(centerCheck, [
        topLeftPoint,
        topRightPoint,
        bottomRightPoint,
        bottomLeftPoint,
      ]);
    }

    if (direction === 'horizontal') {
      topLeftPoint = {
        x: l1.x - 25,
        y: l1.y - 25 > 0 ? l1.y - 25 : 0,
      };
      topRightPoint = {
        x: r1.x + 25,
        y: l1.y - 25 > 0 ? l1.y - 25 : 0,
      };
      bottomLeftPoint = {
        x: l1.x - 25,
        y: l1.y + 25,
      };
      bottomRightPoint = {
        x: r1.x + 25,
        y: r1.y + 25,
      };

      sum = checkInside(centerCheck, [
        topLeftPoint,
        bottomLeftPoint,
        bottomRightPoint,
        topRightPoint,
      ]);
    }

    if (direction === 'any') {
      topLeftPoint = {
        x: l1.x - 25,
        y: l1.y - 25,
      };
      topRightPoint = {
        x: l1.x + 25,
        y: l1.y,
      };
      bottomLeftPoint = {
        x: r1.x - 30,
        y: r1.y + 25,
      };
      bottomRightPoint = {
        x: r1.x + 30,
        y: r1.y + 25,
      };

      sum = checkInside(centerCheck, [
        topLeftPoint,
        topRightPoint,
        bottomRightPoint,
        bottomLeftPoint,
      ]);
    }

    return sum;
    // If one rectangle is on left side of other
    // if (l1.x >= r2.x || l2.x >= r1.x) {
    //   return false;
    // }
    // // If one rectangle is above other
    // return !(l1.y >= r2.y || l2.y >= r1.y);
  }, []);

  const onStrokeEnd = React.useCallback(
    (data) => {
      const shape = {
        topLeft: startPoint,
        bottomRight: {
          x: data.lastPoint.endX,
          y: data.lastPoint.endY,
        },
      };
      // console.log('onStrokeEnd ', shape);
      const textPuzzle = arrDetailText.filter((item) => {
        // console.log('item ', item.text, index);
        const left2 = {
          x: item.left,
          y: item.top,
        };
        const right2 = {
          x: item.left + item.width,
          y: item.top + item.height,
        };
        return doOverlap(shape.topLeft, shape.bottomRight, left2, right2);
      });
      const textArray = textPuzzle.map((item) => item.text);
      const answer = textArray.join('');

      // console.log('answer ', answer);

      if (!detailAnswer[answer]) {
        canvasRef.current.deletePath(data?.path?.id);
        const dataAddPath = {
          ...data,
          path: {
            ...data.path,
            color: 'rgba(204, 22, 13, 0.5)',
            id: Math.ceil(Math.random() * 1000000) + 1000000,
          },
        };
        canvasRef.current.addPath(dataAddPath);
        playAudioAnswer(false);
        setTimeout(() => {
          canvasRef.current.deletePath(dataAddPath?.path?.id);
        }, 500);
      } else {
        playAudioAnswer(true);
        if (detailAnswer[answer].isBonus) {
          return canvasRef.current.deletePath(data?.path?.id);
        }
        setDetailAnswer((old) => {
          return {
            ...old,
            [answer]: {
              ...old[answer],
              isBonus: true,
            },
          };
        });
        dispatch(increaseScore(1, 1, 0));
        dispatch(doneQuestion());
      }
    },
    [startPoint, arrDetailText, doOverlap, detailAnswer, dispatch],
  );

  return (
    <ScriptWrapper showProgress={false}>
      <FlexContainer paddingVertical={16} paddingHorizontal={16}>
        {currentScriptItem.rows >= 1 && (
          <FlatList
            data={currentScriptItem.data || []}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            scrollEnabled={false}
            numColumns={parseInt(currentScriptItem.rows, 10)}
            style={[styles.flatlist]}
            ItemSeparatorComponent={renderSeparator(1, colors.helpText)}
            onLayout={onLayout}
          />
        )}

        <View style={[styles.baseContainerCanvas, styleCanvas || {}]}>
          <SketchCanvas
            ref={canvasRef}
            style={styles.canvas}
            strokeColor={color}
            strokeWidth={50}
            modeDrawLine
            standardizedPoint={standardizedPoint}
            onStrokeStart={onStrokeStart}
            onStrokeEnd={onStrokeEnd}
          />
        </View>
        <FlatList
          data={currentScriptItem.items}
          keyExtractor={(item) => item.key}
          renderItem={renderAnswer}
          numColumns={2}
          ItemSeparatorComponent={renderSeparator(12, colors.white)}
          style={{paddingTop: 24}}
        />
        <View paddingBottom={OS.hasNotch ? 12 : 0}>
          <Button
            large
            primary
            rounded
            block
            uppercase
            bold
            icon
            onPress={() => {
              const keys = Object.keys(detailAnswer);
              const numberAnswerSuccess = keys.filter(
                (item) => detailAnswer[item].isBonus,
              ).length;
              if (numberAnswerSuccess < keys.length) {
                dispatch(
                  increaseScore(0, 0, keys.length - numberAnswerSuccess),
                );
              }
              generateNextActivity();
            }}>
            {translate('Tiếp tục')}
          </Button>
        </View>
      </FlexContainer>
    </ScriptWrapper>
  );
};

const styles = StyleSheet.create({
  characterItem: {
    borderRightWidth: 1,
  },
  answersItem: {
    width: (OS.WIDTH - 32 - 16) / 2,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginRight: 16,
    borderColor: colors.helpText3,
  },
  checker: {
    position: 'absolute',
    top: 10,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  baseContainerCanvas: {
    flexDirection: 'column',
    position: 'absolute',
    zIndex: 10,
  },
  flatlist: {
    flexGrow: 0,
    borderWidth: 1,
  },
  canvas: {flex: 1},
});

export default PrimaryFindTheWordsScreen;
