import { getProductGroup, addProductGroup, deleteProductGroup, updateProductGroup } from '../../services/api';

export default {
  namespace: 'productGroup',

  state: {
    data: {
      list: [],
      pagination: {},
      dataSource: {},
      firstId: 0,
    },

    updateMessage: {
      code: -1,
      message: '',
    },
  },

  effects: {
    //  查询订单列表
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(getProductGroup, payload);
      if (!response || response.code !== 0) return;
      if (callback) callback(response);
      let newResponse;
      if (!response.data || response.data === '') {
        newResponse = {
          ...response,
          data: [],
        };
      }
      if (response.data) {
        const resData = response.data;
        const dealResData = resData.map((e) => {
          return {
            ...e,
            createdAt: e.createdAt ? e.createdAt.slice(0, 19) : '',
          };
        });
        newResponse = { ...response, data: dealResData };
        if (newResponse.data && newResponse.data.length !== 0
          && newResponse.data[0].parentId === 0) {
          newResponse = {
            ...newResponse,
            data: [
              ...newResponse.data,
            ],
            firstId: newResponse.data[0].id,
          };
          yield put({
            type: 'save',
            payload: newResponse,
          });
        } else {
          yield put({
            type: 'saveDataSource',
            payload: newResponse,
          });
        }
      }
    },
    // 添加分类
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addProductGroup, payload);
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
        type: 'updateData',
        payload: newResponse,
      });
      if (callback) callback(newResponse);
    },
    // 删除分类
    *delete({ payload, callback }, { call, put }) {
      const response = yield call(deleteProductGroup, payload);
      let newResponse = {};
      if (!response) {
        newResponse = {
          code: -1,
          message: '添加失败，请重试',
        };
      } else if (response && response.code === 0) {
        newResponse = {
          code: response.code ? response.code : 0,
          message: response.message ? response.message : '添加成功',
        };
      } else if (response && response.code === -1) {
        newResponse = {
          code: response.code ? response.code : -1,
          message: response.message ? response.message : '添加失败，请重试',
        };
      }
      yield put({
        type: 'updateData',
        payload: newResponse,
      });
      if (callback) callback(newResponse);
    },
    // 更新分类
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateProductGroup, payload);
      let newResponse = {};
      if (!response) {
        newResponse = {
          code: -1,
          message: '添加失败，请重试',
        };
      } else if (response && response.code === 0) {
        newResponse = {
          code: response.code ? response.code : 0,
          message: response.message ? response.message : '添加成功',
        };
      } else if (response && response.code === -1) {
        newResponse = {
          code: response.code ? response.code : -1,
          message: response.message ? response.message : '添加失败，请重试',
        };
      }
      yield put({
        type: 'updateData',
        payload: newResponse,
      });
      if (callback) callback(newResponse);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: {
          ...state.data,
          list: action.payload.data,
          firstId: action.payload.firstId,
        },
      };
    },
    saveDataSource(state, action) {
      return {
        ...state,
        data: {
          ...state.data,
          dataSource: action.payload,
        },
      };
    },
    updateData(state, action) {
      return {
        ...state,
        updateMessage: {
          code: action.payload.code,
          message: action.payload.message,
        },
      };
    },
  },
};
