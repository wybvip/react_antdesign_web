import { message } from 'antd';
import { groups, categories, products, remove, deleteProduct, recoverProduct } from '../services/product/products/services';

export default {
  namespace: 'productList',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    groups: [],
    categories: [],
  },

  effects: {
    *fetchGroups({ payload }, { call, put }) {
      const response = yield call(groups, payload);
      if (!response || response.code === -1) {
        return;
      }
      yield put({
        type: 'changeGroups',
        payload: response,
      });
    },

    *fetchCategories({ payload }, { call, put }) {
      const response = yield call(categories, payload);
      if (!response || response.code === -1) {
        return;
      }
      yield put({
        type: 'changeCategories',
        payload: response,
      });
    },

    *fetchProducts({ payload }, { call, put }) {
      const response = yield call(products, payload);
      if (!response || response.code === -1) {
        return;
      }

      if (response && response.data && response.data.rows) {
        const { rows } = response.data;
        const newRows = rows.map((e) => {
          return {
            ...e,
            createdAt: e.createdAt ? e.createdAt.slice(0, 19) : '',
            updatedAt: e.updatedAt ? e.updatedAt.slice(0, 19) : '',
          };
        });
        const newResponse = { ...response, data: { ...response.data, rows: newRows } };
        yield put({
          type: 'changeProducts',
          payload: newResponse,
        });
      }
    },

    *remove({ payload, callback }, { call }) {
      const response = yield call(remove, payload);
      if (!response || response.code !== 0) {
        message.error('删除失败');
      } else {
        message.success('删除成功');
        callback();
      }
    },

    *recoverProduct({ payload, callback }, { call }) {
      const response = yield call(recoverProduct, payload);
      if (!response || response.code !== 0) {
        message.error('恢复商品失败');
      } else {
        message.success('商品已恢复');
        callback();
      }
    },

    *deleteProduct({ payload, callback }, { call }) {
      const response = yield call(deleteProduct, payload);
      if (!response || response.code !== 0) {
        message.error('删除失败');
      } else {
        message.success('删除成功');
        callback();
      }
    },
  },

  reducers: {
    changeGroups(state, action) {
      return {
        ...state,
        groups: action.payload.data,
      };
    },
    changeCategories(state, action) {
      return {
        ...state,
        categories: action.payload.data,
      };
    },
    changeProducts(state, action) {
      return {
        ...state,
        data: {
          list: action.payload.data.rows,
          pagination: {
            current: action.payload.data.pageNumber,
            pageSize: action.payload.data.pageSize,
            total: action.payload.data.total,
          },
        },
      };
    },
  },
};
