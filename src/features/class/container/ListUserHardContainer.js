import React, {useCallback, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {FlatList, TouchableWithoutFeedback} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {
  FlexContainer,
  NoFlexContainer,
  SeparatorVertical,
} from '~/BaseComponent/components/base/CommonContainer';
import {Card, DateRangePicker, Text} from '~/BaseComponent/index';
import UserShortDesc from '~/BaseComponent/components/elements/homework/UserShortDesc';
import {colors} from '~/themes';
import {queryTimeSelector} from '~/selector/classInfo';
import {setQuerySelected} from '~/features/class/ClassAction';
import classApi from '~/features/class/ClassApi';
import {classUserSelector, infoUserSelector} from '~/selector/user';
import {formatDuration} from '~/utils/utils';
import {OS} from '~/constants/os';
import navigator from '~/navigation/customNavigator';
import {translate} from '~/utils/multilanguage';

const ListUserHardContainer = (props) => {
  const timeQuery = useSelector(queryTimeSelector);
  const classUser = useSelector(classUserSelector);
  const user = useSelector(infoUserSelector);
  const dispatch = useDispatch();

  const [refresh, setRefresh] = useState(true);
  const [bodyQuery, setBodyQuery] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    setRefresh(true);
    setBodyQuery({
      class_id: classUser,
      start_time: timeQuery.startTime,
      end_time: timeQuery.endTime,
    });
  }, [classUser, timeQuery]);

  useEffect(() => {
    async function requestToServer(body) {
      let res = await classApi.rankingDuration(body);

      if (res.ok && res.data) {
        setData(res.data);
      }
    }

    if (refresh && bodyQuery) {
      requestToServer(bodyQuery);
      setRefresh(false);
    }
  }, [refresh, bodyQuery]);

  const onRefresh = useCallback(() => {
    setRefresh(true);
  }, []);

  const renderHeader = useCallback(() => {
    return (
      <NoFlexContainer
        justifyContent={'center'}
        alignItems={'center'}
        paddingVertical={32}
        paddingBottom={16}>
        <Text h5 color={colors.helpText} fontWeight={'600'} uppercase>
          {translate('Xếp hạng')}
        </Text>
        <Text h4 color={colors.helpText} bold uppercase paddingVertical={8}>
          {translate('Chuyên cần')}
        </Text>
        <DateRangePicker
          selectedTime={timeQuery}
          onChanged={(query) => {
            dispatch(setQuerySelected(query));
          }}
        />
      </NoFlexContainer>
    );
  }, [dispatch, timeQuery]);

  const renderItem = useCallback(
    ({item}) => {
      return (
        <TouchableWithoutFeedback
          onPress={() => {
            if (user._id === item._id) {
              navigator.navigate('MainStack', {
                screen: 'BottomTabSetting',
              });
              return;
            }
            navigator.navigate('UserClassInfo', {user: item});
          }}>
          <Card borderRadius={16} paddingVertical={16} paddingHorizontal={16}>
            <UserShortDesc
              lg
              disabled
              dataAction={item}
              title={item.full_name}
              source={item.avatar ? {uri: item.avatar} : null}
              sideContent={translate('Thời gian %s', {
                s1: formatDuration(item.duration),
              })}
            />
          </Card>
        </TouchableWithoutFeedback>
      );
    },
    [user],
  );

  if (!props.focus) {
    return null;
  }

  return (
    <FlexContainer backgroundColor={colors.mainBgColor} paddingHorizontal={16}>
      <FlatList
        refreshing={false}
        onRefresh={onRefresh}
        ListHeaderComponent={renderHeader}
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <SeparatorVertical height={12} />}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={() => (
          <SeparatorVertical slg={OS.hasNotch} lg={!OS.hasNotch} />
        )}
      />
    </FlexContainer>
  );
};
ListUserHardContainer.propTypes = {
  focus: PropTypes.bool,
};
ListUserHardContainer.defaultProps = {
  focus: false,
};
export default ListUserHardContainer;
