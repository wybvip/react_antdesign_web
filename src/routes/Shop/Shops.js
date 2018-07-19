import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Card,
  Icon,
  List,
  Tooltip,
  Button,
  Input,
  Cascader,
  message,
  Popconfirm,
  Divider,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Shops.less';
import options from './area.js';

const FormItem = Form.Item;

@Form.create()
@connect(({ shop, loading }) => ({
  shop,
  loading: loading.models.shop,
}))
export default class Shops extends PureComponent {
  state = {
    addShopVisible: false,
    editShopVisible: false,
    fromEditValues: {},
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'shop/queryShops',
      payload: {},
    });
  }

  handleClickAdd = () => {
    this.setState({
      addShopVisible: true,
    });
  };

  handleClickBackList = () => {
    this.setState({
      addShopVisible: false,
    });
    this.props.dispatch({
      type: 'shop/queryShops',
      payload: {},
    });
  };

  handleSearch = (e) => {
    if (e) e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'shop/selectByName',
          payload: {
            queryName: values.queryName,
          },
        });
      }
    });
  }

  deleteConfirm = (e) => {
    if (e) {
      this.props
        .dispatch({
          type: 'shop/deleteShop',
          payload: {
            id: e,
          },
        })
        .then(() => {
          const code = this.props.shop.data.delCode;
          if (code === 0) {
            // 弹出消息框  添加成功
            message.success('删除自提点成功！', 2.5);

            this.setState({
              addShopVisible: false,
            });
            this.props.dispatch({
              type: 'shop/queryShops',
              payload: {},
            });
          } else {
            message.error('删除自提点失败！', 2.5);

            this.setState({
              addShopVisible: false,
            });
          }
        });
    }
  };

  handleSubmit(e) {
    if (e) e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (this.state.editShopVisible) {
          this.props.dispatch({
            type: 'shop/editShop',
            payload: {
              values,
              id: this.state.fromEditValues.id,
            },
          }).then(() => {
            const code = this.props.shop.data.editCode;
            if (code === 0) {
              // 弹出消息框  添加成功
              message.success('添加自提点成功！', 2.5);

              this.setState({
                addShopVisible: false,
              });
              this.props.dispatch({
                type: 'shop/queryShops',
                payload: {},
              });
            } else {
              // 弹出消息框，添加失败
              message.error('添加自提点失败！', 2.5);
            }
          });
        } else {
          this.props.dispatch({
            type: 'shop/addShop',
            payload: values,
          }).then(() => {
            const code = this.props.shop.data.addCode;
            if (code === 0) {
              // 弹出消息框  添加成功
              message.success('添加自提点成功！', 2.5);

              this.setState({
                addShopVisible: false,
              });
              this.props.dispatch({
                type: 'shop/queryShops',
                payload: {},
              });
            } else {
              // 弹出消息框，添加失败
              message.error('添加自提点失败！', 2.5);
            }
          });
        }
      }
    });
  }

  handleEditPage = (id) => {
    if (id) {
      this.props.dispatch({
        type: 'shop/queryShopById',
        payload: {
          id,
        },
      }).then(() => {
        this.setState({
          addShopVisible: true,
          editShopVisible: true,
          fromEditValues: this.props.shop.data.shopData,
        });
      });
    }
  };

  renderAdd() {
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

    const { shopData } = this.props.shop.data;

    return (
      <PageHeaderLayout
        title="添加自提点"
        content="将自提点信息填入输入框，请填写正确信息"
      >
        <Card bordered={false}>
          <Form
            onSubmit={e => this.handleSubmit(e)}
            hideRequiredMark
            style={{ marginTop: 8 }}
          >
            <FormItem {...formItemLayout} label="门店编号">
              {getFieldDecorator('number', {
                initialValue: shopData ? shopData.number : '',
                rules: [
                  {
                    required: true,
                    message: '请输入门店编号',
                  },
                ],
              })(<Input placeholder="门店编号为数字且最长支持20位字符" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="门店名称">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入门店名称',
                  },
                ],
                initialValue: shopData ? shopData.name : '',
              })(<Input placeholder="门店名称最长支持20位字符" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="联系电话">
              {getFieldDecorator('phone', {
                rules: [
                  {
                    required: true,
                    message: '请输入联系电话',
                  },
                ],
                initialValue: shopData ? shopData.phone : '',
              })(<Input placeholder="请输入联系电话" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="营业时间">
              {getFieldDecorator('workTime', {
                rules: [
                  {
                    required: true,
                    message: '请输入营业时间',
                  },
                ],
                initialValue: shopData ? shopData.workTime : '',
              })(<Input placeholder="请输入营业时间，如09:00-18:00" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="所属区域">
              {getFieldDecorator('areaAdd', {
                rules: [
                  {
                    required: true,
                    message: '请选择所属区域',
                  },
                ],
                initialValue: shopData ? shopData.areaAdd : '',
              })(<Cascader options={options} defaultValue={shopData ? shopData.areaAdd : ''} onChange={this.areaChange} />)}
            </FormItem>

            <FormItem {...formItemLayout} label="街道地址">
              {getFieldDecorator('street', {
                rules: [
                  {
                    required: true,
                    message: '请输入详细地址',
                  },
                ],
                initialValue: shopData ? shopData.street : '',
              })(<Input placeholder="请输入补充详细地址，如XX街XX号" />)}
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

  renderList() {
    const ShopList = this.props.shop.data.list;
    const { getFieldDecorator } = this.props.form;

    return (
      <PageHeaderLayout
        title="自提点列表"
        content="店铺所有的自提点信息展示在下方"
      >
        <div className={styles.filterCardList}>
          <Card bordered={false}>
            <Button type="primary" onClick={this.handleClickAdd}>
              新增自提点
            </Button>
            <Divider />
            <Form layout="inline" onSubmit={this.handleSearch}>
              <FormItem label="名称">
                {getFieldDecorator('queryName')(
                  <Input placeholder="请输入自提点名称" />
                )}
              </FormItem>
              <FormItem>
                <Button type="common" htmlType="submit" >
                  查询
                </Button>
              </FormItem>
            </Form>
          </Card>
          <List
            rowKey="id"
            style={{ marginTop: 24 }}
            grid={{ gutter: 24, xl: 2, lg: 3, md: 3, sm: 2, xs: 1 }}
            dataSource={ShopList}
            loading={this.props.loading}
            renderItem={item => (
              <List.Item key={item.id}>
                <Card
                  hoverable
                  bodyStyle={{ paddingBottom: 20 }}
                  actions={[
                    <Tooltip title="编辑">
                      <Icon
                        type="edit"
                        onClick={() => {
                          this.handleEditPage(item.id);
                        }}
                      />
                    </Tooltip>,
                    <Tooltip title="删除">
                      <Popconfirm
                        title="确认删除该自提点吗?"
                        onConfirm={() => {
                          this.deleteConfirm(item.id);
                        }}
                        onCancel={this.deleteCancel}
                        okText="确认"
                        cancelText="取消"
                      >
                        <Icon type="delete" />
                      </Popconfirm>
                    </Tooltip>,

                  ]}
                >
                  <Card.Meta title={item.name} />
                  <div>
                    <img id="mapImage" alt="" className="mapImage" src={`http://api.map.baidu.com/staticimage/v2?ak=4IU3oIAMpZhfWZsMu7xzqBBAf6vMHcoa&center=${item.longitude},${item.latitude}&width=300&height=200&zoom=15`} style={{ width: '400px', height: '200px' }} />
                    <div className="dataContent">
                      <div className="no">门店编号 : {item.number}</div>
                      <div className="address">
                        详细地址 : {item.provinceStr}
                        {item.cityStr}
                        {item.areaStr}
                        {item.street}
                      </div>
                      <div className="phone">联系电话 : {item.phone}</div>
                      <div className="workTime">营业时间 : {item.workTime}</div>
                    </div>
                  </div>
                </Card>
              </List.Item>
            )}
          />
        </div>
      </PageHeaderLayout>
    );
  }

  render() {
    if (this.state.addShopVisible) {
      return this.renderAdd();
    } else if (this.state.shopListVisible) {
      return this.renderList();
    } else {
      return this.renderList();
    }
  }
}
