import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Form, Card, Select, List, Button, Icon, Row, Col } from 'antd';


import AvatarList from '../../components/AvatarList';
import styles from './Projects.less';


/* eslint react/no-array-index-key: 0 */
@Form.create()
@connect(({ list, loading, shopList}) => ({
  list,
  loading: loading.models.list,
  shopList,
}))
export default class CoverCardList extends PureComponent {
  // componentDidMount() {
  //   this.props.dispatch({
  //     type: 'list/fetch',
  //     payload: {
  //       count: 8,
  //     },
  //   });
  // }
  componentDidMount() {
    this.props.dispatch({
      type: 'shopList/fetch',
    });
  }

  handleFormSubmit = () => {
    const { form, dispatch } = this.props;
    // setTimeout 用于保证获取表单值是在所有表单字段更新完毕的时候
    setTimeout(() => {
      form.validateFields((err) => {
        if (!err) {
          // eslint-disable-next-line
          dispatch({
            type: 'list/fetch',
            payload: {
              count: 8,
            },
          });
        }
      });
    }, 0);
  }

  render() {
    const { loading, form, shopList: { data } } = this.props;
    const { getFieldDecorator } = form;
    const {list} = data;
    console.log('list', data, this.props);
    const cardList = list ? (
      <List
        rowKey="id"
        loading={loading}
        grid={{ gutter: 24, lg: 4, md: 3, sm: 2, xs: 1 }}
        dataSource={list}
        renderItem={item => (
          <List.Item>
            <Row gutter={{ md: 12, lg: 24, xl: 48 }}>
              <Col sm={24}>
                <Card
                  className={styles.card}
                  hoverable
                  cover={<img alt={item.street} src={item.cover} height={154} />}
                  actions={[<Icon type="setting" />, <Icon type="edit" />]}
                >
                  <Card.Meta
                    title={<a href="#">{item.street}</a>}
                    description={`更新日期:${item.updatedAt}`}
                  />
                  <div className={styles.cardItemContent}>
                    <span>{moment(item.updatedAt).fromNow()}</span>
                    <span>联系电话: {item.phone}</span>   
                  </div>
                  <div className={styles.cardItemContent}>
                    <span>门店编号: {item.number}</span>
                    <span>营业时间: {item.workTime}</span>
                  </div>
                </Card>
              </Col>
            </Row>
          </List.Item>
        )}
      />
    ) : null;

    const formItemLayout = {
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    return (
      <div className={styles.coverCardList}>
        <Button type="primary" style={{ marginLeft: 8 }} >添加自提点</Button>
        <div className={styles.cardList}>
          {cardList}
        </div>
      </div>
    );
  }
}
