import { message } from 'antd';
import { routerRedux } from 'dva/router';
import { findAllCategory, preAdd, productDetial, addProduct, updateProduct } from '../../services/product/addNewProduct/services';

const globalProductDetail = {
  product: {},
  productAdditionalServices: [],
  productCornerMark: {},
  productImageList: [],
  productGiveBackAddresses: [],
  productLogisticForms: [],
  productPeakPremiumPrice: [],
  productRentLists: [],
  productServiceMarks: [],
  shopGroupProduct: {},
  specs: [],
  price: {},
};

export default {
  namespace: 'newProduct',

  state: {
    categories: [],
    preAdd: {
      productDetailTemplates: [],
    },
    productDetail: globalProductDetail,
  },

  effects: {
    *findAllCategory({ payload }, { call, put }) {
      const response = yield call(findAllCategory, payload);
      if (!response || response.code !== 0) return;
      yield put({
        type: 'saveAllCategory',
        payload: response,
      });
    },
    *preAdd({ payload, callback }, { call, put }) {
      const response = yield call(preAdd, payload);
      if (!response || response.code !== 0) return;
      yield put({
        type: 'savePreAdd',
        payload: response,
      });
      if (callback) callback();
    },
    *getProductDetial({ payload, callback }, { call, put }) {
      const response = yield call(productDetial, payload);
      if (!response || response.code !== 0) return;
      yield put({
        type: 'saveProductDetail',
        payload: response,
      });
      if (callback) callback();
    },
    *addProduct({ payload }, { call, put }) {
      const response = yield call(addProduct, payload);
      if (!response || response.code !== 0) {
        message.error('提交失败');
      } else {
        message.success('提交成功');
        yield put(routerRedux.push('/product/list'));
      }
    },
    *updateProduct({ payload }, { call, put }) {
      const response = yield call(updateProduct, payload);
      if (!response || response.code !== 0) {
        message.error('提交失败');
      } else {
        message.success('提交成功');
        yield put(routerRedux.push('/product/list'));
      }
    },
    *clearDetail(_, { put }) {
      yield put({
        type: 'saveclearDetail',
      });
    },
  },

  reducers: {
    saveAllCategory(state, action) {
      return {
        ...state,
        categories: action.payload.data,
      };
    },
    savePreAdd(state, action) {
      return {
        ...state,
        preAdd: action.payload.data,
      };
    },
    saveProductDetail(state, action) {
      const productDetail = {
        ...state.productDetail,
        ...action.payload.data,
      };
      return {
        ...state,
        productDetail,
      };
    },
    saveclearDetail(state) {
      return {
        ...state,
        productDetail: globalProductDetail,
      };
    },
  },
};
