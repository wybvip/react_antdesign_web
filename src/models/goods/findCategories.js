import { findCategories } from '../../services/product/addNewProduct/services';

export default {
  namespace: 'findCategories',

  state: {
    findCategoriesData: {
      code: -1,
      message: '',
      data: [],
    },
  },

  effects: {
    // 根据id查询类目信息
    *fetch({ payload }, { call, put }) {
      const response = yield call(findCategories, payload);
      let newReaponse = {
        code: -1,
        data: {
          firstCategories: [],
          secondCategories: [],
          thirdCategories: [],
        },
        message: '',
      };
      const { status } = payload;
      if (status === 1) {
        newReaponse = {
          code: response.code,
          data: {
            firstCategories: payload.firstCategories,
            secondCategories: response.data,
            thirdCategories: [],
          },
          message: response.message,
        };
      } else if (status === 2) {
        newReaponse = {
          code: response.code,
          data: {
            firstCategories: payload.firstCategories,
            secondCategories: payload.secondCategories,
            thirdCategories: response.data,
          },
          message: response.message,
        };
      } else if (status === 0) {
        newReaponse = {
          code: response.code,
          data: {
            firstCategories: response.data,
            secondCategories: [],
            thirdCategories: [],
          },
          message: response.message,
        };
      }
      yield put({
        type: 'savefindCategoriesData',
        payload: newReaponse,
      });
    },
  },

  reducers: {
    savefindCategoriesData(state, action) {
      return {
        ...state,
        findCategoriesData: {
          code: action.payload.code,
          data: action.payload.data,
          message: action.payload.message,
        },
      };
    },
  },
};
