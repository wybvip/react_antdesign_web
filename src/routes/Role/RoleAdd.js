import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Input, Button, Card, Table } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ loading, menus, role, routing }) => ({
  submitting: loading.effects['role/add'] || loading.effects['role/update'],
  loading: loading.models.menu,
  menus,
  role,
  routing,
}))
@Form.create()
export default class RoleAdd extends PureComponent {
  state = {
    selectedRowKeys: [],
  };

  componentDidMount() {
    const { dispatch, match: { params: { id } } } = this.props;
    if (id !== '0') {
      dispatch({
        type: 'role/fetchRoleDetail',
        payload: { id },
      });
    }
    dispatch({
      type: 'menus/fetchList',
    });
  }

  componentWillReceiveProps(nextProps) {
    const rows = nextProps.role.roleDetail.pages.map((e) => { return e.pageId; });
    this.handleSelectRows(rows);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const rows = this.state.selectedRowKeys.map((id) => { return { id }; });
        const val = { ...values, adminPages: rows };
        const { dispatch, match: { params: { id } }, role } = this.props;
        if (id !== '0') {
          const { name, description } = val;
          const { isBoss, shopId } = role.roleDetail.role;
          const roleInfo = { id: role.roleDetail.role.id, name, description, shopId, isBoss };
          dispatch({
            type: 'role/update',
            payload: { role: roleInfo, adminPages: rows },
          });
        } else {
          dispatch({
            type: 'role/add',
            payload: val,
          });
        }
      }
    });
  }

  handleSelectRows = (rows) => {
    this.setState({
      selectedRowKeys: rows,
    });
  }

  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/admin/role'));
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
      type: 'menus/fetchList',
      payload: params,
    });
  }

  columns = [
    {
      title: '页面名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '页面描述',
      dataIndex: 'description',
      key: 'description',
    },
  ];

  render() {
    const { submitting, loading, menus, role } = this.props;
    const { selectedRowKeys } = this.state;
    const { getFieldDecorator } = this.props.form;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleSelectRows,
    };

    return (
      <PageHeaderLayout title="添加角色">
        <Card>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ marginTop: 8 }}
          >
            <FormItem
              label="角色名称："
            >
              {getFieldDecorator('name', {
                rules: [{
                  required: true, message: '请输入标题',
                }],
                initialValue: role.roleDetail.role.name,
              })(
                <Input placeholder="给目标起个名字" />
              )}
            </FormItem>
            <FormItem
              label="角色描述："
            >
              {getFieldDecorator('description', {
                rules: [{
                  required: true, message: '请输入角色描述',
                }],
                initialValue: role.roleDetail.role.description,
              })(
                <TextArea placeholder="请输入角色描述" style={{ minHeight: 32 }} rows={4} />
              )}
            </FormItem>
          </Form>
          <Table
            rowSelection={rowSelection}
            rowKey={record => record.id}
            loading={loading}
            dataSource={menus.data.list}
            pagination={menus.data.pagination}
            columns={this.columns}
            onChange={this.handleStandardTableChange}
          />
          <Button type="primary" onClick={this.handleSubmit} loading={submitting}>
            提交
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={this.handleCancel}>取消</Button>
        </Card>
      </PageHeaderLayout>
    );
  }
}
