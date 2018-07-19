import request from '../../../utils/request';
import Configure from '../../../common/configure';

// 查询商品详情模版详情
export async function templateDetailById(params) {
  return request(Configure.getServer('goods/compensateRuleDetailById.cgi'), {
    method: 'POST',
    body: params,
  });
}

// 添加商品详情模版详情
export async function addCompensateRule(params) {
  return request(Configure.getServer('goods/addCompensateRule.cgi'), {
    method: 'POST',
    body: params,
  });
}

// 修改商品详情模版详情
export async function editCompensateRule(params) {
  return request(Configure.getServer('goods/editCompensateRule.cgi'), {
    method: 'POST',
    body: params,
  });
}

