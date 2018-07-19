import request from '../../../utils/request';
import Configure from '../../../common/configure';

// 查询租赁规则模版详情
export async function rentRuleDetailById(params) {
  return request(Configure.getServer('goods/rentRuleDetailById.cgi'), {
    method: 'POST',
    body: params,
  });
}

//  添加租赁规则模版详情
export async function addRentRule(params) {
  return request(Configure.getServer('goods/addRentRule.cgi'), {
    method: 'POST',
    body: params,
  });
}
//  修改租赁规则模版详情
export async function editRentRule(params) {
  return request(Configure.getServer('goods/editRentRule.cgi'), {
    method: 'POST',
    body: params,
  });
}
