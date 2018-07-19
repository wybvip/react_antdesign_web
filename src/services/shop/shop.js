import request from '../../utils/request';
import Configure from '../../common/configure';

//* 查询自提点列表 */
export async function queryShops(params) {
  return request(Configure.getServer('shop/shopList.cgi'), {
    method: 'POST',
    body: params,
  });
}

/* 添加自提点 */
export async function addShop(params) {
  return request(Configure.getServer('shop/addOfflineShop.cgi'), {
    method: 'POST',
    body: params,
  });
}

/* 删除自提点 */
export async function deleteShop(params) {
  return request(Configure.getServer('shop/deleteOfflineShop.cgi'), {
    method: 'POST',
    body: params,
  });
}

/* 根据id查询自提点 */
export async function queryShopById(params) {
  return request(Configure.getServer('shop/selectOfflineShopById.cgi'), {
    method: 'POST',
    body: params,
  });
}

/* 根据名称查询自提点 */
export async function selectByName(params) {
  return request(Configure.getServer('shop/selectOfflineShopByName.cgi'), {
    method: 'POST',
    body: params,
  });
}

/* 修改自提点自提点 */
export async function editShop(params) {
  return request(Configure.getServer('shop/editOfflineShop.cgi'), {
    method: 'POST',
    body: params,
  });
}
