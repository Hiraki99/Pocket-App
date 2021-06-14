import React from 'react';
import {register} from 'react-native-bundle-splitter';
import {FlexContainer} from '~/BaseComponent/components/base/CommonContainer';

import {colors} from '~/themes';
import {makeid} from '~/utils/utils';

export default register({
  loader: () => import('../HomeworkContainer'),
  placeholder: () => (
    <FlexContainer backgroundColor={colors.mainBgColor} marginTop={4} />
  ),
  name: makeid(16),
});
