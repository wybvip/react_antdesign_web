import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Icon, Button, Divider, DatePicker, message, Tabs, Table, Input, Pagination, Select } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../List/TableList.less';
import StandardTable from '../../components/StandardTable';

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};
const { Option } = Select;
const TabPane = Tabs.TabPane;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
//  const status = ['关闭', '运行中', '已上线', '异常'];

const columns1 = [{
  title: '订单号',
  dataIndex: 'orderId',
  key: 'orderId',
  render: text => <a href="javascript:;">{text}</a>,
}, {
  title: '交易时间',
  dataIndex: 'createdAt',
  key: 'createdAt',
}, {
  title: '收入',
  dataIndex: 'balance',
  key: 'balance',
}, {
  title: '余额',
  dataIndex: 'amount',
  key: 'amount',
}];

const data1 = [{
  key: '1',
  name: 'John Brown',
  age: 32,
  address: 'New York No. 1 Lake Park',
  action: '111',
}, {
  key: '2',
  name: 'Jim Green',
  age: 42,
  address: 'London No. 1 Lake Park',
  action: '111',
}, {
  key: '3',
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
  action: '111',
}, {
  key: '4',
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
  action: '111',
}];
const Action = (a) => {
  console.log(this.props)
}

@connect(({
  orderIncome,
  loading,
  login
}) => ({
  orderIncome,
  loading: loading.models.orderIncome,
  login
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
    startTime: '',
    endTime: '',
    IncomeText: '交易',
    widthDraw: 'income',
    searchType: 'income',
    showWidthDraw: false,
    pageSize: 10,
    current: 1,
    noSearch: true,
    SelectsChangeGroup: [],
    SelectsChangeCategory: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'orderIncome/fetch',
    });
  }

  columns = [{
    title: '主图',
    dataIndex: 'name',
    key: 'name',
    render: record => <img src="https://res.zudeapp.com/Public/Uploads/1b685f386ed1df8c08c6aba84d1fb9b2.png" style={{width: 80, height:80, }}/>,
  }, {
    title: '名称',
    dataIndex: 'age',
    key: 'age',
  }, {
    title: '类目',
    dataIndex: 'address',
    key: 'address',
  }, {
    title: '录入时间',
    dataIndex: 'action',
    key: 'action',
  }, {
    title: '审核状态',
    dataIndex: 'action',
    key: 'action',
  }, {
    title: '审核备注',
    dataIndex: 'action',
    key: 'action',
  }, {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    render: (text, record) => (
      <span>
        <a href="javascript:;" onClick={() => {this.editGoodsList(record)}}>
          <Icon type="edit" style={{ fontSize: 16, color: '#08c' }} />
        </a>
        <Divider type="vertical" />
        <a href="javascript:;" onClick={() => {this.deleteGoodsList(record)}}>
          <Icon type="delete" style={{ fontSize: 16, color: '#08c' }} />
        </a>
      </span>
    ),
  }];
  changeGoodsList = (info) => {
    console.log('editGoodsList');
    console.log('info', info);
  }
  deleteGoodsList = (info) => {
    console.log('deleteGoodsList');
    console.log('info', info);
  }

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  }
  handleMenuClick = (e) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'rule/remove',
          payload: {
            no: selectedRows.map(row => row.no).join(','),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'rule/fetch',
      payload: {},
    });
  }

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  }

  handleMenuClick = (e) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'rule/remove',
          payload: {
            no: selectedRows.map(row => row.no).join(','),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  }

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  }

  handleSearch = (e) => {
    e.preventDefault();

    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const { startTime, endTime, pageSize, current } = this.state;
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'orderIncome/fetch',
        payload: {
          ...values,
          startTime: startTime,
          endTime: endTime,
          pageSize: pageSize,
          current: current,
        },
      });
    });
  }

  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
    });
  }

  handleAdd = (fields) => {
    this.props.dispatch({
      type: 'rule/add',
      payload: {
        description: fields.desc,
      },
    });

    Message.success('添加成功');
    this.setState({
      modalVisible: false,
    });
  }

  changeDate = (date, dateString) => {
    if (dateString[0] && dateString[1]) {
      this.setState({
        startTime: dateString[0],
        endTime: dateString[1],
        noSearch: false,
      });
    }
  };

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  }

  withDraw = () => {
    console.log('提现');
    this.setState({
      showWidthDraw: true,
    });
  }

  withDrawSure = () => {
    console.log('确定提现');
  }
  pageChange = (page) => {
    console.log(page);
    this.setState({
      pageSize: page.pageSize,
      current: page.current,
    });
    this.handleStandardTableChange(page.current, page.pageSize);
  }
  handleStandardTableChange = (current, size) => {
    console.log('current, size', current, size);
    const params = {
      pageSize: size,
      current: current,
      startTime: this.state.startTime,
      endTime: this.state.endTime,
    };
    console.log('params', params);
    this.props.dispatch({
      type: 'orderIncome/fetch',
      payload: params,
    });
  }
  handleSelectsChangeGroup = (value) => {
    console.log(`selected ${value}`);
    this.setState({
      SelectsChangeGroup: value,
    });
  }
  handleSelectsChangeCategory = (value) => {
    console.log(`selected ${value}`);
    this.setState({
      SelectsChangeCategory: value,
    });
  }

  changeTab = (activeKey) => {
    console.log('tab切换');
    if (activeKey && activeKey === 'income') {
      this.setState({
        IncomeText: '交易',
        searchType: 'income',
      });
    } else if (activeKey && activeKey === 'settlement') {
      this.setState({
        IncomeText: '结算',
        searchType: 'settlement',
      });
    } else if (activeKey && activeKey === 'withdrawRecord') {
      this.setState({
        IncomeText: '提现',
        searchType: 'withdrawRecord',
      });
    }
  }

  renderSimpleForm() {
    let {
      orderIncome: {
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
    if (data && data.pagination) {
      data.pagination = {
        ...data.pagination,
        current: this.state.current,
        pageSize: this.state.pageSize,
      };
    }
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem label="选择分类">
              <Select
                mode="multiple"
                placeholder="选择分类"
                onChange={this.handleSelectsChangeGroup}
                style={{ width: 300 }}
              >
                <Option value="jack">Jack (100)</Option>
                <Option value="lucy">Lucy (101)</Option>
              </Select>
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="选择类目">
              <Select
                mode="multiple"
                placeholder="选择类目"
                onChange={this.handleSelectsChangeCategory}
                style={{ width: 300 }}
              >
                <Option value="jack">Jack (100)</Option>
                <Option value="lucy">Lucy (101)</Option>
              </Select>
            </FormItem>
          </Col>
          <Col md={14} sm={24}>
            <FormItem label={`${this.state.IncomeText}日期`}>
              <RangePicker onChange={this.changeDate} />
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem>
              <span className={styles.submitButtons}>
                <Button type="primary" htmlType="submit" >搜索</Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
              </span>
            </FormItem>
          </Col>
        </Row>
        <Tabs defaultActiveKey="income" onChange={this.changeTab}>
          <TabPane tab={<span><Icon type="pay-circle" />全部商品</span>} key="all" type="全部商品">
            <Table
              columns={this.columns}
              dataSource={data.list}
              pagination={data.pagination}
              onChange={this.pageChange.bind(this)}
              onShowSizeChange={this.handleStandardTableChange}
            />
          </TabPane>
          <TabPane tab={<span><Icon type="file-text" />已上架商品</span>} key="settlement" type="已上架商品">
            已上架商品
          </TabPane>
          <TabPane tab={<span><Icon type="bank" />仓库中的商品</span>} key="withdrawRecord" type="仓库中的商品">
            仓库中的商品
          </TabPane>
          <TabPane tab={<span><Icon type="bank" />定时商品</span>} key="withdrawRecord1" type="定时商品">
            定时商品
          </TabPane>
          <TabPane tab={<span><Icon type="bank" />限租商品</span>} key="withdrawRecord2" type="限租商品">
            限租商品
          </TabPane>
          <TabPane tab={<span><Icon type="bank" />回收站</span>} key="withdrawRecord3" type="回收站">
            回收站
          </TabPane>
        </Tabs>
      </Form>
    );
  }

  renderForm() {
    return this.renderSimpleForm();
  }
  render() {
    return (
      <PageHeaderLayout title="所有商品">
        <Card bordered={false}>
          <div className={styles.tableList}>
            {this.renderSimpleForm()}
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
