import React, {useCallback} from 'react';
import {connect, useDispatch, useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  FlatList,
  StyleSheet,
  View,
  Image,
  StatusBar,
  TouchableWithoutFeedback,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Feather from 'react-native-vector-icons/Feather';
import * as Progress from 'react-native-progress';
import ParallaxScrollView from 'react-native-parallax-scroll-view';

import {
  BottomTabContainer,
  Card,
  CommonHeader,
  FlexContainer,
  RowContainer,
  SeparatorVertical,
  Text,
} from '~/BaseComponent';
import {fetchPart, changeCurrentPart} from '~/features/part/PartAction';
import {colors} from '~/themes';
import navigator from '~/navigation/customNavigator';
import {OS} from '~/constants/os';
import {PRIMARY_FOOTER_IMAGES} from '~/themes/footer';

const LessonDetailPrimaryScreen = () => {
  const dispatch = useDispatch();
  const currentLesson = useSelector((state) => state.lesson.currentLesson);
  const parts = useSelector((state) => state.part.parts);
  const [imageFooter] = React.useState(
    PRIMARY_FOOTER_IMAGES[
      Math.round(Math.random() * (PRIMARY_FOOTER_IMAGES.length - 1))
    ],
  );
  React.useEffect(() => {
    if (currentLesson) {
      dispatch(
        fetchPart({
          start: 0,
          length: -1,
          lesson_id: currentLesson._id,
        }),
      );
    }
  }, [currentLesson, dispatch]);

  const changePart = React.useCallback(
    (part) => {
      dispatch(changeCurrentPart(part));
      navigator.navigate('ActivityPrimary');
    },
    [dispatch],
  );

  const renderItemLesson = React.useCallback(
    ({item}) => {
      return (
        <TouchableWithoutFeedback onPress={() => changePart(item)}>
          <View marginHorizontal={24}>
            <RowContainer style={styles.itemContainer}>
              <Card style={styles.featured_image}>
                <Image
                  resizeMode="cover"
                  source={{uri: item.featured_image}}
                  style={styles.featured_image}
                />
              </Card>
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
                size={24}
                color={'rgba(52,67,86,0.3)'}
              />
            </RowContainer>
          </View>
        </TouchableWithoutFeedback>
      );
    },
    [changePart],
  );

  const renderHeader = React.useCallback(() => {
    return (
      <View paddingHorizontal={24} paddingBottom={24}>
        <Text h6 primary uppercase bold center>
          {currentLesson ? currentLesson.name : ''}
        </Text>
        <Text fontSize={20} center medium paddingVertical={8}>
          {currentLesson ? currentLesson.description : ''}
        </Text>
        <View alignItems={'center'} paddingVertical={10}>
          <Progress.Bar
            progress={0.3}
            borderRadius={3}
            unfilledColor={'#F3F5F9'}
            color={colors.warning}
            borderWidth={0}
            width={150}
          />
        </View>
      </View>
    );
  }, [currentLesson]);

  const renderFooter = React.useCallback(() => {
    return <FastImage source={imageFooter} style={styles.footerImage} />;
  }, [imageFooter]);

  const renderItemSeparatorComponent = useCallback(
    () => <SeparatorVertical lg />,
    [],
  );

  const renderStickyHeader = useCallback(() => {
    return <CommonHeader themeWhite title={currentLesson.name} />;
  }, [currentLesson]);

  const renderBackground = useCallback(
    () => (
      <View
        style={{
          overflow: 'hidden',
          backgroundColor: colors.white,
        }}>
        <Image
          source={{uri: currentLesson?.banner_image}}
          style={styles.imageHeader}
        />
        <View style={styles.oval} />
      </View>
    ),
    [currentLesson],
  );

  const renderFixedHeader = useCallback(
    () => (
      <TouchableWithoutFeedback
        onPress={() => {
          navigator.goBack();
        }}>
        <RowContainer
          justifyContent={'center'}
          style={[{zIndex: 10}, styles.back]}>
          <Ionicons name={'md-arrow-back'} color={colors.white} size={22} />
        </RowContainer>
      </TouchableWithoutFeedback>
    ),
    [],
  );

  return (
    <BottomTabContainer backgroundColor={colors.white}>
      <StatusBar
        backgroundColor={OS.IsAndroid ? 'transparent' : 'blue'}
        barStyle={'dark-content'}
      />
      <FlexContainer>
        <ParallaxScrollView
          backgroundColor={colors.white}
          style={{backgroundColor: colors.white}}
          renderFixedHeader={renderFixedHeader}
          renderBackground={renderBackground}
          parallaxHeaderHeight={250}
          stickyHeaderHeight={86}
          bounces={false}
          showsVerticalScrollIndicator={false}
          renderStickyHeader={renderStickyHeader}
          contentContainerStyle={{flex: 1}}>
          <FlatList
            data={parts}
            keyExtractor={(item) => item._id}
            renderItem={renderItemLesson}
            ItemSeparatorComponent={renderItemSeparatorComponent}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={renderHeader}
            ListFooterComponent={renderFooter}
            contentContainerStyle={styles.contentContainerStyle}
            ListFooterComponentStyle={styles.listFooterComponentStyle}
            bounces={false}
          />
        </ParallaxScrollView>
      </FlexContainer>
    </BottomTabContainer>
  );
};

const mapStateToProps = (state) => {
  return {
    currentLesson: state.lesson.currentLesson,
    parts: state.part.parts,
    loading: state.part.loading,
    errorMessage: state.part.errorMessage,
  };
};

const styles = StyleSheet.create({
  listFooterComponentStyle: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  contentContainerStyle: {
    flexGrow: 1,
    minHeight: OS.HEIGHT - 250 - (OS.hasNotch ? 104 : 70),
  },
  footerImage: {
    width: OS.WIDTH,
    height: 260,
  },
  featured_image: {
    width: 82,
    height: 65,
    borderRadius: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    // paddingVertical: 24,
    paddingHorizontal: 8,
  },
  imageHeader: {
    width: OS.WIDTH + 10,
    height: 250,
    zIndex: 9,
  },
  oval: {
    position: 'absolute',
    zIndex: 100,
    bottom: -150,
    left: OS.WIDTH / 2 - 97,
    backgroundColor: 'white',
    width: 194,
    height: 194,
    borderTopRightRadius: 97,
    borderTopLeftRadius: 97,
    transform: [{scaleX: 3}],
  },
  back: {
    width: 32,
    height: 32,
    borderRadius: 16,
    position: 'absolute',
    top: OS.IsAndroid ? 5 : OS.statusBarHeight + 5,
    left: 10,
    zIndex: 10000,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default connect(mapStateToProps, {fetchPart, changeCurrentPart})(
  LessonDetailPrimaryScreen,
);
