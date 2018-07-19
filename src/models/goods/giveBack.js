import { getGiveBackList, saveOrEditGiveBack, deleteGiveBack } from '../../services/api';

export default {
  namespace: 'giveBack',

  state: {
    data: {
      code: -1,
      list: [],
      pagination: {},
    },
    updateMessage: {
      code: -1,
      message: '',
      success: false,
    },
  },

  effects: {
    //  查询订单列表
    *fetch({ payload }, { call, put }) {
      const response = yield call(getGiveBackList, payload);
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
            address: `${e.provinceName}${e.cityName}${e.areaName}${e.street}`,
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
      const response = yield call(saveOrEditGiveBack, payload);
      if (!response || response.code !== 0) return;
      let newResponse = {};
      if (!response || (response && response.code === '-1')) {
        newResponse = {
          code: -1,
          message: '添加失败，请重试',
          success: false,
        };
      } else if (response && response.code === 0) {
        newResponse = {
          code: 0,
          message: response.message ? response.message : '添加成功',
          success: true,
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
      const response = yield call(deleteGiveBack, payload);
      if (!response || response.code !== 0) return;
      let newResponse = {};
      if (!response || (response && response.code === -1)) {
        newResponse = {
          code: -1,
          message: '添加失败，请重试',
          success: false,
        };
      } else {
        newResponse = {
          code: 0,
          message: response.message ? response.message : '添加成功',
          success: true,
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
      return {
        ...state.data,
        updateMessage: {
          code: action.payload.code,
          message: action.payload.message,
          success: action.payload.success,
        },
      };
    },
  },
};
