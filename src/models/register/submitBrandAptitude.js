import { routerRedux } from 'dva/router';
import { findBrandsAptitude, submitBrandAptitude, deleteBrand } from '../../services/register/services';

export default {
  namespace: 'submitBrandAptitude',

  state: {
    result: {
      code: '',
      message: '',
      data: {}
    },
    find: {
      code: '',
      message: '',
      data: {
        shopName: '',
        platformShopType: {},
        shopMainOperationCategories: {},
        batList: [],
        mocList: [],
        oecList: [],
        brandsList: [],
        channelsList: undefined,
        sbList: [],
        shopBrand: undefined,
        brandSwitch: undefined,
        tradeMarkLicense: '',
        qualityTesting: '',
        brandLicensing: ''
      }
    },
    delete: {
      code: '',
      message: '',
      data: {}
    }
  },

  effects: {
    *save({ payload }, { call, put }) {
      const response = yield call(submitBrandAptitude, payload);
      if (!response || response.code !== 0) return;
      yield put({
        type: 'result',
        payload: response,
      });
    },
    *findbyid({ payload }, { call, put }) {
      const response = yield call(findBrandsAptitude, payload);
      if (!response || response.code !== 0) return;
      yield put({
        type: 'find',
        payload: response,
      });
    },
    *delete({ payload }, { call, put }) {
      const response = yield call(deleteBrand, payload);
      if (!response || response.code !== 0) return;
      yield put({
        type: 'deleteid',
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
    find(state, action) {
      return {
        ...state,
        find: {
          code: action.payload.code,
          message: action.payload.message,
          data: {
            shopName: action.payload.data.shopName,
            platformShopType: action.payload.data.platformShopType,
            shopMainOperationCategories: action.payload.data.shopMainOperationCategories,
            batList: action.payload.data.batList,
            mocList: action.payload.data.mocList,
            oecList: action.payload.data.oecList,
            brandsList: action.payload.data.brandsList,
            channelsList: action.payload.data.channelsList,
            sbList: action.payload.data.sbList,
            shopBrand: action.payload.data.shopBrand,
            brandSwitch: action.payload.data.brandSwitch,
            tradeMarkLicense: action.payload.data.tradeMarkLicense,
            qualityTesting: action.payload.data.qualityTesting,
            brandLicensing: action.payload.data.brandLicensing
          }
        },
      };
    },
    deleteid(state, action) {
      return {
        ...state,
        delete: {
          code: action.payload.code,
          message: action.payload.message,
          data: action.payload.data
        },
      };
    }
  },
};
