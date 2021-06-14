import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Keyboard} from 'react-native';

import {updateKeyboardHeight} from '~/features/config/ConfigAction';

export const useKeyboard = (
  didShow?: (keyboardHeight?: number) => void,
  didHide?: () => void,
): [number] => {
  const heightAttachmentChat = useSelector(
    (state) => state.config.keyboardHeight,
  );
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const dispatch = useDispatch();

  const onKeyboardDidShow = React.useCallback(
    (e) => {
      setKeyboardHeight(e.endCoordinates.height);
      if (heightAttachmentChat !== e.endCoordinates.height) {
        dispatch(updateKeyboardHeight(e.endCoordinates.height));
      }
      if (typeof didShow === 'function') {
        didShow(e.endCoordinates.height);
      }
    },
    [didShow, dispatch, heightAttachmentChat],
  );

  const onKeyboardChangeFrame = React.useCallback(
    (e) => {
      setKeyboardHeight(e.endCoordinates.height);
      if (heightAttachmentChat !== e.endCoordinates.height) {
        dispatch(updateKeyboardHeight(e.endCoordinates.height));
      }
    },
    [dispatch, heightAttachmentChat],
  );

  const onKeyboardDidHide = React.useCallback(() => {
    setKeyboardHeight(0);
    if (typeof didHide === 'function') {
      didHide(0);
    }
  }, [didHide]);

  useEffect(() => {
    Keyboard.addListener('keyboardWillShow', onKeyboardDidShow);
    Keyboard.addListener('keyboardWillHide', onKeyboardDidHide);
    Keyboard.addListener('keyboardWillChangeFrame', onKeyboardChangeFrame);
    return () => {
      Keyboard.removeListener('keyboardWillShow', onKeyboardDidShow);
      Keyboard.removeListener('keyboardWillHide', onKeyboardDidHide);
      Keyboard.removeListener('keyboardWillChangeFrame', onKeyboardDidHide);
    };
  }, [onKeyboardDidShow, onKeyboardDidHide, onKeyboardChangeFrame]);

  return [keyboardHeight];
};
