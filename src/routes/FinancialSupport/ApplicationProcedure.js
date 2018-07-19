import React, { PureComponent } from 'react';
import { Form, Input, Card, Badge, Table, Divider,
  Upload, Icon, message } from 'antd';

import imagsrc from '../../../images/finacation_pro.png';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

export default class applicationproceduce extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      src: this.props.src ? this.props.src : '',
    };
  }
  render() {
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div>
            <img src={imagsrc} alt="申请流程" />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
