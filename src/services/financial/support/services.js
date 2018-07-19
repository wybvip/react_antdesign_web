import request from '../../../utils/request';
import Configure from '../../../common/configure';

//* 查询全部的数据*/
export async function fetchFindApplyList(params) {
  return request(Configure.getServer('financialsupport/applicationList.cgi'), {
    method: 'POST',
    body: params,
  });
}

//* 查询单个数据*//
export async function selectDetailApplyId(params) {
  return request(Configure.getServer('financialsupport/applicationDetail.cgi'), {
    method: 'POST',
    body: params,
  });
}

//* 暂存*//
export async function provisionalInsert(params) {
  return request(Configure.getServer('financialsupport/provisionalInsert.cgi'), {
    method: 'POST',
    body: params,
  });
}

//* 查询暂存*//
export async function selectProvisionalApplication(params) {
  return request(Configure.getServer('financialsupport/applicationProvisional.cgi'), {
    method: 'POST',
    body: params,
  });
}

//* 保存*//
export async function insert(params) {
  return request(Configure.getServer('financialsupport/insert.cgi'), {
    method: 'POST',
    body: params,
  });
}

//* 上传图片 图片列表*/
export async function uploadFileList(params) {
  return request(Configure.getServer('image/upload.cgi'), {
    method: 'POST',
    body: params,
  });
}
