import lodash from 'lodash';
import {put, call, takeLatest, select} from 'redux-saga/effects';

import {FETCH_MESSAGE_CLASS, SET_COLOR_CHATTING_ACCOUNT} from './LiveClassType';
import liveClassApi from './LiveClassApi';

import {colors} from '~/themes';
import {getChattingFormat, urlify} from '~/utils/utils';
import {
  fetchMessageChatFail,
  fetchMessageChatSuccess,
  setColorChattingAccountSuccess,
} from '~/features/liveclass/LiveClassAction';

const colorsFix = [
  '#00A170',
  '#7FDBFF',
  '#39CCCC',
  '#F7CAC9',
  '#98DDDE',
  '#88B04B',
  '#FF6F61',
  '#FF851B',
  '#EFC050',
];

const getQueryChattingMessage = (state) => {
  const user = state.auth.user;
  return {
    query: {
      class_scheduled: state.liveClass.selectedScheduleId,
      first_message_time: state.chatting.first_message_time || null,
    },
    user,
  };
};

const getColorAccountChat = (state) => {
  const classId = state.liveClass.selectedClassId;
  const user = state.auth.user;
  const detailClass = state.liveClass.detailClassInfo[classId]?.class || {};
  let detailColorInUser = {
    [detailClass?.teacher?.email]: colorsFix[0],
  };

  (detailClass.students || []).forEach((item) => {
    detailColorInUser = {
      ...detailColorInUser,
      [item.email]:
        item.email === user.email
          ? colors.primary
          : colorsFix[Math.round(Math.random() * colorsFix.length)],
    };
  });

  return detailColorInUser;
};

const getMessageFromStore = (state) => {
  const listIdStore = state.chatting.listIdMessage;
  const detailMessageStore = state.chatting.detailMessage;
  return {listIdStore, detailMessageStore};
};

export default function* chattingSagas() {
  yield takeLatest(FETCH_MESSAGE_CLASS, fetchMessageClassSaga);
  yield takeLatest(SET_COLOR_CHATTING_ACCOUNT, setColorChat);
}

function* setColorChat() {
  const getColorAccount = yield select(getColorAccountChat);
  yield put(setColorChattingAccountSuccess(getColorAccount));
}

function* fetchMessageClassSaga() {
  const selectStore = yield select(getQueryChattingMessage);
  const response = yield call(
    liveClassApi.fetchMessageClassApi,
    selectStore.query,
  );
  if (response.ok && response.data?.data && response.data.data.length) {
    const dataStore = yield select(getMessageFromStore);
    let listId = [];
    let detailMessage = {};
    const queryTime =
      response.data.data[response.data.data.length - 1].created_at;
    for (let item of response.data.data || []) {
      listId.push(item._id);
      let itemPushDetail = {
        ...item,
        isMe: item.user._id === selectStore.user._id,
      };
      if (item.message?.type === 'text') {
        const formatMessage = urlify(item.message.text);
        if (formatMessage.hasLink) {
          itemPushDetail = {
            ...item,
            isMe: item.user._id === selectStore.user._id,
            message: {
              ...item.message,
              text: formatMessage.normalizeTextLink,
            },
            link: formatMessage.linkPreview,
            isLink: formatMessage.hasLink,
          };
        }
      }
      detailMessage = {
        ...detailMessage,
        [itemPushDetail._id]: itemPushDetail,
      };
    }
    detailMessage = {...dataStore.detailMessageStore, ...detailMessage};
    listId = lodash.uniq([...dataStore.listIdStore, ...listId]);
    let detailMessageUpdate = {};
    const messageUpdate = listId.map((item) => detailMessage[item]);
    detailMessageUpdate = getChattingFormat(messageUpdate);
    yield put(fetchMessageChatSuccess(listId, detailMessageUpdate, queryTime));
    return;
  }
  yield put(fetchMessageChatFail());
}
