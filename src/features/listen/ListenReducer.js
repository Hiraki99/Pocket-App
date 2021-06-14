// import {
// } from './ListenType';
// import {FIRST_PAGE, PAGE_SIZE} from '~/constants/query';
//
// const initState = {
//   lectureListenId: [],
//   detailLesson: {},
//   query: {
//     page: FIRST_PAGE,
//     length: PAGE_SIZE,
//     degree: '',
//   },
// };
//
// export default (state = initState, action) => {
//   const {type, payload} = action;
//   switch (type) {
//     case SET_TRANSLATION:
//       return {
//         ...state,
//         wordTranslation: payload.word,
//       };
//     case FETCH_LIST_VOCA_FEATURES_SUCCESS:
//       return {
//         ...state,
//         vocabularyFeatures: payload.data,
//       };
//     case FETCH_LIST_TOPIC_VOCABULARY_SUCCESS:
//       return {
//         ...state,
//         topicsVocabulary: payload.data,
//       };
//     case FETCH_TOPIC_MOST_ATTENTION_SUCCESS:
//       return {
//         ...state,
//         topicsMostAttention: payload.data,
//       };
//     default:
//       return state;
//   }
// };
