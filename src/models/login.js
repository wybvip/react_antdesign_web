import { routerRedux } from 'dva/router';
import { getVerifyCode, login, loginForMobile } from '../services/api';
import { logout } from '../services/user/services';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';

export default {
  namespace: 'login',

  state: {
    code: undefined,
    status: undefined,
    message: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      let response;
      if (payload.type && payload.type === 'smsLogin') {
        response = yield call(loginForMobile, payload);
      } else if (payload.type && payload.type === 'userLogin') {
        response = yield call(login, payload);
      }
      if (!response) return;
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      if (response.code === 0) {
        reloadAuthorized();
        if (response.data.status === 0) { // 待提交企业资质
          yield put(routerRedux.push('/register/enterprise-aptitude'));
        } else if (response.data.status === 1) {
          yield put(routerRedux.push('/register/shop-aptitude'));
        } else if (response.data.status === 2) {
          yield put(routerRedux.push('/register/brand-aptitude'));
        } else if (response.data.status === 3 || response.data.status === 4) {
          yield put(routerRedux.push('/register/result'));
        } else {
          yield put(routerRedux.push('/'));
        }
        // 简单处理
        location.reload();
      }
    },
    *logout(_, { put, select, call }) {
      try {
        const urlParams = new URL(window.location.href); // eslint-disable-line
        const pathname = yield select(state => state.routing.location.pathname);
        // add the parameters in the url
        urlParams.searchParams.set('redirect', pathname);
        window.history.replaceState(null, 'login', urlParams.href);
        yield call(logout);
      } finally {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            code: 0,
            data: {
              status: false,
              currentAuthority: 'guest',
            },
          },
        });
        reloadAuthorized();
        yield put(routerRedux.push('/user/login'));
      }
    },
    *mobileCode({ payload }, { call, put }) {
      const response = yield call(getVerifyCode, payload);
      yield put({
        type: 'changeMobile',
        payload: response,
      });
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      if (!payload.data) {
        payload.data = {}; // eslint-disable-line
      }
      setAuthority(payload.data.currentAuthority);
      return {
        ...state,
        code: payload.code,
        status: payload.data.status,
        type: payload.data.type,
        message: payload.message,
      };
    },
    changeMobile(state, { payload }) {
      return {
        ...state,
        code: payload.code,
        message: payload.message,
      };
    },
  },
};
