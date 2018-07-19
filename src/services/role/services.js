import request from '../../utils/request';
import Configure from '../../common/configure';

export async function getRoleList(params) {
  return request(Configure.getServer('role/getRoleList.cgi'), {
    method: 'POST',
    body: params,
  });
}

export async function getAllMenu(params) {
  return request(Configure.getServer('role/getMenuList.cgi'), {
    method: 'POST',
    body: params,
  });
}

export async function addRole(params) {
  return request(Configure.getServer('role/addRole.cgi'), {
    method: 'POST',
    body: params,
  });
}

export async function deleteRole(params) {
  return request(Configure.getServer('role/deleteRole.cgi'), {
    method: 'POST',
    body: params,
  });
}

export async function updateRole(params) {
  return request(Configure.getServer('role/updateRole.cgi'), {
    method: 'POST',
    body: params,
  });
}

export async function getRoleDetail(params) {
  return request(Configure.getServer('role/getRoleDetail.cgi'), {
    method: 'POST',
    body: params,
  });
}
