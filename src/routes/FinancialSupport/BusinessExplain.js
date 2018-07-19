import React, { PureComponent } from 'react';
import { Card, Badge, Table, Divider } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

export default class businessExplain extends PureComponent {
  render() {
    return (
      <PageHeaderLayout title="本业务说明">
        <Card bordered={false}>
          <div>
            <p>1、为保障每一位合作伙伴的正常商务运作，白租为您寻找优质资金渠道，并全力促成合作；
            </p>
            <p>2、白租是基于合作伙伴的基础，为有资金需求的商家进行作保；
            </p>
            <p>3、白租作为担保方，拥有对申请者的审核权限，但并不意味着，
              白租审核通过后能保证顺利完成资金合作；
            </p>
            <p>4、白租保证为商家提供的都是合法资金渠道，且不存在在本合作过程中收取任何费用；
            </p>
            <p>5、白租作为平台方，希望与各位合作愉快！</p>
            <p>6、如有疑问，请联系我们！</p>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
