import React from 'react';
import Carousel from 'react-native-snap-carousel';
import {useDispatch, useSelector} from 'react-redux';
import RNFS from 'react-native-fs';

import ScriptWrapper from '~/BaseComponent/components/elements/script/ScriptWrapper';
import LetTalkWithSituation from '~/BaseComponent/components/elements/speak/LetTalkWithSituation';
import {currentScriptSelector} from '~/selector/activity';
import {setTotalQuestion} from '~/features/activity/ActivityAction';
import {OS} from '~/constants/os';
import {colors} from '~/themes';
import {generateNextActivity} from '~/utils/script';

const PrimaryLetsTalkWithSituationsScreen = () => {
  const dispatch = useDispatch();
  const question = useSelector(currentScriptSelector);
  const carouselRef = React.useRef(null);
  const [activeSlide, setActiveSlide] = React.useState(0);

  React.useEffect(() => {
    const initRecord = async () => {
      const checkExistedFolder = await RNFS.exists(
        RNFS.DocumentDirectoryPath + '/rolePlayRecorder',
      );
      if (!checkExistedFolder) {
        RNFS.mkdir(RNFS.DocumentDirectoryPath + '/rolePlayRecorder');
      }
    };
    initRecord();
    return () => {
      RNFS.unlink(
        `${RNFS.DocumentDirectoryPath}/rolePlayRecorder`,
      ).then(() => {});
    };
  }, []);

  React.useEffect(() => {
    dispatch(setTotalQuestion((question?.object?.conversations || []).length));
  }, [dispatch, question]);

  const doneQuestionItem = React.useCallback(() => {
    if (
      carouselRef &&
      carouselRef.current &&
      carouselRef.current.currentIndex === question.data.length - 1
    ) {
      generateNextActivity(300);
    } else {
      setTimeout(() => {
        if (carouselRef && carouselRef.current) {
          carouselRef.current.snapToNext();
        }
      }, 150);
    }
  }, [carouselRef, question]);

  const renderItem = React.useCallback(
    ({item, index}) => {
      return (
        <LetTalkWithSituation
          question={item}
          doneQuestionItem={doneQuestionItem}
          focus={index === activeSlide}
        />
      );
    },
    [activeSlide, doneQuestionItem],
  );

  return (
    <ScriptWrapper backgroundColor={colors.white}>
      <Carousel
        ref={carouselRef}
        onSnapToItem={(index) => {
          setActiveSlide(index);
        }}
        data={question.data || []}
        renderItem={renderItem}
        sliderWidth={OS.WIDTH}
        itemWidth={OS.WIDTH}
        firstItem={0}
        inactiveSlideScale={0.9}
        inactiveSlideOpacity={0.7}
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        // scrollEnabled={false}
      />
    </ScriptWrapper>
  );
};

export default PrimaryLetsTalkWithSituationsScreen;
