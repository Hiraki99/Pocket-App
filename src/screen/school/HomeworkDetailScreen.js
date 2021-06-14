import React from 'react';
import {useDispatch} from 'react-redux';

import {CommonHeader, FlexContainer} from '~/BaseComponent/index';
import HomeworkDetailContainer from '~/features/homework/container/HomeworkDetailContainer';
import {setScreenActivity} from '~/features/activity/ActivityAction';
import {translate} from '~/utils/multilanguage';

const HomeworkDetailScreen = () => {
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(setScreenActivity('HomeworkDetail'));
  }, [dispatch]);
  return (
    <FlexContainer>
      <CommonHeader title={`${translate('Bài tập về nhà')}`} back themeWhite />
      <HomeworkDetailContainer />
    </FlexContainer>
  );
};
HomeworkDetailScreen.propTypes = {};
HomeworkDetailScreen.defaultProps = {};
export default HomeworkDetailScreen;
