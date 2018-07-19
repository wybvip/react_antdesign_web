import request from '../../../utils/request';
import Configure from '../../../common/configure';

// 运费添加
export async function addfreightTemplate(params) {
  return request(Configure.getServer('goods/freightTemplateAdd.cgi'), {
    method: 'POST',
    body: params,
  });
}

// 查询运费详细模版
export async function freightTemplateDetialById(params) {
  return request(Configure.getServer('goods/freightTemplateDetialById.cgi'), {
    method: 'POST',
    body: params,
  });
}

// 运费删除
export async function freightTemplateDeleteById(params) {
  return request(Configure.getServer('goods/freightTemplateDeleteById.cgi'), {
    method: 'POST',
    body: params,
  });
}