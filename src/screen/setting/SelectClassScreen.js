import React from 'react';

import {CommonHeader} from '~/BaseComponent/index';
import {colors} from '~/themes';
import ClassContainer from '~/features/course/container/ClassContainer';
import {translate} from '~/utils/multilanguage';

const SelectClassScreen = () => {
  return (
    <>
      <CommonHeader
        themeWhite
        headerContentColor={colors.primary}
        title={translate('Trường lớp')}
      />
      <ClassContainer />
    </>
  );
};

export default SelectClassScreen;
