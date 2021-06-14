import {translate} from '~/utils/multilanguage';

export const oneCorrect = {
  text: [
    translate('Khá đấy chứ!'),
    translate('Cũng được!'),
    translate('Chuẩn rồi!'),
    translate('Chính xác'),
  ],
  image: [
    require('~/assets/images/emotions/amis/correct_1_1.gif'),
    require('~/assets/images/emotions/amis/correct_1_2.gif'),
    require('~/assets/images/emotions/amis/correct_1_3.gif'),
  ],
};

export const twoCorrect = {
  text: [
    translate('Xuất sắc!'),
    translate('Quá đỉnh!'),
    translate('Cũng được đấy chứ!'),
    translate('Làm tốt lắm!'),
    translate('Có thể tốt hơn đấy!'),
  ],
  image: [
    require('~/assets/images/emotions/amis/correct_2_1.gif'),
    require('~/assets/images/emotions/amis/correct_2_2.gif'),
    require('~/assets/images/emotions/amis/correct_2_3.gif'),
  ],
};

export const threeCorrect = {
  text: [
    translate('Xuất sắc!'),
    translate('Quá đỉnh!'),
    translate('Rất tuyệt vời!'),
  ],
  image: [
    require('~/assets/images/emotions/amis/correct_3_1.gif'),
    require('~/assets/images/emotions/amis/correct_3_2.gif'),
    require('~/assets/images/emotions/amis/correct_3_3.gif'),
    require('~/assets/images/emotions/amis/correct_3_4.gif'),
  ],
};

export const oneWrong = {
  text: [
    translate('Whoops! Xem lại đi bạn ei!'),
    translate('Không đúng rồi!'),
    translate('Sai mất rồi!'),
  ],
  image: [
    require('~/assets/images/emotions/amis/wrong_1_1.gif'),
    require('~/assets/images/emotions/amis/wrong_1_2.gif'),
    require('~/assets/images/emotions/amis/wrong_1_3.gif'),
    require('~/assets/images/emotions/amis/wrong_1_4.gif'),
  ],
};

export const oneWrongToCorrect = {
  text: [translate('Lần 2 mới đúng! Tạm được')],
  image: [
    require('~/assets/images/emotions/amis/wrong_to_correct_1_1.gif'),
    require('~/assets/images/emotions/amis/wrong_to_correct_1_2.gif'),
    require('~/assets/images/emotions/amis/wrong_to_correct_1_3.gif'),
  ],
};

export const twoWrong = {
  text: [
    translate('Vẫn không đúng!'),
    translate('Buồn quá đi!'),
    translate('Cố lên bạn!'),
    translate('Hoang mang quá!'),
  ],
  image: [
    require('~/assets/images/emotions/amis/wrong_2_1.gif'),
    require('~/assets/images/emotions/amis/wrong_2_2.gif'),
    require('~/assets/images/emotions/amis/wrong_2_3.gif'),
  ],
};

export const threeWrong = {
  text: [
    translate('Vẫn không đúng! Thôi coi đáp án'),
    translate('Buồn! Đáp án bên dưới nè!'),
  ],
  image: [
    require('~/assets/images/emotions/amis/wrong_3_1.gif'),
    require('~/assets/images/emotions/amis/wrong_3_2.gif'),
    require('~/assets/images/emotions/amis/wrong_3_3.gif'),
    require('~/assets/images/emotions/amis/wrong_3_4.gif'),
  ],
};

export const HASH_TABLE_EMOJI = {
  correct_1_1: require('~/assets/images/emotions/amis/correct_1_1.gif'),
  correct_1_2: require('~/assets/images/emotions/amis/correct_1_2.gif'),
  correct_1_3: require('~/assets/images/emotions/amis/correct_1_3.gif'),

  correct_2_1: require('~/assets/images/emotions/amis/correct_2_1.gif'),
  correct_2_2: require('~/assets/images/emotions/amis/correct_2_2.gif'),
  correct_2_3: require('~/assets/images/emotions/amis/correct_2_3.gif'),

  correct_3_1: require('~/assets/images/emotions/amis/correct_3_1.gif'),
  correct_3_2: require('~/assets/images/emotions/amis/correct_3_2.gif'),
  correct_3_3: require('~/assets/images/emotions/amis/correct_3_3.gif'),
  correct_3_4: require('~/assets/images/emotions/amis/correct_3_4.gif'),

  wrong_to_correct_1_1: require('~/assets/images/emotions/amis/wrong_to_correct_1_1.gif'),
  wrong_to_correct_1_2: require('~/assets/images/emotions/amis/wrong_to_correct_1_2.gif'),
  wrong_to_correct_1_3: require('~/assets/images/emotions/amis/wrong_to_correct_1_3.gif'),

  wrong_2_1: require('~/assets/images/emotions/amis/wrong_2_1.gif'),
  wrong_2_2: require('~/assets/images/emotions/amis/wrong_2_2.gif'),
  wrong_2_3: require('~/assets/images/emotions/amis/wrong_2_3.gif'),

  wrong_3_1: require('~/assets/images/emotions/amis/wrong_3_1.gif'),
  wrong_3_2: require('~/assets/images/emotions/amis/wrong_3_2.gif'),
  wrong_3_3: require('~/assets/images/emotions/amis/wrong_3_3.gif'),
  wrong_3_4: require('~/assets/images/emotions/amis/wrong_3_4.gif'),
};
