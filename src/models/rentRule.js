import { rentRuleGet, rentRuleDelete } from '../services/api';
import { rentRuleDetailById, addRentRule, editRentRule } from '../services/product/rentRules/services';

export default {
  namespace: 'rentRule',

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
    //  查询租赁规则列表
    *fetch({ payload }, { call, put }) {
      const response = yield call(rentRuleGet, payload);
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
    //  查询模版详情
    *rentRuleDetailById({ payload, callback }, { call, put }) {
      const response = yield call(rentRuleDetailById, payload);
      if (!response) return;
      yield put({
        type: 'saveOrderInfo',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 添加规则
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addRentRule, payload);
      yield put({
        type: 'update',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 修改规则
    *edit({ payload, callback }, { call, put }) {
      const response = yield call(editRentRule, payload);
      yield put({
        type: 'update',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 移除规则
    *delete({ payload, callback }, { call, put }) {
      const response = yield call(rentRuleDelete, payload);
      let newResponse = {};
      if (!response || response.code === -1) {
        newResponse = {
          code: -1,
          message: '添加失败，请重试',
        };
      } else if (response && response.code === 0) {
        newResponse = {
          code: response.code ? response.code : 0,
          message: response.message ? response.message : '添加失败，请重试',
        };
      }
      yield put({
        type: 'update',
        payload: newResponse,
      });
      if (callback) callback(newResponse);
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
