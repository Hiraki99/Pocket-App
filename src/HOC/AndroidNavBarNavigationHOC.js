import React from 'react';
import {
  hideNavigationBar,
  showNavigationBar,
} from 'react-native-navigation-bar-color';

import {FlexContainer} from '~/BaseComponent/components/base/CommonContainer';
import {OS} from '~/constants/os';

const AndroidNavBarNavigationHOC = (Comp, props = {}) => {
  return class NewComp extends React.PureComponent {
    componentDidMount() {
      if (OS.IsAndroid) {
        hideNavigationBar();
      }
    }

    componentWillUnmount() {
      showNavigationBar();
    }

    render() {
      if (!OS.IsAndroid) {
        return <Comp />;
      }
      return (
        <FlexContainer>
          <Comp {...props} />
        </FlexContainer>
      );
    }
  };
};

export default AndroidNavBarNavigationHOC;
