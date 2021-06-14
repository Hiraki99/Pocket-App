import React from 'react';
import {TouchableOpacity} from 'react-native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import {BottomTabContainer, CommonHeader} from '~/BaseComponent';
import {OS} from '~/constants/os';
import ExamContainer from '~/features/exam/container/ExamContainer';
import {colors} from '~/themes';
import navigator from '~/navigation/customNavigator';
import {translate} from '~/utils/multilanguage';

const TeacherExamScreen = () => {
  return (
    <BottomTabContainer backgroundColor={colors.mainBgColor}>
      <CommonHeader
        title={translate('Kiểm tra_header')}
        themeWhite
        back={false}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            navigator.navigate('UserExamDid');
          }}>
          <SimpleLineIcons
            name={'book-open'}
            size={20}
            color={colors.primary}
            style={{paddingBottom: OS.IsAndroid ? 4 : 18}}
          />
        </TouchableOpacity>
      </CommonHeader>
      <ExamContainer />
    </BottomTabContainer>
  );
};
export default TeacherExamScreen;
