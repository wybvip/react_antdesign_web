import request from '../../utils/request';
import Configure from '../../common/configure';

//* 查询文件列表 */
export async function fileList(params) {
  return request(Configure.getServer('shop/fileList.cgi'), {
    method: 'POST',
    body: params,
  });
}

//* 修改文件 */
export async function editFile(params) {
  return request(Configure.getServer('shop/editFile.cgi'), {
    method: 'POST',
    body: params,
  });
}

//* 删除文件 */
export async function deleteFile(params) {
  return request(Configure.getServer('shop/deleteFile.cgi'), {
    method: 'POST',
    body: params,
  });
}

//* 添加文件 */
export async function addFile(params) {
  return request(Configure.getServer('shop/addFile.cgi'), {
    method: 'POST',
    body: params,
  });
}

//* 条件分页查询文件 */
export async function selectByName(params) {
  return request(Configure.getServer('shop/fileListByName.cgi'), {
    method: 'POST',
    body: params,
  });
}
