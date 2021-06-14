import React from 'react';
import {
  Image,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';

import {
  FlexContainer,
  NoFlexContainer,
  RowContainer,
  Text,
} from '~/BaseComponent';
import {styles, tabBarOptions} from '~/navigation/navigationHelper';
import {images} from '~/themes';
import {OS} from '~/constants/os';

const getImageByRoute = (route, focused) => {
  switch (route) {
    case 'BottomTabHome':
      return focused ? images.bottomBar.home_active : images.bottomBar.home;
    case 'BottomTabStudy':
      return focused ? images.bottomBar.study_active : images.bottomBar.study;
    case 'BottomTabExam':
      return focused ? images.bottomBar.exam_active : images.bottomBar.exam;
    case 'BottomTabLibrary':
      return focused
        ? images.bottomBar.library_active
        : images.bottomBar.library;
    default:
      return focused
        ? images.bottomBar.profile_active
        : images.bottomBar.profile;
  }
};

const BottomTabBarComponent = (props) => {
  const {state, descriptors, navigation} = props;
  // const dispatch = useDispatch();
  // const sections = useSelector((s) => s.exam.sections || [], shallowEqual);

  if (OS.IsAndroid) {
    return (
      <View style={styles.bottomBarContainerAndroid} alignItems={'center'}>
        <RowContainer paddingHorizontal={16}>
          {state.routes.map((route, index) => {
            const {options} = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.name;

            const isFocused = state.index === index;
            const imageByRoute = getImageByRoute(route.name, isFocused);

            const normalPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const onPress = () => {
              normalPress();
            };

            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            };

            return (
              <TouchableWithoutFeedback
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityStates={isFocused ? ['selected'] : []}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                key={`${route.name}_${index}`}>
                <FlexContainer justifyCOntent={'center'} alignItems={'center'}>
                  <Image
                    resizeMode={'contain'}
                    source={imageByRoute}
                    style={styles.icon}
                  />
                  <Text
                    style={{paddingTop: 2}}
                    fontSize={12}
                    color={
                      isFocused
                        ? tabBarOptions.activeTintColor
                        : tabBarOptions.inactiveTintColor
                    }
                    center>
                    {label}
                  </Text>
                </FlexContainer>
              </TouchableWithoutFeedback>
            );
          })}
        </RowContainer>
      </View>
    );
  }
  return (
    <RowContainer style={styles.bottomBarContainerIOS} alignItems={'center'}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;
        const imageByRoute = getImageByRoute(route.name, isFocused);

        const normalPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            if (route.name === 'BottomTabExam') {
              navigation.navigate(route.name, {
                screen: 'TeacherExam',
              });
            } else {
              navigation.navigate(route.name);
            }
          }
        };

        const onPress = () => {
          normalPress();
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityStates={isFocused ? ['selected'] : []}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            key={`${route.name}_${index}`}
            style={styles.wrapContainer}>
            <NoFlexContainer justifyCOntent={'center'} alignItems={'center'}>
              <Image
                resizeMode={'contain'}
                source={imageByRoute}
                style={styles.icon}
              />
              <Text
                style={{paddingTop: 4}}
                fontSize={12}
                color={
                  isFocused
                    ? tabBarOptions.activeTintColor
                    : tabBarOptions.inactiveTintColor
                }
                center>
                {label}
              </Text>
            </NoFlexContainer>
          </TouchableOpacity>
        );
      })}
    </RowContainer>
  );
};
BottomTabBarComponent.propTypes = {};
BottomTabBarComponent.defaultProps = {};

export default BottomTabBarComponent;
