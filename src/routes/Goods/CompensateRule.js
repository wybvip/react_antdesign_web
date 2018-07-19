import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Icon, Button, Divider, Message, Table, Modal } from 'antd';
import { routerRedux } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../List/TableList.less';

const { confirm } = Modal;

@connect(({
  loading,
  login,
  compensateRule,
}) => ({
  loading: loading.models.compensateRule,
  login,
  compensateRule,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    expandForm: false,
    startTime: '',
    endTime: '',
    pageSize: 10,
    current: 1,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'compensateRule/fetch',
    });
  }

  columns = [{
    title: '名称',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: '创建时间',
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

  // 修改模版
  editGoodsList = (info) => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/product/compensate_rule_add',
      query: {
        type: 'edit',
        id: info.id,
      },
    }));
  }

  reload = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'compensateRule/fetch',
    });
  }

  // 删除模版
  deleteGoodsList = (info) => {
    const { dispatch } = this.props;
    const that = this;
    confirm({
      title: '删除',
      content: '确定删除该模版吗',
      onOk: () => {
        dispatch({
          type: 'compensateRule/delete', // 删除
          payload: {
            id: info.id,
          },
          callback: (response) => {
            const { code } = response;
            if (code === 0) Message.success('操作成功');
            else Message.error('操作失败，请重试');
            that.reload();
          },
        });
      },
      onCancel() {},
    });
  }

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
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
      type: 'compensateRule/fetch',
      payload: params,
    });
  }

  addTemplate = () => {
    this.props.dispatch(routerRedux.push({
      pathname: '/product/compensate_rule_add',
      query: {
        type: 'add',
      },
    }));
  }


  renderSimpleForm() {
    let {
      compensateRule: {
        data,
      },
    } = this.props;
    const { loading } = this.props;
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
        <Table
          columns={this.columns}
          dataSource={data.list}
          loading={loading}
          pagination={data.pagination}
          onChange={this.pageChange.bind(this)}
          onShowSizeChange={this.handleStandardTableChange}
        />
      </Form>
    );
  }

  render() {
    return (
      <PageHeaderLayout title="赔偿规则模版">
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
