import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {  Route } from 'dva/router';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown,
  Menu, InputNumber, DatePicker, Modal,Table, message, Badge, Divider } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';


import styles from './table.less';
import ApplicationRecordDatail from './ApplicationRecordDatail';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const statusMap = ['default', 'processing', 'success', 'error', 'default', 'processing'];
const status = ['暂存', '申请中', '已通过', '拒绝', '驳回', '撤回'];
@connect(({ financialsupport, loading }) => ({
  financialsupport,
  loading: loading.models.financialsupport,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    columns: [
      {
        title: 'ID',
        dataIndex: 'appId',
      },
      {
        title: '申请时间',
        dataIndex: 'applyStart',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '申请额度',
        dataIndex: 'applyLimit',
      },
      {
        title: '申请结果',
        dataIndex: 'applyStatus',
        filters: [
          {
            text: status[1],
            value: 1,
          },
          {
            text: status[2],
            value: 2,
          },
          {
            text: status[3],
            value: 3,
          },
          {
            text: status[4],
            value: 4,
          },
          {
            text: status[5],
            value: 5,
          },
        ],
        render(val) {
          return <Badge status={statusMap[val]} text={status[val]} />;
        },
      },
      {
        title: '审核时间',
        dataIndex: 'applyCheckStart',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '审核理由',
        dataIndex: 'checkReason',
        width: 300,
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.handleModalVisible(record)}>详情</a>
          </Fragment>
        ),
      },
    ]
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const param = {
      pageNumber: 1,
      pageSize: 10,
      adminId: 'fb4d359032720d2c3f72b37aa3d9058b53862e23',
    };
    dispatch({
      type: 'financialsupport/fetchFindList',
      payload: param,
    });
  }

  handleModalVisible(record) {
    const { dispatch } = this.props;
    const param = {
      appId: record.appId,
    };
    this.props.history.push({
      pathname: '/financialsupport/ApplicationRecordDatail/' + param.appId,
      state: { record },
    });
  }

  render() {
    const { financialsupport: { data: { list } }, loading } = this.props;
    const { selectedRows, modalVisible } = this.state;
    return (
      <PageHeaderLayout title="申请记录">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <Table
              columns={this.state.columns}
              dataSource={list}
              pagination={this.state.pagination}
              loading={loading}
              onChange={this.handleTableChange}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
