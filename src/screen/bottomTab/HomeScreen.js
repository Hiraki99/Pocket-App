import React, {useCallback, useEffect} from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
// import Image from 'react-native-fast-image';
import {useSelector, shallowEqual} from 'react-redux';
import {register} from 'react-native-bundle-splitter';
import Orientation from 'react-native-orientation';

import {
  FlexContainer,
  NoFlexContainer,
  Text,
  BlankHeader,
  SeparatorVertical,
} from '~/BaseComponent';
import {colors, images} from '~/themes';
import {
  TYPE_ON_BOARD_STUDENT,
  MAPPING_HOME_STUDENT_SCREEN,
  HOME_STUDENT_ITEM_LIVE_CLASS,
} from '~/constants/student';
import navigator from '~/navigation/customNavigator';
import {OS} from '~/constants/os';
import {unreadCountNotificationSelector} from '~/selector/notification';
import {showResponse} from '~/utils/utils';
import {translate} from '~/utils/multilanguage';

const HomeScreen = () => {
  const currentCourse =
    useSelector((state) => state.course.currentCourse, shallowEqual) || {};
  const unreadCountNotification = useSelector(unreadCountNotificationSelector);
  const user = useSelector((state) => state.auth.user || {}, shallowEqual);

  const hasLiveClass = useCallback(() => {
    return false;
  }, []);

  useEffect(() => {
    Orientation.lockToPortrait();
  }, []);

  const generateHomeItems = useCallback(() => {
    let list = [];
    list.push(...MAPPING_HOME_STUDENT_SCREEN);
    if (hasLiveClass()) {
      list.push(HOME_STUDENT_ITEM_LIVE_CLASS);
    }
    return list;
  }, [hasLiveClass]);

  const action = useCallback(
    (type) => {
      switch (type) {
        case TYPE_ON_BOARD_STUDENT.study_program:
          navigator.navigate('MainStack', {
            screen: 'BottomTabStudy',
            params: {
              screen: 'Study',
              // params: {selected: BUTTON_STUDENT[0]},
            },
          });
          return;
        case TYPE_ON_BOARD_STUDENT.test_student:
          navigator.navigate('MainStack', {
            screen: 'BottomTabExam',
          });
          return;
        case TYPE_ON_BOARD_STUDENT.library:
          navigator.navigate('MainStack', {
            screen: 'BottomTabLibrary',
            params: {screen: 'Library'},
          });
          return;
        case TYPE_ON_BOARD_STUDENT.grammar_basic:
          navigator.navigate('MainStack', {
            screen: 'BottomTabLibrary',
            params: {screen: 'Library', params: {indexSelected: 2}},
          });
          return;
        case TYPE_ON_BOARD_STUDENT.communication:
          navigator.navigate('MainStack', {
            screen: 'BottomTabLibrary',
            params: {screen: 'Library', params: {indexSelected: 3}},
          });
          return;
        case TYPE_ON_BOARD_STUDENT.vocabulary_by_topic:
          navigator.navigate('MainStack', {
            screen: 'BottomTabLibrary',
            params: {screen: 'Library', params: {indexSelected: 0}},
          });
          return;
        case TYPE_ON_BOARD_STUDENT.support_pronunciation:
          navigator.navigate('SpeakVipLesson');
          return;
        case TYPE_ON_BOARD_STUDENT.tool_search_dictionary:
          navigator.navigate('Dictionary');
          return;
        case TYPE_ON_BOARD_STUDENT.listen_practice:
          navigator.navigate('MainStack', {
            screen: 'BottomTabLibrary',
            params: {screen: 'Library', params: {indexSelected: 1}},
          });
          return;
        case TYPE_ON_BOARD_STUDENT.home_work:
          if (user.class) {
            navigator.navigate('Homework');
            return;
          }
          navigator.navigate('SelectClass');
          showResponse(false, translate('Bạn cần tham gia vào lớp học!'));
          return;
        case TYPE_ON_BOARD_STUDENT.class_info:
          if (user.class) {
            navigator.navigate('AccessClass');
            return;
          }
          navigator.navigate('SelectClass');
          showResponse(false, translate('Bạn cần tham gia vào lớp học!'));
          return;
        case TYPE_ON_BOARD_STUDENT.profile_learning:
          navigator.navigate('Setting');
          return;
        case TYPE_ON_BOARD_STUDENT.live_class:
          return;
        default:
          navigator.navigate('MainStack', {
            screen: 'BottomTabSetting',
          });
          break;
      }
    },
    [user],
  );

  const renderItem = useCallback(
    ({item}) => {
      return (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            action(item.type);
          }}>
          <NoFlexContainer
            justifyContent={'center'}
            alignItems={'center'}
            style={styles.item}>
            <Image style={styles.icon} source={item.image} />
            <Text h5 color={colors.helpText} center style={styles.content}>
              {translate(item.content)}
            </Text>
          </NoFlexContainer>
        </TouchableOpacity>
      );
    },
    [action],
  );

  const renderSeparator = useCallback(
    () => <View style={styles.separator} />,
    [],
  );
  const renderFooter = useCallback(
    () => <View style={[styles.footer, hasLiveClass() ? {height: 120} : {}]} />,
    [hasLiveClass],
  );

  const renderHeaderHome = () => {
    return (
      <NoFlexContainer
        backgroundColor={colors.primary}
        paddingHorizontal={24}
        style={styles.header}>
        <Text fontSize={14} color={colors.white} opacity={0.38} bold uppercase>
          {translate('Chương trình')}
        </Text>
        <Text h2 color={colors.white} bold style={styles.description}>
          {currentCourse && currentCourse.name
            ? `${translate('Tiếng Anh')} ${translate('Lớp %s', {
                s1: currentCourse.order,
              })}`
            : currentCourse.display_name}
        </Text>
        <Text fontSize={14} color={colors.white} opacity={0.6}>
          {`${translate('Khoá học')} ${
            currentCourse.name
              ? `${translate('Tiếng Anh')} ${translate('Lớp %s', {
                  s1: currentCourse.order,
                })}`
              : currentCourse.display_name
          } ${translate(
            'sẽ là trợ thủ đắc lực cho các bạn để có một nền tảng tiếng Anh chắc chắn.',
          )}`}
        </Text>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.notification}
          onPress={() => {
            navigator.navigate('Notifications');
          }}>
          <Image source={images.notification} style={{width: 32, height: 32}} />
          {unreadCountNotification > 0 && (
            <View style={styles.badge}>
              <Text fontSize={14} accented bold color={colors.white}>
                {unreadCountNotification > 99 ? '99+' : unreadCountNotification}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </NoFlexContainer>
    );
  };

  return (
    <FlexContainer backgroundColor={colors.white}>
      <BlankHeader light color={colors.primary} />
      {renderHeaderHome()}
      <FlexContainer style={styles.body}>
        <FlatList
          data={generateHomeItems()}
          keyExtractor={(item) => item.key}
          renderItem={renderItem}
          numColumns={3}
          ItemSeparatorComponent={renderSeparator}
          ListFooterComponent={renderFooter}
          ListHeaderComponent={renderSeparator}
          showsVerticalScrollIndicator={false}
          // style={{flexGrow: 1}}
        />
        <SeparatorVertical height={40} />
      </FlexContainer>
    </FlexContainer>
  );
};

const styles = StyleSheet.create({
  header: {paddingBottom: 40, paddingTop: 36},
  description: {paddingTop: 2, paddingBottom: 8},
  icon: {width: 64, height: 64, paddingHorizontal: 16},
  item: {
    width: (OS.WIDTH - 96) / 3,
    marginRight: 24,
  },
  separator: {height: 24},
  footer: {height: 48},
  content: {paddingTop: 8, lineHeight: 22},
  body: {
    marginTop: -16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: colors.white,
    flex: 1,
    paddingLeft: 24,
    paddingTop: 24,
    // paddingBottom: 100,
  },
  notification: {
    position: 'absolute',
    top: 10,
    right: 20,
    zIndex: 1,
  },
  badge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.milanoRed,
    position: 'absolute',
    top: -10,
    right: -10,
    zIndex: 10,
  },
});

export default register({
  loader: () => <View />,
  placeholder: () => <HomeScreen />,
});

// export default HomeScreen;
