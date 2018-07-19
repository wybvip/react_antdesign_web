import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { userAdd, userUpdate, userList, userDelete, userDetail, allRole } from '../../services/user/services';

export default {
  namespace: 'users',

  state: {
    data: {
      list: [],
      pagination: {
        current: 0,
        pageSize: 0,
        total: 0,
      },
    },
    detail: {},
    roles: [],
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(userList, payload);
      if (!response || response.code !== 0) return;
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
    *fetchDetail({ payload }, { call, put }) {
      const response = yield call(userDetail, payload);
      if (!response || response.code !== 0) return;
      yield put({
        type: 'saveDetail',
        payload: response,
      });
    },
    *fetchAllRole({ payload }, { call, put }) {
      const response = yield call(allRole, payload);
      if (!response || response.code !== 0) return;
      yield put({
        type: 'saveAllRole',
        payload: response,
      });
    },
    *add({ payload }, { call, put }) {
      const response = yield call(userAdd, payload);
      if (!response || response.code !== 0) {
        message.error('添加失败');
      } else {
        message.success('添加成功');
        yield put(routerRedux.push('/admin/employee'));
      }
    },
    *update({ payload }, { call, put }) {
      const response = yield call(userUpdate, payload);
      if (!response || response.code !== 0) {
        message.error('更新失败');
      } else {
        message.success('更新成功');
        yield put(routerRedux.push('/admin/employee'));
      }
    },
    *delete({ payload }, { call, put }) {
      const response = yield call(userDelete, payload);
      if (!response || response.code !== 0) {
        message.error('删除失败');
      } else {
        yield put({
          type: 'fetchList',
          payload: { pageSize: 10, pageNumber: 1 },
        });
      }
    },
  },

  reducers: {
    saveList(state, action) {
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
        detail: {},
      };
    },
    saveDetail(state, action) {
      return {
        ...state,
        detail: action.payload.data,
      };
    },
    saveAllRole(state, action) {
      return {
        ...state,
        roles: action.payload.data,
      };
    },
  },
};
