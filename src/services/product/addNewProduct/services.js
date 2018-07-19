import request from '../../../utils/request';
import Configure from '../../../common/configure';

// 查询添加商品所需数据
export async function getAddProductDetial(params) {
  return request(Configure.getServer('goods/getAddProductDetial.cgi'), {
    method: 'POST',
    body: params,
  });
}

// 根据itemId查询详细信息
export async function productDetial(params) {
  return request(Configure.getServer('product/productDetial.cgi'), {
    method: 'POST',
    body: params,
  });
}

// 根据id查询类目信息
export async function findCategories(params) {
  return request(Configure.getServer('product/findCategories.cgi'), {
    method: 'POST',
    body: params,
  });
}

export async function findAllCategory(params) {
  return request(Configure.getServer('product/getAllCategory.cgi'), {
    method: 'POST',
    body: params,
  });
}

export async function preAdd(params) {
  return request(Configure.getServer('product/preAdd.cgi'), {
    method: 'POST',
    body: params,
  });
}

export async function addProduct(params) {
  return request(Configure.getServer('product/addProduct.cgi'), {
    method: 'POST',
    body: params,
  });
}

export async function updateProduct(params) {
  return request(Configure.getServer('product/updateProduct.cgi'), {
    method: 'POST',
    body: params,
  });
}
