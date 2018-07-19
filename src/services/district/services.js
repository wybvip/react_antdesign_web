import request from '../../utils/request';
import Configure from '../../common/configure';

// 城市级联查询
export async function findDistricts(params) {
  return request(Configure.getServer('district/findDistrict.cgi'), {
    method: 'POST',
    body: params,
  });
}
