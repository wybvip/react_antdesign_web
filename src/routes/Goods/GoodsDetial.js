import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Icon, Button, Divider, Message, Table, Modal } from 'antd';
import { routerRedux } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../List/TableList.less';

const { confirm } = Modal;


@connect(({
  loading,
  goodsDetial,
}) => ({
  loading: loading.models.goodsDetial,
  goodsDetial,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    pageSize: 10,
    current: 1,
    showMessage: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'goodsDetial/fetch',
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
      pathname: '/product/template_add',
      query: {
        type: 'edit',
        id: info.id,
      },
    }));
  }

  // 删除模版
  deleteGoodsList = (info) => {
    const { dispatch } = this.props;
    confirm({
      title: '删除',
      content: '确定删除该模版吗',
      onOk: () => {
        dispatch({
          type: 'goodsDetial/delete', // 删除
          payload: {
            id: info.id,
          },
        });
        this.setState({
          showMessage: true,
        });
      },
      onCancel() { },
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
    const { dispatch } = this.props;
    const params = {
      pageSize: size,
      pageNumber: current,
    };
    dispatch({
      type: 'goodsDetial/fetch',
      payload: params,
    });
  }

  addTemplate = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/product/template_add',
      query: {
        type: 'add',
      },
    }));
  }

  showMessage = (e) => {
    const { showMessage } = this.state;
    const { dispatch } = this.props;
    if (!showMessage) return null;
    else if (showMessage && e && e.message !== 'user not login') {
      if (e && e.code === 0) {
        Message.success('操作成功');
      } else if (e && e.code === -1) {
        Message.error('操作失败，请重试 ');
      }
      this.setState({
        showMessage: false,
      });
      dispatch({
        type: 'goodsDetial/fetch',
      });
    }
  }
  renderSimpleForm() {
    let {
      goodsDetial: {
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
      <div>
        <Table
          columns={this.columns}
          dataSource={data.list}
          loading={loading}
          pagination={data.pagination}
          onChange={this.pageChange.bind(this)}
          onShowSizeChange={this.handleStandardTableChange}
        />
      </div>
    );
  }

  render() {
    const { goodsDetial } = this.props;
    let updateMessage;
    if (goodsDetial && goodsDetial.updateMessage) {
      const newUpdateMessage = goodsDetial.updateMessage;
      updateMessage = newUpdateMessage;
    }
    return (
      <PageHeaderLayout title="商品详情模版">
        {this.showMessage(updateMessage)}
        <Button style={{ margin: 15 }} type="primary" onClick={this.addTemplate}>
          添加模版
        </Button>
        <Card bordered={false}>
          <div className={styles.tableList}>
            {this.renderSimpleForm()}
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
