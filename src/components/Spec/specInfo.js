import React, { Component } from 'react';
import { Button, Input, Icon } from 'antd';

const selectStyle = { width: 190, marginRight: 10 };
let inputIndex = 0;

export default class SpecInfo extends Component {
  onInputChange = (evt, key) => {
    const { onChange, word } = this.props;
    let { data } = this.props;
    data = data.map((e) => {
      if (e.id === key) return { ...e, name: evt.target.value };
      return e;
    });
    onChange({ [word]: data });
  }

  addSpec = () => {
    const { onChange, word, data = [] } = this.props;
    inputIndex += 1;
    const id = `${word}${inputIndex}`;
    data.push({ id, name: null, image: null });
    onChange({ [word]: data });
  }

  closeInput = (key) => {
    const { onChange, word } = this.props;
    let { data } = this.props;
    data = data.filter((e) => {
      return e.id !== key;
    });
    onChange({ [word]: data });
  }

  renderInput = () => {
    const { data = [] } = this.props;
    return data.map((e) => {
      return (
        <div
          style={{ position: 'relative', width: 190, marginLeft: 8, display: 'inline-block' }}
          key={e.id}
        >
          <Icon
            style={{ position: 'absolute', top: -2, right: -6, zIndex: 1000, cursor: 'pointer' }}
            type="close-circle-o"
            onClick={() => { this.closeInput(e.id); }}
          />
          <Input
            onChange={(evt) => { this.onInputChange(evt, e.id); }}
            style={selectStyle}
            key={e.id}
            defaultValue={e.name}
          />
        </div>
      );
    });
  }

  render() {
    const { name, data = {} } = this.props;
    return (
      <div>
        <div>
          <Button
            onClick={this.addSpec}
          >
            {name}
          </Button>
          {this.renderInput(data)}
        </div>
      </div >
    );
  }
}
