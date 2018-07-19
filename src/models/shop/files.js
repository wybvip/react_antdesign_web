import {
  fileList, editFile, deleteFile, addFile, selectByName,
} from '../../services/shop/files';

export default {
  namespace: 'files',

  state: {
    data: {
      list: [],
    },
  },

  effects: {
    *fileList({ payload, callback }, { call, put }) {
      const response = yield call(fileList, payload);
      yield put({
        type: 'fetchFindFileListO',
        payload: response,
      });
      if (callback) callback();
    },
    *editFile({ payload }, { call, put }) {
      const response = yield call(editFile, payload);
      yield put({
        type: 'fetchEditFileO',
        payload: response,
      });
    },
    *deleteFile({ payload }, { call, put }) {
      const response = yield call(deleteFile, payload);
      yield put({
        type: 'fetchDeleteFileO',
        payload: response,
      });
    },
    *addFile({ payload }, { call, put }) {
      const response = yield call(addFile, payload);
      yield put({
        type: 'fetchAddFileO',
        payload: response,
      });
    },
    *selectByName({ payload }, { call, put }) {
      const response = yield call(selectByName, payload);
      yield put({
        type: 'fetchSelectByNameO',
        payload: response,
      });
    },
  },

  reducers: {
    fetchFindFileListO(state, action) {
      return {
        ...state,
        data: {
          list: action.payload.data.rows,
          total: action.payload.data.total,
          pageSize: action.payload.data.pageSize,
          pageNumber: action.payload.data.pageNumber,
        },
      };
    },
    fetchEditFileO(state, action) {
      return {
        ...state,
        data: {
          editCode: action.payload.code,
          deitMessage: action.payload.message,
        },
      };
    },
    fetchDeleteFileO(state, action) {
      return {
        ...state,
        data: {
          delCode: action.payload.code,
          delMessage: action.payload.message,
        },
      };
    },
    fetchAddFileO(state, action) {
      return {
        ...state,
        data: {
          addCode: action.payload.code,
          addMessage: action.payload.message,
        },
      };
    },
    fetchSelectByNameO(state, action) {
      return {
        ...state,
        data: {
          list: action.payload.data.rows,
          total: action.payload.data.total,
          pageSize: action.payload.data.pageSize,
          pageNumber: action.payload.data.pageNumber,
        },
      };
    },
  },
};
