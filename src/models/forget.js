import { forget } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';

export default {
  namespace: 'forget',

  state: {
    code: 0,
    mobileCode: undefined,
    status: undefined,
    message: undefined,
  },

  effects: {
    *submit({ payload }, { call, put }) {
      const response = yield call(forget, payload);
      if (!response || response.code !== 0) return;
      yield put({
        type: 'forgetHandle',
        payload: response,
      });
      yield new Promise((res) => {
        setTimeout(() => {
          return res(null);
        }, 1000);
      });
    },
  },

  reducers: {
    forgetHandle(state, { payload }) {
      setAuthority('user');
      reloadAuthorized();
      return {
        ...state,
        code: payload.code ? payload.code : 0,
        message: payload.message ? payload.message : '更改失败',
      };
    },
    codeHandle(state, { payload }) {
      return {
        ...state,
        code: payload.mobileCode,
        message: payload.message,
      };
    },
  },
};
