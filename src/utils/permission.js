import {check, request, RESULTS} from 'react-native-permissions';

export const checkPermission = (permission) => {
  return new Promise((res) => {
    check(permission)
      .then((result) => {
        if (result === RESULTS.GRANTED) {
          return res({accept: true});
        }
        if (result === RESULTS.BLOCKED) {
          return res({accept: false, blocked: true});
        }
        return res({accept: false});
      })
      .catch(() => {
        return res({accept: false, error: true});
      });
  });
};

export const requestAsync = (permission) => {
  return new Promise((res) => {
    request(permission)
      .then((result) => {
        if (result === RESULTS.GRANTED) {
          return res({accept: true});
        }
        if (result === RESULTS.BLOCKED) {
          return res({accept: false, blocked: true});
        }
        return res({accept: false});
      })
      .catch(() => {
        return res({accept: false, error: true});
      });
  });
};

export const requestPermission = async (permission) => {
  const res = await checkPermission(permission);
  if (res.accept) {
    return res;
  } else {
    return await requestAsync(permission);
  }
};
