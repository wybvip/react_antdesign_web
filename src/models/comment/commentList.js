import { getCommentList } from '../../services/comment/services';

export default {
  namespace: 'commentList',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    //  查询评论列表
    *fetch({ payload }, { call, put }) {
      const response = yield call(getCommentList, payload);
      if (!response || response.code !== 0) return;
      yield put({
        type: 'save',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, action) {
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
  },
};
