import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Button, Message, Input, Cascader } from 'antd';
import { routerRedux } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const { TextArea } = Input;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    span: 21,
  },
};

@connect(({
  loading,
  giveBack,
  findDistrict,
}) => ({
  loading: loading.models.giveBack,
  giveBack,
  findDistrict,
}))

@Form.create()
export default class GivebackAdd extends PureComponent {
  state = {
    data: '',
    showMessage: false,
  };

  componentWillMount() {
    const { query } = this.props.location;
    const { dispatch } = this.props;
    dispatch({
      type: 'findDistrict/fetch',
      payload: { type: 3 },
    });
    if (!query) return null;
    else if (query && query.type === 'edit') {
      const { data } = query;
      this.setState({
        id: data.id,
        data,
      });
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'findDistrict/fetch',
    });
  }

  showMessage = (e) => {
    const { showMessage } = this.state;
    if (!showMessage) return null;
    else if (showMessage && e && e.message !== 'user not login') {
      if (e && e.code === 0) {
        Message.success('操作成功');
        this.props.dispatch(routerRedux.push({
          pathname: '/product/giveback',
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
        const { address } = values;
        newValue = {
          ...newValue,
          id: this.state.id,
          provinceId: address[0],
          cityId: address[1],
          areaId: address[2],
        };
        dispatch({
          type: 'giveBack/add',
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
        pathname: '/product/giveback',
      })
    );
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    const stateEditInfo = this.state.data;
    const defaultDistrictValue =
      [stateEditInfo.provinceId, stateEditInfo.cityId, stateEditInfo.areaId];
    const { giveBack: { updateMessage } } = this.props;
    const { findDistrict: { district: { data } } } = this.props;
    return (
      <PageHeaderLayout title="归还地址">
        {this.showMessage(updateMessage)}
        <Form onSubmit={this.handleOk} style={{ margin: 15 }} >
          <FormItem
            {...formItemLayout}
            label={(
              <span>
                收货人姓名
              </span>
            )}
          >
            {getFieldDecorator('name', {
              rules: [{ required: true, message: 'Please input your name!', whitespace: true }],
              initialValue: stateEditInfo.name ? stateEditInfo.name : '',
            })(
              <Input style={{ width: 190 }} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={(
              <span>
                收货地址
              </span>
            )}
          >
            {getFieldDecorator('address', {
              rules: [{ required: true, message: 'Please input your address!' }],
              initialValue: defaultDistrictValue || [],
            })(
              <Cascader
                style={{ width: 390, marginRight: 10 }}
                options={data}
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={(
              <span>
                详细地址
              </span>
            )}
          >
            {getFieldDecorator('street', {
              rules: [{ required: true, message: 'Please input your address!', whitespace: true }],
              initialValue: stateEditInfo.street ? stateEditInfo.street : '',
            })(
              <TextArea rows={4} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={(
              <span>
                邮政编码
              </span>
            )}
          >
            {getFieldDecorator('zcode', {
              rules: [{ required: false, message: 'Please input your zcode!', whitespace: true }],
              initialValue: stateEditInfo.zcode ? stateEditInfo.zcode : '',
            })(
              <Input type="number" style={{ width: 190 }} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={(
              <span>
                手机号码
              </span>
            )}
          >
            {getFieldDecorator('telephone', {
              rules: [{ required: true, message: 'Please input your telephone!', whitespace: true }],
              initialValue: stateEditInfo.telephone ? stateEditInfo.telephone : '',
            })(
              <Input type="number" style={{ width: 190 }} />
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
