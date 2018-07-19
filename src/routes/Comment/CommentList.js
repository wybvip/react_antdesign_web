import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Icon, Tabs, Table } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../List/TableList.less';

const { TabPane } = Tabs;

// 评论列表
const columns = [{
  title: '评论内容',
  dataIndex: 'content',
  key: 'content',
}, {
  title: '商品名称',
  dataIndex: 'productName',
  key: 'productName',
}, {
  title: '买家昵称',
  dataIndex: 'nickName',
  key: 'nickName',
}, {
  title: '评论时间',
  dataIndex: 'createTime',
  key: 'createTime',
}];

@connect(({
  commentList,
  loading,
  login,
}) => ({
  commentList,
  loading: loading.models.commentList,
  login,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
  };

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'commentList/fetch',
    });
  }

  pageChange = (page) => {
    this.handleStandardTableChange(page.current, page.pageSize, this.state.sort);
  }

  handleStandardTableChange = (page, rows, sorts) => {
    const params = {
      page,
      rows,
      sort: sorts,
    };

    this.props.dispatch({
      type: 'commentList/fetch',
      payload: params,
    });
  }

  changeTab = (activeKey) => {
    this.props.dispatch({
      type: 'commentList/fetch',
      payload: {
        sort: activeKey,
        page: 1,
        rows: 10,
      },
    });

    this.setState({
      sort: activeKey,
    });
  }

  renderSimpleForm() {
    let {
      commentList: {
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
    return (
      <Tabs onChange={this.changeTab}>
        <TabPane tab={<span><Icon type="home" />全部</span>} key="null">
          <Table
            columns={columns}
            loading={loading}
            dataSource={data.list}
            pagination={data.pagination}
            onChange={this.pageChange.bind(this)}
            onShowSizeChange={this.handleStandardTableChange}
          />
        </TabPane>
        <TabPane tab={<span><Icon type="like" />好评</span>} key="1">
          <Table
            columns={columns}
            loading={loading}
            dataSource={data.list}
            pagination={data.pagination}
            onChange={this.pageChange.bind(this)}
            onShowSizeChange={this.handleStandardTableChange}
          />
        </TabPane>
        <TabPane tab={<span><Icon type="like-o" />中评</span>} key="2">
          <Table
            columns={columns}
            loading={loading}
            dataSource={data.list}
            pagination={data.pagination}
            onChange={this.pageChange.bind(this)}
            onShowSizeChange={this.handleStandardTableChange}
          />
        </TabPane>
        <TabPane tab={<span><Icon type="dislike" />差评</span>} key="3">
          <Table
            columns={columns}
            loading={loading}
            dataSource={data.list}
            pagination={data.pagination}
            onChange={this.pageChange.bind(this)}
            onShowSizeChange={this.handleStandardTableChange}
          />
        </TabPane>
      </Tabs>
    );
  }

  renderForm() {
    return this.renderSimpleForm();
  }
  render() {
    return (
      <PageHeaderLayout title="评论列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            {this.renderSimpleForm()}
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
