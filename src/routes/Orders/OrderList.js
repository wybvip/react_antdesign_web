import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Icon, Button, DatePicker, Modal, Table } from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from '../../components/DescriptionList';
import styles from '../List/TableList.less';

const { Description } = DescriptionList;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const paymentForm = ['支付宝', '微信', '信用借还', '其他', '其他'];// 支付方式
const logisticForm = ['快递发货', '上门上门', '门店自提'];// 发货方式
const logisticalStatus = ['没有物流信息', '已揽收', '在途中', '已签收', '问题件'];// 物流信息
// 订单状态
const status = {
  USER_CANCELED_CLOSED: '用户取消订单',
  WAITING_PAYMENT: '待支付',
  JH_CREATED: '待支付',
  ALREADY_FREEZE: '已冻结',
  USER_OVERTIME_PAYMENT_CLOSED: '用户超时支付关闭订单',
  USER_DELETE_ORDER: '用户删除订单',
  PLATFORM_CLOSE_ORDER: '平台关闭订单',
  BUSINESS_CLOSE_ORDER: '商家关闭订单',
  WAITING_BUSINESS_DELIVERY: '待商家发货',
  WAITING_USER_RECEIVE_CONFIRM: '待用户确认收货',
  WAITING_BUSINESS_CONFIRM_RETURN_REFUND: '待商家确认退货退款',
  BUSINESS_REFUSED_RETURN_REFUND: '商家拒绝退货退款',
  WAITING_USER_RETURN: '待退货',
  WAITING_REFUND: '待退款',
  WAITING_BUSINESS_RECEIVE_CONFIRM: '待商家确认收货',
  REFUND_SUCCESS: '退款成功',
  WAITING_GIVE_BACK: '租用中',
  GIVING_BACK: '归还中',
  WAITING_SETTLEMENT: '待结算',
  WAITING_CONFIRM_SETTLEMENT: '待确认结算',
  WAITING_SETTLEMENT_PAYMENT: '待结算后的待支付',
  SETTLEMENT_WITHOUT_PAYMENT_OVERTIME_AUTOCONFIRM: '自动确认结算',
  SETTLEMENT_WITH_PAYMENT_OVERTIME: '结算支付超时',
  WAITING_EVALUATION: '待评价',
  ALREADY_EVALUATION: '已评价',
  // 续租
  RENEWALING: '续租中',
  RENEWAL_WAITING_BUSINESS_CONFIRM: '续租待商家确认',
  RENEWAL_REFUSED: '商家拒绝续租请求',
  RENEWAL_WAITING_PAYMENT: '续租待支付',
  RENEWAL_USER_CANCELD_CLOSED: '用户取消续租支付',
  RENEWAL_USER_OVERTIME_PAYMENT_CLOSED: '用户超时支付续租订单',
  RENEWAL_PAYMENT_SUCCESS: '续租支付完成',
  SALEIN_REFUND_WAITING_BISUNIESS_CONFIRM: '申请退款待商家确认',
  SALEIN_REFUND_REFUSED: '商家已拒绝退款申请',
  PLATFORM_INTERVENTION: '小二介入中',
  RENEWAL_USER_CANCEL_REQUEST: '用户取消续租',
  // 结算状态
  NOT_YET_PRINT: '未出结算单',
  ALREADY_PRINT: '已出结算单',
  WAITING_CONFIRM: '结算单等待用户确认',
  COMPLETE: '完成结算单',
  RC_REVIEW: '风控审核中',
  RC_REJECT: '风控拒绝',
  PENALTY_WAITING_SETTLEMENT: '违约金待结算中',
  WAITING_BUCKLE_SETTLEMENT: '代扣结算中',
  ORDER_FINISH: '订单完成',
};

@connect(({ loading, orderList }) => ({
  loading: loading.models.orderList,
  orderList,
}))
@Form.create()

export default class OrderList extends PureComponent {
  state = {
    isModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    startTime: '',
    endTime: '',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'orderList/fetch',
    });
  }

  // 订单列表
  columns = [
    {
      title: '订单编号',
      dataIndex: 'orderId',
    },
    {
      title: '下单时间',
      dataIndex: 'createdAt',
    },
    {
      title: '商品名称',
      dataIndex: 'productName',
    },
    {
      title: '单价',
      dataIndex: 'rent',
    },
    {
      title: '数量',
      dataIndex: 'amount',
    },
    {
      title: '买家昵称',
      dataIndex: 'nickName',
    },
    {
      title: '支付方式',
      dataIndex: 'paymentForm',
      render(val) {
        return paymentForm[val];
      },
    },
    {
      title: '实付款',
      dataIndex: 'totalRent',
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      render(val) {
        return status[val];
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (text, record) => (
        <a><Icon type="eye-o" onClick={() => this.checkOrderDetail(record)} /></a>
      ),
    },
  ];

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      page: pagination.current,
      rows: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'orderList/fetch',
      payload: params,
    });
  }

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
  }

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  }

  checkOrderDetail = (e) => {
    const { dispatch } = this.props;
    this.setState({
      isModalVisible: true,
    });
    const { orderId } = e;

    dispatch({
      type: 'orderList/detail',
      payload: {
        orderId,
      },
    });
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

      const { startTime, endTime } = this.state;
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'orderList/fetch',
        payload: {
          ...values,
          startTime,
          endTime,
        },
      });
    });
  }

  changeDate = (date, dateString) => {
    this.setState({
      startTime: dateString[0],
      endTime: dateString[1],
    });
  }

  close = () => {
    this.setState({
      isModalVisible: false,
    });
  }

  orderDetail = () => {
    const { orderList: { orderdetail } } = this.props;
    const {
      orderData,
      productData,
      rentStartTime,
      rentEndTime,
      expressResult,
      item,
      address,
      express,
      cash,
    } = orderdetail;


    console.log("productData",productData)

    const { amount } = item;
    const premiumDays = orderData.premium_days;

    // 订单详情--------------
    const oneDs = [{
      productName: productData.name,
      rent: cash.rent,
      amount,
      rentDuration: orderData.rent_duration,
      premiumMsg: `${premiumDays}*${amount}`,
      totalPremium: cash.total_premium,
      totalRent: cash.total_rent,
    }];
    const oneCs = [{
      title: '商品名称',
      dataIndex: 'productName',
    }, {
      title: '单价',
      dataIndex: 'rent',
    }, {
      title: '数量',
      dataIndex: 'amount',
    }, {
      title: '租用天数',
      dataIndex: 'rentDuration',
    }, {
      title: '溢价信息',
      dataIndex: 'premiumMsg',
    }, {
      title: '溢价总价',
      dataIndex: 'totalPremium',
    }, {
      title: '总租金',
      dataIndex: 'totalRent',
    }];
    // 订单详情总押金/元、押金减免金额/元、实付押金/元--------------
    const twoDs = [{
      totalRent: cash.total_rent,
      depositReduction: cash.deposit_reduction,
      deposit: cash.deposit,
    }];
    const twoCs = [{
      title: '总押金',
      dataIndex: 'totalRent',
    }, {
      title: '押金减免金额',
      dataIndex: 'depositReduction',
    }, {
      title: '实付押金',
      dataIndex: 'deposit',
    }];
    // 总租金/元 实付押金/元 运费/元 店铺优惠/元 平台优惠/元 订单总金额/元 状态
    const threeDs = [{
      totalRent: cash.total_rent,
      deposit: cash.deposit,
      freightPrice: cash.freight_price,
      depositReduction: cash.deposit_reduction,
      platformCouponReduction: cash.platform_coupon_reduction,
      total: cash.total,
      status: orderData.status,
    }];

    const threeCs = [{
      title: '总租金',
      dataIndex: 'totalRent',
    }, {
      title: '实付押金',
      dataIndex: 'deposit',
    }, {
      title: '运费',
      dataIndex: 'freightPrice',
    }, {
      title: '店铺优惠/',
      dataIndex: 'depositReduction',
    }, {
      title: '平台优惠',
      dataIndex: 'platformCouponReduction',
    }, {
      title: '订单总金额',
      dataIndex: 'total',
    }, {
      title: '状态',
      dataIndex: 'status',
      render(val) {
        return status[val];
      },
    }];


    return (
      <div>
        <Modal
          width={1000}
          visible={this.state.isModalVisible}
          onOk={this.close}
          destroyOnClose
          onCancel={this.close}
        >
          <DescriptionList size="large" title="订单详细" style={{ marginBottom: 32 }}>
            <Description term="商品名称">{productData.name ? productData.name : ''}</Description>
            <Description term="发货方式">{logisticForm[orderData.logistic_form]}</Description>
            <Description term="租用时间">{rentStartTime}至{rentEndTime}</Description>
            <Description term="下单时间">{orderData.created_at}</Description>
            <Description term="付款时间">{orderData.payment_time ? orderData.payment_time : '未付款'}</Description>
            <Description term="发货时间">{orderData.delivery_time ? orderData.delivery_time : '未发货'}</Description>
          </DescriptionList>
          <DescriptionList size="large" title="订单信息" style={{ marginBottom: 32 }}>
            <Description term="订单编号">{orderData.order_id}</Description>
            <Description term="订单状态">{status[orderData.status]}</Description>
            <Description term="付款方式">{paymentForm[orderData.payment_form]}</Description>
            <Description term="收货人姓名">{address.realname}</Description>
            <Description term="收货信息">{address.street}</Description>
          </DescriptionList>
          <DescriptionList size="large" title="发货物流信息" style={{ marginBottom: 32 }}>
            <Description term="物流公司">{express !== {} ? express.name : ''}</Description>
            <Description term="物流单号">{orderData.express_no ? orderData.express_no : ''}</Description>
            <Description term="物流状态">{expressResult !== undefined ? logisticalStatus[expressResult.State] : ''}</Description>
            <Description term="物流跟踪">{expressResult !== undefined ? expressResult.Traces : ''}</Description>
          </DescriptionList>
          <DescriptionList size="large" title="订单详情" style={{ marginBottom: 32 }}>
            <Table pagination={false} dataSource={oneDs} columns={oneCs} />
            <Table pagination={false} dataSource={twoDs} columns={twoCs} />
            <Table pagination={false} dataSource={threeDs} columns={threeCs} />
          </DescriptionList>
        </Modal>
      </div>
    );
  }

  renderForm() {
    return this.renderSimpleForm();
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="订单编号">
              {getFieldDecorator('orderId')(
                <Input placeholder="请输入订单编号" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="商品名称">
              {getFieldDecorator('productName')(
                <Input placeholder="请输入商品名称" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="订单状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择订单状态" mode="multiple" style={{ width: '100%' }}>
                  <Option value="USER_CANCELED_CLOSED">用户取消订单</Option>
                  <Option value="WAITING_PAYMENT">待支付</Option>
                  <Option value="JH_CREATED">待支付</Option>
                  <Option value="USER_OVERTIME_PAYMENT_CLOSED">用户超时支付关闭订单</Option>
                  <Option value="USER_DELETE_ORDER">用户删除订单</Option>
                  <Option value="PLATFORM_CLOSE_ORDER">平台关闭订单</Option>
                  <Option value="BUSINESS_CLOSE_ORDER">商家关闭订单</Option>
                  <Option value="WAITING_BUSINESS_DELIVERY">待商家发货</Option>
                  <Option value="WAITING_USER_RECEIVE_CONFIRM">待用户确认收货</Option>
                  <Option value="WAITING_BUSINESS_CONFIRM_RETURN_REFUND">待商家确认退货退款</Option>
                  <Option value="BUSINESS_REFUSED_RETURN_REFUND">商家拒绝退货退款</Option>
                  <Option value="WAITING_USER_RETURN">待退货</Option>
                  <Option value="WAITING_REFUND">待退款</Option>
                  <Option value="WAITING_BUSINESS_RECEIVE_CONFIRM">待商家确认收货</Option>
                  <Option value="REFUND_SUCCESS">退款成功</Option>
                  <Option value="WAITING_GIVE_BACK">租用中</Option>
                  <Option value="GIVING_BACK">归还中</Option>
                  <Option value="WAITING_SETTLEMENT">待结算</Option>
                  <Option value="WAITING_CONFIRM_SETTLEMENT">待确认结算</Option>
                  <Option value="WAITING_SETTLEMENT_PAYMENT">待结算后的待支付</Option>
                  <Option value="SETTLEMENT_WITHOUT_PAYMENT_OVERTIME_AUTOCONFIRM">自动确认结算</Option>
                  <Option value="SETTLEMENT_WITH_PAYMENT_OVERTIME">结算支付超时</Option>
                  <Option value="WAITING_EVALUATION">待评价</Option>
                  <Option value="ALREADY_EVALUATION">已评价</Option>
                  <Option value="RENEWALING">续租中</Option>
                  <Option value="RENEWAL_WAITING_BUSINESS_CONFIRM">续租待商家确认</Option>
                  <Option value="RENEWAL_REFUSED">商家拒绝续租请求</Option>
                  <Option value="RENEWAL_WAITING_PAYMENT">续租待支付</Option>
                  <Option value="RENEWAL_USER_CANCELD_CLOSED">用户取消续租支付</Option>
                  <Option value="RENEWAL_USER_OVERTIME_PAYMENT_CLOSED">用户超时支付续租订单</Option>
                  <Option value="RENEWAL_PAYMENT_SUCCESS">续租支付完成</Option>
                  <Option value="SALEIN_REFUND_WAITING_BISUNIESS_CONFIRM">申请退款待商家确认</Option>
                  <Option value="SALEIN_REFUND_REFUSED">商家已拒绝退款申请</Option>
                  <Option value="PLATFORM_INTERVENTION">小二介入中</Option>
                  <Option value="RENEWAL_USER_CANCEL_REQUEST">用户取消续租</Option>
                  <Option value="NOT_YET_PRINT">未出结算单</Option>
                  <Option value="ALREADY_PRINT">已出结算单</Option>
                  <Option value="WAITING_CONFIRM">结算单等待用户确认</Option>
                  <Option value="COMPLETE">完成结算单</Option>
                  <Option value="RC_REVIEW">风控审核中</Option>
                  <Option value="RC_REJECT">风控拒绝</Option>
                  <Option value="PENALTY_WAITING_SETTLEMENT">违约金待结算中</Option>
                  <Option value="WAITING_BUCKLE_SETTLEMENT">代扣结算中</Option>
                  <Option value="ORDER_FINISH">订单完成</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="支付方式">
              {getFieldDecorator('paymentForm')(
                <Select placeholder="请选择支付方式" style={{ width: '100%' }}>
                  <Option value="0">支付宝</Option>
                  <Option value="1">微信支付</Option>
                  <Option value="2">信用借还</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="收货人姓名">
              {getFieldDecorator('consigneeName')(
                <Input placeholder="请输入收货人姓名" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="收货人手机号">
              {getFieldDecorator('consigneeNumber')(
                <Input placeholder="请输入收货人手机号" />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="下单日期">
              <RangePicker onChange={this.changeDate} style={{ width: '100%' }} />
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="物流方式">
              {getFieldDecorator('logisticForm')(
                <Select placeholder="请选择物流方式" style={{ width: '100%' }}>
                  <Option value="0">快递</Option>
                  <Option value="1">上门</Option>
                  <Option value="2">自提</Option>
                </Select>
              )}
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

  render() {
    const { loading } = this.props;
    const { selectedRows } = this.state;
    const { orderList } = this.props;

    return (
      <PageHeaderLayout title="订单列表">
        {this.orderDetail()}
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={orderList.data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
