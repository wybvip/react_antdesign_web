import request from '../../utils/request';
import Configure from '../../common/configure';

// -----------------------订单列表------------------------
// 获取订单列表
export async function getOrderList(params) {
  return request(Configure.getServer('orders/orderList.cgi'), {
    method: 'POST',
    body: params,
  });
}
// 查询订单详情
export async function getOrderDetail(params) {
  return request(Configure.getServer('orders/orderDetail.cgi'), {
    method: 'POST',
    body: params,
  });
}
