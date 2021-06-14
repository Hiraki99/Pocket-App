import React from 'react';
import {Image, View, Dimensions, StatusBar, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Swiper from 'react-native-swiper';
import {connect} from 'react-redux';
import {Container} from 'native-base';

import {Text, Button} from '~/BaseComponent';
import navigator from '~/navigation/customNavigator';
import {images, colors} from '~/themes';
import {translate} from '~/utils/multilanguage';

const {width, height} = Dimensions.get('screen');

class OnBoardingScreen extends React.PureComponent {
  componentDidMount = async () => {
    await AsyncStorage.setItem('firstUseApp', 'false');
    StatusBar.setBarStyle('dark-content');
  };

  render() {
    return (
      <Swiper
        dot={<View style={styles.dot} />}
        activeDot={<View style={styles.dotActive} />}
        loop={false}>
        <Container style={styles.container}>
          <Image
            source={images.onBoard.onBoard_1}
            style={styles.image}
            resizeMode="contain"
          />
          <Text h4 bold paddingVertical="16" center color={'#1F2631'}>
            {translate('Học tiếng Anh trên lớp')}
          </Text>
          <Text center fontSize={14} opacity={0.38} style={styles.memo}>
            {translate(
              'Nếu bạn muốn thực sự nắm được bài, đạt điểm cao nhưng không cần phải\nbỏ nhiều thời gian cho môn tiếng Anh trên lớp thì ứng dụng ENGLISH\nFOR SCHOOL này chính là dành cho bạn',
            )}
          </Text>
        </Container>

        <Container style={styles.container}>
          <Image
            source={images.onBoard.onBoard_2}
            style={styles.image}
            resizeMode="contain"
          />

          <Text h4 bold center paddingVertical="16" color="#1F2631">
            {translate('Nhẹ nhàng mà điểm cao')}
          </Text>
          <Text
            center
            fontSize={14}
            opacity={0.38}
            color="#1F2631"
            style={styles.memo}>
            {translate(
              'Nếu bạn muốn thực sự nắm được bài, đạt điểm cao nhưng không cần phải\nbỏ nhiều thời gian cho môn tiếng Anh trên lớp thì ứng dụng ENGLISH\nFOR SCHOOL này chính là dành cho bạn',
            )}
          </Text>
        </Container>

        <Container style={styles.container}>
          <Image
            source={images.onBoard.onBoard_3}
            style={styles.image}
            resizeMode="contain"
          />
          <Text h4 bold center paddingVertical="16" color="#1F2631">
            {translate('Tiếng Anh là chuyện nhỏ')}
          </Text>
          <Text
            center
            fontSize={14}
            opacity={0.38}
            color="#1F2631"
            style={styles.lastMemo}>
            {translate(
              'Nếu bạn muốn thực sự nắm được bài, đạt điểm cao nhưng không cần phải\nbỏ nhiều thời gian cho môn tiếng Anh trên lớp thì ứng dụng ENGLISH\nFOR SCHOOL này chính là dành cho bạn',
            )}
          </Text>

          <Button
            large
            primary
            rounded
            block
            uppercase
            bold
            icon
            onPress={() => navigator.navigate('AuthStack')}>
            {translate('Bắt đầu')}
          </Button>
        </Container>
      </Swiper>
    );
  }
}

const styles = StyleSheet.create({
  dot: {
    backgroundColor: '#4A50F1',
    opacity: 0.3,
    width: 6,
    height: 6,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  },
  dotActive: {
    backgroundColor: '#4A50F1',
    width: 12,
    height: 6,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  },
  icon: {paddingTop: 2, paddingRight: 10, opacity: 0.8},
  image: {width: width - 54, height: height / 3},
  container: {
    paddingHorizontal: 27,
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  slideText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
    paddingRight: 15,
  },
  memo: {
    lineHeight: 22,
  },
  lastMemo: {
    marginBottom: 24,
  },
});

export default connect(null, null)(OnBoardingScreen);
