import React from 'react';
import {useDispatch} from 'react-redux';

import {CommonHeader, FlexContainer} from '~/BaseComponent/index';
import HomeworkContainer from '~/features/homework/container/inline-require';
import {setScreenActivity} from '~/features/activity/ActivityAction';
import {translate} from '~/utils/multilanguage';

const HomeworkScreen = () => {
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(setScreenActivity('Homework'));
  }, [dispatch]);

  return (
    <FlexContainer>
      <CommonHeader title={`${translate('Bài tập về nhà')}`} back themeWhite />
      <HomeworkContainer />
    </FlexContainer>
  );
};
HomeworkScreen.propTypes = {};
HomeworkScreen.defaultProps = {};
export default HomeworkScreen;
