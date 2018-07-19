import { routerRedux } from 'dva/router';
import { getIncomeList, withdrawRecord, saveWithdrawRecord } from '../../services/income/services';

export default {
  namespace: 'income',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    result: {},
    withdraw: {},
  },

  effects: {
    //  查询我的收入,明细,提现记录
    *fetch({ payload }, { call, put }) {
      const response = yield call(getIncomeList, payload);
      if (!response || response.code !== 0) return;
      if (!response.data) return;
      if (response.data.rows) {
        yield put({
          type: 'save',
          payload: response,
        });
      }
    },
    // 提现信息
    *withdrawRecord({ payload }, { call, put }) {
      const response = yield call(withdrawRecord, payload);
      if (!response || response.code !== 0) return;
      if (!response.data) return;
      yield put({
        type: 'result',
        payload: response,
      });
    },
    // 添加提现信息
    *saveWithdrawRecord({ payload, callback }, { call, put }) {
      const response = yield call(saveWithdrawRecord, payload);
      yield put({
        type: 'withdraw',
        payload: response,
      });
      if (callback) callback(response);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: {
          ...state.data,
          list: action.payload.data.rows,
          pagination: {
            current: action.payload.data.pageNumber, // 页码
            pageSize: action.payload.data.pageSize, // 条数
            total: action.payload.data.total, // 总条数
            pageSizeOptions: ['10', '20', '30', '40'],
            showQuickJumper: true,
            showSizeChanger: true,
          },
        },
      };
    },
    result(state, action) {
      return {
        ...state,
        result: action.payload.data,
      };
    },
    withdraw(state, action) {
      return {
        ...state,
        withdraw: action.payload,
      };
    },
  },
};
