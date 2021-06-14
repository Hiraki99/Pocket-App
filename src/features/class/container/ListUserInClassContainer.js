import React, {useCallback, useEffect} from 'react';
import PropTypes from 'prop-types';
import {
  FlatList,
  Image,
  TouchableWithoutFeedback,
  StyleSheet,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {
  FlexContainer,
  NoFlexContainer,
  SeparatorVertical,
} from '~/BaseComponent/components/base/CommonContainer';
import {Button, Card, Text} from '~/BaseComponent/index';
import UserShortDesc from '~/BaseComponent/components/elements/homework/UserShortDesc';
import {colors, images} from '~/themes';
import {classUserSelector, infoUserSelector} from '~/selector/user';
import {fetchDetailClass} from '~/features/class/ClassAction';
import {classDetailSelect} from '~/selector/classInfo';
import navigator from '~/navigation/customNavigator';
import {translate} from '~/utils/multilanguage';

const ListUserInClassContainer = (props) => {
  const user = useSelector(infoUserSelector);
  const classUser = useSelector(classUserSelector);
  const classInfo = useSelector(classDetailSelect);
  const dispatch = useDispatch();

  useEffect(() => {
    if (classUser && classInfo) {
      let detailStudent = {};
      (classInfo?.students || []).forEach((item) => {
        detailStudent = {...detailStudent, [item.email]: item};
      });
    }
  }, [dispatch, classUser, classInfo]);

  const enterLiveClass = useCallback(() => {
    if (classInfo?.online_class_status === 'ongoing') {
    } else {
      Alert.alert(
        translate('Thông báo'),
        translate('Lớp học chưa được bắt đầu.'),
        [
          {
            text: translate('Đồng ý'),
            style: 'cancel',
          },
        ],
      );
    }
  }, [dispatch, classInfo, classUser]);

  React.useEffect(() => {
    dispatch(
      fetchDetailClass({
        id: classUser,
      }),
    );
  }, [dispatch, classUser]);

  const renderHeader = useCallback(() => {
    return (
      <NoFlexContainer
        justifyContent={'center'}
        alignItems={'center'}
        paddingHorizontal={24}
        paddingBottom={32}>
        <Image source={images.readingsOfficer} style={styles.logoTab} />
        <Text
          h2
          color={colors.helpText}
          bold
          uppercase
          style={{marginTop: -16}}>
          {classInfo.name}
        </Text>
        <Button
          marginTop={25}
          large
          primary
          rounded
          block
          uppercase
          bold
          icon
          shadow
          onPress={enterLiveClass}>
          {translate('Vào lớp học')}
        </Button>
      </NoFlexContainer>
    );
  }, [classInfo, enterLiveClass]);
  const renderItem = useCallback(
    ({item}) => {
      return (
        <TouchableWithoutFeedback
          onPress={() => {
            if (user._id === item._id) {
              navigator.navigate('MainStack', {
                screen: 'BottomTabSetting',
              });
              return;
            }
            navigator.navigate('UserClassInfo', {user: item});
          }}>
          <Card borderRadius={16} paddingVertical={16} paddingHorizontal={16}>
            <UserShortDesc
              lg
              dataAction={item}
              title={item.full_name}
              sideContent={item.email}
              source={item.avatar ? {uri: item.avatar} : null}
              disabled
            />
          </Card>
        </TouchableWithoutFeedback>
      );
    },
    [user],
  );

  if (!props.focus) {
    return null;
  }
  return (
    <FlexContainer backgroundColor={colors.mainBgColor} paddingHorizontal={16}>
      <FlatList
        ListHeaderComponent={renderHeader}
        data={classInfo.students || []}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <SeparatorVertical height={12} />}
        showsVerticalScrollIndicator={false}
      />
    </FlexContainer>
  );
};
ListUserInClassContainer.propTypes = {
  focus: PropTypes.bool,
};
ListUserInClassContainer.defaultProps = {
  focus: false,
};
const styles = StyleSheet.create({
  logoTab: {width: 100, height: 100, marginTop: 20},
});
export default ListUserInClassContainer;
