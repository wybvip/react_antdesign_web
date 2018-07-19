import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Input, Button, Popover, Card, Progress, Select, Radio } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Register.less';

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;

const passwordStatusMap = {

  ok: <div className={styles.success}>强度：强</div>,
  pass: <div className={styles.warning}>强度：中</div>,
  poor: <div className={styles.error}>强度：太短</div>,
};

const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

@connect(({ loading, users }) => ({
  submitting: loading.effects['users/add'] || loading.effects['users/update'],
  loading: loading.models.menu,
  users,
}))
@Form.create()
export default class UserAdd extends PureComponent {
  state = {
    visible: false,
    PopconfirmPlacement: 'right',
    formWidth: 400,
    help: '',
  };

  componentWillMount() {
    this.changeLayout();
  }

  componentDidMount() {
    const { dispatch, match: { params: { id } } } = this.props;
    if (id !== '0') {
      dispatch({
        type: 'users/fetchDetail',
        payload: { id },
      });
      dispatch({
        type: 'users/fetchAllRole',
      });
    } else {
      dispatch({
        type: 'users/fetchAllRole',
      });
    }
  }

  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  changeLayout = () => {
    const documwntOffetWidth = document.querySelector('body').offsetWidth;
    if (documwntOffetWidth < 748) {
      this.setState({
        PopconfirmPlacement: 'top',
      });
    }
  }

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不匹配!');
    } else {
      callback();
    }
  };

  checkPassword = (rule, value, callback) => {
    if (!value) {
      this.setState({
        help: '请输入密码！',
        visible: !!value,
      });
      callback('error');
    } else {
      this.setState({
        help: '',
      });
      if (!this.state.visible) {
        this.setState({
          visible: !!value,
        });
      }
      if (value.length < 6) {
        callback('error');
      } else {
        const { form } = this.props;
        if (value && this.state.confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
      }
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { dispatch, match: { params: { id } } } = this.props;
        if (id !== '0') {
          const adminInfo = { id, ...values };
          dispatch({
            type: 'users/update',
            payload: { adminInfo },
          });
        } else {
          dispatch({
            type: 'users/add',
            payload: { adminInfo: values },
          });
        }
      }
    });
  }

  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/admin/employee'));
  }

  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  render() {
    const { submitting, users } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <PageHeaderLayout title="添加管理员">
        <Card>
          <Form style={{ width: this.state.formWidth }} onSubmit={this.handleSubmit}>
            <FormItem>
              {getFieldDecorator('roleId')(
                <Select
                  size="large"
                >
                  {users.roles.map((e) => {
                    return (<Option key={e.id} value={e.id}>{e.name}</Option>);
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('telephone', {
                rules: [
                  {
                    required: true,
                    message: '请输入手机号！',
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: '手机号格式错误！',
                  },
                ],
                initialValue: users.detail.telephone,
              })(
                <Input
                  size="large"
                  placeholder="11位手机号"
                />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('email', {
                rules: [
                  {
                    required: true,
                    message: '请输入邮箱地址！',
                  },
                  {
                    type: 'email',
                    message: '邮箱地址格式错误！',
                  },
                ],
                initialValue: users.detail.email,
              })(<Input size="large" placeholder="邮箱" />)}
            </FormItem>
            <FormItem>
              {getFieldDecorator('realname', {
                rules: [
                  {
                    required: true,
                    message: '请输入真实姓名',
                  },
                ],
                initialValue: users.detail.realname,
              })(<Input size="large" placeholder="请输入真实姓名" />)}
            </FormItem>
            <FormItem>
              {getFieldDecorator('nick', {
                rules: [
                  {
                    required: true,
                    message: '请输入昵称',
                  },
                ],
                initialValue: users.detail.nick,
              })(<Input size="large" placeholder="请输入昵称" />)}
            </FormItem>
            <FormItem help={this.state.help}>
              <Popover
                content={
                  <div style={{ padding: '4px 0' }}>
                    {passwordStatusMap[this.getPasswordStatus()]}
                    {this.renderPasswordProgress()}
                    <div style={{ marginTop: 10 }}>
                      请至少输入 6 个字符。请不要使用容易被猜到的密码。
                    </div>
                  </div>
                }
                overlayStyle={{ width: 240 }}
                placement={this.state.PopconfirmPlacement}
                visible={this.state.visible}
              >
                {getFieldDecorator('password', {
                  rules: [
                    {
                      validator: this.checkPassword,
                    },
                  ],
                })(
                  <Input
                    size="large"
                    type="password"
                    placeholder="至少6位密码，区分大小写"
                    onBlur={this.cancel}
                  />
                )}
              </Popover>
            </FormItem>
            <FormItem>
              {getFieldDecorator('confirm', {
                rules: [
                  {
                    required: true,
                    message: '请确认密码！',
                  },
                  {
                    validator: this.checkConfirm,
                  },
                ],
              })(<Input size="large" type="password" placeholder="确认密码" />)}
            </FormItem>
            <FormItem>
              {getFieldDecorator('enabled')(
                <RadioGroup>
                  <Radio key="a" value={1}>正常</Radio>
                  <Radio key="b" value={0}>禁用</Radio>
                </RadioGroup>)}
            </FormItem>
            <FormItem>
              <Button
                size="large"
                loading={submitting}
                className={styles.submit}
                type="primary"
                htmlType="submit"
              >
                保存
              </Button>
              <Button
                size="large"
                style={{ marginLeft: 10 }}
                className={styles.submit}
                onClick={this.handleCancel}
              >
                取消
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
