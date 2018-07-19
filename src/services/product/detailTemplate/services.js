import request from '../../../utils/request';
import Configure from '../../../common/configure';


// 查询商品详情模版详情
export async function templateDetailById(params) {
  return request(Configure.getServer('goods/templateDetailById.cgi'), {
    method: 'POST',
    body: params,
  });
}

//  添加商品详情模版详情
export async function addTemplate(params) {
  return request(Configure.getServer('goodsDetialAdd.cgi'), {
    method: 'POST',
    body: params,
  });
}
//  修改商品详情模版详情
export async function editTemplate(params) {
  return request(Configure.getServer('goodsDetialUpdate.cgi'), {
    method: 'POST',
    body: params,
  });
}
