import { freightTemplateGet, deleteProductGroup, addProductGroup, updateProductGroup }
  from '../../services/api';
import { addfreightTemplate, freightTemplateDetialById, freightTemplateDeleteById }
  from '../../services/product/freightTemplate/services';

export default {
  namespace: 'freightTemplate',

  state: {
    result: {
      code: '',
      message: '',
      data: {},
    },
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
    orderDetial: {
      shopFreightTemplate: {},
      shopFreightTemplateArea: [],
    },
  },

  effects: {
    //  查询订单列表
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(freightTemplateGet, payload);
      if (!response || response.code !== 0) return;
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
      if (callback) callback(newResponse);
    },
    // 添加分类
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addProductGroup, payload);
      if (!response || response.code !== 0) return;
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
      if (!response || response.code !== 0) return;
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
    // 查询详细
    *detial({ payload, callback }, { call, put }) {
      const response = yield call(freightTemplateDetialById, payload);
      console.log('///|||', response);
      if (callback) callback(response);
      if (response && response.code !== 0) return;
      yield put({
        type: 'saveDetial',
        payload: response,
      });
    },
    // 添加运费模版
    *submitfreightTemplate({ payload, callback }, { call, put }) {
      const response = yield call(addfreightTemplate, payload);
      if (callback) callback(response);
      if (!response || response.code !== 0) return;
      yield put({
        type: 'result',
        payload: response,
      });
    },
    // 删除运费模版
    *deletefreightTemplate({ payload, callback }, { call, put }) {
      const response = yield call(freightTemplateDeleteById, payload);
      if (callback) callback(response);
      if (!response || response.code !== 0) return;
      yield put({
        type: 'result',
        payload: response,
      });
    },
  },

  reducers: {
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
        updateMessage: {
          code: -1,
          message: '',
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
    saveDetial(state, action) {
      return {
        ...state,
        orderDetial: {
          shopFreightTemplate: action.payload.data.shopFreightTemplate,
          shopFreightTemplateArea: action.payload.data.shopFreightTemplateArea,
        },
        updateMessage: {
          code: -1,
          message: '',
        },
      };
    },
  },
};
