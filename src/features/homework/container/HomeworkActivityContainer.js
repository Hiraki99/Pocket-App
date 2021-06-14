import React, {useRef} from 'react';
import PropTypes from 'prop-types';
import {Animated, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Sound from 'react-native-sound';
import Icon from 'react-native-vector-icons/Foundation';
import {InstagramLoader} from 'react-native-easy-content-loader';

import {
  Button,
  CommonAlert,
  FlexContainer,
  SeparatorVertical,
  Text,
} from '~/BaseComponent/index';
import HomeWorkDescription from '~/BaseComponent/components/elements/homework/HomeWorkDescription';
import ActivityItem from '~/BaseComponent/components/elements/activity/ActivityItem';
import {colors} from '~/themes';
import {changeCurrentActivity} from '~/features/activity/ActivityAction';
import {
  changeCurrentScriptItem,
  resetAction,
} from '~/features/script/ScriptAction';
import {homeworkChoose} from '~/selector/homework';
import navigator from '~/navigation/customNavigator';
import {translate} from '~/utils/multilanguage';

const HomeworkActivityContainer = (props) => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const beginDrag = useRef(new Animated.Value(0)).current;
  const dispatch = useDispatch();
  const [showAlert, setShowAlert] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [message, setMessageError] = React.useState('');

  const homeworkSelected = useSelector(homeworkChoose);
  const audio = require('~/assets/media/Complete-Activity.wav');
  const sound = new Sound(audio, () => {});

  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 200);
  }, []);

  const navigateToScript = React.useCallback(
    (item) => {
      dispatch(changeCurrentActivity(item));
      dispatch(changeCurrentScriptItem(null));
      dispatch(resetAction());

      const {script} = item;

      if (script && script.length > 0) {
        navigator.navigate('MainScript');
      } else {
        setShowAlert(true);
        setMessageError(
          translate('Phần này chưa có bài tập rồi, bạn quay lại sau nhé!'),
        );
      }
    },
    [dispatch],
  );

  const renderAlert = React.useCallback(() => {
    return (
      <CommonAlert
        theme="danger"
        show={showAlert}
        title={translate('Ôi không!')}
        subtitle={message}
        headerIconComponent={<Icon name="alert" color="#fff" size={30} />}
        onRequestClose={() => {}}
        cancellable={false}>
        <Button rounded large danger onPress={() => setShowAlert(false)}>
          {translate('Quay lại')}
        </Button>
      </CommonAlert>
    );
  }, [showAlert, message]);

  const renderHeader = React.useCallback(() => {
    return (
      <View>
        <HomeWorkDescription
          dataAction={homeworkSelected}
          content={homeworkSelected.content}
          showListActivity={false}
        />
        <Text
          h5
          bold
          uppercase
          paddingHorizontal={24}
          paddingTop={32}
          paddingBottom={24}>
          {translate('Danh sách bài tập')}
        </Text>
      </View>
    );
  }, [homeworkSelected]);

  const playAudioSuccess = React.useCallback(() => {
    sound.play();
  }, [sound]);

  const renderItem = React.useCallback(
    ({item}) => {
      return (
        <ActivityItem
          item={item}
          playAudioSuccess={playAudioSuccess}
          onSelected={navigateToScript}
          showScore
        />
      );
    },
    [playAudioSuccess, navigateToScript],
  );

  if (loading) {
    return <InstagramLoader active />;
  }
  return (
    <FlexContainer backgroundColor={colors.mainBgColor} marginTop={4}>
      <Animated.FlatList
        data={homeworkSelected.activities || []}
        ListHeaderComponent={renderHeader}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListFooterComponent={() => <SeparatorVertical slg />}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        initialNumToRender={2}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  y: scrollY,
                },
              },
            },
          ],
          {useNativeDriver: false},
        )}
        onScrollBeginDrag={() => {
          beginDrag.setValue(scrollY._value);
        }}
        onScrollEndDrag={() => {
          const range = scrollY._value - beginDrag._value;
          props.action(range < 0);
        }}
      />
      {renderAlert()}
    </FlexContainer>
  );
};
HomeworkActivityContainer.propTypes = {
  action: PropTypes.func,
};
HomeworkActivityContainer.defaultProps = {
  action: () => {},
};
export default HomeworkActivityContainer;
