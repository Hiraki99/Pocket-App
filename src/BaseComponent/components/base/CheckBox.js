import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CheckBox = (props) => {
  return (
    <Container {...props}>
      {props.checked && (
        <Ionicons name={'md-checkmark'} color={'white'} size={20} />
      )}
    </Container>
  );
};

export default CheckBox;

const Container = styled.View`
  width: ${(props) => props.size};
  height: ${(props) => props.size};
  border-radius: ${(props) => props.size / 2};
  border-width: 1;
  border-color: ${(props) => props.color};
  background-color: ${(props) => {
    if (props.checked) {
      return props.color;
    }
    return 'transparent';
  }};
  align-items: center;
  justify-content: center;
`;

CheckBox.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
  checked: PropTypes.bool,
};

CheckBox.defaultProps = {
  size: 24,
  color: '#4A50F1',
  checked: false,
};
