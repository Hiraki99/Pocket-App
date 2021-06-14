import React, {useEffect, useCallback, useState} from 'react';
import {useDispatch} from 'react-redux';
import {Alert, TouchableWithoutFeedback} from 'react-native';
import PropTypes from 'prop-types';
import {useNavigation} from '@react-navigation/native';
import {Image} from 'react-native-animatable';

import {colors, images} from '~/themes';
import {FlexContainer, CommonHeader} from '~/BaseComponent';
import {resetExam} from '~/features/exam/ExamAction';
import timer from '~/utils/timer';
import navigator from '~/navigation/customNavigator';
import {formatsMinuteOptions} from '~/utils/utils';
import getAllInfoExamSelector from '~/selector/examSelector';
import ListStatusQuestionModalRef from '~/BaseComponent/components/elements/exam/modal/ListStatusQuestionModal';
import PartExamContainer from '~/features/exam/container/PartExamContainer';
import {translate} from '~/utils/multilanguage';

const PartExamScreen = (props) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const modalRef = React.useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigation.addListener('focus', () => {
      setLoading(false);
    });
    navigation.addListener('blur', () => {
      setLoading(true);
    });
  }, [navigation]);
  const {introExam} = getAllInfoExamSelector();

  const [time, setTime] = useState(0);

  useEffect(() => {
    timer.getTimerCurrentExam((t) => {
      if (t > introExam.time * 60 && typeof introExam.time === 'number') {
        Alert.alert(
          `${translate('Thông báo')}`,
          `${translate('Thời gian kiểm tra đã kết thúc')}`,
          [{text: `${translate('Đồng ý')}`}],
        );
        timer.clearIntervalTimingGlobal();
        navigator.navigate('ExamResult');
      } else {
        setTime(t);
      }
    });
  });

  const onClose = useCallback(() => {
    Alert.alert(
      `${translate('Thông báo')}`,
      `${translate('Bạn có chắc muốn kết thúc bài kiểm tra ?')}`,
      [
        {
          text: `${translate('Đồng ý')}`,
          onPress: () => {
            dispatch(resetExam());
            timer.clearIntervalTimingGlobal();
            navigator.navigate('MainStack', {
              screen: 'BottomTabExam',
              params: {
                screen: 'TeacherExam',
              },
            });
          },
        },
        {text: `${translate('Hủy')}`},
      ],
    );
  }, [dispatch]);

  return (
    <FlexContainer
      disablePadding={props.disablePadding}
      backgroundColor={colors.white}>
      <CommonHeader
        title={formatsMinuteOptions(time)}
        themeWhite
        close
        onClose={onClose}
        back={false}>
        <TouchableWithoutFeedback
          onPress={() => {
            if (modalRef && modalRef.current) {
              modalRef.current.showModal();
            }
          }}>
          <Image
            source={images.menuExam}
            style={{width: 16, height: 16, marginBottom: 32}}
          />
        </TouchableWithoutFeedback>
      </CommonHeader>
      {!loading && <PartExamContainer />}
      <ListStatusQuestionModalRef ref={modalRef} />
    </FlexContainer>
  );
};

PartExamScreen.propTypes = {
  disablePadding: PropTypes.bool,
};
PartExamScreen.defaultProps = {
  disablePadding: false,
};

export default PartExamScreen;
