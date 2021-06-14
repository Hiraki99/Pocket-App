import React from 'react';
import {connect} from 'react-redux';
import {
  TouchableOpacity,
  View,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import {Image} from 'react-native-animatable';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  Card,
  NoFlexContainer,
  RowContainer,
  Text,
  BlankHeader,
  FilterButton,
  Avatar,
  SeparatorVertical,
  FlexContainer,
} from '~/BaseComponent';
import ProgressUserLearning from '~/features/course/container/ProgressUserLearning';
import {customNavigationOptions} from '~/navigation/navigationHelper';
import {logout} from '~/features/authentication/AuthenAction';
import {colors, images} from '~/themes';
import navigator from '~/navigation/customNavigator';
import {translate} from '~/utils/multilanguage';

const filterButton = [translate('Hồ sơ'), translate('Thành tích')];

class SettingScreen extends React.PureComponent {
  static navigationOptions = customNavigationOptions;
  constructor(props) {
    super(props);
    this.state = {
      selected: filterButton[0],
    };
  }

  componentDidMount(): void {}

  logout = () => {
    const {fcmToken} = this.props;
    Alert.alert(
      translate('Thông báo'),
      translate('Bạn có muốn đăng xuất ra khỏi ứng dụng!'),
      [
        {
          text: translate('Đồng ý'),
          onPress: () => this.props.logout({fcmToken}),
        },
        {
          text: translate('Hủy'),
        },
      ],
    );
  };

  setSelected = (value) => {
    if (this.scrollView) {
      this.scrollView.scrollTo({x: 0, y: 0, animated: true});
    }
    this.setState({selected: value});
  };

  renderFormAchievements = () => {
    return (
      <Card style={styles.achievementsContainer}>
        <TouchableOpacity activeOpacity={0.75}>
          <RowContainer
            paddingVertical={12}
            paddingHorizontal={24}
            alignItem="center">
            <Image source={images.award.medal} style={styles.icon} />
            <NoFlexContainer paddingHorizontal={24}>
              <Text h5 bold paddingVertical={12}>
                {translate('0 huy chương')}
              </Text>
              <Text h6 color={colors.helpText2}>
                {translate('Hoàn thành bài học')}
              </Text>
            </NoFlexContainer>
          </RowContainer>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.75}>
          <RowContainer
            paddingVertical={12}
            paddingHorizontal={24}
            alignItem="center">
            <Image source={images.award.badge} style={styles.iconBadge} />
            <NoFlexContainer paddingHorizontal={24}>
              <Text h5 bold paddingVertical={12}>
                {translate('0 chuyên cần')}
              </Text>
              <Text h6 color={colors.helpText2}>
                {translate('Làm ít nhất 5 bài tập')}
              </Text>
            </NoFlexContainer>
          </RowContainer>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.75}>
          <RowContainer
            paddingVertical={12}
            paddingHorizontal={24}
            alignItem="center">
            <Image source={images.award.star} style={styles.icon} />
            <NoFlexContainer paddingHorizontal={24}>
              <Text h5 bold paddingVertical={12}>
                {translate('0 ngôi sao')}
              </Text>
              <Text h6 color={colors.helpText2}>
                {translate('Đạt 3 điểm 10 liên tiếp')}
              </Text>
            </NoFlexContainer>
          </RowContainer>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.75}>
          <RowContainer
            paddingVertical={12}
            paddingHorizontal={24}
            alignItem="center">
            <Image source={images.award.tropy} style={styles.icon} />
            <NoFlexContainer paddingHorizontal={24}>
              <Text h5 bold paddingVertical={12}>
                {translate('0 cúp vàng')}
              </Text>
              <Text h6 color={colors.helpText2}>
                {translate('Hoàn thành khóa học')}
              </Text>
            </NoFlexContainer>
          </RowContainer>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.75}>
          <RowContainer
            paddingVertical={12}
            paddingHorizontal={24}
            alignItem="center">
            <Image source={images.award.streak} style={styles.icon} />
            <NoFlexContainer paddingHorizontal={24}>
              <Text h5 bold paddingVertical={12}>
                {translate('0 Streak')}
              </Text>
              <Text h6 color={colors.helpText2} style={{paddingBottom: 12}}>
                {translate('Số lần học liên tiếp 7 ngày')}
              </Text>
            </NoFlexContainer>
          </RowContainer>
        </TouchableOpacity>
      </Card>
    );
  };

  render() {
    const {selected} = this.state;
    const {user} = this.props;
    return (
      <FlexContainer style={styles.container}>
        <BlankHeader dark color={colors.mainBgColor} />
        <ScrollView
          ref={(ref) => {
            this.scrollView = ref;
          }}
          backgroundColor={colors.mainBgColor}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              navigator.goBack();
            }}>
            <View backgroundColor={colors.mainBgColor}>
              <Ionicons
                name="md-arrow-back"
                size={24}
                color={colors.primary}
                style={{paddingHorizontal: 16, paddingVertical: 8}}
              />
            </View>
          </TouchableOpacity>
          <SeparatorVertical slg />
          <NoFlexContainer alignItems={'center'}>
            <Avatar uri={user.avatar} />
            {user.full_name && (
              <Text h4 bold color={colors.helpText} style={styles.name}>
                {user.full_name}
              </Text>
            )}
            <Text h6 color={colors.helpText2} paddingVertical={4}>
              {user.email}
            </Text>
          </NoFlexContainer>
          <View style={styles.tabContainer}>
            <FilterButton
              buttons={filterButton}
              selected={this.state.selected}
              onSelected={this.setSelected}
            />
            {selected === filterButton[0] ? (
              <ProgressUserLearning user={this.props.user} />
            ) : selected === filterButton[1] ? (
              this.renderFormAchievements()
            ) : (
              this.renderFormAccount()
            )}
          </View>
        </ScrollView>
      </FlexContainer>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user || {},
    fcmToken: state.auth.fcmToken,
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginVertical: 16,
    // backgroundColor: 'red',
  },
  cardContainer: {
    backgroundColor: '#fff',
    marginTop: 36,
    marginBottom: 36,
  },
  containerFirst: {
    marginHorizontal: 30,
    paddingTop: 16,
    paddingBottom: 36,
  },
  tabContainer: {
    marginHorizontal: 30,
    paddingTop: 16,
    paddingBottom: 36,
  },
  achievementsContainer: {
    backgroundColor: '#fff',
    marginTop: 16,
    marginBottom: 16,
    paddingVertical: 12,
  },
  iconBadge: {width: 30, height: 34, marginTop: 5},
  icon: {width: 34, height: 40, marginTop: 5},
  name: {paddingTop: 16, paddingBottom: 10},
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

export default connect(mapStateToProps, {logout})(SettingScreen);
