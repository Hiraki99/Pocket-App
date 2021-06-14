import styled from 'styled-components';
import {Platform} from 'react-native';

import Text from './Text';

import {colors} from '~/themes';
import {OS} from '~/constants/os';

export const Container = styled.View`
  flex: 1
  flexDirection: ${(props) => props.direction || 'column'}
  justifyContent: ${(props) => props.justifyContent || 'flex-start'}
  alignItems: ${(props) => props.alignItems || 'flex-start'}
  marginTop: ${(props) => props.marginTop || 'null'}
  marginBottom: ${(props) => props.marginBottom || 'null'}
  marginVertical: ${(props) => props.marginVertical || 'null'}
  marginHorizontal: ${(props) => props.marginHorizontal || 'null'}
  paddingHorizontal: ${(props) => props.paddingHorizontal || 'null'}
  paddingVertical: ${(props) => props.paddingVertical || 'null'}
`;
export const ColumnContainer = styled(Container)`
  flexDirection: column
  justifyContent: ${(props) => props.justifyContent || 'flex-start'}
  alignItems: ${(props) => props.alignItems || 'center'}
  paddingRight: ${(props) => props.paddingRight || 'null'}
  paddingVertical: ${(props) => props.paddingVertical || 'null'}
  paddingHorizontal: ${(props) => props.paddingHorizontal || 'null'}
  marginHorizontal: ${(props) => props.marginHorizontal || 'null'}
  marginVertical: ${(props) => props.marginVertical || 'null'}
`;

export const BottomTabContainer = styled.View`
  flex: 1
  backgroundColor: ${(props) => props.backgroundColor || 'transparent'}
  paddingBottom: ${(props) => {
    if (props.disablePadding) {
      return 0;
    }
    return OS.hasNotch ? 100 : 70;
  }}
`;

export const FlexContainer = styled.View`
  flex: ${(props) => props.flex || 1}
  justifyContent: ${(props) => props.justifyContent || 'flex-start'}
  overflow: ${(props) => {
    if (props.hidden) {
      return 'hidden';
    }
    return 'visible';
  }}
  backgroundColor: ${(props) => props.backgroundColor || 'transparent'}
`;
export const NoFlexContainer = styled.View`
  justifyContent: ${(props) => props.justifyContent || 'flex-start'}
  flexDirection: ${(props) => props.direction || 'column'}
  alignItems: ${(props) => props.alignItems || 'flex-start'}
  marginTop: ${(props) => props.marginTop || 'null'}
  marginBottom: ${(props) => props.marginBottom || 'null'}
  marginHorizontal: ${(props) => props.marginHorizontal || 'null'}
  marginVertical: ${(props) => props.marginVertical || 'null'}
  paddingVertical: ${(props) => props.paddingVertical || 'null'}
  paddingHorizontal: ${(props) => props.paddingHorizontal || 'null'}
  backgroundColor: ${(props) => props.backgroundColor || 'transparent'}
`;
export const StartColumnContainer = styled(Container)`
  flex-direction: column
  justify-content: flex-start
`;
export const RowContainer = styled.View`
  flexDirection: row
  justifyContent: ${(props) => props.justifyContent || 'flex-start'}
  alignItems: ${(props) => props.alignItems || 'center'}
  paddingRight: ${(props) => props.paddingRight || 'null'}
  paddingVertical: ${(props) => props.paddingVertical || 'null'}
  paddingHorizontal: ${(props) => props.paddingHorizontal || 'null'}
  marginHorizontal: ${(props) => props.marginHorizontal || 'null'}
  marginVertical: ${(props) => props.marginVertical || 'null'}
  marginTop: ${(props) => props.marginTop || 'null'}
  marginBottom: ${(props) => props.marginBottom || 'null'}
`;

export const BottomWrapper = styled.View`
  paddingTop: 24
  paddingBottom: ${OS.hasNotch ? 48 : 24}
  zIndex: 1
`;

export const FlexRowContainer = styled(RowContainer)`
  flex: 1
  backgroundColor: ${(props) => props.backgroundColor || '#fff'}
  marginTop: ${(props) => props.marginTop || 'null'}
  marginBottom: ${(props) => props.marginBottom || 'null'}
  marginHorizontal: ${(props) => props.marginHorizontal || 'null'}
  marginLeft: ${(props) => props.marginLeft || 'null'}
  paddingHorizontal: ${(props) => props.paddingHorizontal || 'null'}
`;
export const STextInput = styled.TextInput`
  font-size: 17px
  line-height: 22px
  padding-vertical: 17px
  padding-horizontal: 24px
  border-radius: ${(props) => {
    if (props.borderRadius === 0) {
      return 0;
    }
    return 12;
  }}
  border-width: ${Platform.OS === 'ios' ? '1px' : 0}
  border-color: #DFE7F3
  background-color: #fff
  margin-vertical: ${(props) => props.marginVertical || 'null'}
  color: ${colors.black}
  width: 100%
  font-family: CircularStd-Book
`;

export const MainContainer = styled.View`
	flex: 1
	backgroundColor: ${(props) => props.backgroundColor || colors.mainBgColor}
	paddingHorizontal: ${(props) =>
    props.paddingHorizontal === 0 ? 0 : props.paddingHorizontal || '24px'}
	paddingTop: ${(props) =>
    props.paddingTop === 0 ? 0 : props.paddingTop || '60px'}
`;

export const SeparatorVertical = styled.View`
	height: ${(props) => {
    if (props.slg) {
      return 48;
    }
    if (props.lg) {
      return 24;
    }
    if (props.md) {
      return 16;
    }
    if (props.sm) {
      return 8;
    }
    if (props.height) {
      return props.height;
    }
    return 1;
  }}
	backgroundColor: ${(props) => props.backgroundColor || 'null'}
`;

export const SeparatorHorizontal = styled.View`
	width: ${(props) => {
    if (props.slg) {
      return 48;
    }
    if (props.lg) {
      return 24;
    }
    if (props.md) {
      return 16;
    }
    if (props.sm) {
      return 8;
    }
    if (props.height) {
      return props.height;
    }
    return 1;
  }}
	backgroundColor: ${(props) => props.backgroundColor || 'null'}
`;

export const SText = styled(Text)`
  color: ${(props) => {
    if (props.good) {
      return props.theme.colors.good;
    }
    if (props.passable) {
      return props.theme.colors.passable;
    }
    if (props.primary) {
      return props.theme.colors.primary;
    }
    if (props.average) {
      return props.theme.colors.average;
    }
    if (props.bad) {
      return props.theme.colors.bad;
    }
    return props.theme.colors.helpText;
  }};
  border-bottom-width: ${(props) => {
    if (props.refer) {
      return 2;
    }
    return 0;
  }};
  border-bottom-color: ${(props) => {
    if (props.good) {
      return props.theme.colors.good;
    }
    if (props.passable) {
      return props.theme.colors.passable;
    }
    if (props.primary) {
      return props.theme.colors.primary;
    }
    if (props.average) {
      return props.theme.colors.average;
    }
    if (props.bad) {
      return props.theme.colors.bad;
    }
    return props.theme.colors.helpText;
  }};
`;
