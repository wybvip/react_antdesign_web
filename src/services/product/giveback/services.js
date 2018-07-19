import request from '../../../utils/request';
import Configure from '../../../common/configure';

// 查询归还地址详细信息
export async function givebackDetailById(params) {
  return request(Configure.getServer('goods/givebackDetailById.cgi'), {
    method: 'POST',
    body: params,
  });
}

// 添加归还地址详细信息
export async function addGiveback(params) {
  return request(Configure.getServer('goods/addGiveback.cgi'), {
    method: 'POST',
    body: params,
  });
}

// 修改归还地址详细信息
export async function editGiveback(params) {
  return request(Configure.getServer('goods/editGiveback.cgi'), {
    method: 'POST',
    body: params,
  });
}
