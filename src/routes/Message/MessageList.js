import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Icon, Divider, Modal, Message, Table } from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../List/TableList.less';

const status = ['未读', '已读']; // 消息状态
const { confirm } = Modal;

@connect(({
  loading,
  messageList
}) => ({
  loading: loading.models.messageList,
  messageList,
}))

export default class MessageList extends PureComponent {
  state = {
    pageNumber: 1,
    pageSize: 10,
    isModalVisible: false,
    content: '',
    isShowMessage: false
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'messageList/fetch',
    });
  }

  // 消息中心
  columns = [
    {
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: '内容',
      dataIndex: 'content',
      render(val) {
        return <div dangerouslySetInnerHTML={{ __html: val }}></div>
      }
    },
    {
      title: '发布时间',
      dataIndex: 'sendTime',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render(val) {
        return status[val];
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (text, record) => (
        <div>
          <a><Icon type="eye-o" onClick={() => this.checkMessageDetail(record)} /></a>
          <Divider type="vertical" />
          <a><Icon type="delete" onClick={() => this.deleteMessage(record)} /></a>
        </div>
      ),
    },
  ];

  pageChange = (page) => {
    this.setState({
      pageNumber: page.current,
      pageSize: page.pageSize,
    });

    console.log("page", page)

    this.handleStandardTableChange(page.current, page.pageSize);
  }

  handleStandardTableChange = (page, rows) => {
    const { dispatch } = this.props;
    const params = {
      page: page,
      rows: rows
    };

    dispatch({
      type: 'messageList/fetch',
      payload: params,
    });
  }

  checkMessageDetail = (e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'messageList/checkmessage',
      payload: { id: e.id },
    });

    this.setState({
      isModalVisible: true,
      content: e.content,
    });
  }

  // 查看详情
  messageDetail = () => {
    return (
      <div>
        <Modal
          onOk={this.close.bind(this)}
          onCancel={this.close.bind(this)}
          visible={this.state.isModalVisible}
        >
          {this.state.content}
        </Modal>
      </div>
    );
  }

  // 删除消息
  deleteMessage = (e) => {
    const { dispatch } = this.props;
    confirm({
      title: '确定要删除吗?',
      okText: '确定',
      okCancel: '取消',
      onOk: () => {
        dispatch({
          type: 'messageList/deletemessage',
          payload: { id: e.id },
        });
        // 提示信息
        this.setState({
          isShowMessage: true,
        });
      },
      onCancel() {
      },
    });
  }

  showMeaasge = (e) => {
    if (this.state.isShowMessage) {
      if (e && e.code === 0) {
        Message.success('删除成功');
        this.props.dispatch({
          type: 'messageList/fetch',
        });
        this.setState({
          isShowMessage: false,
        });
      }
    }
  }

  close = () => {
    this.setState({
      isModalVisible: false,
    });

    this.props.dispatch({
      type: 'messageList/fetch',
    });
  }

  render() {
    const { loading } = this.props;
    const { messageList } = this.props;
    const { result } = messageList;
    console.log("messageList", messageList)
    return (
      <PageHeaderLayout title="消息中心">
        {this.messageDetail()}
        {this.showMeaasge(result)}
        <Card bordered={false}>
          <div className={styles.tableList}>
            <Table
              loading={loading}
              columns={this.columns}
              dataSource={messageList.data.list}
              pagination={messageList.data.pagination}
              onChange={this.pageChange.bind(this)}
              onShowSizeChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
