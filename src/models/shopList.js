import { shopList, removeRule, addRule } from '../services/api';

export default {
  namespace: 'shopList',

  state: {
    data: {
      list: [],
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
      const response = yield call(shopList, payload);
      if (!response || response.code !== 0) return;
      if (!response.data) return;
      if (response.data) {
        const resData = response.data;
        const dealResData = resData.map((e) => {
          return {
            ...e,
            createdAt: e.createdAt ? e.createdAt.slice(0, 19) : '',
            updatedAt: e.updatedAt ? e.updatedAt.slice(0, 19) : '',
          };
        });
        const newResponse = { ...response, data: dealResData };
        yield put({
          type: 'save',
          payload: newResponse,
        });
      }
    },
    // 添加规则
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addRule, payload);
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
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeRule, payload);
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
  },

  reducers: {
    save(state, action) {
      console.log('action', action);
      return {
        data: {
          list: action.payload.data,
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
