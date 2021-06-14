import React from 'react';
import {ActivityIndicator, View, StyleSheet} from 'react-native';
import {Toast} from 'native-base';
import {LongPressGestureHandler, State} from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import {captureScreen} from 'react-native-view-shot';
import Orientation from 'react-native-orientation';

import {FlexContainer} from '~/BaseComponent';
import activityApi from '~/features/activity/ActivityApi';
import {REVIEWER} from '~/constants/role';
import {colors} from '~/themes';

const mapStateToProps = (state) => {
  return {
    role: state.auth.user ? state.auth.user.role : {},
    currentActivity: state.activity.currentActivity,
  };
};

class ReviewContext extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  componentDidMount() {
    Orientation.lockToPortrait();
  }

  uploadImageReview = ({nativeEvent}) => {
    const {role, currentActivity} = this.props;
    if (
      nativeEvent.state === State.ACTIVE &&
      role.name === REVIEWER &&
      currentActivity
    ) {
      captureScreen({
        format: 'jpg',
        quality: 0.8,
      }).then(
        async (uri) => {
          const formData = new FormData();
          const nameFile = uri.split('/')[uri.split('/').length - 1];
          formData.append('activity_id', currentActivity?._id);
          formData.append('activity_type', currentActivity?.type);
          formData.append('image', {
            uri,
            name: nameFile,
            type: 'image/jpg',
          });
          formData.append('type', 'image/jpg');
          this.setState({loading: true});
          const response = await activityApi.reviewActivity(formData);
          this.setState({loading: false});
          if (response.ok) {
            Toast.show({
              text: 'Upload ảnh review thành công!',
              buttonText: 'Đồng ý',
              duration: 3000,
            });
          } else {
            Toast.show({
              text: 'Upload ảnh review không thành công!',
              buttonText: 'Đồng ý',
              duration: 3000,
            });
          }
        },
        () => {
          Toast.show({
            text: 'Upload ảnh review không thành công!',
            buttonText: 'Đồng ý',
            duration: 3000,
          });
        },
      );
    }
  };

  render() {
    return (
      <LongPressGestureHandler
        onHandlerStateChange={this.uploadImageReview}
        minDurationMs={800}>
        <FlexContainer>
          {this.state.loading && (
            <View style={styles.loading}>
              <ActivityIndicator size={'large'} color={colors.white} />
            </View>
          )}
          {this.props.children}
        </FlexContainer>
      </LongPressGestureHandler>
    );
  }
}

const styles = StyleSheet.create({
  loading: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0, 0.3)',
    zIndex: 1,
  },
});

export default connect(mapStateToProps)(ReviewContext);
