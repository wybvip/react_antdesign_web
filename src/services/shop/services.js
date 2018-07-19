import request from '../../utils/request';
import Configure from '../../common/configure';

//* 查询（根据shopId查询所有记录 有效的）*/
export async function queryServices(params) {
  return request(Configure.getServer('shop/queryServices.cgi'), {
    method: 'POST',
    body: params,
  });
}

//* 删除 */
export async function deleteServices(params) {
  return request(Configure.getServer('shop/deleteServices.cgi'), {
    method: 'POST',
    body: params,
  });
}

//* 删除 */
export async function addServices(params) {
  return request(Configure.getServer('shop/addServices.cgi'), {
    method: 'POST',
    body: params,
  });
}
