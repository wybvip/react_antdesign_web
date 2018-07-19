import React, { Component } from 'react';
import { connect } from 'dva';
import { Icon, Button, Divider, Table, Card, Modal } from 'antd';
import { routerRedux } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const { confirm } = Modal;

@connect(({ users, loading }) => ({
  users,
  loading: loading.models.users,
}))
export default class RoleList extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'users/fetchList',
      payload: { pageSize: 10, pageNumber: 1 },
    });
  }

  columns = [
    {
      title: '姓名',
      dataIndex: 'realName',
      key: 'realName',
    },
    {
      title: '账号',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: '昵称',
      dataIndex: 'nick',
      key: 'nick',
    },
    {
      title: '最后登录时间',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
    },
    {
      title: '最后登录ip',
      dataIndex: 'lastIp',
      key: 'lastIp',
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
    },
    {
      title: '操作',
      dataIndex: 'opt',
      key: 'opt',
      render: (text, record) => {
        return (
          <span>
            <a onClick={() => { this.editEmployee(record); }}>
              <Icon type="edit" style={{ fontSize: 16, color: '#08c' }} />
            </a>
            <Divider type="vertical" />
            <a onClick={() => { this.deleteEmployee(record); }}>
              <Icon type="delete" style={{ fontSize: 16, color: '#08c' }} />
            </a>
          </span>
        );
      },
    },
  ];

  addEmployee = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/admin/employee_add/0'));
  }

  editEmployee = (record) => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: `/admin/employee_add/${record.id}`,
    }));
  }

  deleteEmployee = (record) => {
    const that = this;
    confirm({
      title: '确认删除这条信息？',
      content: '删除人员',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        that.deleteOne(record);
      },
      onCancel() {
      },
    });
  }

  deleteOne = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'users/delete',
      payload: { id: record.id },
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const params = {
      pageNumber: pagination.current,
      pageSize: pagination.pageSize,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'users/fetchList',
      payload: params,
    });
  }

  render() {
    const { users: { data }, loading } = this.props;
    return (
      <PageHeaderLayout>
        <Card>
          <Button style={{ margin: 15 }} type="primary" onClick={this.addEmployee}>添加管理员</Button>
          <Table
            rowKey={record => record.id}
            columns={this.columns}
            loading={loading}
            dataSource={data.list}
            onChange={this.handleStandardTableChange}
            pagination={data.pagination}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
