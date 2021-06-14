import React, {useCallback} from 'react';
import Carousel from 'react-native-snap-carousel';
import {useDispatch, useSelector} from 'react-redux';

import {colors} from '~/themes';
import {currentScriptSelector} from '~/selector/activity';
import {OS} from '~/constants/os';
import ListenAndCheck from '~/BaseComponent/components/elements/listen/ListenAndCheck';
import {generateNextActivity} from '~/utils/script';
import ScriptWrapper from '~/BaseComponent/components/elements/script/ScriptWrapper';
import {setTotalQuestion} from '~/features/activity/ActivityAction';

const PrimaryListenAndTickScreen = () => {
  const carouselRef = React.useRef(null);
  const dispatch = useDispatch();
  const question = useSelector(currentScriptSelector);
  const [activeSlide, setActiveSlide] = React.useState(0);

  React.useEffect(() => {
    if (question && question.items) {
      dispatch(setTotalQuestion(question.items.length));
    }
  }, [dispatch, question]);
  const doneQuestionItem = useCallback(() => {
    if (
      carouselRef &&
      carouselRef.current &&
      carouselRef.current.currentIndex === question.items.length - 1
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

  const renderItem = useCallback(
    ({item, index}) => {
      return (
        <ListenAndCheck
          data={item}
          isFocus={index === activeSlide}
          doneQuestion={doneQuestionItem}
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
        data={question.items || []}
        renderItem={renderItem}
        sliderWidth={OS.WIDTH}
        itemWidth={OS.WIDTH}
        firstItem={0}
        inactiveSlideScale={0.9}
        inactiveSlideOpacity={0.7}
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        scrollEnabled={false}
      />
    </ScriptWrapper>
  );
};

export default PrimaryListenAndTickScreen;
