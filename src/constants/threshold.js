import {translate} from '~/utils/multilanguage';

export const THRESHOLD = {
  GOOD: 0.8,
  PASSABLE: 0.6,
  BAD: 0.4,
};

export const COMMENT_PRONUNCIATION = {
  GOOD: `${translate('Đúng rồi')}`,
  PASSABLE: `${translate('Khá tốt')}`,
  AVERAGE: `${translate('Tạm chấp nhận được')}`,
  BAD: `${translate('Chưa chuẩn')}`,
};

export const HARD_LEVEL = {
  BAD: 1,
  AVERAGE: 2,
  GOOD: 3,
};

export const MEDIUM_SCORE = 65;
