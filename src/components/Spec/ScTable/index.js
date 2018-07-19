import React, { Component } from 'react';
import { Table, Button, Input, Form, Select, InputNumber } from 'antd';
import CyclePrice from './CyclePrice';

const { Option } = Select;
const defaultList = [{
  title: '颜色',
  dataIndex: 'color',
  key: 'color',
  width: 140,
}, {
  title: '规格',
  dataIndex: 'spec',
  key: 'spec',
  width: 140,
}];
const periodArray = [
  { id: 0, text: '1日及以上' },
  { id: 1, text: '7日及以上' },
  { id: 2, text: '30日及以上' },
  { id: 3, text: '90日及以上' },
  { id: 4, text: '365日及以上' },
];
const text = [
  '元／日,1日及以上，是指租用时长为1日以上（包含1日）每日的租金价格',
  '元／日,7日及以上，是指租用时长为7日以上（包含7日）每日的租金价格',
  '元／日,30日及以上，是指租用时长为30日以上（包含30日）每日的租金价格',
  '元／日,90日及以上，是指租用时长为90日以上（包含90日）每日的租金价格',
  '元／日,365日及以上，是指租用时长为365日以上（包含365日）每日的租金价格',
];
const isNewOrOld = [{
  value: 0,
  text: '全新',
}, {
  value: 1,
  text: '99成新',
}, {
  value: 2,
  text: '97成新',
}, {
  value: 3,
  text: '9成新',
}];
const isNewOptions = isNewOrOld.map(e => <Option value={e.value}>{e.text}</Option>);
const defaultColumns = [{
  title: '新旧程度',
  dataIndex: 'degree',
  key: 'degree',
  width: 140,
  render: (text, record) => {
    return (
      <div>
        <Select
          style={{ width: 100, marginRight: 10 }}
          onChange={value => this.changeDegree(record, value)}
        >
          {isNewOptions}
        </Select>
      </div>
    );
  },
}, {
  title: '市场价',
  dataIndex: 'price',
  key: 'price',
  width: 140,
  render: (text, record) => {
    return (
      <div>
        <Input addonAfter="元" defaultValue="0" style={{ width: 100 }} />
      </div>
    );
  },
}, {
  title: '库存',
  dataIndex: 'stock',
  key: 'stock',
  width: 140,
  render: (text, record) => {
    return (
      <div>
        <InputNumber defaultValue="0" />
      </div>
    );
  },
}];
let checkedPeriodArr = [];


@Form.create()
export default class ScTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: defaultColumns,
      dataSouce: [],
      speciData1: [],
      speciData2: [],
    };
  }
  onExpandedRowsChange = (expandedRows) => {
    let expandedRowKeys = expandedRows.pop();
    if (expandedRowKeys === undefined) expandedRowKeys = [];
    else expandedRowKeys = [expandedRowKeys];
    this.setState({
      expandedRowKeys: expandedRowKeys,
      isAddSelect: false,
    });
  }
  // 添加属性
  addAttribute = () => {
    let { length } = this.state;
    if (length <= 2) {
      length += 1;
    } else {
      length = 2;
    }
    this.setState({
      length: length,
    });
  }
  // 修改新旧程度
  changeDegree = (record, value) => {
    console.log(record, value);
  }
  selectArrtibute = (e, index) => {
    const newColumns = this.state.columns;
    const { list, newList } = this.state;
    const newLists = list.filter((item) => {
      return (item.dataIndex !== e);
    });
    const spliceList = list.filter((item) => {
      return (item.dataIndex === e);
    });
    newList.push(spliceList);
    newColumns.unshift(spliceList[0]);
    if (index === '1') {
      this.setState({
        list: newLists,
        columns: newColumns,
        firstSelectDisabled: true,
        newList: newList,
      });
    } else if (index === '2') {
      this.setState({
        list: newLists,
        columns: newColumns,
        secondSelectDisabled: true,
        newList: newList,
      });
    }
  }
  addDetial = () => {
    const { addNum } = this.state;
    const addNumLength = addNum.length;
    const addOptions = { id: addNumLength };
    addNum.push(addOptions);
    this.setState({
      addNum: addNum,
    });
    console.log(this.state.addNum);
  }
  addDetial2 = () => {
    const { addNum2 } = this.state;
    const addNumLength = addNum2.length;
    const addOptions = { id: addNumLength };
    addNum2.push(addOptions);
    this.setState({
      addNum2: addNum2,
    });
    console.log(this.state.addNum2);
  }
  isAddAttribute = (Options) => {
    if (this.state.length === 0) {
      return null;
    } else if (this.state.length === 1) {
      return (
        <div>
          <Select style={{ width: 190, marginRight: 10 }} onChange={val => this.selectArrtibute(val, '1')} disabled={this.state.firstSelectDisabled}>
            {Options}
          </Select>
          <br />
          {this.addtext()}
          <Button style={{ margin: 15 }} type="primary" onClick={this.addDetial} disabled={!this.state.firstSelectDisabled}>添加</Button>
        </div>
      );
    } else if (this.state.length >= 2) {
      return (
        <div>
          <Select style={{ width: 190, marginRight: 10 }} onChange={val => this.selectArrtibute(val, '1')} disabled={this.state.firstSelectDisabled}>
            {Options}
          </Select>
          <br />
          {this.addtext()}
          <Button style={{ margin: 15 }} type="primary" onClick={this.addDetial} disabled={!this.state.firstSelectDisabled}>添加</Button>
          <br />
          <Select style={{ width: 190, marginRight: 10 }} onChange={val => this.selectArrtibute(val, '2')} disabled={this.state.secondSelectDisabled}>
            {Options}
          </Select>
          <br />
          {this.addtext2()}
          <Button style={{ margin: 15 }} type="primary" onClick={this.addDetial2} disabled={!this.state.secondSelectDisabled}>添加</Button>
        </div>
      );
    }
  }
  changeAddValue = (e, id) => {
    console.log(e, id);
    const { speciData1 } = this.state;
    if (id < speciData1.length) {
      speciData1[id].id = e.target.value;
    } else {
      speciData1.push({
        id: e.target.value,
      });
    }
    this.setState({
      speciData1: speciData1,
    });
    console.log('speciData1', speciData1);
  }
  changeAddValue2 = (e, id) => {
    // console.log(e, id);
    const { speciData2 } = this.state;
    if (id < speciData2.length) {
      speciData2[id].id = e.target.value;
    } else {
      speciData2.push({
        id: e.target.value,
      });
    }
    this.setState({
      speciData2: speciData2,
    });
    console.log('speciData2', speciData2);
  }
  
  addtext = () => {
    const { addNum } = this.state;
    const inputs = addNum.map(item => <Input placeholder="点击编辑" style={{ width: 'auto', maxWidth: 300, marginRight: 10 }} onChange={e => this.changeAddValue(e, item.id)} />
    );
    return (
      <div>
        {inputs}
      </div>
    );
  }
  addtext2 = () => {
    const { addNum2 } = this.state;
    const inputs = addNum2.map(item => <Input placeholder="点击编辑" style={{ width: 'auto', maxWidth: 300, marginRight: 10 }} onChange={e => this.changeAddValue2(e, item.id)} />);
    return (
      <div>
        {inputs}
      </div>
    );
  }
  changeDay = (e) => {
    console.log('e', e, e.target.checked);
  }
  // setPeriod = () => {
  //   const text = [
  //     '元／日,1日及以上，是指租用时长为1日以上（包含1日）每日的租金价格',
  //     '元／日,7日及以上，是指租用时长为7日以上（包含7日）每日的租金价格',
  //     '元／日,30日及以上，是指租用时长为30日以上（包含30日）每日的租金价格',
  //     '元／日,90日及以上，是指租用时长为90日以上（包含90日）每日的租金价格',
  //     '元／日,365日及以上，是指租用时长为365日以上（包含365日）每日的租金价格',
  //   ];
  //   let { periodArr } = this.state;
  //   const { checkedPeriodArr } = this.state;
  //   let Options = periodArr.map(e => <Option value={e.id}>{e.text}</Option>);
  //   const selectedOption = (e) => {
  //     checkedPeriodArr.push(e);
  //     for (let i = 0; i < checkedPeriodArr.length; i++) {
  //       periodArr = periodArr.filter((item) => {
  //         return (item.id !== e);
  //       });
  //     }
  //     console.log('periodArr+++', periodArr);
  //     this.setState({
  //       periodArr: periodArr,
  //       checkedPeriodArr: checkedPeriodArr,
  //     });
  //   };

  //   return (
  //     <div style={{ width: 700 }}>
  //       <Select style={{ marginRight: 10, width: 120 }} onChange={selectedOption} >
  //         {Options}
  //       </Select>
  //       <Input style={{ width: 540 }}  addonAfter={text[0]} defaultValue="0" />
  //       <Button style={{ display: checkedPeriodArr.length >= 5 ? 'none' : 'block' }} type="default" shape="circle" icon="plus" />
  //     </div>
  //   );
  // }
  showSelect = () => {
    this.setState({
      isAddSelect: true,
    });
  }

  render() {
    const dataSourceDetial = []
   
    return (
     <div>
         {{'dhadjia'}}
     </div>
    );
  }
}
