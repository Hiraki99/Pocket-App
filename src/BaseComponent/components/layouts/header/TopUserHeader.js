import React from 'react';
import {useSelector} from 'react-redux';
import PropTypes from 'prop-types';

import {Avatar, RowContainer, Text, FlexContainer} from '~/BaseComponent';
import {infoUserSelector} from '~/selector/user';
import {translate} from '~/utils/multilanguage';

const TopUserHeader = () => {
  const user = useSelector(infoUserSelector);
  return (
    <RowContainer justifyContent={'space-between'} paddingVertical={16}>
      <FlexContainer>
        <Text fontSize={20} accented medium>
          {translate('Chào buổi sáng')}
        </Text>
        <Text h4 bold>
          {user.full_name}
        </Text>
      </FlexContainer>
      <Avatar />
    </RowContainer>
  );
};

TopUserHeader.propTypes = {
  onPressAvatar: PropTypes.func,
};

TopUserHeader.defaultProps = {
  onPressAvatar: () => {},
};

export default TopUserHeader;
