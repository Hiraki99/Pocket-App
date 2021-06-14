import React from 'react';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';

import InlineActivityWrapper from '~/BaseComponent/components/elements/script/InlineActivityWrapper';

export default class InlineImageActivity extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {activity, loadingCompleted} = this.props;
    const {data} = activity;
    const {isUser, image, delay} = data;

    return (
      <InlineActivityWrapper
        loading={false}
        isUser={isUser}
        delay={delay}
        loadingCompleted={loadingCompleted}>
        <FastImage
          source={{uri: image}}
          style={{
            width: 160,
            height: 160,
            borderRadius: 8,
            marginHorizontal: 16,
          }}
        />
      </InlineActivityWrapper>
    );
  }
}

InlineImageActivity.propTypes = {
  activity: PropTypes.object.isRequired,
  loadingCompleted: PropTypes.func,
};

InlineImageActivity.defaultProps = {
  loadingCompleted: () => {},
};
