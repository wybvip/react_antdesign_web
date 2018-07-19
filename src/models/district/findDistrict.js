import { findDistricts } from '../../services/district/services';

export default {
  namespace: 'findDistrict',

  state: {
    district: {
      code: 0,
      message: '',
      data: [],
    },
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(findDistricts, payload);
      if(callback) callback(response);
      if (!response || response.code !== 0) return;
      yield put({
        type: 'result',
        payload: response,
      });
    },
  },

  reducers: {
    result(state, action) {
      return {
        ...state,
        district: {
          code: action.payload.code,
          message: action.payload.message,
          data: action.payload.data,
        },
      };
    },
  },
};
