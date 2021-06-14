import api from '~/utils/apisaure';

const fetchListLiveClass = (data) => {
  return api.post('/online-class/get-by-student', data);
};

const fetchLiveClassInfo = (classId) => {
  return api.post('/online-class/get-by-id', {_id: classId});
};

const fetchSessionActivity = (sessionId) => {
  return api.post('/online-sessions/get-activities-by-sessions-id', {
    _id: {
      _id: sessionId,
    },
  });
};

const checkJoinClass = (data, isSchoolClass = false) => {
  if (isSchoolClass) {
    return api.post('/class/get-meeting', data);
  }
  return api.post('/meeting/check-joining', data);
};

const getClassOnline = (data) => {
  return api.post('/online-class-scheduled/get-class-by-scheduled-id', data);
};

const getDocsClassOnline = (data) => {
  return api.post('/online-session-parts/get-by-schedule', data);
};

const fetchMessageClassApi = (data) => {
  return api.post('/online-class-scheduled/list-messages', data);
};

const getSchoolClassCoursewares = (data) => {
  return api.post('/class-coursewares/detail', data);
};

const uploadAttachment = (data) => {
  return api.post('/media/upload-single-image', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Accept: 'application/json',
    },
  });
};
const uploadAttachmentFile = (data) => {
  return api.post('/media/upload-single-file', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Accept: 'application/json',
    },
  });
};

export default {
  fetchListLiveClass,
  fetchLiveClassInfo,
  fetchSessionActivity,
  checkJoinClass,
  getClassOnline,
  getDocsClassOnline,
  fetchMessageClassApi,
  getSchoolClassCoursewares,
  uploadAttachment,
  uploadAttachmentFile,
};
