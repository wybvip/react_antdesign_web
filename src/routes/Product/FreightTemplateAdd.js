import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Radio, Card, Button, Message } from 'antd';
import { routerRedux } from 'dva/router';
import ExpressCard from '../../components/ExpressCard';
import DoorFreightCard from '../../components/DoorFreightCard';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const RadioGroup = Radio.Group;
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
  findDistrict,
  freightTemplate,
  loading,
}) => ({
  findDistrict,
  freightTemplate,
  loading: loading.models.freightTemplate,
}))

@Form.create()
export default class FreightTemplateAdd extends PureComponent {
  state = {
    data: [],
    aroundType: 0, // 快递范围---全国默认值
    expressType: 0, // 模版类型---快递运费模版默认值
    aroundValue: [{ value: 0, name: '全国' }, { value: 1, name: '非全国' }], // 快递范围
    expressValue: [{ value: 0, name: '快递运费模版' }, { value: 1, name: '上门运费模版' }], // 模版类型
    freight: 0,
    show_template: true,
  };

  // 默认加载
  componentDidMount() {
    const { params } = this.props.match;
    this.fetchDetial(params);
  }

  // 快递范围选择事件
  onChangeAround = (e) => {
    this.setState({ aroundType: e.target.value });
  }

  // 模版类型选择事件
  onChangeExpress = (e) => {
    if (e.target.value === 0) { // 全国
      this.setState({ show_template: true });
    } else {
      this.setState({ show_template: false });
    }
    this.setState({ expressType: e.target.value });
  }


  // 组件传值事件
  onChildChanged = (newState, freight) => {
    if (!newState) newState = [];
    const data = newState.map((item, index) => {
      item['districtId'] = item.districtId || item.name;
      item['id'] = item.id || `NEW_TEMP_ID_${index}`;
      item['first'] = item.first || '0';
      delete item['@type'];
      return item;
    })

    this.setState({
      data,
      freight,
    });
  }

  // 查询详情
  fetchDetial = (query) => {
    const { dispatch } = this.props;
    const { type } = query;
    const that = this;
    this.setState({
      addType: type,
    });
    if (type === 'edit') {
      const { id } = query;
      dispatch({
        type: 'freightTemplate/detial',
        payload: { id },
        callback: (response) => {
          const { code, data } = response;
          if (code === 0) {
            const { shopFreightTemplateArea, shopFreightTemplate } = data;
            that.setState({
              show_template: shopFreightTemplate.type === 0 ? true : false,
              shopFreightTemplateArea,
            });
          }
        },
      });
    }
  }

  // 表单提交事件
  handleSubmit = (e) => {
    const { freightTemplate, dispatch } = this.props;
    const { result } = freightTemplate;
    const { shopFreightTemplateArea } = this.state;
    const data = shopFreightTemplateArea.map(item => {
      delete item['@type'];
      return item;
    })
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = {
          name: values.name,
          expressType: values.expressType,
          data,
          freight: this.state.freight,
        };
        dispatch({
          type: 'freightTemplate/submitfreightTemplate',
          payload: params,
        });
        this.showMsg(result);// response展示
      }
    });
  }

  // 取消按钮事件
  handleCancel = () => {
    this.props.dispatch(
      routerRedux.push({
        pathname: '/product/freight_template',
      })
    );
  }

  // response展示
  showMsg = (e) => {
    if (e.code === 0) {
      Message.success('提交成功！');
      setTimeout(() => {
        this.props.dispatch(
          routerRedux.push({
            pathname: '/product/freight_template',
          })
        );
      }, 2000);
    } else {
      Message.success('修改成功！');
      setTimeout(() => {
        this.props.dispatch(
          routerRedux.push({
            pathname: '/product/freight_template',
          })
        );
      }, 2000);
    }
  }

  changeDataSouce = (data) => {
    this.setState({ shopFreightTemplateArea: data, data, });

  }

  // 模版展示
  showTemplate = (data, show_template) => {
    if (show_template) {
      return (<ExpressCard callbackParent={this.onChildChanged} dataSouce={data} onChange={this.changeDataSouce} />);
    } else {
      return (<DoorFreightCard callbackParent={this.onChildChanged} onChange={this.changeDataSouce} dataSouce={data} />);
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { freightTemplate: { orderDetial: { shopFreightTemplate } } } = this.props;
    const isShopFreightTemplate = JSON.stringify(shopFreightTemplate) === '{}';
    const { addType, show_template, shopFreightTemplateArea } = this.state;
    const aroundRadio = this.state.aroundValue.map(e => <Radio value={e.value}>{e.name}</Radio>);
    const expressRadio = this.state.expressValue.map(e => <Radio value={e.value}>{e.name}</Radio>);
    return (
      <PageHeaderLayout title="添加运费模版">
        <Form onSubmit={this.handleSubmit}>
          <Card bordered={false}>
            <FormItem
              {...formItemLayout}
              label="模板名称"
            >
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入模板名称!', whitespace: true }],
                initialValue: (addType === 'add' || isShopFreightTemplate) ? '' : shopFreightTemplate.name,
              })(
                <Input placeholder="请输入模板名称" style={{ width: 300 }} />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="模板类型"
            >
              {getFieldDecorator('expressType', {
                rules: [{ required: true, message: '请选择模版类型' }],
                initialValue: (addType === 'add' || isShopFreightTemplate) ? 0 : shopFreightTemplate.type,
              })(
                <RadioGroup
                  onChange={this.onChangeExpress}
                  // value={this.state.expressType}
                >
                  {expressRadio}
                </RadioGroup>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="快递范围"
            >
              {getFieldDecorator('aroundType', {
                rules: [{ required: true, message: '请选择快递范围!' }],
                // initialValue: this.state.aroundType,
                initialValue: (addType === 'add' || isShopFreightTemplate) ? 0 : shopFreightTemplate.type,
              })(
                <RadioGroup
                  onChange={this.onChangeAround}
                  // value={this.state.aroundType}
                >
                  {aroundRadio}
                </RadioGroup>
              )}
            </FormItem>
            {this.showTemplate(shopFreightTemplateArea, show_template)}
          </Card>
          <FormItem>
            <Button style={{ margin: 15 }} type="primary" onClick={this.handleSubmit}>完成</Button>
            <Button style={{ margin: 15 }} type="primary" onClick={this.handleCancel}>取消</Button>
          </FormItem>
        </Form>
      </PageHeaderLayout>
    );
  }
}

