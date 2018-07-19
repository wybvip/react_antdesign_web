import React, { Component } from 'react';
import { connect } from 'dva';
import { Icon, Button, Divider, Table, Card, Modal } from 'antd';
import { routerRedux } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const { confirm } = Modal;

@connect(({ role, loading }) => ({
  role,
  loading: loading.models.role,
}))
export default class RoleList extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/fetchList',
      payload: { pageSize: 10, pageNumber: 1 },
    });
  }

  columns = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '角色描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '操作',
      dataIndex: 'opt',
      key: 'opt',
      render: (text, record) => {
        if (record.isBoss) return;
        return (
          <span>
            <a onClick={() => { this.editRole(record); }}>
              <Icon type="edit" style={{ fontSize: 16, color: '#08c' }} />
            </a>
            <Divider type="vertical" />
            <a onClick={() => { this.deleteRole(record); }}>
              <Icon type="delete" style={{ fontSize: 16, color: '#08c' }} />
            </a>
          </span>
        );
      },
    },
  ];

  addRole = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/admin/role_add/0'));
  }

  editRole = (record) => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: `/admin/role_add/${record.id}`,
    }));
  }

  deleteOne = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/delete',
      payload: { id: record.id },
    });
  }

  deleteRole = (record) => {
    const that = this;
    confirm({
      title: '确认删除这条信息？',
      content: '删除角色',
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
      type: 'role/fetchList',
      payload: params,
    });
  }

  render() {
    const { role: { data }, loading } = this.props;
    return (
      <PageHeaderLayout>
        <Card>
          <Button style={{ margin: 15 }} type="primary" onClick={this.addRole}>添加角色</Button>
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
