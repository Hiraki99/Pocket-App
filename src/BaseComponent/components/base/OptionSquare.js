import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import {colors} from '~/themes';

export default class Option extends React.PureComponent {
  render() {
    return (
      <OptionContainer {...this.props}>
        {this.props.success && (
          <Entypo name={'check'} size={24} color={colors.successChoice} />
        )}
        {this.props.wrong && (
          <AntDesign name={'close'} size={24} color={colors.red_brick} />
        )}
      </OptionContainer>
    );
  }
}

Option.propTypes = {
  selected: PropTypes.bool,
  success: PropTypes.bool,
  wrong: PropTypes.bool,
  colorOption: PropTypes.string,
};

Option.defaultProps = {
  selected: false,
  colorOption: null,
  success: false,
  wrong: false,
};

const OptionContainer = styled.View`
  width: 28
  height: 28
  border-radius: 4
  border-width: 2
  opacity: 1
  borderColor: ${(props) => {
    if (props.selected) {
      if (props.colorOption) {
        return props.colorOption;
      }
      return props.theme.colors.primary;
    }
    if (props.success) {
      return props.theme.colors.success;
    }
    if (props.wrong) {
      return props.theme.colors.red_brick;
    }
    return props.theme.colors.primary;
  }}
  justifyContent: center
  alignItems: center
`;
