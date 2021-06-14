import React, {useCallback, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {FlatList, TouchableWithoutFeedback, StyleSheet} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
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
import {classUserSelector, infoUserSelector} from '~/selector/user';
import classApi from '~/features/class/ClassApi';
import {OS} from '~/constants/os';
import {formatDuration} from '~/utils/utils';
import navigator from '~/navigation/customNavigator';
import {translate} from '~/utils/multilanguage';

const ListUserScoreContainer = (props) => {
  const timeQuery = useSelector(queryTimeSelector);
  const user = useSelector(infoUserSelector);
  const classUser = useSelector(classUserSelector);
  const dispatch = useDispatch();

  const [refresh, setRefresh] = useState(true);
  const [bodyQuery, setBodyQuery] = useState(null);
  const [data, setData] = useState([]);
  const [sort, setSort] = React.useState('first');

  useEffect(() => {
    setRefresh(true);
    setBodyQuery({
      class_id: classUser,
      start_time: timeQuery.startTime,
      end_time: timeQuery.endTime,
      type: sort,
    });
  }, [classUser, timeQuery, sort]);

  useEffect(() => {
    async function requestToServer(body) {
      let res = await classApi.rankingScore(body);
      if (res.ok && res.data && res.data.data) {
        setData(res.data.data);
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
          {translate('Kết quả học tập')}
        </Text>
        <RNPickerSelect
          placeholder={{
            label: translate('Chọn tiêu chí'),
            value: null,
            color: colors.black,
          }}
          onValueChange={(value) => setSort(value)}
          style={pickerSelectStyles}
          items={[
            {label: translate('Xếp theo điểm lần đầu'), value: 'first'},
            {label: translate('Xếp theo điểm lần cuối'), value: 'last'},
            {label: translate('Xếp theo điểm cao nhất'), value: 'max'},
          ]}
          value={sort}
          doneText={translate('Xác nhận')}
        />
        <DateRangePicker
          selectedTime={timeQuery}
          onChanged={(query) => {
            dispatch(setQuerySelected(query));
          }}
        />
      </NoFlexContainer>
    );
  }, [dispatch, sort, timeQuery]);

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
        keyExtractor={(item) => item._id}
        data={data}
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
ListUserScoreContainer.propTypes = {
  focus: PropTypes.bool,
};
ListUserScoreContainer.defaultProps = {
  focus: false,
};
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 17,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#d3d3d3',
    color: 'black',
    paddingRight: 30,
    backgroundColor: colors.white,
    shadowColor: 'rgb(60,128,209)',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.05,
    shadowRadius: 3,
    fontFamily: 'CircularStd-Book',
    marginVertical: 8,
  },
  inputAndroid: {
    fontSize: 16,
    borderRadius: 8,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#DFE7F3',
    color: 'black',
    paddingRight: 30,
    fontFamily: 'CircularStd-Book',
    marginVertical: 8,
  },
});

export default ListUserScoreContainer;
