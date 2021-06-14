import React, {useCallback, useRef} from 'react';
import PropTypes from 'prop-types';
import {Animated} from 'react-native';
import {useSelector} from 'react-redux';

import {
  FlexContainer,
  SeparatorVertical,
} from '~/BaseComponent/components/base/CommonContainer';
import {Text} from '~/BaseComponent/index';
import UserShortDesc from '~/BaseComponent/components/elements/homework/UserShortDesc';
import {colors} from '~/themes';
import {homeworkChoose} from '~/selector/homework';
import navigator from '~/navigation/customNavigator';
import {infoUserSelector} from '~/selector/user';
import {translate} from '~/utils/multilanguage';

const ListUserDoneHomework = (props) => {
  const user = useSelector(infoUserSelector);
  const scrollY = useRef(new Animated.Value(0)).current;
  const beginDrag = useRef(new Animated.Value(0)).current;
  const homeworkSelected = useSelector(homeworkChoose);
  const lengthActvitiesHomework = homeworkSelected.activities
    ? homeworkSelected.activities.length
    : 0;

  const renderItem = useCallback(
    ({item}) => {
      return (
        <UserShortDesc
          source={item.avatar ? {uri: item.avatar} : null}
          action={() => {
            if (user?._id === item._id) {
              navigator.navigate('MainStack', {
                screen: 'BottomTabSetting',
              });
              return;
            }
            navigator.navigate('UserClassInfo', {user: item});
          }}
          dataAction={item}
          title={item.full_name}
          sideContent={translate('Hoàn thành %s', {
            s1: `${lengthActvitiesHomework}/${lengthActvitiesHomework}`,
          })}
        />
      );
    },
    [lengthActvitiesHomework, user],
  );
  return (
    <FlexContainer backgroundColor={colors.mainBgColor} paddingHorizontal={16}>
      <Animated.FlatList
        data={homeworkSelected.students || []}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        ItemSeparatorComponent={() => <SeparatorVertical lg />}
        ListHeaderComponent={() => (
          <Text h5 paddingVertical={24} uppercase bold>
            {translate('Đã hoàn thành %s', {
              s1: `(${homeworkSelected.done_count}/${homeworkSelected.student_count})`,
            })}
          </Text>
        )}
        removeClippedSubviews
        initialNumToRender={2}
        ListFooterComponent={() => <SeparatorVertical slg />}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  y: scrollY,
                },
              },
            },
          ],
          {useNativeDriver: false},
        )}
        onScrollBeginDrag={() => {
          beginDrag.setValue(scrollY._value);
        }}
        onScrollEndDrag={() => {
          const range = scrollY._value - beginDrag._value;
          props.action(range < 0);
        }}
      />
    </FlexContainer>
  );
};
ListUserDoneHomework.propTypes = {
  action: PropTypes.func,
};
ListUserDoneHomework.defaultProps = {
  action: () => {},
};
export default ListUserDoneHomework;
