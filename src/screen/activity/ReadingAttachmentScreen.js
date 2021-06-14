import React from 'react';

import navigator from '~/navigation/customNavigator';
import ReadingView from '~/BaseComponent/components/elements/script/readingAnswerQuestions/ReadingView';
import {TutorialHeader} from '~/BaseComponent/index';

const ReadingAttachmentScreen = () => {
  const attachment = navigator.getParam('attachment', {item: {}});

  return (
    <>
      <TutorialHeader themeWhite title={'Reading'} />
      <ReadingView
        image={attachment.item.image}
        content={`<p>${attachment.item.content}</p>`}
        title={attachment.item.title}
        data={attachment.item}
        activeContinue={false}
      />
    </>
  );
};

export default ReadingAttachmentScreen;
