import { goodsDetialGet, goodsDetialUpdate, goodsDetialDelete, goodsDetialAdd } from '../services/api';

export default {
  namespace: 'goodsDetial',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    orderInfoData: {
      userOrderCashes: {},
      userOrders: {},
    },
    updateMessage: {
      code: 0,
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
    // 添加规则
    *add({ payload, callback }, { call, put }) {
      const response = yield call(goodsDetialAdd, payload);
      let newResponse = {};
      if (!response) {
        newResponse = {
          code: 0,
          message: '添加失败，请重试',
        };
      } else {
        newResponse = {
          code: response.code ? response.code : 0,
          message: response.message ? response.message : '添加失败，请重试',
        };
      }
      yield put({
        type: 'update',
        payload: newResponse,
      });
      if (callback) callback();
    },
    // 移除规则
    *delete({ payload, callback }, { call, put }) {
      const response = yield call(goodsDetialDelete, payload);
      let newResponse = {};
      if (!response) {
        newResponse = {
          code: 0,
          message: '添加失败，请重试',
        };
      } else {
        newResponse = {
          code: response.code ? response.code : 0,
          message: response.message ? response.message : '添加失败，请重试',
        };
      }
      yield put({
        type: 'update',
        payload: newResponse,
      });
      if (callback) callback();
    },
    //  更新模版
    *update({ payload, callback }, { call, put }) {
      const response = yield call(goodsDetialUpdate, payload);
      let newResponse = {};
      if (!response) {
        newResponse = {
          code: 0,
          message: '更新失败，请重试',
        };
      } else {
        newResponse = {
          code: response.code ? response.code : 0,
          message: response.message ? response.message : '更新失败，请重试',
        };
      }
      yield put({
        type: 'update',
        payload: newResponse,
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
          },
        },
      };
    },
    update(state, action) {
      console.log('action', action);
      return {
        ...state.updateMessage,
        code: action.code,
        message: action.message,
      };
    },
    saveOrderInfo(state, action) {
      console.log('saveOrderInfo', action);
      return {
        ...state,
        orderInfoData: {
          userOrderCashes: action.payload.data.userOrderCashes,
          userOrders: action.payload.data.userOrders,
          orderInfoStatus: action.payload.status,
        },
      };
    },
  },
};
