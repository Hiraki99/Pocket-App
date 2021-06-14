import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {TouchableOpacity, View, StyleSheet, FlatList} from 'react-native';
import ModalWrapper from 'react-native-modal-wrapper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';
import {useIsFocused} from '@react-navigation/native';

import {
  RowContainer,
  CommonHeader,
  FlexContainer,
  Text,
} from '~/BaseComponent/index';
import {selectedHomework} from '~/features/homework/HomeworkAction';
import {
  queryNotificationSelector,
  notificationsSelector,
} from '~/selector/notification';
import {colors} from '~/themes';
import navigator from '~/navigation/customNavigator';
import {
  ASSIGN_EXERCISE,
  REVIEW_EXERCISE,
  CREATE_ONLINE_CLASS,
} from '~/constants/exam';
import {OS} from '~/constants/os';
import {
  fetchListNotificationAction,
  markReadAllNotification,
  markReadNotificationAction,
} from '~/features/notification/NotificationAction';
import {FIRST_PAGE, PAGE_SIZE} from '~/constants/query';
import {translate} from '~/utils/multilanguage';

const NotificationsScreen = () => {
  const isFocused = useIsFocused();
  const queryNotification = useSelector(queryNotificationSelector);
  const notifications = useSelector(notificationsSelector);
  const dispatch = useDispatch();

  const [show, setShow] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    dispatch(
      fetchListNotificationAction({
        page_size: PAGE_SIZE,
        page: FIRST_PAGE,
      }),
    );
  }, [dispatch]);

  const loadMore = React.useCallback(() => {
    if (queryNotification.canLoadMore) {
      dispatch(
        fetchListNotificationAction({
          ...queryNotification,
          page: queryNotification.page + 1,
        }),
      );
    }
  }, [dispatch, queryNotification]);

  React.useEffect(() => {
    if (isFocused) {
      onRefresh();
    }
  }, [isFocused, onRefresh]);

  const onPressItem = React.useCallback(
    (item) => {
      console.log('item ,', item);
      dispatch(
        markReadNotificationAction({
          topic: item.topic,
          _id: item?._id,
        }),
      );

      if (item.type === CREATE_ONLINE_CLASS) {
        navigator.navigate('AccessClass');
        return;
      }

      if (item.type === ASSIGN_EXERCISE) {
        if (item.data.type === 'writing') {
          navigator.navigate('EditorEssayExam', {
            params: {id: item?.data?.exercise},
          });
          return;
        }
        navigator.navigate('HomeworkDetail', {
          params: {id: item?.data?.exercise},
        });
        dispatch(
          selectedHomework({
            _id: item?.data?.exercise,
          }),
        );
      }
    },
    [dispatch],
  );

  const renderItem = React.useCallback(
    ({item}) => {
      return (
        <TouchableOpacity activeOpacity={0.7} onPress={() => onPressItem(item)}>
          <RowContainer
            paddingHorizontal={16}
            paddingVertical={16}
            alignItems={'flex-start'}
            backgroundColor={item.read_at ? colors.white : colors.mainBgColor}>
            <FastImage
              source={{uri: item?.data?.teacher?.avatar}}
              style={styles.avatar}
            />
            <View style={{flex: 1}}>
              <Text marginLeft={16}>
                <Text h5 bold>
                  {item?.data?.teacher?.full_name}{' '}
                </Text>
                {item?.type === REVIEW_EXERCISE && (
                  <Text h5>{`${translate(
                    'đã chấm bài kiểm tra của bạn',
                  )}`}</Text>
                )}
                {item?.type === ASSIGN_EXERCISE && (
                  <Text h5>{`${translate(
                    'đã giao bài kiểm tra của bạn',
                  )}`}</Text>
                )}
                {item?.type === CREATE_ONLINE_CLASS && (
                  <Text h5>{`${translate('đã mở lớp học online')}`}</Text>
                )}
              </Text>
            </View>
          </RowContainer>
        </TouchableOpacity>
      );
    },
    [onPressItem],
  );

  return (
    <FlexContainer>
      <CommonHeader
        title={`${translate('Thông báo')}`}
        themeWhite
        close
        back={false}
        onClose={() => {
          navigator.goBack();
        }}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            setShow(true);
          }}
          style={{
            justifyContent: 'center',
            paddingVertical: 16,
          }}>
          <Ionicons
            name={'ellipsis-horizontal-sharp'}
            size={24}
            style={{paddingBottom: 36}}
          />
        </TouchableOpacity>
      </CommonHeader>
      <ModalWrapper
        containerStyle={{
          flexDirection: 'row',
          height: OS.HEIGHT,
        }}
        onRequestClose={() => setShow(false)}
        shouldAnimateOnRequestClose={true}
        style={{
          borderRadius: 8,
          position: 'absolute',
          paddingVertical: 12,
          paddingHorizontal: 16,
          top: OS.headerHeight + 36,
          right: 0,
          zIndex: 10,
        }}
        visible={show}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            dispatch(markReadAllNotification());
            setShow(false);
          }}>
          <RowContainer>
            <Ionicons name={'checkmark'} size={24} />
            <Text h5 paddingLeft={16}>
              {`${translate('Đánh dấu đã đọc tất cả')}`}
            </Text>
          </RowContainer>
        </TouchableOpacity>
      </ModalWrapper>
      <FlexContainer
        backgroundColor={colors.white}
        marginTop={4}
        paddingBottom={OS.hasNotch ? 12 : 8}>
        <FlatList
          refreshing={false}
          onRefresh={onRefresh}
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          onEndReachedThreshold={0.1}
          onEndReached={loadMore}
          showsVerticalScrollIndicator={false}
        />
      </FlexContainer>
    </FlexContainer>
  );
};

const styles = StyleSheet.create({
  avatar: {width: 48, height: 48, borderRadius: 24},
  container: {
    flex: 1,
    // marginVertical: 16,
    // backgroundColor: 'red',
  },
});

export default NotificationsScreen;
