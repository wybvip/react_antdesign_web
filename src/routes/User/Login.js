import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Form, Checkbox, Alert, Row, Col, Input } from 'antd';
import Login from '../../components/Login';
import styles from './Login.less';
import Configure from '../../conf/configure';
import VerifyCodecd from '../../components/ImageCode';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
@Form.create()
export default class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.freshCode = this.freshCode.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
  }

  state = {
    type: 'userLogin',
    autoLogin: true,
    imgCode: '',
    userName: localStorage.getItem('userName') ? localStorage.getItem('userName') : '',
    password: localStorage.getItem('password') ? localStorage.getItem('password') : '',
    mobile: localStorage.getItem('mobile') ? localStorage.getItem('mobile') : '',
  }

  onTabChange = (type) => {
    this.setState({ type });
    this.freshCode();
  }

  onGetCaptcha = () => {
    const code = this.state.imgCode;
    const { mobile } = this.state;
    this.props.dispatch({
      type: 'login/mobileCode',
      payload: {
        mobile,
        code,
        type: 'login',
      },
    });
  }

  freshCode() {
    this.setState({ src: Configure.getImageCode() });
  }

  handleRefresh(e) {
    e.preventDefault();
    this.freshCode();
  }

  handleSubmit = (err, values) => {
    const { type, autoLogin } = this.state;
    // 是否勾选记住密码
    if (autoLogin) {
      if (values.userName && values.userName !== 'undefined') {
        localStorage.setItem('userName', values.userName);
      }

      if (values.password && values.password !== 'undefined') {
        localStorage.setItem('password', values.password);
      }

      if (values.mobile && values.mobile !== 'undefined') {
        localStorage.setItem('mobile', values.mobile);
      }
    } else {
      localStorage.setItem('userName', '');
      localStorage.setItem('password', '');
      localStorage.setItem('mobile', '');
    }

    const newValue = { ...values, code: this.state.imgCode };
    if (!err) {
      this.props.dispatch({
        type: 'login/login',
        payload: {
          ...newValue,
          type,
        },
      });
    }
  }


  saveCode = (e) => {
    this.setState({
      imgCode: e.target.value,
    });
  }

  changeAutoLogin = (e) => {
    this.setState({
      autoLogin: e.target.checked,
    });
  }

  changeMobile = (e) => {
    this.setState({
      mobile: e.target.value,
    });
  }

  renderMessage = (content) => {
    return (
      <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
    );
  }

  renderLoginMessage(login) {
    if (!login.code) return;
    if (login.code !== 0) {
      if (!login.message || login.message == null) {
        return this.renderMessage('未知异常');
      }
      return this.renderMessage(login.message);
    }
  }

  render() {
    const { login, submitting } = this.props;
    const { type } = this.state;
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
        >
          <Tab key="userLogin" tab="账户密码登录">
            {
              this.renderLoginMessage(login)
            }
            <UserName name="userName" defaultValue={this.state.userName} placeholder="邮箱" />

            <Row gutter={8} style={{ marginBottom: 24 }}>
              <Col span={16}>
                <Input
                  size="large"
                  placeholder="图形验证码"
                  onChange={this.saveCode}
                />
              </Col>
              <Col span={8}>
                <VerifyCodecd onClick={this.handleRefresh} src={this.state.src} />
              </Col>
            </Row>
            <Password name="password" defaultValue={this.state.password} placeholder="密码" />
          </Tab>
          <Tab key="smsLogin" tab="手机号登录">
            {
              this.renderLoginMessage(login)
            }
            <Mobile name="mobile" defaultValue={this.state.mobile} onChange={this.changeMobile} />
            <Row gutter={8} style={{ marginBottom: 24 }}>
              <Col span={16}>
                <Input
                  size="large"
                  placeholder="图形验证码"
                  onBlur={this.saveCode}
                />
              </Col>
              <Col span={8}>
                <VerifyCodecd onClick={this.handleRefresh} src={this.state.src} />
              </Col>
            </Row>
            <Captcha name="captcha" onGetCaptcha={this.onGetCaptcha} />
          </Tab>
          <div>
            <Checkbox checked={this.state.autoLogin} onChange={this.changeAutoLogin}>保存密码</Checkbox>
            <Link style={{ float: 'right' }} to="/user/forget">忘记密码</Link>
          </div>
          <Submit loading={submitting}>登录</Submit>
          <div className={styles.other}>
            <Link className={styles.register} to="/user/register">注册账户</Link>
          </div>
        </Login>
      </div>
    );
  }
}
