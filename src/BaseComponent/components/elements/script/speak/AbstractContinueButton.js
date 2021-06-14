import React, {useCallback, useState} from 'react';
import PropTypes from 'prop-types';
import {TouchableWithoutFeedback} from 'react-native';

import {generateNextActivity} from '~/utils/script';

const AbstractContinueButton = (props) => {
  const {renderComponent} = props;
  const [isDone, setIsDone] = useState(false);

  const nextActivity = useCallback(() => {
    if (!isDone) {
      generateNextActivity();
      setIsDone(true);
    }
  }, [isDone]);

  return (
    <TouchableWithoutFeedback onPress={nextActivity}>
      {renderComponent()}
    </TouchableWithoutFeedback>
  );
};

AbstractContinueButton.propTypes = {
  renderComponent: PropTypes.func,
};

AbstractContinueButton.defaultProps = {
  renderComponent: () => {},
};

export default AbstractContinueButton;
