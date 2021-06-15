import React from 'react';
import {TouchableOpacity, View, Image} from 'react-native';
import {connect} from 'react-redux';
import FastImage from 'react-native-fast-image';
import FontAwesome5 from 'react-native-vector-icons/Ionicons';
import LottieView from 'lottie-react-native';
import PropTypes from 'prop-types';

import {NoFlexContainer, RowContainer, Text} from '~/BaseComponent';
import {colors, images} from '~/themes';
import {resetActivityDone} from '~/features/activity/ActivityAction';
import {OS} from '~/constants/os';
import {HARD_LEVEL} from '~/constants/threshold';

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
    const {item, onSelected, doneActivity} = this.props;
    const checkboxColor = item.done ? '#5468FF' : '#E2E4E7';

    return (
      <View style={[item.enabled ? styles.enable : styles.disable]}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.courseItem}
          onPress={() => onSelected(item, item.enabled)}>
          <View style={styles.courseInfoWrap}>
            <View>
              <FastImage
                source={{uri: item.featured_image}}
                style={styles.featureImage}
              />
              {item.word_group_level === HARD_LEVEL.BAD && (
                <Image source={images.clam} style={styles.clamImage} />
              )}
            </View>
            <View style={styles.courseInfo}>
              <Text h5 bold>
                {item.name}
              </Text>
              {!item.word_group_level ? (
                <Text color={colors.helpText2}>{item.display_name}</Text>
              ) : (
                <>
                  {item.word_group_level === HARD_LEVEL.BAD && (
                    <RowContainer>
                      <Text color={colors.helpText2}>Độ mạnh bộ từ</Text>
                      <Image source={images.hard.level_1} style={styles.hard} />
                    </RowContainer>
                  )}
                  {item.word_group_level === HARD_LEVEL.AVERAGE && (
                    <RowContainer>
                      <Text color={colors.helpText2}>Độ mạnh bộ từ</Text>
                      <Image source={images.hard.level_2} style={styles.hard} />
                    </RowContainer>
                  )}
                  {item.word_group_level === HARD_LEVEL.GOOD && (
                    <RowContainer>
                      <Text color={colors.helpText2}>Độ mạnh bộ từ</Text>
                      <Image source={images.hard.level_3} style={styles.hard} />
                    </RowContainer>
                  )}
                </>
              )}
            </View>
          </View>
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
        </TouchableOpacity>
      </View>
    );
  }
}

ActivityItem.propTypes = {
  item: PropTypes.object.isRequired,
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
  hard: {width: 22, height: 14, marginBottom: 2, marginLeft: 8},
  error: {width: 20, height: 20, position: 'absolute', top: -4, right: 18},
  clamImage: {
    width: 20,
    height: 20,
    position: 'absolute',
    top: -4,
    right: 18,
  },
  featureImage: {
    width: 48,
    height: 48,
    marginRight: 16,
  },
};

export default connect(mapStateToProps, {resetActivityDone})(ActivityItem);
