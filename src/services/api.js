import { stringify } from 'qs';
import request from '../utils/request';
import Configure from '../common/configure';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function fakeAccountLogin(params) {
  return request(Configure.getServer('login.cgi'), {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}

// 账号密码登陆
export async function login(params) {
  return request(Configure.getServer('login.cgi'), {
    method: 'POST',
    body: params,
  });
}
// 验证码登陆
export async function loginForMobile(params) {
  return request(Configure.getServer('loginForMobile.cgi'), {
    method: 'POST',
    body: params,
  });
}
// 获取手机验证码
export async function getVerifyCode(params) {
  return request(Configure.getServer('code.cgi'), {
    method: 'POST',
    body: params,
  });
}

//  获取注册手机验证码
export async function getVerifyCodeForRegister(params) {
  return request(Configure.getServer('code.cgi'), {
    method: 'POST',
    body: params,
  });
}

//  新用户注册
export async function fakeRegister(params) {
  return request(Configure.getServer('regist.cgi'), {
    method: 'POST',
    body: params,
  });
}

//  忘记密码
export async function forget(params) {
  return request(Configure.getServer('forget.cgi'), {
    method: 'POST',
    body: params,
  });
}

// 移除规则
export async function removeRule(params) {
  return request(Configure.getServer('removeRule.cgi'), {
    method: 'POST',
    body: params,
  });
}

// 添加规则
export async function addRule(params) {
  return request(Configure.getServer('addRole.cgi'), {
    method: 'POST',
    body: params,
  });
}

// 提现
export async function withDraw(params) {
  return request(Configure.getServer('withDraw.cgi'), {
    method: 'POST',
    body: params,
  });
}

//  获取自提点
export async function shopList(params) {
  return request(Configure.getServer('shopList.cgi'), {
    method: 'POST',
    body: params,
  });
}

// 获取商家详情模版
export async function goodsDetialGet(params) {
  return request(Configure.getServer('goodsDetialGet.cgi'), {
    method: 'POST',
    body: params,
  });
}

// 修改商家详情模版
export async function goodsDetialUpdate(params) {
  return request(Configure.getServer('goodsDetialUpdate.cgi'), {
    method: 'POST',
    body: params,
  });
}

// 删除商家详情模版
export async function goodsDetialDelete(params) {
  return request(Configure.getServer('goodsDetialDelete.cgi'), {
    method: 'POST',
    body: params,
  });
}

// 增加商家详情模版
export async function goodsDetialAdd(params) {
  return request(Configure.getServer('goodsDetialAdd.cgi'), {
    method: 'POST',
    body: params,
  });
}

// 归还地址  fetchGiveBackList
export async function getGiveBackList(params) {
  return request(Configure.getServer('goods/getGiveBackList.cgi'), {
    method: 'POST',
    body: params,
  });
}

// 更新归还地址
export async function saveOrEditGiveBack(params) {
  return request(Configure.getServer('goods/saveOrEditGiveBack.cgi'), {
    method: 'POST',
    body: params,
  });
}

// 删除归还地址
export async function deleteGiveBack(params) {
  return request(Configure.getServer('goods/deleteGiveBack.cgi'), {
    method: 'POST',
    body: params,
  });
}

// 查询分类
export async function getProductGroup(params) {
  return request(Configure.getServer('goods/productGroupGet.cgi'), {
    method: 'POST',
    body: params,
  });
}

// 增加分类
export async function addProductGroup(params) {
  return request(Configure.getServer('goods/productGroupAdd.cgi'), {
    method: 'POST',
    body: params,
  });
}

// 删除分类
export async function deleteProductGroup(params) {
  return request(Configure.getServer('goods/productGroupDelete.cgi'), {
    method: 'POST',
    body: params,
  });
}

// 更新分类
export async function updateProductGroup(params) {
  return request(Configure.getServer('goods/productGroupUpdate.cgi'), {
    method: 'POST',
    body: params,
  });
}

// 查询租赁规则模版
export async function rentRuleGet(params) {
  return request(Configure.getServer('goods/rentRuleGet.cgi'), {
    method: 'POST',
    body: params,
  });
}

//  删除租赁规则模版
export async function rentRuleDelete(params) {
  return request(Configure.getServer('goods/rentRuleDelete.cgi'), {
    method: 'POST',
    body: params,
  });
}

// 查询赔偿规则模板
export async function compensateRuleGet(params) {
  return request(Configure.getServer('goods/compensateRuleGet.cgi'), {
    method: 'POST',
    body: params,
  });
}

// 删除赔偿规则模板
export async function compensateRuleDelete(params) {
  return request(Configure.getServer('goods/compensateRuleDelete.cgi'), {
    method: 'POST',
    body: params,
  });
}

// 查询运费模版
export async function freightTemplateGet(params) {
  return request(Configure.getServer('goods/freightTemplateGet.cgi'), {
    method: 'POST',
    body: params,
  });
}
