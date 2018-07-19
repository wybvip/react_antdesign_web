import React, { Component } from 'react';
import { DatePicker, Button, InputNumber, Icon } from 'antd';
import moment from 'moment';

const { RangePicker } = DatePicker;

export default class PeakPremium extends Component {
  onRangePickerChange = (dates, dateStrings, id) => {
    const { onChange, data } = this.props;
    onChange(data.map((e) => {
      if (e.id === id) {
        [e.start, e.end] = dateStrings;
      }
      return e;
    }));
  }

  onInputChange = (id, value) => {
    const { onChange, data } = this.props;
    onChange(data.map((e) => {
      if (e.id === id) {
        e.price = value;
      }
      return e;
    }));
  }

  index = 0;

  addPeak = () => {
    const { onChange, data } = this.props;
    data.push({ id: this.index += 1 });
    onChange(data);
  }

  closeInput = (id) => {
    const { onChange } = this.props;
    let { data } = this.props;
    data = data.filter((e) => {
      return e.id !== id;
    });
    onChange(data);
  }

  renderItem = () => {
    const format = 'YYYY-MM-DD';
    const { data = [] } = this.props;
    return data.map((e) => {
      const defaultValue = (e.start && e.end) ?
        [moment(e.start, format), moment(e.end, format)] : null;
      return (
        <div key={e.id}>
          <Icon
            style={{ marginRight: 5, cursor: 'pointer' }}
            type="close-circle-o"
            onClick={() => { this.closeInput(e.id); }}
          />
          <RangePicker
            showTime={{ format: 'HH:mm' }}
            format={format}
            defaultValue={defaultValue}
            placeholder={['开始时间', '结束时间']}
            onChange={(date, dateStrings) => { this.onRangePickerChange(date, dateStrings, e.id); }}
          />
          <span
            style={{ marginLeft: 5, marginRight: 5 }}
          >
            加价
          </span>
          <InputNumber
            onChange={(ea) => { this.onInputChange(e.id, ea.target.value); }}
            defaultValue={e.price}
            style={{ width: 150 }}
          />
          <span> 元/日</span>
        </div>
      );
    });
  }

  render() {
    return (
      <div>
        <Button
          onClick={this.addPeak}
        >
          添加溢价
        </Button>
        {this.renderItem()}
      </div>
    );
  }
}
