import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Tabs, Select, DatePicker, Button, Input, Icon, Divider, Modal } from 'antd';
import { routerRedux } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './TableList.less';
import StandardTable from '../../components/StandardTable';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const { TabPane } = Tabs;
const { Option } = Select;
const status = ['审核失效', '审核有效', '正在上架'];
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

const tabList = [
  {
    key: -1,
    tab: '全部商品',
  }, {
    key: 0,
    tab: '回收站',
  }, {
    key: 1,
    tab: '已上架商品',
  }, {
    key: 2,
    tab: '仓库中的商品',
  }, {
    key: 3,
    tab: '定时售卖的商品',
  }, {
    key: 4,
    tab: '预售的商品',
  }, {
    key: 5,
    tab: '限购的商品',
  },
];

@connect(({ productList, loading }) => ({
  productList,
  loading: loading.models.productList,
}))
@Form.create()
export default class SearchList extends Component {
  state = {
    formValues: '',
    startTime: '',
    endTime: '',
    selectCategorys: 'multiple',
    selectGroups: 'multiple',
    type: -1,
    visible: false,
    recoverVisible: false,
    confirmLoading: false,
    item: {},
    modalText: '',
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'productList/fetchGroups',
      payload: { parentId: 0 },
    });
    this.props.dispatch({
      type: 'productList/fetchCategories',
      payload: { id: '0' },
    });
    this.props.dispatch({
      type: 'productList/fetchProducts',
      payload: { pageSize: 10, pageNumber: 1 },
    });
  }

  columns = [
    {
      title: '主图',
      dataIndex: 'mainImage',
      key: 'mainImage',
      render: record => <img alt="" src={record} style={{ width: 80, height: 80 }} />,
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类目',
      dataIndex: 'categoryId',
      key: 'categoryId',
    },
    {
      title: '录入时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '审核状态',
      dataIndex: 'status',
      key: 'status',
      render(val) {
        return status[val];
      },
    },
    {
      title: '审核备注',
      dataIndex: 'auditRefuseReason',
      key: 'auditRefuseReason',
    },
    {
      title: '操作',
      dataIndex: 'opt',
      key: 'opt',
      render: (text, record) => (
        <span>
          <a onClick={() => { this.editGoodsList(record); }}>
            <Icon type="edit" style={{ fontSize: 16, color: '#08c' }} />
          </a>
          <Divider type="vertical" />
          <a onClick={() => { this.showModal(record); }}>
            <Icon type="delete" style={{ fontSize: 16, color: '#08c' }} />
          </a>
        </span>
      ),
    },
  ];

  showModal = (item) => {
    const modalText = (item.type === 0 ? '确认彻底删除吗' : '确认放入回收站吗 ');
    this.setState({
      ...this.state,
      visible: true,
      item,
      modalText,
    });
  }

  tableChange = (key) => {
    const { dispatch } = this.props;
    const intKey = parseInt(key, 0);
    this.setState({
      type: intKey,
    });
    const param = {
      pageNumber: 1,
      pageSize: 10,
    };
    if (intKey !== -1) {
      param.type = intKey;
    }
    dispatch({
      type: 'productList/fetchProducts',
      payload: param,
    });
  }

  selectDate = (date, dateString) => {
    if (dateString && dateString[0] && dateString[1]) {
      this.setState({
        startTime: dateString[0],
        endTime: dateString[1],
      });
    }
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    const param = {
      pageNumber: 1,
      pageSize: 10,
    };
    if (this.state.type !== -1) {
      param.type = this.state.type;
    }
    dispatch({
      type: 'productList/fetchProducts',
      payload: param,
    });
  }

  handleSearch = (e) => {
    if (e) e.preventDefault();

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
      const param = {
        ...values,
        startTime,
        endTime,
        pageSize: 10,
        pageNumber: 1,
      };
      if (this.state.type !== -1) {
        param.type = this.state.type;
      }
      dispatch({
        type: 'productList/fetchProducts',
        payload: param,
      });
    });
  }

  editGoodsList = (item) => {
    const { dispatch } = this.props;
    if (item.type === 0) {
      this.setState({
        ...this.state,
        recoverVisible: true,
        item,
      });
      return;
    }
    dispatch(routerRedux.push({
      pathname: `/product/add_new_product/${item.itemId}`,
    }));
  }

  handleModalCancel = () => {
    this.setState({
      ...this.state,
      visible: false,
    });
  }

  handleRecoverCancel = () => {
    this.setState({
      ...this.state,
      recoverVisible: false,
    });
  }

  handleModalOk = () => {
    const { dispatch } = this.props;
    const { item } = this.state;
    this.setState({
      ...this.state,
      visible: false,
    });
    if (item.type === 0) {
      dispatch({
        type: 'productList/deleteProduct',
        payload: { itemId: item.itemId },
        callback: () => {
          this.handleSearch();
        },
      });
    } else {
      dispatch({
        type: 'productList/remove',
        payload: { params: item },
        callback: () => {
          this.handleSearch();
        },
      });
    }
    this.handleSearch();
  }

  handleRecoverOk = () => {
    const { item } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'productList/recoverProduct',
      payload: { itemId: item.itemId },
      callback: () => {
        this.handleSearch();
      },
    });
    this.setState({
      ...this.state,
      recoverVisible: false,
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues, type } = this.state;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      pageNumber: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (type !== -1) {
      params.type = type;
    }
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'productList/fetchProducts',
      payload: params,
    });
  }

  addProduct = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/product/add_new_product/0'));
  }

  renderRecoverModal = () => {
    const { recoverVisible } = this.state;
    return (
      <Modal
        title="恢复商品"
        visible={recoverVisible}
        onOk={this.handleRecoverOk}
        onCancel={this.handleRecoverCancel}
      >
        <p>确认恢复商品吗？</p>
      </Modal>
    );
  }

  renderSimpleForm = () => {
    const {
      getFieldDecorator,
    } = this.props.form;
    const { groups, categories } = this.props.productList;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="选择分类">
              {getFieldDecorator('groupIds')(
                <Select style={{ width: '100%' }} mode={this.state.selectGroups} onChange={this.changeGroups} >
                  {groups.map((e) => {
                    return (
                      <Option key={e.id} value={e.id}>{e.groupName}</Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="选择类目">
              {getFieldDecorator('categoryIds')(
                <Select style={{ width: '100%' }} mode={this.state.selectCategorys} onChange={this.changeCategorys} >
                  {categories.map((e) => {
                    return (
                      <Option key={e.id} value={e.id}>{e.name}</Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="录入时间">
              <RangePicker onChange={this.selectDate} />
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="商品名称">
              {getFieldDecorator('name')(
                <Input />
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

  renderTable = () => {
    const { productList, loading } = this.props;
    return (
      <Tabs defaultActiveKey="-1" onChange={this.tableChange}>
        {tabList.map((e) => {
          return (
            <TabPane tab={e.tab} key={e.key}>
              <StandardTable
                rowKey={e.key}
                loading={loading}
                data={productList.data}
                columns={this.columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
              />
            </TabPane>
          );
        }
        )}
      </Tabs>
    );
  }

  render() {
    const { visible, confirmLoading, modalText } = this.state;
    return (
      <PageHeaderLayout
        title="商品列表"
      >
        <Modal
          title="删除商品"
          visible={visible}
          onOk={this.handleModalOk}
          confirmLoading={confirmLoading}
          onCancel={this.handleModalCancel}
        >
          <p>{modalText}</p>
        </Modal>
        {this.renderRecoverModal()}
        <Card>
          <Button style={{ margin: 15 }} type="primary" onClick={this.addProduct}>添加商品</Button>
        </Card>
        <Card>
          <div className={styles.tableListForm}>
            {this.renderSimpleForm()}
          </div>
          <div>
            {this.renderTable()}
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
