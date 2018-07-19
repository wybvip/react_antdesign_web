import { routerRedux } from 'dva/router';
import { getOrderList, getOrderDetail } from '../../services/orders/services';

export default {
  namespace: 'orderList',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    orderdetail: {
      orderData: {},
      productData: {},
      rentStartTime: '',
      rentEndTime: '',
      address: {},
      express: {},
      expressResult: {},
      cash: {},
      item: {},
    },
  },

  effects: {
    //  查询订单列表
    *fetch({ payload }, { call, put }) {
      const response = yield call(getOrderList, payload);
      if (!response || response.code !== 0) return;
      if (!response.data) return;
      if (response.data.rows) {
        const resData = response.data.rows;
        const dealResData = resData.map((e) => {
          return {
            ...e,
            repaymentDate: e.repaymentDate ? e.repaymentDate.slice(0, 19) : '',
            statementDate: e.statementDate ? e.statementDate.slice(0, 19) : '',
          };
        });
        const newResponse = { ...response, data: { ...response.data, rows: dealResData } };
        yield put({
          type: 'save',
          payload: newResponse,
        });
      }
    },
    //  查询订单详情
    *detail({ payload }, { call, put }) {
      const response = yield call(getOrderDetail, payload);
      if (!response || response.code !== 0) return;
      yield put({
        type: 'orderdetail',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: {
          list: action.payload.data.rows,
          pagination: {
            current: action.payload.data.pageNumber, // 页码
            pageSize: action.payload.data.pageSize, // 条数
            total: action.payload.data.total, // 总条数
          },
        },
      };
    },
    orderdetail(state, action) {
      return {
        ...state,
        orderdetail: {
          orderData: action.payload.data.orderData,
          productData: action.payload.data.productData,
          rentStartTime: action.payload.data.rentStartTime,
          rentEndTime: action.payload.data.rentEndTime,
          address: action.payload.data.orderData.address,
          express: action.payload.data.orderData.express,
          expressResult: action.payload.data.expressResult.data,
          cash: action.payload.data.orderData.cash,
          item: action.payload.data.orderData.item,
        },
      };
    },
  },
};
