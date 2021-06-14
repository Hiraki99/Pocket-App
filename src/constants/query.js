import moment from 'moment';

import {translate} from '~/utils/multilanguage';

export const FIRST_PAGE = 0;
export const PAGE_SIZE = 10;

export const TimeQuery = {
  today: {
    key: 'today',
    text: translate('Hôm nay'),
    startTime: moment().startOf('day').valueOf(),
    endTime: moment().endOf('day').valueOf(),
  },
  yesterday: {
    key: 'yesterday',
    text: translate('Hôm qua'),
    startTime: moment().startOf('day').subtract(1, 'day').valueOf(),
    endTime: moment().subtract(1, 'day').endOf('day').valueOf(),
  },
  last7days: {
    key: 'last7days',
    text: translate('7 ngày vừa qua'),
    startTime: moment().subtract(6, 'day').startOf('day').valueOf(),
    endTime: moment().endOf('day').valueOf(),
  },
  thisWeek: {
    key: 'thisWeek',
    text: translate('Tuần này'),
    startTime: moment().startOf('week').valueOf(),
    endTime: moment().endOf('week').valueOf(),
  },
  lastWeek: {
    key: 'lastWeek',
    text: translate('Tuần trước'),
    startTime: moment().startOf('week').subtract(1, 'week').valueOf(),
    endTime: moment().endOf('week').subtract(1, 'week').valueOf(),
  },
  last30days: {
    key: 'last30days',
    text: translate('30 ngày vừa qua'),
    startTime: moment().startOf('day').subtract(29, 'day').valueOf(),
    endTime: moment().endOf('day').valueOf(),
  },
  thisMonth: {
    key: 'thisMonth',
    text: translate('Tháng này'),
    startTime: moment().startOf('month').valueOf(),
    endTime: moment().endOf('month').valueOf(),
  },
  lastMonth: {
    key: 'lastMonth',
    text: translate('Tháng trước'),
    startTime: moment().startOf('month').subtract(1, 'month').valueOf(),
    endTime: moment().endOf('month').subtract(1, 'month').valueOf(),
  },
  last90days: {
    key: 'last90days',
    text: translate('3 tháng trước'),
    startTime: moment().startOf('day').subtract(89, 'day').valueOf(),
    endTime: moment().endOf('day').valueOf(),
  },
  custom: {
    key: 'custom',
    text: translate('Tùy chỉnh'),
  },
};

export const LIVE_CLASS_STATUS = {
  ONGOING: 'ongoing',
  PENDING: 'pending',
  FINISHED: 'finished',
};
