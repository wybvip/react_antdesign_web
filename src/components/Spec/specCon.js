import React, { Component } from 'react';
import { Table, Select, InputNumber } from 'antd';
import { isNewOrOld } from './constSpec';
import CyclePrice from './CyclePrice';

const { Option } = Select;

const isNewOptions =
  isNewOrOld.map(e => <Option value={e.value}>{e.text}</Option>);

export default class SpecCon extends Component {
  columns = [
    {
      title: '颜色',
      dataIndex: 'color',
      key: 'color',
    },
    {
      title: '规格',
      dataIndex: 'spec',
      key: 'spec',
    },
    {
      title: '新旧程度',
      dataIndex: 'degree',
      key: 'degree',
      width: 140,
      render: (text, record) => {
        return (
          <div>
            <Select
              defaultValue={record.degree}
              style={{ width: 100, marginRight: 10 }}
              onChange={value => this.degreeChange(record, value)}
            >
              {isNewOptions}
            </Select>
          </div>
        );
      },
    },
    {
      title: '库存',
      dataIndex: 'stock',
      key: 'stock',
      width: 140,
      render: (text, record) => {
        return (
          <div>
            <InputNumber
              onChange={e => this.stockChange(record, e)}
              defaultValue={record.stock}
            />
          </div>
        );
      },
    },
    {
      title: '市场价',
      dataIndex: 'price',
      key: 'price',
      width: 140,
      render: (text, record) => {
        return (
          <div>
            <InputNumber
              onChange={e => this.priceChange(record, e)}
              addonAfter="元"
              defaultValue={record.price}
              style={{ width: 100 }}
            />
          </div>
        );
      },
    },
  ];

  cycleChange = (cycle) => {
    const { onChange, dataSource } = this.props;
    onChange({ ...dataSource[0], cycle });
  }

  degreeChange = (record, degree) => {
    const { onChange } = this.props;
    onChange({ ...record, degree });
  }

  stockChange = (record, stock) => {
    const { onChange } = this.props;
    onChange({ ...record, stock });
  }

  priceChange = (record, price) => {
    const { onChange } = this.props;
    onChange({ ...record, price });
  }

  render() {
    const { dataSource } = this.props;
    console.log('dataSouce', dataSource);
    const { cycle = [] } = dataSource[0];
    return (
      <div>
        <Table
          rowKey={(record) => { return JSON.stringify(record); }}
          columns={this.columns}
          dataSource={dataSource}
          pagination={false}
        />
        <CyclePrice cycle={cycle} onChange={this.cycleChange} />
      </div>
    );
  }
}
