import React from 'react';
import {FlatList, View, TouchableOpacity, Alert} from 'react-native';
import FastImage from 'react-native-fast-image';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/Foundation';

import {
  BlankHeader,
  Loading,
  Button,
  Card,
  CommonAlert,
  Logo,
  Text,
  CheckBox,
  FlexContainer,
  // BottomTabContainer,
} from '~/BaseComponent';
import {playAudio} from '~/utils/common';
import {customNavigationOptions} from '~/navigation/navigationHelper';
import {fetchCourse, changeCurrentCourse} from '~/features/course/CourseAction';
import navigator from '~/navigation/customNavigator';
import {colors, images} from '~/themes';
import {translate} from '~/utils/multilanguage';

class CourseScreen extends React.PureComponent {
  static navigationOptions = customNavigationOptions;

  constructor(props) {
    super(props);
    this.scrollView = React.createRef();

    this.state = {
      show: false,
      showLoading: false,
    };
  }

  componentDidMount() {
    this.loadCourses();

    this.setState({showLoading: true});
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.errorMessage && this.props.errorMessage) {
      this.setState({show: true});
    }

    if (prevProps.courses.length !== this.props.courses.length) {
      const {courses, user} = this.props;

      if (user && user.current_course) {
        const item = courses.find((o) => o._id === user.current_course);
        if (item) {
          this.props.changeCurrentCourse(item);
        }
      }
    }
  }

  loadCourses() {
    this.props.fetchCourse({
      start: 0,
      length: -1,
      // showAll: true,
    });
  }

  changeCurrentCourse(item) {
    playAudio('selected');
    this.props.changeCurrentCourse(item);
    this.scrollView.current.scrollToEnd(true, 500);
  }

  renderItem = ({item, index}) => {
    const {courses, currentCourse} = this.props;
    const courseLength = courses.length;

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => this.changeCurrentCourse(item)}
        style={{
          ...styles.courseItem,
          borderTopLeftRadius: index === 0 ? 15 : 0,
          borderTopRightRadius: index === 0 ? 15 : 0,
          borderBottomLeftRadius: index === courseLength - 1 ? 15 : 0,
          borderBottomRightRadius: index === courseLength - 1 ? 15 : 0,
          marginBottom: index === courseLength - 1 ? 0 : 1,
        }}>
        <View style={styles.courseInfoWrap}>
          <FastImage
            source={{uri: item.featured_image}}
            resizeMode={'cover'}
            style={{width: 72, height: 72, marginHorizontal: 16}}
          />
          <View style={styles.courseInfo}>
            <Text h5 bold>
              {item.description}
            </Text>
            <Text color={colors.helpText} style={{opacity: 0.38}}>
              {translate('%s b??i h???c', {s1: item.lesson_count})}
            </Text>
          </View>
        </View>

        <CheckBox
          checked={currentCourse && currentCourse._id === item._id}
          style={{marginRight: 30}}
        />
      </TouchableOpacity>
    );
  };

  nextNavigation = () => {
    const {currentCourse} = this.props;

    if (currentCourse) {
      navigator.navigate('MainStack', {screen: 'BottomTabHome'});
    } else {
      Alert.alert(
        translate('Th??ng b??o'),
        translate('B???n vui l??ng ch???n l???p h???c tr?????c khi b???t ?????u nh??!'),
        [
          {
            text: translate('?????ng ??'),
          },
        ],
      );
    }
  };

  tryAgain = () => {
    this.setState({
      show: false,
    });

    this.loadCourses();
  };

  renderHeaderList = () => {
    return (
      <View style={{paddingVertical: 24}}>
        <Logo images={images.logoSimple} />
        <Card
          style={{
            paddingVertical: 20,
            marginTop: 32,
            paddingHorizontal: 20,
            borderRadius: 16,
          }}
          arrowTranslateX={6}
          hasArrow={true}>
          <Text center h4 bold color={colors.helpText}>
            {translate('B???t ?????u nh??')}
          </Text>
          <Text center h5 color={colors.helpText}>
            {translate('B???n ??ang h???c l???p m???y v???y?')}
          </Text>
        </Card>
      </View>
    );
  };

  renderFooterList = () => {
    const {loading, courses} = this.props;
    const {showLoading} = this.state;
    return (
      <View style={{marginVertical: 20}}>
        {courses.length > 0 && (
          <Button
            large
            primary
            rounded
            block
            uppercase
            bold
            icon
            onPress={this.nextNavigation}>
            {translate('Ti???p t???c')}
          </Button>
        )}

        {showLoading && loading && <Loading />}
      </View>
    );
  };
  render() {
    const {courses} = this.props;

    return (
      <FlexContainer backgroundColor={colors.mainBgColor}>
        <BlankHeader dark />
        <FlexContainer
          backgroundColor={colors.mainBgColor}
          paddingHorizontal={24}>
          <CommonAlert
            theme="danger"
            show={this.state.show}
            title={translate('??i kh??ng')}
            subtitle={translate('Kh??ng t???i ???????c d??? li???u r???i!')}
            headerIconComponent={<Icon name="alert" color="#fff" size={30} />}
            onRequestClose={() => {}}
            cancellable={false}>
            <Button info onPress={this.tryAgain}>
              {translate('Th??? l???i')}
            </Button>
            <Button danger onPress={() => this.setState({show: false})}>
              {translate('????ng')}
            </Button>
          </CommonAlert>
          <FlexContainer style={styles.courseList}>
            <FlatList
              ref={this.scrollView}
              ListHeaderComponent={this.renderHeaderList}
              data={courses}
              renderItem={this.renderItem}
              keyExtractor={(item) => item._id}
              showsVerticalScrollIndicator={false}
              // ListFooterComponent={}
            />
          </FlexContainer>
          {this.renderFooterList()}
        </FlexContainer>
      </FlexContainer>
    );
  }
}

const styles = {
  courseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 1,
    justifyContent: 'space-between',
    borderColor: 'transparent',
  },
  courseInfoWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  courseInfo: {
    flexDirection: 'column',
  },
  courseList: {
    marginBottom: 10,
    marginTop: 0,
    backgroundColor: 'transparent',
    flex: 1,
    borderRadius: 8,
  },
};

const mapStateToProps = (state) => {
  return {
    courses: state.course.courses,
    currentCourse: state.course.currentCourse,
    loading: state.course.loading,
    errorMessage: state.course.errorMessage,
    user: state.auth.user,
  };
};

export default connect(mapStateToProps, {fetchCourse, changeCurrentCourse})(
  CourseScreen,
);
