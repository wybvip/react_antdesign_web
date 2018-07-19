import React, { Component, Fragment } from 'react';
import { Form, Card, Divider } from 'antd';
import SpecInfo from './specInfo';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 2,
  },
  wrapperCol: {
    span: 21,
  },
};

@Form.create()
export default class SpecIndex extends Component {
  changeSpecInfo = (value) => { // 修改规格与颜色时触发 value: {color|spec: [{id: "color1", name: "黑色"}]}
    const { specs, onChange } = this.props;
    if (value[Object.keys(value)[0]].length === 0) {
      delete specs[Object.keys(value)[0]];
      onChange(specs);
      return;
    }
    onChange(Object.assign(specs, value));
  }

  render() {
    const { specs } = this.props;
    return (
      <Fragment>
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
            </Card>
          </div>
        </FormItem>
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
        </FormItem>

      </Fragment>
    );
  }
}
