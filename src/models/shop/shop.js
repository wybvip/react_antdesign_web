import {
  queryShops, addShop, deleteShop, queryShopById, selectByName, editShop,
} from '../../services/shop/shop';

export default {
  namespace: 'shop',

  state: {
    data: {
      list: [],
    },
  },

  effects: {
    *queryShops({ payload }, { call, put }) {
      const response = yield call(queryShops, payload);
      yield put({
        type: 'fetchFindShopListO',
        payload: response,
      });
    },
    *addShop({ payload }, { call, put }) {
      const response = yield call(addShop, payload);
      yield put({
        type: 'fetchAddShopO',
        payload: response,
      });
    },
    *deleteShop({ payload }, { call, put }) {
      const response = yield call(deleteShop, payload);
      yield put({
        type: 'fetchDeleteShopO',
        payload: response,
      });
    },
    *queryShopById({ payload }, { call, put }) {
      const response = yield call(queryShopById, payload);
      yield put({
        type: 'fetchQueryShopByIdO',
        payload: response,
      });
    },
    *selectByName({ payload }, { call, put }) {
      const response = yield call(selectByName, payload);
      yield put({
        type: 'fetchSelectShopByNameO',
        payload: response,
      });
    },
    *editShop({ payload }, { call, put }) {
      const response = yield call(editShop, payload);
      yield put({
        type: 'fetchEditShopO',
        payload: response,
      });
    },
    // *shopMapImg({ payload }, { call, put }) {
    //   const response = yield call(shopMapImg, payload);
    //   yield put({
    //     type: 'fetchshopMapImgO',
    //     payload: response,
    //   });
    // },
  },

  reducers: {
    fetchFindShopListO(state, action) {
      return {
        ...state,
        data: {
          list: action.payload.data,
        },
      };
    },
    fetchAddShopO(state, action) {
      return {
        ...state,
        data: {
          addCode: action.payload.code,
          addMessage: action.payload.message,
        },
      };
    },
    fetchDeleteShopO(state, action) {
      return {
        ...state,
        data: {
          delCode: action.payload.code,
          delMessage: action.payload.message,
        },
      };
    },
    fetchQueryShopByIdO(state, action) {
      return {
        ...state,
        data: {
          Code: action.payload.code,
          Message: action.payload.message,
          shopData: action.payload.data,
          areaAdd: action.payload.data.areaAdd,
        },
      };
    },
    fetchSelectShopByNameO(state, action) {
      return {
        ...state,
        data: {
          list: action.payload.data,
        },
      };
    },
    fetchEditShopO(state, action) {
      return {
        ...state,
        data: {
          editCode: action.payload.code,
          editMessage: action.payload.message,
        },
      };
    },
    // fetchshopMapImgO(state, action) {
    //   return {
    //     ...state,
    //     data: {
    //       imgSrc: action.payload.code,
    //     },
    //   };
    // },
  },
};
