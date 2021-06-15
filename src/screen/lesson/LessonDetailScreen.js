import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';

import {
  CommonHeader,
  FlexContainer,
  RowContainer,
  SeparatorVertical,
  Text,
} from '~/BaseComponent';
import {OS} from '~/constants/os';
import {customNavigationOptions} from '~/navigation/navigationHelper';
import {fetchPart, changeCurrentPart} from '~/features/part/PartAction';
import {colors, images} from '~/themes';
import navigator from '~/navigation/customNavigator';
import {getDimensionVideo169} from '~/utils/utils';

class LessonDetailScreen extends React.PureComponent {
  static navigationOptions = customNavigationOptions;

  constructor(props) {
    super(props);

    this.state = {
      activeIndex: 0,
    };
  }

  componentDidMount() {
    this.loadParts();
  }

  loadParts = () => {
    const {currentLesson} = this.props;

    this.props.fetchPart({
      start: 0,
      length: -1,
      lesson_id: currentLesson._id,
    });
  };

  changePart = (part) => () => {
    this.props.changeCurrentPart(part);
    navigator.navigate('Activity');
  };

  renderHeader = () => {
    return (
      <View paddingHorizontal={24} paddingVertical={24}>
        <Image
          source={images.lesson_primary_image}
          resizeMode={'cover'}
          style={styles.imageHeader}
        />
      </View>
    );
  };

  renderItemLesson = ({item}) => {
    return (
      <TouchableWithoutFeedback onPress={this.changePart(item)}>
        <View marginHorizontal={24} style={styles.itemLessonContainer}>
          <RowContainer style={styles.itemContainer}>
            <View style={styles.featured_image}>
              <Image
                resizeMode="contain"
                source={{uri: item.featured_image}}
                style={styles.featured_image}
              />
            </View>
            <FlexContainer paddingHorizontal={16}>
              <Text h6 bold uppercase>
                {item.name}
              </Text>
              <Text h5 paddingTop={8} color={'rgba(52,67,86,0.3)'}>
                {item.description || item.display_name}
              </Text>
            </FlexContainer>
            <Feather
              name={'chevron-right'}
              size={20}
              color={'rgba(52,67,86,0.3)'}
            />
          </RowContainer>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  render() {
    const {parts, currentLesson} = this.props;

    return (
      <FlexContainer backgroundColor={colors.newMainBackground}>
        <CommonHeader title={currentLesson.name} back themeWhite />
        <FlatList
          data={parts}
          keyExtractor={(item) => item._id}
          renderItem={this.renderItemLesson}
          ItemSeparatorComponent={() => <SeparatorVertical lg />}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={this.renderHeader}
          ListFooterComponent={() => <SeparatorVertical lg />}
          ListFooterComponentStyle={{height: 50, justifyContent: 'flex-end'}}
          bounces={false}
        />
      </FlexContainer>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentLesson: state.lesson.currentLesson,
    parts: state.part.parts,
    loading: state.part.loading,
    errorMessage: state.part.errorMessage,
  };
};

const styles = StyleSheet.create({
  footerImage: {
    width: OS.WIDTH,
    height: 260,
  },
  featured_image: {
    width: 72,
    height: 72,
    borderRadius: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    paddingHorizontal: 8,
  },
  imageHeader: {
    width: OS.WIDTH - 48,
    height: getDimensionVideo169(OS.WIDTH - 48),
    borderRadius: 24,
  },
  itemLessonContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: 4,
    paddingVertical: 12,
    shadowColor: 'rgba(0, 0, 0,1)',
    shadowOffset: {
      width: 4,
      height: 16,
    },
    shadowOpacity: 0.1,
    shadowRadius: 40,
    borderRadius: 16,
  },
});

export default connect(mapStateToProps, {fetchPart, changeCurrentPart})(
  LessonDetailScreen,
);
