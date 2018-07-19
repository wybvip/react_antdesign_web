import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, Modal, Table, message, Badge, InputNumber } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import StandardFormRow from '../../components/StandardFormRow';
import styles from './table.less';

const { confirm } = Modal;
const FormItem = Form.Item;
const { TextArea } = Input;
const statusMap = ['default', 'processing', 'success', 'error', 'default', 'processing'];
const status = ['审核拒绝', '审核中', '审核成功'];


@connect(({ services, loading }) => ({
  services,
  loading: loading.models.services,
}))
@Form.create()
export default class Services extends PureComponent {
  state = {
    addServicesVisible: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const param = {
    };
    dispatch({
      type: 'services/queryServicesList',
      payload: param,
    });
  }

  columns = [
    {
      title: '服务名称',
      dataIndex: 'name',
    },
    {
      title: '服务价格',
      dataIndex: 'price',
    },
    {
      title: '服务内容',
      dataIndex: 'content',
      width: 300,
    },
    {
      title: '审核状态',
      dataIndex: 'approvalStatus',
      filters: [
        {
          text: status[1],
          value: 0,
        },
        {
          text: status[2],
          value: 1,
        },
        {
          text: status[3],
          value: 2,
        },
      ],
      render(val) {
        return <Badge status={statusMap[val]} text={status[val]} />;
      },
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.showDeleteConfirm(record)}>删除</a>
        </Fragment>
      ),
    },
  ];


  showDeleteConfirm = (record) => {
    const that = this;
    const { id } = record;
    confirm({
      title: '确认删除这条信息？',
      content: '增值服务',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        that.deleteConfirm(id);
      },
      onCancel() {
      },
    });
  }

  deleteConfirm = (id) => {
    this.props.dispatch({
      type: 'services/deleteServices',
      payload: {
        id,
      },
    }).then(() => {
      const code = this.props.services.data.delCode;
      if (code === 0) {
        // 弹出消息框  添加成功
        message.success('删除增值服务成功！', 2.5);
        this.props.dispatch({
          type: 'services/queryServicesList',
          payload: {},
        });
      } else {
        message.error('删除增值服务失败！', 2.5);
      }
    });
  }

  checkAccount(rule, value, callback) {
    var re = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;

   if (re.test(value)) {
       callback();
   } else {
       callback('输入小数两位以内的正确金额');
   }
};

  handleClickAdd = () => {
    this.setState({
      addServicesVisible: true,
    });
  }

  handleClickBackList = () => {
    this.setState({
      addServicesVisible: false,
    });
    this.props.dispatch({
      type: 'services/queryServicesList',
      payload: {},
    });
  }

  handleSubmit = (e) => {
    if (e) e.preventDefault();
    const { dispatch } = this.props;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'services/addServices',
          payload: {
            values,
          },
        }).then(() => {
          const code = this.props.services.data.addCode;
          const Message = this.props.services.data.addMessage;
          if (code === 0) {
            // 弹出消息框  添加成功
            message.success('添加增值服务成功！', 2.5);
            this.setState({
              addServicesVisible: false,
            });
            this.props.dispatch({
              type: 'services/queryServicesList',
              payload: {},
            });
          } else {
            // 弹出消息框，添加失败
            message.error(Message, 2.5);
          }
        });
      }
    });
  }

  renderTable() {
    const { list } = this.props.services.data;
    return (
      <PageHeaderLayout title="增值服务" content="所有的增值服务信息展示在下方" >
        <Card bordered={false}>
          <Form layout="inline" onSubmit={this.handleSearch} loading={this.props.loading}>
            <StandardFormRow loading={this.props.loading}  grid last>
              <Row gutter={16}>
                <Col>
                  <Button type="primary" onClick={this.handleClickAdd}>
                    新增增值服务
                  </Button>
                </Col>
              </Row>
            </StandardFormRow>
          </Form>
        </Card>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <Table
              columns={this.columns}
              dataSource={list}
              onChange={this.handleTableChange}
              loading={this.props.loading}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }

  renderForm() {
    const { loading } = this.props;
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    return (
      <PageHeaderLayout
        title="添加增值服务"
        content="将增值服务信息填入输入框，请填写正确信息"
      >
        <Card bordered={false} loading={this.props.loading}>
          <Form
            onSubmit={e => this.handleSubmit(e)}
            hideRequiredMark
            loading={this.props.loading}
            style={{ marginTop: 8 }}
          >
            <FormItem {...formItemLayout} label="增值服务名称">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入增值服务名称',
                  },
                ],
              })(<Input placeholder="请输入增值服务的名称" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="增值服务价格">
              {getFieldDecorator('price', {
                rules: [
                  {
                    required: true,
                    message: '请输入增值服务价格',
                  },
                ],
              })(<InputNumber style={{width : '100%'}} placeholder="请输增值服务的价格" addonAfter="元" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="增值服务内容">
              {getFieldDecorator('content', {
                rules: [
                  {
                    required: true,
                    message: '请输入增值服务内容',
                  },
                ],

              })(<TextArea placeholder="请输入增值服务的内容信息" autosize={{ minRows: 2, maxRows: 6 }} />)}
            </FormItem>

            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
              <Button
                style={{ marginLeft: 8 }}
                onClick={this.handleClickBackList}
              >
                返回
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }

  render() {
    const { addServicesVisible } = this.state;
    if (addServicesVisible) {
      return this.renderForm();
    } else {
      return this.renderTable();
    }
  }
}
