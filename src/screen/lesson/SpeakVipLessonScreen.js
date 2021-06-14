import React from 'react';

import CommonHeader from '~/BaseComponent/components/layouts/CommonHeader';
import SpeakContainer from '~/features/lessons/container/SpeakContainer';
import {translate} from '~/utils/multilanguage';

const SpeakVipLessonScreen = () => {
  return (
    <>
      <CommonHeader themeWhite title={translate('Luyện nói')} />
      <SpeakContainer />
    </>
  );
};

export default SpeakVipLessonScreen;
