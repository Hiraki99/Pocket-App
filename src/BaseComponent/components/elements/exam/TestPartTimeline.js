import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import Timeline from 'react-native-timeline-flatlist';

import {Text} from '~/BaseComponent';
import {colors} from '~/themes';
import {STATUS_PART} from '~/constants/testData';

export default class TestPartTimeline extends React.PureComponent {
  renderDetail = (rowData, sectionID) => {
    const {activeIndex} = this.props;

    let title = (
      <Text
        fontSize={17}
        bold
        color={
          activeIndex === sectionID
            ? colors.primary
            : rowData.status === STATUS_PART.DONE
            ? colors.helpText
            : colors.helpText2
        }>
        {rowData.name}
      </Text>
    );

    const desc = (
      <Text fontSize={14} color={colors.helpText2}>
        {rowData.test_questions.length} questions
      </Text>
    );

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          this.props.selectPart(rowData);
        }}>
        <View
          style={{flex: 1, marginTop: -15, marginBottom: 20, marginLeft: 24}}>
          {title}
          {desc}
        </View>
      </TouchableOpacity>
    );
  };

  renderCircle = (rowData, sectionID) => {
    const {activeIndex} = this.props;

    return (
      <View
        style={{
          left: 16,
          position: 'absolute',
          top: -5,
          zIndex: 999,
          backgroundColor: '#fff',
          width: 30,
          height: 30,
          borderRadius: 15,
          justifyContent: 'center',
        }}>
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor:
              activeIndex === sectionID
                ? colors.primary
                : rowData.status === STATUS_PART.DONE
                ? colors.helpText
                : colors.helpText2,
          }}
        />
      </View>
    );
  };

  renderFooter = () => {
    return <View style={{height: 48}} />;
  };

  eventPress = (event) => {
    // console.log('eventPress ', event);
  };

  render() {
    const {parts} = this.props;

    return (
      <Timeline
        data={parts}
        showTime={false}
        renderDetail={this.renderDetail}
        renderCircle={this.renderCircle}
        lineColor="#D4DCE7"
        lineWidth={1}
        style={{marginLeft: -16}}
        options={{
          showsVerticalScrollIndicator: false,
          ListFooterComponent: this.renderFooter(),
          ListHeaderComponent: this.props.renderHeader,
        }}
        showsVerticalScrollIndicator={false}
      />
    );
  }
}

TestPartTimeline.propTypes = {
  parts: PropTypes.array,
  activeIndex: PropTypes.number,
  renderHeader: PropTypes.func,
  selectPart: PropTypes.func,
};

TestPartTimeline.defaultProps = {
  activeIndex: 0,
  renderHeader: () => <View />,
  selectPart: () => {},
};
