import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Icon, Button, Divider, Message, Table, Modal } from 'antd';
import { routerRedux } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../List/TableList.less';


const { confirm } = Modal;
let editInfo = {
  provinceId: '',
  cityId: '',
  areaId: '',
};
//  const status = ['关闭', '运行中', '已上线', '异常'];

@connect(({
  orderIncome,
  loading,
  login,
  goodsDetial,
  rule,
  giveBack,
  findDistrict,
}) => ({
  orderIncome,
  loading: loading.models.giveBack,
  login,
  goodsDetial,
  rule,
  giveBack,
  findDistrict,
}))
@Form.create()

export default class GiveBack extends PureComponent {
  state = {
    editInfo: {},
    messageVisible: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'giveBack/fetch',
    });
    dispatch({
      type: 'findDistrict/fetch',
    });
  }


  onFirstChange = (value) => {
    this.setState({
      editInfo: {
        ...editInfo,
        provinceId: value,
        cityId: '请选择',
        cityName: '请选择',
        areaId: '请选择',
        areaName: '请选择',
      },
    });
    this.props.dispatch({
      type: 'findDistrict/fetch',
      payload: {
        parentId: value,
        status: 2,
        firstParent: this.props.findDistrict.cityInfo.data.firstParent,
      },
    });
  }
  onSecondChange = (value) => {
    this.setState({
      editInfo: {
        ...editInfo,
        provinceId: this.state.editInfo.provinceId,
        cityId: value,
        areaId: '请选择',
        areaName: '请选择',
      },
    });
    this.props.dispatch({
      type: 'findDistrict/fetch',
      payload: {
        parentId: value,
        status: 3,
        firstParent: this.props.findDistrict.cityInfo.data.firstParent,
        secondParent: this.props.findDistrict.cityInfo.data.secondParent,
      },
    });
  }
  onThirdChange = (value) => {
    this.setState({
      editInfo: {
        ...editInfo,
        provinceId: this.state.editInfo.provinceId,
        cityId: this.state.editInfo.cityId,
        areaId: value,
      },
    });
  }
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
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

      dispatch({
        type: 'orderIncome/fetch',
        payload: {
          ...values,
          startTime,
          endTime,
          pageSize,
          current,
        },
      });
    });
  }

  pageChange = (page) => {
    this.setState({
      pageSize: page.pageSize,
      current: page.current,
    });
    this.handleStandardTableChange(page.current, page.pageSize);
  }
  handleStandardTableChange = (current, size) => {
    const params = {
      pageSize: size,
      pageNumber: current,
    };
    this.props.dispatch({
      type: 'giveBack/fetch',
      payload: params,
    });
  }

  addTemplate = () => {
    editInfo = '';
    this.props.dispatch(routerRedux.push({
      pathname: '/product/giveback_add',
      query: {
        type: 'add',
      },
    }));
  }

  // 删除模版
  deleteGoodsList = (info) => {
    const { dispatch } = this.props;
    const that = this;
    confirm({
      title: '删除',
      content: '确定删除该模版吗',
      onOk() {
        dispatch({
          type: 'giveBack/delete', // 删除
          payload: {
            id: info.id,
          },
        });
        that.setState({
          messageVisible: true,
        });
      },
      onCancel() { },
    });
  }
  // 修改模版
  editGoodsList = (info) => {
    editInfo = info;
    this.props.dispatch(routerRedux.push({
      pathname: '/product/giveback_add',
      query: {
        type: 'edit',
        data: info,
      },
    }));
  }

  // 消息展示
  sendMessage = (e) => {
    if (this.state.messageVisible && e) {
      if (e && e.success === true) Message.success(e.message);
      else if (e && e.success !== true) Message.error(e.message);
      this.props.dispatch({
        type: 'giveBack/fetch',
      });
      this.setState({
        messageVisible: false,
      });
    }
  }

  columns = [{
    title: '手机号码',
    dataIndex: 'telephone',
    key: 'telephone',
  }, {
    title: '收货地址',
    dataIndex: 'address',
    key: 'address',
  }, {
    title: '收货人姓名',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: '邮编',
    dataIndex: 'zcode',
    key: 'zcode',
  }, {
    title: '添加时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
  }, {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    render: (text, record) => (
      <span>
        <a onClick={() => this.editGoodsList(record)}>
          <Icon type="edit" style={{ fontSize: 16, color: '#08c' }} />
        </a>
        <Divider type="vertical" />
        <a onClick={() => this.deleteGoodsList(record)}>
          <Icon type="delete" style={{ fontSize: 16, color: '#08c' }} />
        </a>
      </span>
    ),
  }];

  renderSimpleForm() {
    let {
      giveBack: {
        data,
      },
    } = this.props;
    const { loading } = this.props;
    if (data) {
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
    } else {
      data = {
        list: [],
        pagination: {},
      };
    }
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Table
          columns={this.columns}
          loading={loading}
          dataSource={data.list}
          pagination={data.pagination}
          onChange={this.pageChange.bind(this)}
          onShowSizeChange={this.handleStandardTableChange}
        />
      </Form>
    );
  }

  render() {
    const { giveBack: { updateMessage } } = this.props;
    return (
      <PageHeaderLayout title="归还地址">
        {this.sendMessage(updateMessage)}
        <Button style={{ margin: 15 }} type="primary" onClick={this.addTemplate}>添加模版</Button>
        <Card bordered={false}>
          <div className={styles.tableList}>
            {this.renderSimpleForm()}
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
