import request from '../../utils/request';
import Configure from '../../common/configure';

// -----------------------资质审核------------------------
// 企业资质审核
export async function submitEnterpriseAptitude(params) {
  return request(Configure.getServer('register/submitEnterpriseAptitude.cgi'), {
    method: 'POST',
    body: params,
  });
}
// 企业信息查询
export async function findEnterpriseInfo(params) {
  return request(Configure.getServer('register/findEnterpriseInfo.cgi'), {
    method: 'POST',
    body: params,
  });
}

// -----------------------店铺审核------------------------
// 店铺主营类目查询
export async function findShopMainCategory(params) {
  return request(Configure.getServer('register/findShopMainCategory.cgi'), {
    method: 'POST',
    body: params,
  });
}
// 企业资质审核
export async function submitShopAptitude(params) {
  return request(Configure.getServer('register/submitShopAptitude.cgi'), {
    method: 'POST',
    body: params,
  });
}

// -----------------------品牌审核------------------------
// 品牌信息查询
export async function findBrandsAptitude(params) {
  return request(Configure.getServer('register/findBrandsAptitude.cgi'), {
    method: 'POST',
    body: params,
  });
}
// 品牌信息审核
export async function submitBrandAptitude(params) {
  return request(Configure.getServer('register/submitBrandAptitude.cgi'), {
    method: 'POST',
    body: params,
  });
}
// 品牌信息删除
export async function deleteBrand(params) {
  return request(Configure.getServer('register/deleteBrand.cgi'), {
    method: 'POST',
    body: params,
  });
}
// 审核结果
export async function auditResults(params) {
  return request(Configure.getServer('register/auditResult.cgi'), {
    method: 'POST',
    body: params,
  });
}
