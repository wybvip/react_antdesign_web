import { findDistrict } from '../services/district/services';

export default {
  namespace: 'findDistrict',

  state: {
    cityInfo: {
      code: 0,
      message: '',
      data: {
        firstParent: [],
        secondParent: [],
        thirdParent: [],
      },
    },
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      console.log('payload', payload);
      let response = yield call(findDistrict, payload);
      console.log('findDistrict', response, payload);

      let payloadStatus;
      let newResponse;
      if (response && response.code == '-1') {
        response = {
          ...response,
          data: [],
        };
      }
      if (payload && payload.status === 2) {
        payloadStatus = payload.status;
        newResponse = {
          ...response,
          payloadStatus: payloadStatus,
          firstParent: payload.firstParent ? payload.firstParent : [],
          secondParent: response.data,
          thirdParent: payload.thirdParent ? payload.thirdParent : [],
        };
      } else if (payload && payload.status === 3) {
        payloadStatus = payload.status;
        newResponse = {
          ...response,
          payloadStatus: payloadStatus,
          firstParent: payload.firstParent ? payload.firstParent : [],
          secondParent: payload.secondParent ? payload.secondParent : [],
          thirdParent: response.data,
        };
      } else {
        payloadStatus = 1;
        newResponse = {
          ...response,
          payloadStatus: payloadStatus,
          firstParent: response.data,
          secondParent: [],
          thirdParent: [],
        };
      }
      console.log('shopsListresponse3333', response);
      console.log('newResponse', newResponse)
      if (!response.data) return;
      yield put({
        type: 'update',
        payload: newResponse,
      });
      if (callback) callback();
    },
  },

  reducers: {
    update(state, action) {
      return {
        ...state,
        cityInfo: {
          data: action.payload
        }
      };
    },
  },
};
