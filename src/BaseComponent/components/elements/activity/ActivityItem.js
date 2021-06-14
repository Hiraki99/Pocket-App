import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {connect} from 'react-redux';
import FastImage from 'react-native-fast-image';
import FontAwesome5 from 'react-native-vector-icons/Ionicons';
import LottieView from 'lottie-react-native';
import PropTypes from 'prop-types';

import {resetActivityDone} from '~/features/activity/ActivityAction';
import {NoFlexContainer} from '~/BaseComponent/components/base/CommonContainer';
import Text from '~/BaseComponent/components/base/Text';
import {Card} from '~/BaseComponent';
import {colors} from '~/themes';
import {OS} from '~/constants/os';

class ActivityItem extends React.PureComponent {
  componentDidUpdate(): void {
    if (
      this.props.item &&
      this.props.item.done &&
      this.props.doneActivity &&
      this.props.doneActivity._id === this.props.item._id
    ) {
      setTimeout(() => {
        this.props.playAudioSuccess();
      }, 800);
      setTimeout(() => {
        this.props.resetActivityDone();
      }, 2000);
    }
  }

  render() {
    const {item, onSelected, doneActivity, showScore} = this.props;
    const checkboxColor = item.done ? '#5468FF' : '#E2E4E7';
    const lengthProgress = item.progress ? item.progress.length : 0;
    return (
      // <View style={[item.enabled ? styles.enable : styles.enable]}>
      <View style={styles.enable}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.courseItem}
          onPress={() => onSelected(item, item.enabled)}>
          <View style={styles.courseInfoWrap}>
            <FastImage
              source={{uri: item.featured_image}}
              style={styles.imageActivity}
            />
            <View style={styles.courseInfo}>
              <Text h5 bold>
                {item.name}
              </Text>
              <Text color={colors.helpText2}>{item.display_name}</Text>
            </View>
          </View>

          {showScore && item.progress && item.progress.length > 0 && (
            <Card style={styles.normal_score}>
              <Text fontSize={12} color={colors.white} bold>
                {Math.ceil(
                  item.progress[lengthProgress - 1].normal_score * 100,
                )}
              </Text>
            </Card>
          )}
          {!showScore && (
            <>
              {doneActivity && doneActivity._id === item._id ? (
                <NoFlexContainer>
                  <LottieView
                    ref={(ref) => {
                      this.lottieview = ref;
                    }}
                    autoPlay
                    loop={false}
                    source={require('~/assets/animate/check_animation')}
                    style={{width: 42, marginLeft: 5}}
                  />
                </NoFlexContainer>
              ) : (
                <NoFlexContainer
                  justifyContent={'center'}
                  alignItems={'center'}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    borderWidth: 1.6,
                    borderColor: checkboxColor,
                    backgroundColor: item.done ? '#5468FF' : null,
                  }}>
                  <FontAwesome5
                    color={item.done ? 'white' : '#E2E4E7'}
                    name={'md-checkmark'}
                    size={16}
                    style={{marginLeft: 1, marginTop: 1}}
                  />
                </NoFlexContainer>
              )}
            </>
          )}
        </TouchableOpacity>
      </View>
    );
  }
}

ActivityItem.propTypes = {
  item: PropTypes.object.isRequired,
  showScore: PropTypes.bool,
  onSelected: PropTypes.func,
  playAudioSuccess: PropTypes.func,
};

const mapStateToProps = (state) => {
  return {
    doneActivity: state.activity.doneActivity,
  };
};

const styles = {
  courseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 8,
    justifyContent: 'space-between',
    marginHorizontal: 24,
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: 'rgba(120,141,180, 0.12)',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 2,
    elevation: 0,
    borderBottomWidth: 0,
  },
  enable: {
    opacity: 1,
    shadowColor: 'rgba(60,128,209, 0.03)',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 8,
    elevation: 0,
    borderBottomWidth: 0,
  },
  disable: {
    opacity: 0.5,
    shadowColor: 'rgba(60,128,209, 0.03)',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 8,
    elevation: 8,
    borderBottomWidth: 0,
  },
  courseInfoWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  courseInfo: {
    flexDirection: 'column',
    width: OS.WIDTH - 24 * 2 - 130,
  },
  normal_score: {
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  imageActivity: {
    width: 52,
    height: 52,
    marginRight: 16,
  },
};

export default connect(mapStateToProps, {resetActivityDone})(ActivityItem);
