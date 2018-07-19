import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Icon, Button, DatePicker, Tabs, Table, Modal, Input, Message } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../List/TableList.less';
import moment from 'moment';

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};
const { TabPane } = Tabs;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const status = ['正在审核', '审核完成', '审核拒绝']; // 审核状态
// 评论列表
const incomeColumns = [{
  title: '订单号',
  dataIndex: 'orderId',
  key: 'orderId',
}, {
  title: '交易时间',
  dataIndex: 'createdAt',
  key: 'createdAt',
  render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
}, {
  title: '收入',
  dataIndex: 'amount',
  key: 'amount',
}, {
  title: '余额',
  dataIndex: 'balance',
  key: 'balance',
}];

// 待结算明细
const settlement = [{
  title: '订单号',
  dataIndex: 'orderId',
  key: 'orderId',
}, {
  title: '交易时间',
  dataIndex: 'createdAt',
  key: 'createdAt',
  render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
}, {
  title: '收入',
  dataIndex: 'amount',
  key: 'amount',
}, {
  title: '余额',
  dataIndex: 'balance',
  key: 'balance',
}];

// 提现记录
const withdrawRecord = [{
  title: '申请时间',
  dataIndex: 'createdAt',
  key: 'createdAt',
}, {
  title: '提现账号',
  dataIndex: 'payNumber',
  key: 'payNumber',
}, {
  title: '提现金额',
  dataIndex: 'amount',
  key: 'amount',
}, {
  title: '处理完成时间',
  dataIndex: 'completeTime',
  render(val) {
    if (val === undefined) {
      return '未完成';
    } else {
      return val;
    }
  },
}, {
  title: '状态',
  dataIndex: 'status',
  render(val) {
    return status[val];
  },
}, {
  title: '申请人',
  dataIndex: 'realName',
  key: 'realName',
}];

@connect(({
  income,
  loading,
  login,
}) => ({
  income,
  loading: loading.models.income,
  login,
}))
@Form.create()
export default class InComeList extends PureComponent {
  state = {
    pageNumber: 1,
    pageSize: 10,
    startTime: '',
    endTime: '',
    dateText: '交易',
    methodType: 'income',
    switch: false,
    balance: '',
    bankInfoId: '',
    isShowMessage: false
  };

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'income/fetch',
    });

    dispatch({
      type: 'income/withdrawRecord',
    });
  }

  // 提现提交
  onSubmit = () => {
    const { income: { result }, dispatch } = this.props;
    const amount = this.state.balance;
    const pattern = /^(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if (!pattern.test(amount) || amount === '0') {
      Message.warning('请输入正确的提现金额');
    } else if (amount < result.balance || amount === result.balance) {
      dispatch({
        type: 'income/saveWithdrawRecord',
        payload: {
          amount,
          bankInfoId: this.state.bankInfoId,
        },
        callback: (e) => {
          if (e && e.code === 0) {
            Message.success('操作成功');
            dispatch({
              type: 'income/fetch',
            });

            dispatch({
              type: 'income/withdrawRecord',
            });
            this.setState({ switch: false });
          } else if (e && e.code === -1) {
            const message = e.message;
            Message.error(message);
          }
        },
      });
    } else {
      Message.warning('提现金额大于余额');
    }
  }

  // 日期检索
  changeDate = (date, dateString) => {
    this.setState({
      startTime: dateString[0],
      endTime: dateString[1],
    });
  }

  pageChange = (page) => {
    this.setState({
      pageNumber: page.current,
      pageSize: page.pageSize,
    });

    this.handleStandardTableChange(page.current, page.pageSize);
  }

  handleStandardTableChange = (page, rows) => {
    const params = {
      pageNumber: page,
      pageSize: rows,
      startTime: this.state.startTime,
      endTime: this.state.endTime,
      methodType: this.state.methodType,
    };

    this.props.dispatch({
      type: 'income/fetch',
      payload: params,
    });
  }

  changeTab = (activeKey) => {
    this.setState({
      pageNumber: 1,
      pageSize: 10
    });

    this.props.dispatch({
      type: 'income/fetch',
      payload: {
        pageNumber: 1,
        pageSize: 10,
        methodType: activeKey,
      },
    });

    if (activeKey === 'income' || activeKey === 'settlement') {
      this.setState({
        dateText: '交易',
        methodType: activeKey,
      });
    } else {
      this.setState({
        dateText: '提现',
        methodType: activeKey,
      });
    }
  }

  withdrawRecord = () => {
    this.setState({
      switch: true,
    });
  }

  // 获取提现金额
  balanceChange = (e) => {
    const { value } = e.target;
    this.setState({
      balance: value,
    });
  }

  // 关闭
  close = () => {
    this.setState({
      switch: false,
    });
  }

  // 搜索
  handleSearch = (e) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err) => {
      if (err) return;
      const { startTime, endTime, pageNumber, pageSize, methodType } = this.state;
      dispatch({
        type: 'income/fetch',
        payload: {
          startTime,
          endTime,
          pageNumber,
          pageSize,
          methodType,
        },
      });
    });
  }

  renderSimpleForm() {
    const { loading, income: { result } } = this.props;
    let {
      income: {
        data,
      },
    } = this.props;
    if (!data.list) {
      data = {
        list: [],
        pagination: {
          current: 1,
          pageSize: 10,
          total: 0,
          pageSizeOptions: ['10', '20', '30', '40'],
          showSizeChanger: true,
          showQuickJumper: true,
        },
      };
    }
    this.setState({
      bankInfoId: result.bankInfoId,
    });
    return (
      <div>
        <Form onSubmit={this.handleSearch} layout="inline">
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={16} sm={24}>
              <Button type="primary" htmlType="submit" style={{ marginBottom: 30 }} onClick={this.withdrawRecord}>提现</Button>
            </Col>
          </Row>
          <Modal
            title="提现"
            destroyOnClose
            onOk={this.onSubmit}
            onCancel={this.close}
            visible={this.state.switch}
          >
            <FormItem
              {...formItemLayout}
              label="余额"
            >
              {result.balance} 元
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="提现金额"
            >
              <Input placeholder={`最大可提现${result.balance}元`} onChange={this.balanceChange} />
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="支付宝账号"
            >
              <Input disabled defaultValue={result.account} />
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="姓名"
            >
              <Input disabled defaultValue={result.realName} />
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="提现审核周期"
            >
              预计7个工作日到账
            </FormItem>
          </Modal>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={16} sm={24}>
              <FormItem label={`${this.state.dateText}日期`}>
                <RangePicker onChange={this.changeDate} />
              </FormItem>
              <FormItem>
                <span className={styles.submitButtons}>
                  <Button type="primary" htmlType="submit">查询</Button>
                </span>
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Tabs onChange={this.changeTab}>
          <TabPane tab={<span><Icon type="bank" />我的收入</span>} key="income">
            <Table
              loading={loading}
              columns={incomeColumns}
              dataSource={data.list}
              pagination={data.pagination}
              onChange={this.pageChange.bind(this)}
              onShowSizeChange={this.handleStandardTableChange}
            />
          </TabPane>
          <TabPane tab={<span><Icon type="pay-circle-o" />待结算明细</span>} key="settlement">
            <Table
              loading={loading}
              columns={settlement}
              dataSource={data.list}
              pagination={data.pagination}
              onChange={this.pageChange.bind(this)}
              onShowSizeChange={this.handleStandardTableChange}
            />
          </TabPane>
          <TabPane tab={<span><Icon type="form" />提现记录</span>} key="withdraw_record">
            <Table
              loading={loading}
              columns={withdrawRecord}
              dataSource={data.list}
              pagination={data.pagination}
              onChange={this.pageChange.bind(this)}
              onShowSizeChange={this.handleStandardTableChange}
            />
          </TabPane>
        </Tabs>
      </div>
    );
  }

  renderForm() {
    return this.renderSimpleForm();
  }
  render() {
    const { income: { result } } = this.props;
    return (
      <PageHeaderLayout title="收入/提现">
        <Card bordered={false}>
          <div className={styles.tableList}>
            {this.renderSimpleForm()}
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
