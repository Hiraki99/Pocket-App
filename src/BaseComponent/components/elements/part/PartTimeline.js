import React, {PureComponent} from 'react';
import {StyleSheet, View, TouchableOpacity, Animated} from 'react-native';
import {Icon} from 'native-base';
import PropTypes from 'prop-types';
import ProgressCircle from 'react-native-progress-circle';
import FastImage from 'react-native-fast-image';

import Loading from '../../base/Loading';
import Text from '../../base/Text';
import AnimatedHeader from '../../layouts/AnimatedHeader';

import PartHeader from './PartHeader';

import {truncateStr} from '~/utils/common';
import {OS} from '~/constants/os';
import {FlexContainer} from '~/BaseComponent';
import {colors} from '~/themes';
import {translate} from '~/utils/multilanguage';

export default class PartTimeline extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      data: this.props.data,
      maxHeight: 0,
      minHeight: 50,
      scrollY: new Animated.Value(0),
      runUp: false,
    };
    this.lastDrag = null;
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.data !== nextProps.data) {
      return {
        data: nextProps.data,
      };
    }

    return null;
  }

  onLayout = (e) => {
    if (this.state.maxHeight === 0) {
      this.setState({
        maxHeight: e.nativeEvent.layout.height,
      });
    }
  };

  renderHeader = () => {
    return (
      <View
        style={{
          backgroundColor: colors.mainBgColor,
          width: '100%',
          zIndex: 10,
        }}>
        <PartHeader lesson={this.props.currentLesson || {}} />
        <Text primary uppercase bold paddingHorizontal={24}>
          {translate('Nội dung bài học')}
        </Text>
        {this.props.loading && (
          <Loading
            style={{
              height: OS.HEIGHT - 230,
              justifyContent: 'center',
              alignItems: 'center',
              paddingBottom: 230,
            }}
          />
        )}
      </View>
    );
  };

  onScrollEndDrag = (evt) => {
    const {runUp} = this.state;
    const {contentOffset} = evt.nativeEvent;
    const {y} = contentOffset;
    if (!runUp && this.lastDrag - y < 0) {
      this.setState({runUp: true});
    }
    if (runUp && this.lastDrag - y > 0) {
      this.setState({runUp: false});
    }
  };

  render() {
    const {currentLesson} = this.props;
    const {data} = this.state;
    const imageTranslate = this.state.scrollY.interpolate({
      inputRange: [0, OS.RANGE_INTERPOLE],
      outputRange: [0, OS.TRANSLATE_Y * -1],
      extrapolate: 'clamp',
      useNativeDriver: false,
    });
    return (
      <>
        <AnimatedHeader
          themePrimary
          title={`${currentLesson.display_name}`}
          runAnimated={this.state.runUp}
          headerContentColor={'white'}
          androidStatusBarColor={colors.primary}
        />
        <View
          style={data.length > 0 ? styles.container : styles.containerNodata}>
          {data.length > 0 && <View style={styles.topBackground} />}
          <Animated.FlatList
            ListHeaderComponent={this.renderHeader}
            style={{
              zIndex: 100,
              position: 'relative',
              top: 0,
              transform: [{translateY: imageTranslate}],
            }}
            data={data}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index + ''}
            showsVerticalScrollIndicator={false}
            refreshing={false}
            onScroll={Animated.event([
              {nativeEvent: {contentOffset: {y: this.state.scrollY}}},
            ])}
            onScrollBeginDrag={(evt) => {
              const {contentOffset} = evt.nativeEvent;
              const {y} = contentOffset;
              this.lastDrag = y;
            }}
            onScrollEndDrag={this.onScrollEndDrag}
            onMomentumScrollEnd={this.onScrollEndDrag}
            ListFooterComponent={() => (
              <View style={{height: OS.IsAndroid ? 48 : 12}} />
            )}
            scrollEventThrottle={16}
          />
          <View style={styles.bottomBackground} />
        </View>
      </>
    );
  }

  renderItem = ({item, index}) => {
    return (
      <View style={{backgroundColor: colors.mainBgColor}}>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => this.props.onChangePart(item)}>
          <View key={index} style={{paddingHorizontal: 24}}>
            <View style={styles.rowContainer}>
              {index !== 0 && <View style={styles.topLine} />}
              {this.renderCircle(item, index)}
              {this.renderEvent(item, index)}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  renderEvent = (rowData, rowID) => {
    return (
      <View
        style={styles.details}
        onLayout={(evt) => {
          if (!this.state.x && !this.state.width) {
            const {x, width} = evt.nativeEvent.layout;
            this.setState({x, width});
          }
        }}>
        <View style={styles.detail}>{this.renderDetail(rowData, rowID)}</View>
      </View>
    );
  };

  renderDetail = (rowData) => {
    return (
      <FlexContainer>
        <View style={styles.detailWrap}>
          <View>
            <Text h5 bold>
              {truncateStr(rowData.name, 25)}
            </Text>
            <Text color={colors.helpText} style={{opacity: 0.38}}>
              {truncateStr(rowData.display_name, 30)}
            </Text>
          </View>
          <Icon
            type="Feather"
            name="chevron-right"
            style={{color: colors.helpText, fontSize: 20, opacity: 0.38}}
          />
        </View>
      </FlexContainer>
    );
  };

  renderCircle = (rowData) => {
    let percent = 0;

    if (rowData && rowData.activity_done_count) {
      percent = (rowData.activity_done_count * 100) / rowData.activity_count;
    }

    return (
      <View style={styles.circle}>
        <ProgressCircle
          percent={percent}
          radius={38}
          borderWidth={5}
          color="#FFCC00"
          shadowColor="#dddddd"
          bgColor={colors.mainBgColor}>
          <FastImage
            source={{uri: rowData.featured_image}}
            style={{width: 56, height: 56}}
          />
        </ProgressCircle>
      </View>
    );
  };
}

PartTimeline.propTypes = {
  onChangePart: PropTypes.func,
  currentLesson: PropTypes.object.isRequired,
  header: PropTypes.node,
  loading: PropTypes.bool,
};

PartTimeline.defaultProps = {
  onChangePart: () => {},
  header: null,
  loading: false,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: !OS.IsAndroid ? colors.primary : colors.mainBgColor,
    overflow: 'hidden',
  },
  containerNodata: {
    flex: 1,
    backgroundColor: colors.mainBgColor,
    overflow: 'hidden',
  },
  listview: {
    flex: 1,
  },
  rowContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    zIndex: 1,
    position: 'absolute',
    left: 0,
    top: 20,
  },
  details: {
    flexDirection: 'column',
    flex: 1,
  },
  detail: {paddingTop: 30, paddingBottom: 30, marginLeft: 88},
  detailWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topLine: {
    width: 4,
    backgroundColor: '#ddd',
    position: 'absolute',
    height: 100,
    left: 36,
    zIndex: 1,
    top: -15,
  },
  bottomBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: OS.HEIGHT / 2,
    backgroundColor: colors.mainBgColor,
    zIndex: 2,
  },
  topBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: colors.primary,
    zIndex: 2,
  },
});
