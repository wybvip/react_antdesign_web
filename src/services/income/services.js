import request from '../../utils/request';
import Configure from '../../common/configure';

// -----------------------收入/提现------------------------
// 查询我多收入
export async function getIncomeList(params) {
  return request(Configure.getServer('income/incomeList.cgi'), {
    method: 'POST',
    body: params,
  });
}
// 查询待结算明细
export async function getSettlementList(params) {
  return request(Configure.getServer('income/settlementList.cgi'), {
    method: 'POST',
    body: params,
  });
}
//  提现记录
export async function getWithdrawRecordList(params) {
  return request(Configure.getServer('income/withdrawRecordList.cgi'), {
    method: 'POST',
    body: params,
  });
}
// 提现信息
export async function withdrawRecord(params) {
  return request(Configure.getServer('income/withdrawRecord.cgi'), {
    method: 'POST',
    body: params,
  });
}
// 添加提现信息
export async function saveWithdrawRecord(params) {
  return request(Configure.getServer('income/saveWithdrawRecord.cgi'), {
    method: 'POST',
    body: params,
  });
}
