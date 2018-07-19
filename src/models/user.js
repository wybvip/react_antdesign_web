import { queryUser, fetchMenus } from '../services/user/services';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
    menuData: [],
  },

  effects: {
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryUser);
      const responseData = {
        avatar: response.data.avatar,
        name: response.data.realname,
        notifyCount: 12,
        userid: response.data.id,
      };

      yield put({
        type: 'saveCurrentUser',
        payload: responseData,
      });
    },

    *fetchMenu(_, { call, put }) {
      const response = yield call(fetchMenus);
      if (!response) return;
      const newResponse = response.data
        .filter((a) => { return a.visibility !== 0; })
        .map((e) => {
          const children = e.children.filter((e1) => {
            return e1.visibility !== 0;
          });
          return { ...e, children };
        });
      yield put({
        type: 'savaMenus',
        payload: newResponse,
      });
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
    savaMenus(state, action) {
      return {
        ...state,
        menuData: action.payload,
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
  },
};
