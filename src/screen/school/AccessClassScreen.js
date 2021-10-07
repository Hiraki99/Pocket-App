import React, {useCallback, useEffect} from 'react';
import {StyleSheet, Alert} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {TabBar, TabView} from 'react-native-tab-view';
import {useSelector} from 'react-redux';

import {CommonHeader, FlexContainer, Text} from '~/BaseComponent/index';
import {translate} from '~/utils/multilanguage';
import {colors} from '~/themes';
import ListUserInClassContainer from '~/features/class/container/ListUserInClassContainer';
import ListUserHardContainer from '~/features/class/container/ListUserHardContainer';
import ListUserScoreContainer from '~/features/class/container/ListUserScoreContainer';
import {classDetailSelect} from '~/selector/classInfo';
import navigator from '~/navigation/customNavigator';

const routes = [
  {
    key: 'list',
    title: `${'Danh sách'}`,
  },
  {
    key: 'hard',
    title: `${'Chuyên cần'}`,
  },
  {
    key: 'study',
    title: `${'Học tập'}`,
  },
];
const AccessClassScreen = () => {
  const classInfo = useSelector(classDetailSelect);
  const [index, setIndex] = React.useState(0);
  const isFocus = useIsFocused();

  useEffect(() => {
    if (isFocus) {
      const classClose = navigator.getParam('classClose', false);
      navigator.setParams('classClose', false);
      if (classClose) {
        Alert.alert(
          `${translate('Thông báo')}`,
          `${translate('Lớp học đã kết thúc.')}`,
          [
            {
              text: `${translate('Đồng ý')}`,
              style: 'cancel',
            },
          ],
        );
      }
      const kickOut = navigator.getParam('kickOut', false);
      navigator.setParams('kickOut', false);
      const rejectJoinClass = navigator.getParam('rejectJoinClass', false);
      navigator.setParams('rejectJoinClass', false);
      if (kickOut) {
        Alert.alert(
          `${translate('Thông báo')}`,
          `${translate('Bạn đã tham gia lớp học trên thiết bị khác.')}`,
          [
            {
              text: `${translate('Đồng ý')}`,
              style: 'cancel',
            },
          ],
        );
      }
      if (rejectJoinClass) {
        Alert.alert(
          `${translate('Thông báo')}`,
          `${translate('Giáo viên từ chối cho bạn vào lớp học.')}`,
          [
            {
              text: `${translate('Đồng ý')}`,
              style: 'cancel',
            },
          ],
        );
      }
    }
  }, [isFocus]);

  const renderTabBar = useCallback(
    (props) => (
      <TabBar
        {...props}
        indicatorStyle={styles.indicator}
        style={styles.tabBarStyle}
        renderLabel={({route, focused}) => (
          <Text fontSize={14} bold uppercase primary={focused}>
            {translate(route.title)}
          </Text>
        )}
      />
    ),
    [],
  );

  const renderScene = useCallback(({route}) => {
    switch (route.key) {
      case 'list':
        return <ListUserInClassContainer focus={route.key === 'list'} />;
      case 'hard':
        return <ListUserHardContainer focus={route.key === 'hard'} />;
      default:
        return <ListUserScoreContainer focus={route.key === 'study'} />;
    }
  }, []);

  return (
    <FlexContainer>
      <CommonHeader title={classInfo.name} back themeWhite />
      <TabView
        navigationState={{index, routes}}
        onIndexChange={setIndex}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
      />
    </FlexContainer>
  );
};
AccessClassScreen.propTypes = {};
AccessClassScreen.defaultProps = {};
const styles = StyleSheet.create({
  indicator: {backgroundColor: colors.primary, height: 4},
  tabBarStyle: {
    backgroundColor: colors.white,
    shadowColor: '#788db4',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 3,
    borderBottomWidth: 0,
  },
});
export default React.memo(AccessClassScreen);
