import React from 'react';

import {FlexContainer} from '~/BaseComponent';
import {useKeyboard} from '~/hook/keyboard';

const InputContainer = (props) => {
  const keyboardHeight = useKeyboard();
  const {children, ...restProps} = props;
  return (
    <FlexContainer
      style={{paddingBottom: parseInt(keyboardHeight, 10)}}
      {...restProps}>
      {children}
    </FlexContainer>
  );
};

export default InputContainer;
