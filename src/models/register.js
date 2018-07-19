import { message } from 'antd';
import { routerRedux } from 'dva/router';
import { fakeRegister, getVerifyCodeForRegister } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';

export default {
  namespace: 'register',

  state: {
    status: undefined,
  },

  effects: {
    *submit({ payload }, { call, put }) {
      const response = yield call(fakeRegister, payload);
      if (response) {
        if (response.code !== -1) {
          message.success('注册成功');
          yield put(routerRedux.push('/user/register-result'));
        } else {
          message.error(response.message);
        }
      } else {
        message.error('未知异常');
      }
    },
    *mobileCode({ payload }, { call, put }) {
      const response = yield call(getVerifyCodeForRegister, payload);
      if (response && response.code === 0) {
        message.success('短信验证码已发送');
      } else {
        message.error('短信验证码发送失败');
      }
      yield put({
        type: 'codeHandle',
        payload: response,
      });
    },
  },

  reducers: {
    registerHandle(state) {
      setAuthority('user');
      reloadAuthorized();
      return {
        ...state,
      };
    },
    codeHandle(state) {
      return {
        ...state,
      };
    },
  },
};
