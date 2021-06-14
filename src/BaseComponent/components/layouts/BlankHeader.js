import React from 'react';
import {StatusBar, View} from 'react-native';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import {useIsFocused} from '@react-navigation/native';

import {OS} from '~/constants/os';

const BlankHeader = (props) => {
  const isFocused = useIsFocused();
  const {light, dark} = props;
  const [barStyle, setBarStyle] = React.useState(
    light ? 'light-content' : dark ? 'dark-content' : 'default',
  );
  React.useEffect(() => {
    if (isFocused) {
      setBarStyle(light ? 'light-content' : dark ? 'dark-content' : 'default');
    } else {
      setBarStyle(null);
    }
  }, [isFocused, light, dark]);

  if (OS.IsAndroid && isFocused) {
    return <StatusBar backgroundColor={props.color} barStyle={barStyle} />;
  }

  return (
    <HeaderContainer {...props}>
      <StatusBar barStyle={barStyle} />
    </HeaderContainer>
  );
};

export default BlankHeader;

const HeaderContainer = styled(View)`
  height: ${OS.statusBarHeight}
  borderBottomColor: ${(props) => props.color || 'transparent'}
  backgroundColor: ${(props) => props.color || 'transparent'}
`;

BlankHeader.propTypes = {
  color: PropTypes.string,
  light: PropTypes.bool,
  dark: PropTypes.bool,
};

BlankHeader.defaultProps = {
  color: 'transparent',
  light: false,
  dark: false,
};
