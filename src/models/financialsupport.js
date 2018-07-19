import {
  fetchFindApplyList, selectDetailApplyId, provisionalInsert, insert,
  selectProvisionalApplication,
} from '../services/financial/support/services';

export default {
  namespace: 'financialsupport',

  state: {
    data: {
      list: [],
      total: {},
      pageable: {},
    },
    InfoDataItem: {
      Item: {},
    },
    priDataItem: {
    },
    CurrentInsert: {
    },
    insertDataItem: {
      intDataItem: {},
    },
  },

  effects: {
    *fetchFindList({ payload }, { call, put }) {
      const response = yield call(fetchFindApplyList, payload);
      yield put({
        type: 'fetchFindApplyListO',
        payload: response,
      });
    },
    *fetchSelectDatail({ payload }, { call, put }) {
      const response = yield call(selectDetailApplyId, payload);
      yield put({
        type: 'selectDetailApplyIdO',
        payload: response,
      });
    },
    *fetchInsert({ payload }, { call, put }) {
      const response = yield call(insert, payload);
      yield put({
        type: 'fetchInsertO',
        payload: response,
      });
    },
    *fetchProInsert({ payload }, { call, put }) {
      const response = yield call(provisionalInsert, payload);
      yield put({
        type: 'provisionalInsertO',
        payload: response,
      });
    },
    *fetchSelectProvisional({ payload }, { call, put }) {
      const response = yield call(selectProvisionalApplication, payload);
      yield put({
        type: 'selectProvisionalApplicationO',
        payload: response,
      });
    },
  },

  reducers: {
    fetchFindApplyListO(state, action) {
      return {
        ...state,
        data: {
          list: action.payload.data.content,
          total: action.payload.data.total,
          pageable: {
            pageNumber: action.payload.data.pageNumber,
            pageSize: action.payload.data.pageSize,
          },
        },
      };
    },
    selectDetailApplyIdO(state, action) {
      return {
        ...state,
        InfoDataItem: {
          Item: action.payload.data,
        },
      };
    },
    fetchInsertO(state, action) {
      return {
        ...state,
        insertDataItem: action.payload,
      };
    },
    provisionalInsertO(state, action) {
      return {
        ...state,
        CurrentInsert: action.payload,
      };
    },
    selectProvisionalApplicationO(state, action) {
      return {
        ...state,
        priDataItem: action.payload,
      };
    },
  },
};
