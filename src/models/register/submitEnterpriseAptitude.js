import { routerRedux } from 'dva/router';
import { submitEnterpriseAptitude, findEnterpriseInfo } from '../../services/register/services';

export default {
  namespace: 'submitEnterpriseAptitude',

  state: {
    result: {
      code: '',
      message: '',
      data: {}
    },
    findbyid: {
      code: -1,
      message: '',
      data: {
        sei: {},
        businessLicenseThumbs: '',
        organizationLicenseThumbs: '',
        taxLicenseThumbs: '',
        idFrontThumbs: '',
        idBackThumbs: '',
        province: '',
        city: ''
      }
    },
  },

  effects: {
    *save({ payload }, { call, put }) {
      const response = yield call(submitEnterpriseAptitude, payload);
      if (!response || response.code !== 0) return;
      yield put({
        type: 'result',
        payload: response,
      });
    },
    *find({ payload }, { call, put }) {
      const response = yield call(findEnterpriseInfo, payload);
      if (!response || response.code !== 0) return;
      yield put({
        type: 'findbyid',
        payload: response,
      });
    },
  },

  reducers: {
    result(state, action) {
      return {
        ...state,
        result: {
          code: action.payload.code,
          message: action.payload.message,
          data: action.payload.data
        },
      };
    },
    findbyid(state, action) {
      return {
        ...state,
        findbyid: {
          code: action.payload.code,
          message: action.payload.message,
          data: {
            sei: action.payload.data.sei,
            businessLicenseThumbs: action.payload.data.businessLicenseThumbs,
            organizationLicenseThumbs: action.payload.data.organizationLicenseThumbs,
            taxLicenseThumbs: action.payload.data.taxLicenseThumbs,
            idFrontThumbs: action.payload.data.idFrontThumbs,
            idBackThumbs: action.payload.data.idBackThumbs,
            province: action.payload.data.sei.licenseProvince,
            city: action.payload.data.sei.licenseCity
          }
        },
      };
    },
  },
};
