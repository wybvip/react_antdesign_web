import React, { Component } from 'react';
import { Button, Select, Checkbox } from 'antd';

const Option = { Select };

export default class AdditionalService extends Component {
  addService = () => {
    const { data = [], onChange } = this.props;
    const count = data.filter((e) => {
      return Object.keys(e).length === 0;
    }).length;
    if (data.length && count !== 0) return;
    data.push({});
    onChange(data);
  }

  renderServices = () => {
    const { data = [], onChange } = this.props;
    return data.map((e) => {
      return (
        <div>
          <Select style={{ width: 200 }}>
            <Option id="1" key="1">1</Option>
            <Option id="2" key="2">2</Option>
            <Option id="3" key="3">3</Option>
          </Select>
          <Checkbox style={{ marginLeft: 5 }}>必选</Checkbox>
        </div>
      );
    });
  }

  render() {
    return (
      <div>
        <Button
          type="primary"
          onClick={this.addService}
        >
          添加增值服务
        </Button>
        {this.renderServices()}
      </div>
    );
  }
}
