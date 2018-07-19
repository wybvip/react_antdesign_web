import request from '../../../utils/request';
import Configure from '../../../common/configure';

export async function groups(params) {
  return request(Configure.getServer('getGroups.cgi'), {
    method: 'POST',
    body: params,
  });
}

export async function categories(params) {
  return request(Configure.getServer('getCategories.cgi'), {
    method: 'POST',
    body: params,
  });
}

export async function products(params) {
  return request(Configure.getServer('getProducts.cgi'), {
    method: 'POST',
    body: params,
  });
}

export async function remove(params) {
  return request(Configure.getServer('product/removeProduct.cgi'), {
    method: 'POST',
    body: params,
  });
}

export async function deleteProduct(params) {
  return request(Configure.getServer('product/deleteProduct.cgi'), {
    method: 'POST',
    body: params,
  });
}

export async function recoverProduct(params) {
  return request(Configure.getServer('product/recoverProduct.cgi'), {
    method: 'POST',
    body: params,
  });
}
