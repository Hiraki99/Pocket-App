import React from 'react';
import {TouchableOpacity} from 'react-native';

const TouchableOpacityPreventDoubleClick = (props) => {
  const timeoutRef = React.useRef();
  const clickedRef = React.useRef(false);
  const {onPress} = props;

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      clickedRef.current = false;
    };
  }, []);

  const press = React.useCallback(() => {
    if (!clickedRef.current) {
      clickedRef.current = true;
      onPress && onPress();
      timeoutRef.current = setTimeout(() => {
        clickedRef.current = false;
      }, 1000);
    }
  }, [onPress]);

  return <TouchableOpacity activeOpacity={0.7} {...props} onPress={press} />;
};

export default TouchableOpacityPreventDoubleClick;
