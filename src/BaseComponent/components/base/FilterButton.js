import React from 'react';
import {TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';

import Card from './Card';
import Text from './Text';

import {translate} from '~/utils/multilanguage';

export default class FilterButton extends React.Component {
  render() {
    const {buttons, selected, onSelected} = this.props;
    return (
      <Card style={styles.wrap}>
        {buttons.map((item, index) => {
          return (
            <TouchableOpacity
              activeOpactity={0.85}
              onPress={() => onSelected(item)}
              key={item}
              style={
                item === selected
                  ? styles.buttonActive
                  : index !== buttons.length - 1
                  ? styles.buttonDeactivate
                  : styles.buttonDeactivateNoBorder
              }>
              <Text fontSize={14} center uppercase bold={item === selected}>
                {translate(item)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </Card>
    );
  }
}

FilterButton.propTypes = {
  buttons: PropTypes.array,
  selected: PropTypes.any,
  onSelected: PropTypes.func,
};

FilterButton.defaultProps = {
  buttons: [],
  selected: null,
  onSelected: () => {},
};

const styles = {
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 1,
    overflow: 'hidden',
  },
  buttonActive: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 13,
    borderRightWidth: 1,
    borderRightColor: '#F3F5F9',
  },
  buttonDeactivate: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 13,
    borderRightWidth: 1,
    borderRightColor: '#F3F5F9',
  },
  buttonDeactivateNoBorder: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 13,
  },
  shadow: {
    shadowColor: '#F3F5F9',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
  },
};
