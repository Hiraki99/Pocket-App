import React from 'react';
import {Image} from 'react-native';
import PropTypes from 'prop-types';

import InlineActivityWrapper from '~/BaseComponent/components/elements/script/InlineActivityWrapper';

export default class InlineEmotion extends React.PureComponent {
  render() {
    const {activity, loadingCompleted} = this.props;
    const {data} = activity;
    const {delay} = data;

    return (
      <InlineActivityWrapper
        delay={delay}
        loading={false}
        loadingCompleted={loadingCompleted}>
        <Image source={data.image} resizeMode="contain" style={styles.large} />
      </InlineActivityWrapper>
    );
  }
}

InlineEmotion.propTypes = {
  activity: PropTypes.object.isRequired,
  loadingCompleted: PropTypes.func,
};

InlineEmotion.defaultProps = {
  loadingCompleted: () => {},
};

const styles = {
  large: {
    width: 150,
    height: 150,
    maxHeight: 150,
    margin: 0,
  },
};
