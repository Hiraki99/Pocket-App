import React from 'react';
import {TouchableWithoutFeedback, StyleSheet, View} from 'react-native';
import PropTypes from 'prop-types';

import {CommonImage, RowContainer, Text} from '~/BaseComponent';
import {colors, images} from '~/themes';

const UserShortDesc = (props) => {
  return (
    <TouchableWithoutFeedback onPress={props.action} disabled={props.disabled}>
      <RowContainer>
        <CommonImage
          source={props.source ? props.source : images.teacher}
          style={props.lg ? styles.avatarLg : styles.avatar}
        />
        <View paddingHorizontal={12}>
          <Text h5 fontWeight={'700'}>
            {props.title}
            <Text>{props.contentAttach}</Text>
          </Text>
          <Text h6 color={colors.hoverText} paddingTop={6}>
            {props.sideContent}
          </Text>
        </View>
      </RowContainer>
    </TouchableWithoutFeedback>
  );
};
UserShortDesc.propTypes = {
  dataAction: PropTypes.object,
  source: PropTypes.any,
  action: PropTypes.func,
  title: PropTypes.string,
  contentAttach: PropTypes.string,
  sideContent: PropTypes.string,
  disabled: PropTypes.bool,
  md: PropTypes.bool,
  lg: PropTypes.bool,
};
UserShortDesc.defaultProps = {
  data: {},
  action: () => {},
  source: null,
  title: 'Nguyễn Ngọc Thịnh',
  contentAttach: '',
  sideContent: '12 giờ trước',
  disabled: false,
  md: false,
  lg: false,
};
const styles = StyleSheet.create({
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarLg: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
});
export default UserShortDesc;
