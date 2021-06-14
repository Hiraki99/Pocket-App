import {makeid} from '~/utils/utils';
import {images} from '~/themes';

export const TYPE_ON_BOARD_TEACHER = {
  test_input: 'test_input',
  upgrade_level: 'upgrade_level',
  procedure_teach: 'procedure_teach',
  test_exam: 'test_exam',
  vocabulary_by_topic: 'vocabulary_by_topic',
  support_pronunciation: 'support_pronunciation',
  dictionary: 'dictionary',
  library: 'library',
  profile_learning: 'profile_learning',
};

export const MAPPING_HOME_TEACHER_SCREEN = [
  {
    key: makeid(8),
    content: 'Kiểm tra đầu vào',
    type: TYPE_ON_BOARD_TEACHER.test_input,
    image: images.onBoardTeacher.test_input,
  },
  {
    key: makeid(8),
    content: 'Học thi nâng bậc',
    type: TYPE_ON_BOARD_TEACHER.upgrade_level,
    image: images.onBoardTeacher.test_upgrade_level,
  },
  {
    key: makeid(8),
    content: 'Phương pháp dạy',
    type: TYPE_ON_BOARD_TEACHER.procedure_teach,
    image: images.onBoardTeacher.procedure_teach,
  },
  {
    key: makeid(8),
    content: 'Làm bài thi thử',
    type: TYPE_ON_BOARD_TEACHER.test_exam,
    image: images.onBoardTeacher.test_exam,
  },
  {
    key: makeid(8),
    content: 'Từ vựng theo chủ đề',
    type: TYPE_ON_BOARD_TEACHER.vocabulary_by_topic,
    image: images.onBoardTeacher.vocabulary_by_topic,
  },
  {
    key: makeid(8),
    content: 'Trợ lý luyện phát âm',
    type: TYPE_ON_BOARD_TEACHER.support_pronunciation,
    image: images.onBoardTeacher.support_pronunciation,
  },
  {
    key: makeid(8),
    content: 'Công cụ tra từ điển',
    type: TYPE_ON_BOARD_TEACHER.dictionary,
    image: images.onBoardTeacher.dictionary,
  },
  {
    key: makeid(8),
    content: 'Thư viện học liệu',
    type: TYPE_ON_BOARD_TEACHER.library,
    image: images.onBoardTeacher.library,
  },
  {
    key: makeid(8),
    content: 'Hồ sơ học tập',
    type: TYPE_ON_BOARD_TEACHER.profile_learning,
    image: images.onBoardTeacher.profile_learning,
  },
];

export const BUTTON_TEACHER = ['Học thi', 'Luyện nói', 'Dạy học'];
export const BUTTON_COMMUNICATION = ['Luyện nói', 'Phát âm'];

export const SCORE_LEVEL = {
  master: {
    score: 0.9,
    name: 'Masters',
  },
  profiency: {
    score: 0.76,
    name: 'Profiency',
  },
  advanced: {
    score: 0.53,
    name: 'Advanced',
  },
  intermediate: {
    score: 0.367,
    name: 'Intermediate',
  },
  preIntermediate: {
    score: 0.116,
    name: 'Pre-Intermediate',
  },
  elementary: {
    score: 0.11,
    name: 'Elementary',
  },
};
