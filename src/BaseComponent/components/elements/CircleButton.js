import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {colors} from '~/themes';

const CircleButton = (props) => {
  const {children, onClick, ...styleProps} = props;
  return (
    <STouchableOpacity activeOpacity={0.7} onPress={onClick} {...styleProps}>
      {children}
    </STouchableOpacity>
  );
};

CircleButton.propTypes = {
  onClick: PropTypes.func,
  active: PropTypes.bool,
  size: PropTypes.number,
};
CircleButton.defaultProps = {
  onClick: () => {},
  active: false,
  size: 36,
};

export const STouchableOpacity = styled.TouchableOpacity`
  background-color: ${(props) => {
    if (props.active) {
      return colors.primary;
    }
    return colors.white_15;
  }};
  justify-content: center;
  align-items: center;
  border-radius: ${(props) => props.size / 2};
  width: ${(props) => props.size};
  height: ${(props) => props.size};
`;

export default CircleButton;
