import React, {useState, useEffect, useCallback} from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {Icon} from 'native-base';
import Timeline from 'react-native-timeline-flatlist';
import moment from 'moment';
import lodash from 'lodash';

import {Card, Text} from '~/BaseComponent/index';
import {colors} from '~/themes';
import CourseApi from '~/features/course/CourseApi';
import {formatDuration, makeid} from '~/utils/utils';
import {translate} from '~/utils/multilanguage';

const ProgressUserLearning = (props) => {
  const initTime = moment();
  const [monthSelected, setMonthSelected] = useState(initTime);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const user = props.user;
  useEffect(() => {
    async function callApi() {
      const now = moment();
      if (user && user._id) {
        const sameMonthNow = now.month() === monthSelected.month();
        const endTime = sameMonthNow
          ? now.format('YYYY-MM-DD')
          : monthSelected.endOf('month').format('YYYY-MM-DD');
        setLoading(true);
        const startTime = monthSelected.startOf('month').format('YYYY-MM-DD');
        const res = await CourseApi.statisticByDay({
          startTime,
          endTime,
          userId: user._id,
        });
        if (res.ok && res.data && res.data.data) {
          let monthData = [];
          let count = 1;
          let week = [];
          let durationInWeek = 0;
          let durationMonth = 0;
          res.data.data.forEach((item, index) => {
            const dateItem = moment(item.created_at);
            const dayInWeek = dateItem.weekday();
            durationInWeek += item.duration;
            durationMonth += item.duration;
            week.push(item);
            if (dayInWeek === 0 || index === res.data.data.length - 1) {
              week.push({
                _id: makeid(32),
                title: translate('Tuần %s', {s1: count}),
                type: 'agg',
                duration: durationInWeek,
                description:
                  week.length === 0
                    ? dateItem.format('DD/MM')
                    : `${moment(week[0].created_at).format(
                        'DD/MM',
                      )}  -  ${dateItem.format('DD/MM')}`,
              });
              monthData.push(lodash.reverse(week));
              count += 1;
              week = [];
            }
          });
          setData((data) => {
            return {
              ...data,
              [monthSelected.format('YYYY-MM')]: {
                monthData: lodash.reverse(monthData),
                durationMonth,
              },
            };
          });
          setLoading(false);
        }
      }
    }
    callApi();
  }, [monthSelected, user]);

  const prevMonth = useCallback(() => {
    setMonthSelected((oldMonth) => {
      return moment(oldMonth.subtract(1, 'months'));
    });
  }, []);

  const nextMonth = useCallback(() => {
    setMonthSelected((oldMonth) => moment(oldMonth.add(1, 'months')));
  }, []);

  const renderDetail = (rowData) => {
    let title = (
      <Text
        fontSize={rowData.isGroup ? 19 : 17}
        bold
        primary={rowData.type === 'agg'}
        color={rowData.notLogin ? 'rgba(31,38,49,0.38)' : colors.black}>
        {rowData.type === 'agg'
          ? `${rowData.title}: ${formatDuration(rowData.duration)}`
          : `${moment(rowData.created_at).format('DD-MM')}: ${formatDuration(
              rowData.duration,
            )}`}
      </Text>
    );
    let desc = null;
    if (rowData.description) {
      desc = <Text color={'rgba(31,38,49,0.38)'}>{rowData.description}</Text>;
    } else {
      desc = <Text color={'rgba(31,38,49,0.38)'}>Login lúc 08:00:00</Text>;
    }

    return (
      <View style={{flex: 1, marginTop: -14, marginBottom: 20, marginLeft: 15}}>
        {title}
        {desc}
      </View>
    );
  };

  const renderCircle = (rowData) => {
    return (
      <View
        style={{
          left: 8,
          position: 'absolute',
          top: -3,
          zIndex: 999,
          backgroundColor: '#fff',
        }}>
        {rowData.type === 'agg' ? (
          <Icon
            name="md-checkmark-circle"
            style={{
              color: colors.primary,
            }}
            type="Ionicons"
          />
        ) : (
          <Icon
            name="check"
            style={{
              color: rowData.notLogin ? 'rgba(31,38,49,0.38)' : colors.primary,
              marginLeft: 7,
              fontSize: 14,
            }}
            type="FontAwesome5"
          />
        )}
      </View>
    );
  };

  const renderItem = useCallback(({item}) => {
    return (
      <Card style={{paddingVertical: 40, paddingHorizontal: 36, marginTop: 20}}>
        <Timeline
          data={item}
          showTime={false}
          renderDetail={renderDetail}
          renderCircle={renderCircle}
          lineColor="#D4DCE7"
          lineWidth={1}
        />
      </Card>
    );
  }, []);
  const sameMonthNow = initTime.month() === monthSelected.month();
  return (
    <>
      <Card
        style={{
          marginTop: 20,
          backgroundColor: colors.primary,
          shadowColor: colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
          height: 186,
        }}>
        <View
          style={{
            backgroundColor: colors.primary_overlay,
            opacity: 0.8,
            width: 100,
            marginBottom: 16,
          }}>
          <Text uppercase fontSize={12} bold center color={colors.white}>
            {sameMonthNow
              ? translate('Tháng này')
              : translate('Tháng %s', {s1: monthSelected.month() + 1})}
          </Text>
        </View>
        {loading || !data[monthSelected.format('YYYY-MM')] ? (
          <ActivityIndicator size={'small'} color={colors.white} />
        ) : (
          <Text fontSize={40} accented color={colors.white} bold>
            {formatDuration(
              data[monthSelected.format('YYYY-MM')].durationMonth || 0,
            )}
          </Text>
        )}

        <Text uppercase color={'rgba(255,255,255,0.38)'}>
          {translate('Tổng thời gian học')}
        </Text>
        <TouchableOpacity
          style={styles.prevBtn}
          activeOpacity={0.7}
          onPress={prevMonth}>
          <Icon
            name={'chevron-left'}
            type={'Feather'}
            style={{color: colors.white, fontSize: 16}}
          />
        </TouchableOpacity>
        {!sameMonthNow && (
          <TouchableOpacity
            style={styles.nextBtn}
            activeOpacity={0.7}
            onPress={nextMonth}>
            <Icon
              name={'chevron-right'}
              type={'Feather'}
              style={{color: colors.white, fontSize: 16}}
            />
          </TouchableOpacity>
        )}
      </Card>
      <FlatList
        data={
          data[monthSelected.format('YYYY-MM')]
            ? data[monthSelected.format('YYYY-MM')].monthData
            : []
        }
        keyExtractor={(item, index) =>
          `${monthSelected.format('YYYY-MM')}_${index}_${
            item[0] ? item[0]._id : 1
          }`
        }
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </>
  );
};
ProgressUserLearning.propTypes = {
  user: PropTypes.object,
};
ProgressUserLearning.defaultProps = {
  user: {},
};
const styles = StyleSheet.create({
  prevBtn: {
    position: 'absolute',
    left: 14,
    top: 90,
    width: 24,
    height: 24,
    borderRadius: 2,
    backgroundColor: colors.primary_overlay,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextBtn: {
    position: 'absolute',
    right: 14,
    top: 90,
    width: 24,
    height: 24,
    borderRadius: 2,
    backgroundColor: colors.primary_overlay,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProgressUserLearning;
