import React, { Component } from 'react';
import { Input, Select, Icon } from 'antd';
import styles from './index.less';

const { Option } = Select;

const periodArray = [
  { id: 1, text: '1日及以上' },
  { id: 7, text: '7日及以上' },
  { id: 30, text: '30日及以上' },
  { id: 90, text: '90日及以上' },
  { id: 365, text: '365日及以上' },
];

export default class CyclePrice extends Component {
  selectChange = (id, v) => {
    const { cycle, onChange } = this.props;
    const isRepeat = cycle.filter((e) => {
      return e.id === parseInt(id, 0);
    });
    if (isRepeat.length > 0) return;
    cycle.push({ id: parseInt(id, 0), text: v.props.children });
    onChange(cycle);
  }

  inputChange = (evt, key) => {
    let { cycle } = this.props;
    const { onChange } = this.props;
    cycle = cycle.map((e) => {
      const c = e;
      if (e.id === key) c.value = evt.target.value;
      return c;
    });
    onChange(cycle);
  }

  closeInput = (id) => {
    const { onChange } = this.props;
    let { cycle } = this.props;
    cycle = cycle.filter((e) => {
      return e.id !== id;
    });
    onChange(cycle);
  }

  renderCycle = () => {
    const { cycle } = this.props;
    return cycle.map((e) => {
      const { text } = (periodArray.filter((e1) => {
        return e1.id === e.id;
      }))[0];
      return (
        <div
          style={{ position: 'relative', marginLeft: 8, display: 'inline-block' }}
          key={e.id}
        >
          <Icon
            style={{ position: 'absolute', top: -2, right: -6, zIndex: 1000, cursor: 'pointer' }}
            type="close-circle-o"
            onClick={() => { this.closeInput(e.id); }}
          />
          <div key={e.id} className={styles.cycle_item}>
            <span>{`${text} `}</span>
            <Input
              defaultValue={e.value}
              onChange={(evt) => { this.inputChange(evt, e.id); }}
              key={e.id}
              size="small"
              className={styles.item}
            />
            <span>元/日</span>
          </div>
        </div>
      );
    });
  }

  renderOption = () => {
    return periodArray.map((e) => {
      return (<Option key={e.id} id={e.id}>{e.text}</Option>);
    });
  }

  render() {
    return (
      <div className={styles.addCyclePrice}>
        <Select onChange={this.selectChange} placeholder="选择周期价格">
          {this.renderOption()}
        </Select>
        {this.renderCycle()}
      </div>
    );
  }
}
