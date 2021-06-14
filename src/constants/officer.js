import {makeid} from '~/utils/utils';
import {images} from '~/themes';

export const TYPE_ON_BOARD_OFFICER = {
  grammar_basic: 'grammar_basic',
  vocabulary_by_topic: 'vocabulary_by_topic',
  support_listen: 'support_listen',
  support_speak: 'support_speak',
  exam: 'exam',
  support_pronunciation: 'support_pronunciation',
  dictionary: 'dictionary',
  library: 'library',
  profile_learning: 'profile_learning',
};

export const MAPPING_HOME_OFFICER_SCREEN = [
  {
    key: makeid(8),
    content: 'Ngữ pháp cơ bản',
    type: TYPE_ON_BOARD_OFFICER.grammar_basic,
    image: images.onBoardOfficer.grammar_basic,
  },
  {
    key: makeid(8),
    content: 'Từ vựng theo chủ đề',
    type: TYPE_ON_BOARD_OFFICER.vocabulary_by_topic,
    image: images.onBoardOfficer.vocabulary_by_topic,
  },
  {
    key: makeid(8),
    content: 'Luyện nghe hiểu',
    type: TYPE_ON_BOARD_OFFICER.support_listen,
    image: images.onBoardOfficer.support_listen,
  },
  {
    key: makeid(8),
    content: 'Luyện nói theo chủ đề',
    type: TYPE_ON_BOARD_OFFICER.support_speak,
    image: images.onBoardOfficer.support_speak,
  },
  {
    key: makeid(8),
    content: 'Kiểm tra và thi thử',
    type: TYPE_ON_BOARD_OFFICER.exam,
    image: images.onBoardOfficer.exam,
  },
  {
    key: makeid(8),
    content: 'Trợ lý luyện phát âm',
    type: TYPE_ON_BOARD_OFFICER.support_pronunciation,
    image: images.onBoardOfficer.support_pronunciation,
  },
  {
    key: makeid(8),
    content: 'Công cụ tra từ điển',
    type: TYPE_ON_BOARD_OFFICER.dictionary,
    image: images.onBoardOfficer.dictionary,
  },
  {
    key: makeid(8),
    content: 'Thư viện học liệu',
    type: TYPE_ON_BOARD_OFFICER.library,
    image: images.onBoardOfficer.library,
  },
  {
    key: makeid(8),
    content: 'Hồ sơ học tập',
    type: TYPE_ON_BOARD_OFFICER.profile_learning,
    image: images.onBoardOfficer.profile_learning,
  },
];

export const BUTTON_OFFICER = ['Học thi', 'Luyện nói', 'Dạy học'];
