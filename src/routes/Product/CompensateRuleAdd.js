import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Button, Message, Input } from 'antd';
import { routerRedux } from 'dva/router';
import Test from '../../components/edit';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';


const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    span: 21,
  },
};
const uploadProps = [];
@connect(({
  loading,
  compensateRule,
}) => ({
  loading: loading.models.compensateRule,
  compensateRule,
}))
@Form.create()
export default class CompensateRuleAdd extends PureComponent {
  state = {
    htmlContent: '',
    id: -1,
    type: 'add',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { query } = this.props.location;
    if (!query) return null;
    else if (query.type === 'edit') {
      const { id } = query;
      dispatch({
        type: 'compensateRule/templateDetailById',
        payload: {
          id,
        },
      });
      this.setType(id, 'edit');
    }
  }

  setType = (id, type) => {
    this.setState({
      id,
      type,
    });
  }

  receiveHtml = (e) => {
    this.setState({
      htmlContent: e,
    });
  }

  showMessage = (e) => {
    const { showMessage } = this.state;
    if (!showMessage) return null;
    else if (showMessage && e && e.message !== 'user not login') {
      if (e && e.code === 0) {
        Message.success('操作成功');
        this.props.dispatch(routerRedux.push({
          pathname: '/product/compensate_rule',
        }));
      } else if (e && e.code === -1) {
        Message.error('操作失败，请重试 ');
      }
      this.setState({
        showMessage: false,
      });
    }
  }
  handleOk = () => {
    const { dispatch } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let newValue = values;
        newValue = {
          ...newValue,
          id: this.state.id,
          content: this.state.htmlContent,
        };
        const { type } = this.state;
        dispatch({
          type: `compensateRule/${type}`,
          payload: newValue,
        });
        this.setState({
          showMessage: true,
        });
      }
    });
  }
  handleCancel = () => {
    this.props.dispatch(
      routerRedux.push({
        pathname: '/product/compensate_rule',
      })
    );
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { orderInfoData } = this.props.compensateRule;
    let htmlContent = '';
    let name;
    if (orderInfoData && orderInfoData.code === 0 && orderInfoData.data !== {}) {
      const { data } = orderInfoData;
      const names = data.name;
      htmlContent = data.content;
      name = names;
    }
    const updateInfo = this.props.compensateRule.updateMessage;
    return (
      <PageHeaderLayout title="添加赔偿规则模版">
        {this.showMessage(updateInfo)}
        <Form onSubmit={this.handleOk}>
          <FormItem
            {...formItemLayout}
            label={(
              <span>
                模板名称
              </span>
            )}
          >
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入模板名称!', whitespace: true }],
              initialValue: name || '',
            })(
              <Input placeholder="请输入模板名称" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={(
              <span>
                商品详情
              </span>
            )}
          >
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入模板名称!', whitespace: true }],
            })(
              <Test
                htmlContent={htmlContent}
                cbReceiver={this.receiveHtml}
                uploadProps={uploadProps}
              />
            )}
          </FormItem>
          <FormItem>
            <Button style={{ margin: 15 }} type="primary" onClick={this.handleOk}>完成</Button>
            <Button style={{ margin: 15 }} type="primary" onClick={this.handleCancel}>取消</Button>
          </FormItem>
        </Form>
      </PageHeaderLayout>
    );
  }
}
