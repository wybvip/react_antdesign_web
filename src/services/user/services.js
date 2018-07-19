import request from '../../utils/request';
import Configure from '../../common/configure';

export async function logout(params) {
  return request(Configure.getServer('logout.cgi'), {
    method: 'POST',
    body: params,
  });
}

export async function queryUser(params) {
  return request(Configure.getServer('getUser.cgi'), {
    method: 'POST',
    body: params,
  });
}

export async function fetchMenus(params) {
  return request(Configure.getServer('fetchMenus.cgi'), {
    method: 'POST',
    body: params,
  });
}

export async function userAdd(params) {
  return request(Configure.getServer('users/userAdd.cgi'), {
    method: 'POST',
    body: params,
  });
}

export async function userList(params) {
  return request(Configure.getServer('users/userList.cgi'), {
    method: 'POST',
    body: params,
  });
}

export async function userUpdate(params) {
  return request(Configure.getServer('users/userUpdate.cgi'), {
    method: 'POST',
    body: params,
  });
}

export async function userDelete(params) {
  return request(Configure.getServer('users/userDelete.cgi'), {
    method: 'POST',
    body: params,
  });
}

export async function userDetail(params) {
  return request(Configure.getServer('users/userDetail.cgi'), {
    method: 'POST',
    body: params,
  });
}

export async function allRole(params) {
  return request(Configure.getServer('users/allRole.cgi'), {
    method: 'POST',
    body: params,
  });
}
