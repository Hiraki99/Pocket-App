import api from '~/utils/apisaure';

const fetchPart = (data) => {
  return api.post('/part/list', data);
};

const fetchPartsVip = (data) => {
  return api.post('/part/list-vip', data);
};

export default {
  fetchPart,
  fetchPartsVip,
};
