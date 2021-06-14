import React, {useCallback} from 'react';
import {StyleSheet, TouchableWithoutFeedback} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Foundation';
import {useDispatch} from 'react-redux';

import {Button, Card, CommonAlert, CommonImage} from '~/BaseComponent/index';
import TextBase, {
  TextBaseStyle,
} from '~/BaseComponent/components/base/text-base/TextBase';
import {colors} from '~/themes';
import {changeCurrentActivity} from '~/features/activity/ActivityAction';
import {
  changeCurrentScriptItem,
  resetAction,
} from '~/features/script/ScriptAction';
import navigator from '~/navigation/customNavigator';
import {translate} from '~/utils/multilanguage';

const ActivityHomework = (props) => {
  const dispatch = useDispatch();
  const [showAlert, setShowAlert] = React.useState(false);
  const [message, setMessageError] = React.useState('');
  const navigateToScript = useCallback(
    (item) => {
      dispatch(changeCurrentActivity(item));
      dispatch(changeCurrentScriptItem(null));
      dispatch(resetAction());

      const {script} = item;

      if (script && script.length > 0) {
        navigator.navigate('MainScript');
      } else {
        setShowAlert(true);
        setMessageError(
          translate('Phần này chưa có bài tập rồi, bạn quay lại sau nhé!'),
        );
      }
    },
    [dispatch],
  );

  const renderAlert = React.useCallback(() => {
    return (
      <CommonAlert
        theme="danger"
        show={showAlert}
        title={translate('Ôi không!')}
        subtitle={message}
        headerIconComponent={<Icon name="alert" color="#fff" size={30} />}
        onRequestClose={() => {}}
        cancellable={false}>
        <Button rounded large danger onPress={() => setShowAlert(false)}>
          {translate('Quay lại')}
        </Button>
      </CommonAlert>
    );
  }, [showAlert, message]);

  const {dataAction} = props;
  const lengthProgress = dataAction.progress ? dataAction.progress.length : 0;

  return (
    <TouchableWithoutFeedback
      onPress={() => navigateToScript(props.dataAction)}>
      <Card style={styles.container}>
        {renderAlert()}
        <CommonImage
          source={{uri: dataAction.featured_image}}
          style={styles.images}
        />
        <TextBase
          style={[
            TextBaseStyle.h5,
            TextBaseStyle.bold,
            TextBaseStyle.center,
            {lineHeight: 22, paddingTop: 20},
          ]}>
          {dataAction.name}
        </TextBase>
        <TextBase
          style={[
            TextBaseStyle.center,
            {fontSize: 14, lineHeight: 22, color: colors.hoverText},
          ]}>
          {dataAction.display_name}
        </TextBase>
        {dataAction.progress && dataAction.progress.length > 0 && (
          <Card backgroundColor={colors.primary} style={styles.normal_score}>
            <TextBase
              style={[TextBaseStyle.bold, {fontSize: 12, color: colors.white}]}>
              {Math.ceil(
                dataAction.progress[lengthProgress - 1].normal_score * 100,
              )}
            </TextBase>
          </Card>
        )}
      </Card>
    </TouchableWithoutFeedback>
  );
};
ActivityHomework.propTypes = {
  action: PropTypes.func,
  dataAction: PropTypes.object,
};
ActivityHomework.defaultProps = {
  action: () => {},
  dataAction: {},
};
const styles = StyleSheet.create({
  container: {
    width: 160,
    height: 192,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 0,
    paddingHorizontal: 2,
  },
  images: {
    height: 64,
    width: 64,
    borderRadius: 32,
    marginTop: 16,
  },
  normal_score: {
    borderRadius: 15,
    width: 30,
    height: 30,
    position: 'absolute',
    top: 10,
    right: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
});
export default ActivityHomework;
