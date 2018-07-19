import React, { Component, Fragment } from 'react';
import { Button, Input, Form, Card, Checkbox, DatePicker, Divider } from 'antd';
import SpecInfo from '../../components/Spec/specInfo';
import SpecTable from '../../components/Spec/specTable';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    span: 21,
  },
};

@Form.create()
export default class SelectAdd extends Component {
  state = {
    specInfos: {
      specs: {}, // {color: [{id: "color1", name: "黑色"}], spec: [{id: "spec1", name: "128G"}] }
      price: [], // price: [[{color: "黑色", spec: "128G"}], [{color: "黑色", spec: "128G"}]]
    },
  };

  initSpec = () => { // 修改商品时初始化规格
    let { specInfos: { specs = [] } } = this.state;
    // specs: [[{children: [{id: 1, name: 黑色}]}], [{children: [{id: 1, name: 黑色}]}]]
    const spec = ['color', 'spec'];
    specs = specs.map((e, i) => {
      const { children } = e;
      const ones = children.map((x) => {
        return { id: x.id, name: x.name };
      });
      const one = spec[i];
      return { [one]: ones };
    }).reduce((k, a) => {
      return Object.assign(k, a);
    });
    this.setState({
      ...this.state,
      specInfos: { ...this.state.specInfos, specs },
    });
  }

  initPrice = () => { // 修改商品时用作初始化数据 price: [{specs: [{name: "黑色"}, {name: "128G"}]}]
    let { specInfos: { price } } = this.state;
    price = price.map((e) => {
      const spec = ['color', 'spec'];
      let { specs } = { e };
      if (spec && spec instanceof Array) {
        specs = specs.map((n, i) => {
          const one = spec[i];
          return { [one]: n.name };
        }).reduce((k, a) => {
          return Object.assign(k, a);
        });
      } // price: [[{color: "黑色", spec: "128G"}], [{color: "黑色", spec: "128G"}]]
      return [specs];
    });
    this.setState({
      ...this.state,
      specInfos: { ...this.state.specInfos, price },
    });
  }

  changeSpecInfo = (value) => { // 修改规格与颜色时触发 value: {color|spec: [{id: "color1", name: "黑色"}]}
    const { specInfos: { specs } } = this.state;
    Object.assign(specs, value);
    this.setState({
      ...this.state,
      specInfos: { ...this.state.specInfos, specs },
    });
  }

  feedSpecTable = () => {
    const { specInfos: { specs } } = this.state;
    const keys = Object.keys(specs);
    if (keys.length === 0) return {};
    const arr = keys.map((e) => {
      return specs[e].map((one) => {
        return one.name;
      });
    });
    const result = {};
    keys.forEach((e, i) => {
      result[e] = arr[i];
    });
    return result;
  }

  dealData = (data) => { // 组成tables所需要的数据
    const keys = Object.keys(data);
    if (keys.length === 0) return [];
    return this.permutation(keys.map((e) => {
      return data[e];
    }).filter((e) => { return e.length !== 0; })).map((e) => {
      return e.map((one, i) => {
        const spec = {};
        spec[keys[i]] = one;
        return spec;
      });
    }).map((v) => {
      const tmp = v.reduce((e, a) => {
        return Object.assign(e, a);
      });
      return [tmp];
    });
  }

  permutation = (arr) => { // 传入数组，生成排列组合 [[1, 2, 3], [a]]
    const results = [];
    const result = [];
    if (!arr || !(arr instanceof Array) || arr.length === 0) return [];
    const doExchange = (arr2, depth2) => {
      for (let i = 0; i < arr2[depth2].length; i += 1) {
        result[depth2] = arr2[depth2][i];
        if (depth2 !== arr2.length - 1) {
          doExchange(arr2, depth2 + 1);
        } else {
          results.push(result.join('|'));
        }
      }
    };
    doExchange(arr, 0);
    return results.map((e) => {
      return e.split('|');
    }); // [[1, a], [2, a], [3, a]]
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { specInfos: { specs, price } } = this.state;
    return (
      <Fragment>
        <FormItem
          {...formItemLayout}
          label={(
            <span>
              商品规格
            </span>
          )}
        >
          <SpecInfo
            key="color"
            word="color"
            name="设置颜色"
            data={specs.color}
            onChange={this.changeSpecInfo}
          />
          <Divider />
          <SpecInfo
            key="spec"
            word="spec"
            name="设置规格"
            data={specs.spec}
            onChange={this.changeSpecInfo}
          />
          <SpecTable data={this.dealData(this.feedSpecTable())} />
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={(
            <span>
              商品定价
            </span>
          )}
        >
          <div>
            <Card style={{ padding: 0 }}>
              <p style={{ color: 'red', fontSize: 12 }}>
                * 定价说明<br />
                1日及以上，是指租用时长为1日以上（包含1日）每日的租金价格;<br />
                7日及以上，是指租用时长为7日以上（包含7日）每日的租金价格;<br />
                其它优惠周期（30日及以上、90日及以上、365日及以上）原理相同。<br />
                如一: 当只设置1日及以上的价格，则无论消费者选择多长的租用时长，均按照1日及以上的价格<br />
                如二: 当同时设置1日或7日及以上的价格时，消费者选择租用10日，则每日租金为7日及以上的租金价格。<br />
              </p>
              批量设置:
            </Card>
          </div>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={(
            <span>
              最小租用周期
            </span>
          )}
        >
          {getFieldDecorator('telephone', {
            rules: [{ required: true, message: 'Please input your telephone!', whitespace: true }],
            initialValue: '1',
          })(
            <div>
              <Input addonAfter="天" style={{ maxWidth: 300 }} />
              <p style={{ fontSize: 12 }}>用户需起租的最小周期</p>
            </div>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={(
            <span>
              最大租用周期
            </span>
          )}
        >
          <div>
            {getFieldDecorator('telephone', {
              rules: [{ required: true, message: 'Please input your telephone!', whitespace: true }],
              initialValue: '100',
            })(
              <Input addonAfter="天" style={{ maxWidth: 300, marginRight: 10 }} />
            )}
            <Checkbox onChange={this.changeDay}>不限</Checkbox>
            <p style={{ fontSize: 12 }}>用户可租用的最大租用周期</p>
          </div>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={(
            <span>
              最少提前
            </span>
          )}
        >
          <div>
            {getFieldDecorator('telephone', {
              rules: [{ required: true, message: 'Please input your telephone!', whitespace: true }],
              initialValue: '1',
            })(
              <Input addonAfter="天" style={{ maxWidth: 300, marginRight: 10 }} />
            )}
            <p style={{ fontSize: 12 }}>用户最少在起租日前多少天可以下单租赁</p>
          </div>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={(
            <span>
              最多提前
            </span>
          )}
        >
          <div>
            {getFieldDecorator('telephone', {
              rules: [{ required: true, message: 'Please input your telephone!', whitespace: true }],
              initialValue: '1',
            })(
              <Input addonAfter="天" style={{ maxWidth: 300, marginRight: 10 }} />
            )}
            <Checkbox onChange={this.changeDay}>不限</Checkbox>
            <p style={{ fontSize: 12 }}>用户最多在起租日前多少天可以下单租赁</p>
          </div>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={(
            <span>
              高峰溢价
            </span>
          )}
        >
          <div>
            <Card>
              <font style={{ marginRight: 10 }} >从</font>
              <DatePicker style={{ marginRight: 10 }} />
              <font style={{ marginRight: 10 }} >到</font>
              <DatePicker style={{ marginRight: 10 }} />
              <font style={{ marginRight: 10 }} >加价</font>
              <Input addonAfter="元/天" style={{ width: 'auto', maxWidth: 300 }} />
            </Card>
            <Button style={{ marginLeft: 15 }} type="primary" onClick={this.addAttribute}>添加溢价</Button>
          </div>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={(
            <span>
              增值服务
            </span>
          )}
        >
          <div>
            <Button style={{ marginLeft: 15 }} type="primary" onClick={this.addAttribute}>添加增值服务</Button>
          </div>
        </FormItem>
      </Fragment>
    );
  }
}
