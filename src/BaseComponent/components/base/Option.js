import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

export default class Option extends React.Component {
  render() {
    return (
      <OptionContainer {...this.props}>
        <OptionValue {...this.props} />
      </OptionContainer>
    );
  }
}

Option.propTypes = {
  selected: PropTypes.bool,
  colorOption: PropTypes.string,
  size: PropTypes.number,
};

Option.defaultProps = {
  selected: false,
  colorOption: null,
  size: 20,
};

const OptionContainer = styled.View`
  width: ${(props) => {
    console.log(props.size);
    return props.size;
  }};
  height: ${(props) => {
    return props.size;
  }};
  borderRadius: ${(props) => {
    return props.size / 2;
  }}
  border-width: 2
  opacity: ${(props) => {
    if (props.selected) {
      return 1;
    }
    return 0.54;
  }}
  borderColor: ${(props) => {
    if (props.selected) {
      if (props.colorOption) {
        return props.colorOption;
      }
      return props.theme.colors.primary;
    }
    return props.theme.colors.helpText;
  }}
  justifyContent: center;
  alignItems: center;
`;
const OptionValue = styled.View`
  width: ${(props) => (props.selected ? props.size / 2 : 0)}
  height: ${(props) => (props.selected ? props.size / 2 : 0)}
  border-radius: ${(props) => {
    return props.size / 4;
  }};
  backgroundColor: ${(props) => {
    if (props.selected) {
      if (props.colorOption) {
        return props.colorOption;
      }
      return props.theme.colors.primary;
    }
    return props.theme.colors.helpText;
  }}
`;
