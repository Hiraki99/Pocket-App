import React from 'react';
import {ScrollView, View} from 'react-native';
import PropTypes from 'prop-types';

import {Button, GeneralStatusBar, FlexContainer} from '~/BaseComponent';
import {colors} from '~/themes';
import {translate} from '~/utils/multilanguage';

export default class ActivityBoardWrapper extends React.Component {
  render() {
    const {nextNavigation, mainContentStyle, loading} = this.props;

    return (
      <FlexContainer
        backgroundColor={colors.primary}
        paddingTop={0}
        paddingHorizontal={24}>
        <GeneralStatusBar
          backgroundColor={colors.primary}
          barStyle="light-content"
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={mainContentStyle}>
          {this.props.children}
        </ScrollView>

        <View style={{paddingTop: 20, paddingBottom: 30}}>
          <Button
            large
            white
            rounded
            block
            uppercase
            bold
            icon
            loading={loading}
            onPress={nextNavigation}>
            {translate('Tiếp tục')}
          </Button>
        </View>
      </FlexContainer>
    );
  }
}

ActivityBoardWrapper.propTypes = {
  nextNavigation: PropTypes.func,
  mainContentStyle: PropTypes.object,
  loading: PropTypes.bool,
};

ActivityBoardWrapper.defaultProps = {
  nextNavigation: () => {},
  mainContentStyle: null,
  loading: false,
};
