import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { getRoleList, addRole, deleteRole, updateRole, getRoleDetail } from '../../services/role/services';

export default {
  namespace: 'role',

  state: {
    data: {
      list: [],
      pagination: {
        current: 0,
        pageSize: 0,
        total: 0,
      },
    },
    roleDetail: { role: {}, pages: [] },
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(getRoleList, payload);
      if (!response) return;
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
    *fetchRoleDetail({ payload }, { call, put }) {
      const response = yield call(getRoleDetail, payload);
      if (!response || response.code === -1) return;
      yield put({
        type: 'saveRoleDetail',
        payload: response,
      });
    },
    *add({ payload }, { call, put }) {
      const response = yield call(addRole, payload);
      if (!response || response.code !== 0) {
        message.error('提交失败');
      } else {
        message.success('提交成功');
        yield put(routerRedux.push('/admin/role'));
      }
    },
    *delete({ payload }, { call, put }) {
      const response = yield call(deleteRole, payload);
      if (!response || response.code !== 0) {
        message.error('删除失败');
      } else {
        message.success('删除成功');
        yield put({
          type: 'fetchList',
          payload: { pageSize: 10, pageNumber: 1 },
        });
      }
    },
    *update({ payload }, { call, put }) {
      const response = yield call(updateRole, payload);
      if (!response || response.code !== 0) {
        message.error('更新失败');
      } else {
        message.success('更新成功');
        yield put(routerRedux.push('/admin/role'));
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
        roleDetail: { role: {}, pages: [] },
      };
    },
    saveRoleDetail(state, action) {
      return {
        ...state,
        roleDetail: {
          role: action.payload.data.shopRole,
          pages: action.payload.data.shopRolePage,
        },
      };
    },
  },
};
