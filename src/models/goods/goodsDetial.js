import { goodsDetialGet, goodsDetialDelete } from '../../services/api';
import { templateDetailById, addTemplate, editTemplate } from '../../services/product/detailTemplate/services';

export default {
  namespace: 'goodsDetial',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    orderInfoData: {
      code: -1,
      data: {},
      message: '',
    },
    updateMessage: {
      code: -1,
      message: '',
    },
  },

  effects: {
    //  查询订单列表
    *fetch({ payload }, { call, put }) {
      const response = yield call(goodsDetialGet, payload);
      if (!response || response.code !== 0) return;
      let newResponse;
      if (!response.data || !response.data === '') {
        newResponse = {
          ...response,
          data: {
            ...response.data,
            rows: [],
          },
        };
      }
      if (response.data.rows) {
        const resData = response.data.rows;
        const dealResData = resData.map((e) => {
          return {
            ...e,
            repaymentDate: e.repaymentDate ? e.repaymentDate.slice(0, 19) : '',
            statementDate: e.statementDate ? e.statementDate.slice(0, 19) : '',
            createdAt: e.createdAt ? e.createdAt.slice(0, 19) : '',
            updatedAt: e.updatedAt ? e.updatedAt.slice(0, 19) : '',
          };
        });
        newResponse = { ...response, data: { ...response.data, rows: dealResData } };
        yield put({
          type: 'save',
          payload: newResponse,
        });
      }
    },
    //  查询模版详情
    *templateDetailById({ payload }, { call, put }) {
      const response = yield call(templateDetailById, payload);
      if (!response) return;
      yield put({
        type: 'saveOrderInfo',
        payload: response,
      });
    },
    // 添加规则
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addTemplate, payload);
      yield put({
        type: 'update',
        payload: response,
      });
      if (callback) callback();
    },
    // 移除规则
    *delete({ payload, callback }, { call, put }) {
      const response = yield call(goodsDetialDelete, payload);
      yield put({
        type: 'update',
        payload: response,
      });
      if (callback) callback();
    },
    //  更新模版
    *edit({ payload, callback }, { call, put }) {
      const response = yield call(editTemplate, payload);
      yield put({
        type: 'update',
        payload: response,
      });
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        data: {
          list: action.payload.data.rows,
          pagination: {
            current: action.payload.data.pageNumber, // 页码
            pageSize: action.payload.data.pageSize,
            total: action.payload.data.total, // 总条数
            pageSizeOptions: ['10', '20', '30', '40'],
            showSizeChanger: true,
            showQuickJumper: true,
          },
        },
      };
    },
    update(state, action) {
      return {
        ...state,
        updateMessage: {
          code: action.payload.code,
          message: action.payload.message,
        },
      };
    },
    saveOrderInfo(state, action) {
      return {
        ...state,
        orderInfoData: {
          code: action.payload.code,
          data: action.payload.data,
          message: action.payload.message,
        },
      };
    },
  },
};
