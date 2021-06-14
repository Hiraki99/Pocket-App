import React from 'react';
// import PropTypes from 'prop-types';
import {Animated, StyleSheet} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import DefaultTabBar from 'react-native-scrollable-tab-view/DefaultTabBar';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';

import {FlexContainer} from '~/BaseComponent/index';
import {colors} from '~/themes';
import HomeworkActivityContainer from '~/features/homework/container/HomeworkActivityContainer';
import ListUserDoneHomework from '~/features/homework/container/ListUserDoneHomework';
import {homeworkChoose} from '~/selector/homework';
// import {useIsFocused} from '@react-navigation/native';
import {fetchDetailHomework} from '~/features/homework/HomeworkAction';
import {translate} from '~/utils/multilanguage';

const HomeworkDetailContainer = () => {
  // const isFocus = useIsFocused();
  const trans = React.useRef(new Animated.Value(1)).current; // Initial value for opacity: 0
  const [showTabBar, setShowTabBar] = React.useState(true);
  const homeworkSelected = useSelector(homeworkChoose, shallowEqual);
  const homeworkSelectedId = homeworkSelected._id;
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (homeworkSelectedId) {
      dispatch(fetchDetailHomework({id: homeworkSelectedId}));
    }
  }, [dispatch, homeworkSelectedId]);

  React.useEffect(() => {
    Animated.timing(trans, {
      toValue: showTabBar ? 1 : 0,
      duration: 500,
    }).start();
  }, [showTabBar, trans]);

  const translateY = trans.interpolate({
    inputRange: [0, 1],
    outputRange: [-60, 0],
    extrapolate: 'clamp',
    useNativeDriver: true,
  });
  return (
    <FlexContainer backgroundColor={colors.mainBgColor} hidden>
      <Animated.View
        style={{
          flex: 1,
          transform: [{translateY}],
        }}>
        <ScrollableTabView
          renderTabBar={() => <DefaultTabBar style={{height: 46}} />}
          tabBarBackgroundColor={colors.white}
          tabBarActiveTextColor={colors.primary}
          tabBarInactiveTextColor={colors.helpText}
          prerenderingSiblingsNumber={0}
          onChangeTab={() => setShowTabBar(true)}
          tabBarUnderlineStyle={{backgroundColor: colors.primary}}
          tabBarTextStyle={styles.tabBarTextStyle}>
          <HomeworkActivityContainer
            tabLabel={translate('Bài tập')}
            action={setShowTabBar}
          />
          <ListUserDoneHomework
            tabLabel={translate('Hoàn thành')}
            action={setShowTabBar}
          />
        </ScrollableTabView>
      </Animated.View>
    </FlexContainer>
  );
};
HomeworkDetailContainer.propTypes = {};
HomeworkDetailContainer.defaultProps = {};
const styles = StyleSheet.create({
  tabBarTextStyle: {
    fontSize: 14,
    lineHeight: 18,
    textTransform: 'uppercase',
    fontFamily: 'CircularStd-Bold',
    fontWeight: 'bold',
  },
});
export default HomeworkDetailContainer;
