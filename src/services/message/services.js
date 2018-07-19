import request from '../../utils/request';
import Configure from '../../common/configure';

// -----------------------消息中心------------------------
// 获取消息中心
export async function getMessageList(params) {
  return request(Configure.getServer('message/messageList.cgi'), {
    method: 'POST',
    body: params,
  });
}
// 查看消息
export async function checkMessage(params) {
  return request(Configure.getServer('message/checkMessage.cgi'), {
    method: 'POST',
    body: params,
  });
}
// 删除消息
export async function deleteMessage(params) {
  return request(Configure.getServer('message/deleteMessage.cgi'), {
    method: 'POST',
    body: params,
  });
}
