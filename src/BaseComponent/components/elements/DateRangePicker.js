import React from 'react';
import {connect} from 'react-redux';
import {View, Modal, TouchableOpacity, ScrollView} from 'react-native';
import moment from 'moment';
import CalendarPicker from 'react-native-calendar-picker';
import PropTypes from 'prop-types';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {Option, Text, Card, CommonHeader} from '~/BaseComponent';
import {TimeQuery} from '~/constants/query';
import colors from '~/themes/colors';
import {translate} from '~/utils/multilanguage';

class DateRangePicker extends React.Component {
  constructor(props) {
    super(props);
    const time = props.selectedTime ? props.selectedTime.key : 'last7days';
    this.state = {
      displayText: TimeQuery[time].text,
      modalVisible: false,
      options: this.getOptions(props.selectedTime),
      selected: TimeQuery.today.key,
      selectedStartDate: (props.selectedTime
        ? moment(props.selectedTime.startTime)
        : moment(TimeQuery[time].startTime)
      ).format('DD/MM/YYYY'),
      selectedEndDate: (props.selectedTime
        ? moment(props.selectedTime.endTime)
        : moment(TimeQuery[time].endTime)
      ).format('DD/MM/YYYY'),
    };
  }

  shouldComponentUpdate(nextProps) {
    if (
      JSON.stringify(nextProps.selectedTime) !==
      JSON.stringify(this.props.selectedTime)
    ) {
      const time = nextProps.selectedTime
        ? nextProps.selectedTime.key
        : 'last7days';
      this.state = {
        displayText: TimeQuery[time].text,
        modalVisible: false,
        options: this.getOptions(nextProps.selectedTime),
        selected: TimeQuery.today.key,
        selectedStartDate: (nextProps.selectedTime
          ? moment(nextProps.selectedTime.startTime)
          : moment(TimeQuery[time].startTime)
        ).format('DD/MM/YYYY'),
        selectedEndDate: (nextProps.selectedTime
          ? moment(nextProps.selectedTime.endTime)
          : moment(TimeQuery[time].endTime)
        ).format('DD/MM/YYYY'),
      };
    }
    return true;
  }

  getOptions = (selectedTime) => {
    const time = selectedTime ? selectedTime.key : 'last7days';
    return [
      {
        group: 'd',
        items: [
          {selected: TimeQuery[time].key === 'today', ...TimeQuery.today},
          {
            selected: TimeQuery[time].key === 'yesterday',
            ...TimeQuery.yesterday,
          },
        ],
      },
      {
        group: 'w',
        items: [
          {
            selected: TimeQuery[time].key === 'last7days',
            ...TimeQuery.last7days,
          },
          {
            selected: TimeQuery[time].key === 'thisWeek',
            ...TimeQuery.thisWeek,
          },
          {
            selected: TimeQuery[time].key === 'lastWeek',
            ...TimeQuery.lastWeek,
          },
        ],
      },
      {
        group: 'm',
        items: [
          {
            selected: TimeQuery[time].key === 'last30days',
            ...TimeQuery.last30days,
          },
          {
            selected: TimeQuery[time].key === 'thisMonth',
            ...TimeQuery.thisMonth,
          },
          {
            selected: TimeQuery[time].key === 'lastMonth',
            ...TimeQuery.lastMonth,
          },
        ],
      },
      {
        group: 'c',
        items: [
          {
            key: 'custom',
            text: translate('Tùy chỉnh'),
            startTime: selectedTime
              ? moment(selectedTime.startTime)
              : moment().startOf('day').subtract(6, 'day'),
            endTime: selectedTime
              ? moment(selectedTime.endTime)
              : moment().endOf('day'),
          },
        ],
      },
    ];
  };

  onDateChange = (date, type) => {
    const {selectedStartDate} = this.state;
    if (!date) {
      return;
    }
    if (type === 'END_DATE') {
      this.setState(
        {
          selectedEndDate: date,
          displayText: `${moment(selectedStartDate).format(
            'DD/MM/YYYY',
          )} - ${date.format('DD/MM/YYYY')}`,
        },
        () => {
          const {selected} = this.state;
          this.props.onChanged(
            selected,
            moment(this.state.selectedStartDate.valueOf()).format('DD/MM/YYYY'),
            moment(this.state.selectedEndDate.endOf('day').valueOf()).format(
              'DD/MM/YYYY',
            ),
          );
          this.setModalVisible(false);
        },
      );
    } else {
      this.setState({
        selectedStartDate: date,
        selectedEndDate: null,
      });
    }
  };

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  changeOption = (item) => {
    const {options} = this.state;
    const arr = options.map((group) => {
      const g = {...group};
      const items = g.items.map((o) => {
        const clone = {...o};
        if (clone.key === item.key) {
          clone.selected = true;
        } else {
          clone.selected = false;
        }

        return clone;
      });

      g.items = items;

      return g;
    });

    this.setState({options: arr, selected: item.key}, () => {
      switch (item.key) {
        case 'today':
          this.emitChangeOption(TimeQuery.today);
          break;
        case 'yesterday':
          this.emitChangeOption(TimeQuery.yesterday);
          break;
        case 'last7days':
          this.emitChangeOption(TimeQuery.last7days);
          break;
        case 'thisWeek':
          this.emitChangeOption(TimeQuery.thisWeek);
          break;
        case 'lastWeek':
          this.emitChangeOption(TimeQuery.lastWeek);
          break;
        case 'last30days':
          this.emitChangeOption(TimeQuery.last30days);
          break;
        case 'thisMonth':
          this.emitChangeOption(TimeQuery.thisMonth);
          break;
        case 'lastMonth':
          this.emitChangeOption(TimeQuery.lastMonth);
          break;
        default:
          break;
      }

      if (item.key !== 'custom') {
        this.setModalVisible(false);
      }
    });
  };

  emitChangeOption(day) {
    this.setState(
      {
        displayText: day.text,
        selectedStartDate: moment(day.startTime),
        selectedEndDate: moment(day.endTime),
      },
      () => {
        this.props.onChanged({
          ...TimeQuery[day.key],
          startTime: moment(this.state.selectedStartDate.valueOf()).format(
            'DD/MM/YYYY',
          ),
          endTime: moment(
            this.state.selectedEndDate.endOf('day').valueOf(),
          ).format('DD/MM/YYYY'),
        });
      },
    );
  }

  renderButton() {
    const onPress = () => {
      this.setModalVisible(true);
    };
    return (
      <TouchableOpacity onPress={onPress} style={styles.selection}>
        <Card style={styles.container} padding={16}>
          <Text h5>{translate(this.state.displayText)}</Text>
          <AntDesign
            name={'down'}
            size={16}
            color={colors.helpText}
            style={styles.icon}
          />
        </Card>
      </TouchableOpacity>
    );
  }

  renderSelections() {
    const maxDate = new Date();
    return (
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        {this.state.options.map((group) => {
          return (
            <Card style={styles.optionWrap} key={group.group}>
              <View>
                {group.items.map((item) => {
                  return (
                    <TouchableOpacity
                      key={item.key}
                      style={styles.option}
                      activeOpacity={0.7}
                      onPress={() => this.changeOption(item)}>
                      <Option selected={item.selected} />
                      <Text
                        fontSize={16}
                        color={colors.normalText}
                        paddingHorizontal={15}>
                        {translate(item.text)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </Card>
          );
        })}

        {this.state.selected === 'custom' ? (
          <View
            style={{
              ...styles.optionWrap,
              flex: 1,
              backgroundColor: '#fff',
              borderRadius: 4,
            }}>
            <CalendarPicker
              startFromMonday
              allowRangeSelection
              maxRangeDuration={31}
              months={[
                translate('Tháng 1'),
                translate('Tháng 2'),
                translate('Tháng 3'),
                translate('Tháng 4'),
                translate('Tháng 5'),
                translate('Tháng 6'),
                translate('Tháng 7'),
                translate('Tháng 8'),
                translate('Tháng 9'),
                translate('Tháng 10'),
                translate('Tháng 11'),
                translate('Tháng 12'),
              ]}
              weekdays={[
                translate('T2'),
                translate('T3'),
                translate('T4'),
                translate('T5'),
                translate('T6'),
                translate('T7'),
                translate('CN'),
              ]}
              todayBackgroundColor="#779dd9"
              selectedDayColor="#125DD5"
              selectedDayTextColor="#FFFFFF"
              nextTitle=">>"
              previousTitle="<<"
              maxDate={maxDate}
              selectedStartDate={this.state.selectedStartDate}
              selectedEndDate={this.state.selectedEndDate}
              onDateChange={this.onDateChange}
            />
          </View>
        ) : null}
      </ScrollView>
    );
  }

  render() {
    return (
      <View>
        {this.renderButton()}
        <Modal
          supportedOrientations={['portrait', 'landscape']}
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setModalVisible(false);
          }}>
          <View style={{backgroundColor: colors.mainBgColor, flex: 1}}>
            <CommonHeader
              close
              back={false}
              onClose={() => this.setModalVisible(false)}
              themePrimary
              headerContentColor={colors.white}
              title={translate('Chọn thời gian')}
            />
            {this.renderSelections()}
          </View>
        </Modal>
      </View>
    );
  }
}

DateRangePicker.propTypes = {
  onChanged: PropTypes.func,
  selectedTime: PropTypes.object,
  onAction: PropTypes.func,
};

DateRangePicker.defaultProps = {
  onChanged: () => {},
  selectedTime: null,
  onAction: () => {},
};

export default connect()(DateRangePicker);
const styles = {
  wrap: {
    backgroundColor: '#fff',
    shadowColor: '#788db4',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.24,
    shadowRadius: 2,
    elevation: 10,
    paddingVertical: 15,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(120, 141, 180, 0.24)',
  },
  selection: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectionInner: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateIcon: {
    marginRight: 5,
  },
  optionWrap: {
    paddingVertical: 10,
    borderRadius: 4,
    paddingHorizontal: 15,
    marginLeft: 8,
    marginRight: 8,
  },
  option: {
    paddingVertical: 5,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  icon: {marginTop: 4},
};
