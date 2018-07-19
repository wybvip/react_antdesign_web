import {
  queryServices, deleteServices, addServices,
} from '../../services/shop/services';


export default {
  namespace: 'services',

  state: {
    data: {
      list: [],
    },
  },

  effects: {
    *queryServicesList({ payload }, { call, put }) {
      const response = yield call(queryServices, payload);
      yield put({
        type: 'queryServicesCallBack',
        payload: response,
      });
    },
    *deleteServices({ payload }, { call, put }) {
      const response = yield call(deleteServices, payload);
      yield put({
        type: 'fetchDeleteServicesO',
        payload: response,
      });
    },
    *addServices({ payload }, { call, put }) {
      const response = yield call(addServices, payload);
      yield put({
        type: 'fetchAddServicesO',
        payload: response,
      });
    },
  },

  reducers: {
    queryServicesCallBack(state, action) {
      return {
        ...state,
        data: {
          list: action.payload.data,
        },
      };
    },
    fetchDeleteServicesO(state, action) {
      return {
        ...state,
        data: {
          delCode: action.payload.code,
        },
      };
    },
    fetchAddServicesO(state, action) {
      return {
        ...state,
        data: {
          addCode: action.payload.code,
          addMessage: action.payload.message,
        },
      };
    },
  },
};
