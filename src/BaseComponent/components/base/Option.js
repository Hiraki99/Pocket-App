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
};

Option.defaultProps = {
  selected: false,
  colorOption: null,
};

const OptionContainer = styled.View`
  width: 20
  height: 20
  border-radius: 10
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
  justifyContent: center
  alignItems: center
`;
const OptionValue = styled.View`
  width: ${(props) => (props.selected ? 10 : 0)}
  height: ${(props) => (props.selected ? 10 : 0)}
  border-radius: 5
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
