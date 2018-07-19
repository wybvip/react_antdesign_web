import React, { Component } from 'react';
import { Input, Icon } from 'antd';

export default class RentList extends Component {
  max = 5;
  index = 0;

  addRentList = () => {
    const { data, onChange } = this.props;
    if (this.max === 0) return;
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

  renderInput = (e) => {
    const { showInput = true } = this.props;
    if (showInput) {
      return (
        <Input defaultValue={e.name} style={{ width: 100, display: 'block', padding: 5 }} />
      );
    }
  }

  renderImages = () => {
    const { data } = this.props;
    return data.map((e) => {
      return (
        <div
          style={{ position: 'relative', width: 120, marginLeft: 8, display: 'inline-block' }}
          key={e.id}
        >
          <Icon
            style={{ position: 'absolute', top: -2, right: -6, zIndex: 1000, cursor: 'pointer' }}
            type="close-circle-o"
            onClick={() => { this.closeInput(e.id); }}
          />
          <img
            src={e.image}
            width="100"
            height="100"
            alt="清单"
            style={{ display: 'block', marginTop: 10, marginBottom: 10, padding: 2 }}
          />
          {this.renderInput(e)}
        </div>
      );
    });
  }

  render() {
    return (
      <div>
        {this.renderImages()}
      </div>
    );
  }
}
