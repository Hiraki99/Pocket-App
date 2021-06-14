import {makeid} from '~/utils/utils';
import {images} from '~/themes';
import {translate} from '~/utils/multilanguage';

export const TYPE_ON_BOARD_STUDENT = {
  study_program: 'study_program',
  test_student: 'test_student',
  grammar_basic: 'grammar_basic',
  communication: 'communication',
  vocabulary_by_topic: 'vocabulary_by_topic',
  support_pronunciation: 'support_pronunciation',
  tool_search_dictionary: 'tool_search_dictionary',
  library: 'library',
  profile_learning: 'profile_learning',
  listen_practice: 'listen_practice',
  home_work: 'home_work',
  manage_account: 'manage_account',
  class_info: 'class_info',
  live_class: 'live_class',
};

export const MAPPING_HOME_STUDENT_SCREEN_INCOGNITO = [
  {
    key: makeid(16),
    content: translate('Chương trình học'),
    type: TYPE_ON_BOARD_STUDENT.study_program,
    image: images.onBoardStudent.study_program,
  },
  {
    key: makeid(16),
    content: translate('Kiểm tra thi cử'),
    type: TYPE_ON_BOARD_STUDENT.test_student,
    image: images.onBoardStudent.test_student,
  },
  {
    key: makeid(16),
    content: translate('Ngữ pháp cơ bản'),
    type: TYPE_ON_BOARD_STUDENT.grammar_basic,
    image: images.onBoardStudent.grammar_basic,
  },
  {
    key: makeid(16),
    content: translate('Tiếng Anh giao tiếp'),
    type: TYPE_ON_BOARD_STUDENT.communication,
    image: images.onBoardStudent.communication,
  },
  {
    key: makeid(16),
    content: translate('Từ vựng theo chủ đề'),
    type: TYPE_ON_BOARD_STUDENT.vocabulary_by_topic,
    image: images.onBoardStudent.vocabulary_by_topic,
  },
  {
    key: makeid(16),
    content: translate('Trợ lý luyện phát âm'),
    type: TYPE_ON_BOARD_STUDENT.support_pronunciation,
    image: images.onBoardStudent.support_pronunciation,
  },
  {
    key: makeid(16),
    content: translate('Công cụ tra từ điển'),
    type: TYPE_ON_BOARD_STUDENT.tool_search_dictionary,
    image: images.onBoardStudent.tool_search_dictionary,
  },
  {
    key: makeid(16),
    content: translate('Luyện nghe hiểu'),
    type: TYPE_ON_BOARD_STUDENT.listen_practice,
    image: images.onBoardStudent.listen_practice,
  },
  {
    key: makeid(16),
    content: translate('Hồ sơ học tập'),
    type: TYPE_ON_BOARD_STUDENT.profile_learning,
    image: images.onBoardStudent.profile_learning,
  },
];

export const MAPPING_HOME_STUDENT_SCREEN = [
  {
    key: makeid(16),
    content: translate('Chương trình học'),
    type: TYPE_ON_BOARD_STUDENT.study_program,
    image: images.onBoardStudent.study_program,
  },
  {
    key: makeid(16),
    content: translate('Kiểm tra thi cử'),
    type: TYPE_ON_BOARD_STUDENT.test_student,
    image: images.onBoardStudent.test_student,
  },
  {
    key: makeid(16),
    content: translate('Thư viện học liệu'),
    type: TYPE_ON_BOARD_STUDENT.library,
    image: images.onBoardStudent.library,
  },
  {
    key: makeid(16),
    content: translate('Bài tập về nhà'),
    type: TYPE_ON_BOARD_STUDENT.home_work,
    image: images.onBoardStudent.home_work,
  },
  {
    key: makeid(16),
    content: translate('Hồ sơ học tập'),
    type: TYPE_ON_BOARD_STUDENT.profile_learning,
    image: images.onBoardStudent.profile_learning,
  },
  {
    key: makeid(16),
    content: translate('Thông tin trường lớp'),
    type: TYPE_ON_BOARD_STUDENT.class_info,
    image: images.onBoardStudent.communication,
  },
  {
    key: makeid(16),
    content: translate('Trợ lý luyện phát âm'),
    type: TYPE_ON_BOARD_STUDENT.support_pronunciation,
    image: images.onBoardStudent.support_pronunciation,
  },
  {
    key: makeid(16),
    content: translate('Công cụ tra từ điển'),
    type: TYPE_ON_BOARD_STUDENT.tool_search_dictionary,
    image: images.onBoardStudent.tool_search_dictionary,
  },
  {
    key: makeid(16),
    content: translate('Quản lý tài khoản'),
    type: TYPE_ON_BOARD_STUDENT.manage_account,
    image: images.onBoardStudent.manage_account,
  },
];

export const HOME_STUDENT_ITEM_LIVE_CLASS = {
  key: makeid(16),
  content: translate('Lớp học trực tuyến'),
  type: TYPE_ON_BOARD_STUDENT.live_class,
  image: images.onBoardStudent.study_program,
};

export const BUTTON_STUDENT = [
  translate('Học SGK'),
  translate('Ôn Tập'),
  translate('Mục lục'),
];
export const BUTTON_STUDENT_PRIMARY = [
  translate('Học bài'),
  translate('Kiểm tra'),
];
