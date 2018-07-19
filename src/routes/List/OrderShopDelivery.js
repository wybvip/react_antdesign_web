import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Badge, Divider } from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from '../../components/DescriptionList';
import styles from './TableList.less';

const { TextArea } = Input;
const { Description } = DescriptionList;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];
const columns = [
  {
    title: '规则编号',
    dataIndex: 'no',
  },
  {
    title: '描述',
    dataIndex: 'description',
  },
  {
    title: '服务调用次数',
    dataIndex: 'callNo',
    sorter: true,
    align: 'right',
    render: val => `${val} 万`,
    // mark to display a total number
    needTotal: true,
  },
  {
    title: '状态',
    dataIndex: 'status',
    filters: [
      {
        text: status[0],
        value: 0,
      },
      {
        text: status[1],
        value: 1,
      },
      {
        text: status[2],
        value: 2,
      },
      {
        text: status[3],
        value: 3,
      },
    ],
    render(val) {
      return <Badge status={statusMap[val]} text={status[val]} />;
    },
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    sorter: true,
    render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
  },
  {
    title: '操作',
    render: () => (
      <Fragment>
        <a href="">配置</a>
        <Divider type="vertical" />
        <a href="">订阅警报</a>
      </Fragment>
    ),
  },
];

const CreateForm = Form.create()((props) => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      title="新建规则"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="描述"
      >
        {form.getFieldDecorator('desc', {
          rules: [{ required: true, message: 'Please input some description...' }],
        })(
          <Input placeholder="请输入" />
        )}
      </FormItem>
    </Modal>
  );
});

@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    startDate: '',
    endDate: '',
    orderDetialIsVisible: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      // type: 'orderlist/submit',
      type: 'rule/fetch',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'orderlist/submit',
      payload: params,
    });
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

      const { startDate, endDate } = this.state;
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'orderlist/submit',
        payload: {
          ...values,
          startDate: startDate,
          endDate: endDate,
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

    message.success('添加成功');
    this.setState({
      modalVisible: false,
    });
  }

  changeDate = (date, dateString) => {
    this.setState({
      startDate: dateString[0],
      endDate: dateString[1],
    });
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="订单编号">
              {getFieldDecorator('no')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="商品名称">
              {getFieldDecorator('goodsName')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="订单状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">用户取消订单</Option>
                  <Option value="1">待支付</Option>
                  <Option value="2">用户超时支付关闭订单</Option>
                  <Option value="3">用户删除订单</Option>
                  <Option value="4">平台关闭订单</Option>
                  <Option value="5">商家关闭订单</Option>
                  <Option value="6">待商家发货</Option>
                  <Option value="7">待用户确认收货</Option>
                  <Option value="8">待商家确认退货退款</Option>
                  <Option value="9">商家拒绝退货退款</Option>
                  <Option value="10">待退货</Option>
                  <Option value="11">待退款</Option>
                  <Option value="12">待商家确认收货</Option>
                  <Option value="13">退款成功</Option>
                  <Option value="14">租用中</Option>
                  <Option value="15">归还中</Option>
                  <Option value="16">待结算</Option>
                  <Option value="17">待确认结算</Option>
                  <Option value="18">待结算后的待支付</Option>
                  <Option value="19">自动确认结算</Option>
                  <Option value="20">结算支付超时</Option>
                  <Option value="21">待评价</Option>
                  <Option value="22">已评价</Option>
                  <Option value="23">续租中</Option>
                  <Option value="24">续租待商家确认</Option>
                  <Option value="25">商家拒绝续租请求</Option>
                  <Option value="26">续租待支付</Option>
                  <Option value="27">用户取消续租支付</Option>
                  <Option value="28">用户超时支付续租订单</Option>
                  <Option value="29">续租支付完成</Option>
                  <Option value="30">申请退款待商家确认</Option>
                  <Option value="31">商家已拒绝退款申请</Option>
                  <Option value="32">小二介入中</Option>
                  <Option value="33">用户取消续租</Option>
                  <Option value="34">未出结算单</Option>
                  <Option value="35">已出结算单</Option>
                  <Option value="36">结算单等待用户确认</Option>
                  <Option value="37">完成结算单</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="支付方式">
              {getFieldDecorator('payType')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">支付宝支付</Option>
                  <Option value="1">微信支付</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="收货人姓名">
              {getFieldDecorator('userName')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="收货人手机号">
              {getFieldDecorator('userPhone')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={16} sm={24}>
            <FormItem label="下单日期">
              <RangePicker onChange={this.changeDate} />
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem>
              <span className={styles.submitButtons}>
                <Button type="primary" htmlType="submit">查询</Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
              </span>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="规则编号">
              {getFieldDecorator('no')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="调用次数">
              {getFieldDecorator('number')(
                <InputNumber style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="更新日期">
              {getFieldDecorator('date')(
                <DatePicker style={{ width: '100%' }} placeholder="请输入更新日期" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status3')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status4')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <div style={{ overflow: 'hidden' }}>
              <span style={{ float: 'right', marginBottom: 24 }}>
                <Button type="primary" htmlType="submit">查询</Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>

              </span>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }
  renderDetail(orderInfoData) {
    console.log('orderInfoData', orderInfoData);
    if (!orderInfoData) {
      return (
        <div>
          <p>暂无数据</p>
          <Button type="primary" style={{ marginLeft: 30 }} onClick={this.goBackOrderList}>返回</Button>
        </div>
      );
    } else {
      return (
        <PageHeaderLayout title="订单详情">
          <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ margin: " 0px 0px 24px 24px" }}>
            <Col md={24} sm={24}>
              <Button type="primary" style={{ marginLeft: 30 }} onClick={this.goBackOrderList}>返回</Button>
              <Modal
                title={this.state.refundText}
                visible={this.state.modalIsVisible}
                onOk={this.SelectHandleOk}
                onCancel={this.SelectHandleCancel}
              >
                <TextArea rows={4} placeholder="请输入理由" onChange={this.textAreaChange} value={this.state.textAreaText} />
              </Modal>
            </Col>
          </Row>
          <Card bordered={false}>
            <DescriptionList size="large" title="订单详细" style={{ marginBottom: 32 }}>
              <Description term="商品名称"> {orderInfoData.userOrders.order_id || 'iphone8'}</Description>
              <Description term="发货方式"> {orderStatus[orderInfoData.userOrders.status] || '快递发货'}</Description>
              <Description term="租用时间"> {orderTypeStatus[orderInfoData.userOrders.type] || '2018-05-22 至 2018-05-23'} </Description>
              <Description term="下单时间"> {isViolationStatus[orderInfoData.userOrders.is_violation] || '2018-05-19 15:55:17'}</Description>
              <Description term="付款时间"> {isRenewalStatus[orderInfoData.userOrders.is_renewal] || '暂无信息'}</Description>
              <Description term="发货时间"> {paymentTypeStatus[orderInfoData.userOrders.payment_type] || '未发货'}</Description>
            </DescriptionList>
            <Divider style={{ marginBottom: 32 }} />
            <DescriptionList size="large" title="订单信息" style={{ marginBottom: 32 }}>
              <Description term="订单编号"> 1000000023422933 </Description>
              <Description term="订单状态"> 待结算  </Description>
              <Description term="付款方式"> 微信支付 </Description>
              <Description term="收货人姓名"> 测试 </Description>
              <Description term="收货信息"> {orderInfoData.userOrders.remark || '12345678900 北京北京市东城区123'} </Description>
            </DescriptionList>
            <Divider style={{ marginBottom: 32 }} />
            <DescriptionList size="large" title="归还物流信息" style={{ marginBottom: 32 }}>
              <Description term="物流公司">{orderInfoData.userOrders.express_no || '顺丰快递'}</Description>
              <Description term="物流单号">123456</Description>
              <Description term="常用快递">菜鸟仓储</Description>
              <Description term="物流状态">{orderInfoData.userOrders.address_id || '已签收'}</Description>
              <Description term="物流信息"></Description>
              <div>
                <p>2222222</p>
                <p>2222222</p>
                <p>2222222</p>
                <p>2222222</p>
              </div>
            </DescriptionList>
            <Divider style={{ marginBottom: 32 }} />
            <DescriptionList size="large" title="时间信息" style={{ marginBottom: 32 }}>
              <Description term="支付时间">{orderInfoData.userOrders.payment_time}</Description>
              <Description term="发货时间">18100000000</Description>
              <Description term="成交时间">菜鸟仓储</Description>
              <Description term="租用时长">{orderInfoData.userOrders.rent_duration} 个月</Description>
              <Description term="起租时间">{orderInfoData.userOrders.rent_start}</Description>
              <Description term="退租时间">{orderInfoData.userOrders.unrent_time}</Description>
              <Description term="订单关闭时间">无</Description>
            </DescriptionList>
            <Divider style={{ marginBottom: 32 }} />
          </Card>
        </PageHeaderLayout>
      );
    }
  }
  render() {
    const { rule: { data }, loading } = this.props;
    const { selectedRows, modalVisible } = this.state;

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    const { orderList } = this.props;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    if (this.state.orderDetialIsVisible) {
      return this.renderDetail(orderInfoData);
    } else {
      return (
        <PageHeaderLayout title="查询表格">
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>
                {this.renderForm()}
              </div>
              <div className={styles.tableListOperator}>
                <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                  新建
                </Button>
                {
                  selectedRows.length > 0 && (
                    <span>
                      <Button>批量操作</Button>
                      <Dropdown overlay={menu}>
                        <Button>
                          更多操作 <Icon type="down" />
                        </Button>
                      </Dropdown>
                    </span>
                  )
                }
              </div>
              <StandardTable
                selectedRows={selectedRows}
                loading={loading}
                data={data}
                columns={columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
              />
            </div>
          </Card>
          <CreateForm
            {...parentMethods}
            modalVisible={modalVisible}
          />
        </PageHeaderLayout>
      );
    }
  }
}
