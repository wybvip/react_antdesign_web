import { uploadFileList } from '../../services/financial/support/services';

export default {
  namespace: 'upload',

  state: {
    data: {
      list: [],
      total: {},
      pageable: {},
    },
    InfoDataItem: {
      Item: {},
    },
  },

  effects: {
    *uploadFileList({ payload }, { call, put }) {
      const response = yield call(uploadFileList, payload);
      yield put({
        type: 'uploadFileListCallBack',
        payload: response,
      });
    },
  },

  reducers: {
    uploadFileListCallBack(state, action) {
      return {
        ...state,
        insertDataItem: action.payload,
      };
    },
  },
};
