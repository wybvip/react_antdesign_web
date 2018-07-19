import { routerRedux } from 'dva/router';
import { findShopMainCategory, submitShopAptitude } from '../../services/register/services';

export default {
  namespace: 'submitShopAptitude',

  state: {
    result: {
      code: '',
      message: '',
      data: {}
    },
    findshopmaincategory: {
      code: '',
      message: '',
      data: {
        category: [],
        defaultOption: '',
        first: [],
        end: [],
        shop: {},
        platformShopType: {}
      }
    },
  },

  effects: {
    *save({ payload }, { call, put }) {
      const response = yield call(submitShopAptitude, payload);
      if (!response || response.code !== 0) return;
      yield put({
        type: 'result',
        payload: response,
      });
    },
    *findmaincategory({ payload }, { call, put }) {
      const response = yield call(findShopMainCategory, payload);
      if (!response || response.code !== 0) return;
      yield put({
        type: 'findshopmaincategory',
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
          data: action.payload.data
        },
      };
    },
    findshopmaincategory(state, action) {
      return {
        ...state,
        findshopmaincategory: {
          code: action.payload.code,
          message: action.payload.message,
          data: {
            category: action.payload.data.category,
            defaultOption: action.payload.data.defaultOption,
            first: action.payload.data.first,
            end: action.payload.data.end,
            shop: action.payload.data.shop,
            platformShopType: action.payload.data.platformShopType
          }
        },
      };
    },
  },
};
