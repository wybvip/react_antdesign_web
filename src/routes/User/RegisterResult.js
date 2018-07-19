import React from 'react';
import { Button } from 'antd';
import { Link } from 'dva/router';
import Result from '../../components/Result';
import styles from './RegisterResult.less';

const actions = (
  <div className={styles.actions}>
    <Link to="/"><Button size="large">返回首页</Button></Link>
  </div>
);

export default () => (
  <Result
    className={styles.registerResult}
    type="success"
    title={
      <div className={styles.title}>
        你已成功注册商家平台，请登陆后提交相关信息进行审核
      </div>
    }
    actions={actions}
    style={{ marginTop: 56 }}
  />
);
