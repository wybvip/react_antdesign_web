import { routerRedux } from 'dva/router';
import { auditResults } from '../../services/register/services';

export default {
  namespace: 'auditResult',

  state: {
    result: {
      code: '',
      message: '',
      data: {
        enterprise: undefined,
        auditRecords: undefined,
        shop: undefined,
        shopTypeName: '',
        mainCategoryName: '',
        shopBrands: []
      }
    }
  },

  effects: {
    *find({ payload }, { call, put }) {
      const response = yield call(auditResults, payload);
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
          data: {
            enterprise: action.payload.data.enterprise,
            auditRecords: action.payload.data.auditRecords,
            shop: action.payload.data.shop,
            shopTypeName: action.payload.data.shopTypeName,
            mainCategoryName: action.payload.data.mainCategoryName,
            shopBrands: action.payload.data.shopBrands
          }
        },
      };
    }
  },
};
