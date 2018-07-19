import request from '../../utils/request';
import Configure from '../../common/configure';

// -----------------------评论列表------------------------
// 获取评论列表
export async function getCommentList(params) {
  return request(Configure.getServer('comment/commentList.cgi'), {
    method: 'POST',
    body: params,
  });
}
