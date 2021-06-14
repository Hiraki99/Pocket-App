import {createSelector} from 'reselect';
import {getArrFromText, makeid, matchAllRegex} from '~/utils/utils';

const tutorialsActivitySelector = (state) => state.activity.tutorialActivity;
const currentScriptQuery = (state) => state.script.currentScriptItem;
const currentScriptFindTheWordQuery = (state) => {
  if (!state.script.currentScriptItem) {
    return null;
  }
  const question = state.script.currentScriptItem;
  let detailAnswer = {};
  let detailText = {};
  const data = [];
  question.items = (question.items || []).map((item) => {
    const fromCol = parseInt(item.fromCol, 10) - 1;
    const fromRow = parseInt(item.fromRow, 10) - 1;
    const toCol = parseInt(item.toCol, 10) - 1;
    const toRow = parseInt(item.toRow, 10) - 1;
    const normalizedItem = {
      ...item,
      fromCol,
      fromRow,
      toCol,
      toRow,
    };
    detailAnswer = {
      ...detailAnswer,
      [normalizedItem.text]: normalizedItem,
    };
    return normalizedItem;
  });
  question.table.map((item) => {
    item.map((it) => {
      const textItem = {
        id: makeid(),
        text: it,
      };
      detailText = {
        ...detailText,
        [textItem.id]: textItem,
      };
      data.push(textItem);
    });
    return item;
  });
  return {
    ...question,
    detailAnswer,
    rows: parseInt(question.rows, 10),
    data,
    detailText,
  };
};
const currentScriptLookListenAndNumber = (state) => {
  if (!state.script.currentScriptItem) {
    return null;
  }
  let question = state.script.currentScriptItem;
  question.numbers = (question.numbers || []).map((item, index) => {
    return {
      ...item,
      answer: index + 1,
      id: makeid(30),
    };
  });
  return {
    ...question,
  };
};

const currentScriptListenAndChantQuery = (state) => {
  if (!state.script.currentScriptItem) {
    return null;
  }
  const res = [];
  const detailAllText = [];
  const question = state.script.currentScriptItem;
  if (question?.object?.conversations) {
    question?.object?.conversations.forEach((item) => {
      const pronunciationRegex = /<.*?>/g;
      const rawContent = item.content.replace(/[<|>]/g, '').trim();
      const jump =
        (parseFloat(item.end) - parseFloat(item.start || 0)) /
        rawContent.length;
      const listMatchAll = matchAllRegex(pronunciationRegex, item.content);
      let arr = [];
      if (listMatchAll.length === 0) {
        arr = [...arr, ...getArrFromText(item.content)];
      } else {
        listMatchAll.map((it, index) => {
          if (index === 0 && it.index > 0) {
            arr = [...arr, ...getArrFromText(it.input.slice(0, it.index))];
          }
          arr = [...arr, ...getArrFromText(it[0].replace(/[<|>]/g, ''), true)];
          if (index === listMatchAll.length - 1) {
            arr = [
              ...arr,
              ...getArrFromText(it.input.slice(it[0].length + it.index)),
            ];
          } else {
            arr = [
              ...arr,
              ...getArrFromText(
                it.input.slice(
                  it.index + it[0].length,
                  listMatchAll[index + 1].index,
                ),
              ),
            ];
          }
        });
      }
      arr = arr.map((arrItem, index) => {
        return {
          ...arrItem,
          sentenceId: item.id,
          start: parseFloat(item.start) + jump * index,
          end: parseFloat(item.start) + jump * (index + 1),
        };
      });
      detailAllText.push([...[...arr]]);
      const list = [];

      let listItem = [];
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].text === ' ') {
          list.push({
            key: makeid(30),
            data: listItem,
          });
          listItem = [];
        } else {
          listItem.push(arr[i]);
        }

        if (i === arr.length - 1) {
          list.push({
            key: makeid(30),
            data: listItem,
          });
          listItem = [];
        }
      }

      res.push({
        ...item,
        detail: arr,
        detailWord: list,
        start: parseFloat(item.start),
        end: parseFloat(item.end),
      });
    });
  }

  const arrs = detailAllText.flat();
  const startTimeAudio = arrs[0]?.start || 0;
  const endTimeAudio = arrs[arrs.length - 1]?.start || 0;
  return {
    ...state.script.currentScriptItem,
    chants: res,
    detailAllText: detailAllText.flat(),
    startTimeAudio,
    endTimeAudio,
  };
};

const currentScriptConversationQuery = (state) => {
  if (!state.script.currentScriptItem) {
    return null;
  }
  let {conversations} = state.script.currentScriptItem;
  let detailConversations = {};
  let totalQuestion = 0;
  conversations = conversations.map((item, index) => {
    if (item.type === 'answer') {
      totalQuestion += 1;
    }
    const updateConversation = {
      ...item,
      nextItem: conversations[index + 1]?.key,
    };
    detailConversations = {
      ...detailConversations,
      [item.key]: updateConversation,
    };
    return {
      ...item,
      nextItem: conversations[index + 1]?.key,
    };
  });
  return {
    ...state.script.currentScriptItem,
    conversations,
    totalQuestion,
    detailConversations,
  };
};
const currentScriptObjectQuery = (state) => {
  if (!state.script.currentScriptItem) {
    return null;
  }
  let {
    object: {conversations},
  } = state.script.currentScriptItem;
  conversations = conversations.map((item, index) => {
    return {
      ...item,
      start: parseFloat(item.start),
      end: parseFloat(item.end),
      index,
    };
  });
  return {
    ...state.script.currentScriptItem,
    object: {
      ...state.script.currentScriptItem.object,
      conversations,
    },
  };
};

export const tutorialSelector = createSelector(
  tutorialsActivitySelector,
  currentScriptQuery,
  (tutorials, currentScript) => {
    return tutorials[currentScript?.type] || {};
  },
);

const currentActivitySelect = (state) => state.activity.currentActivity;
export const currentActivitySelector = createSelector(
  currentActivitySelect,
  (data) => data || {},
);

const currentPartSelect = (state) => state.part.currentPart;
export const currentPartSelector = createSelector(
  currentPartSelect,
  (data) => data || {},
);

export const currentScriptSelector = createSelector(
  currentScriptQuery,
  (data) => data || {},
);

export const currentScriptConversationSelector = createSelector(
  currentScriptConversationQuery,
  (data) => data || {},
);

export const currentScriptListenAndChantSelector = createSelector(
  currentScriptListenAndChantQuery,
  (data) => data || {},
);

export const currentScriptFindTheWordsSelector = createSelector(
  currentScriptFindTheWordQuery,
  (data) => data || {},
);

export const currentScriptObjectSelector = createSelector(
  currentScriptObjectQuery,
  (data) => data || {},
);

export const currentScriptListenAndNumberSelector = createSelector(
  currentScriptLookListenAndNumber,
  (data) => data || {},
);
