import { routerRedux } from 'dva/router';
import { getMessageList, checkMessage, deleteMessage } from '../../services/message/services';

export default {
  namespace: 'messageList',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  result: {
    code: '',
    message: '',
    data: '',
  },

  effects: {
    //  消息中心
    *fetch({ payload }, { call, put }) {
      const response = yield call(getMessageList, payload);
      if (!response || response.code !== 0) return;
      if (!response.data) return;
      if (response.data.rows) {
        yield put({
          type: 'list',
          payload: response,
        });
      }
    },
    // 查看消息
    *checkmessage({ payload }, { call, put }) {
      const response = yield call(checkMessage, payload);
      if (!response || response.code !== 0) return;
      if (!response.data) return;
      yield put({
        type: 'result',
        payload: response,
      });
    },
    // 删除消息
    *deletemessage({ payload }, { call, put }) {
      const response = yield call(deleteMessage, payload);
      if (!response || response.code !== 0) return;
      yield put({
        type: 'result',
        payload: response,
      });
    },
  },

  reducers: {
    list(state, action) {
      return {
        ...state,
        data: {
          ...state.data,
          list: action.payload.data.rows,
          pagination: {
            current: action.payload.data.pageNumber, // 页码
            pageSize: action.payload.data.pageSize, // 条数
            total: action.payload.data.total, // 总条数
            pageSizeOptions: ['10', '20', '30', '40'],
            showQuickJumper: true,
            showSizeChanger: true,
          },
        },
      };
    },
    result(state, action) {
      return {
        ...state,
        result: {
          code: action.payload.code,
          message: action.payload.message,
          data: action.payload.data,
        },
      };
    },
  },
};
