import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Modal, Table, Message, Checkbox, Button, Divider, InputNumber, Card, Alert, Input, Popconfirm, Select } from 'antd';
import { routerRedux } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { len } from 'gl-matrix/src/gl-matrix/vec2';

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;
let input_text = [];
let plainOptions = [];
let defaultCheckedList = [];
let cityName = '';

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
    door_freight: undefined,// 快递运费数据
    data: [],
    loading: false,
    visible: false,// modal开关
    is_newAdd: false,// 是否继续设置运费
    freight: 0,// 默认运费
    tab_index: 0,
    province_option: undefined,
    city_option: undefined,
    area_checkbox: undefined,
    indeterminate: true,
    checkAll: false,
    checkedList: defaultCheckedList,
    isCanAdd: true,
  };

  // 默认加载
  componentDidMount() {
    const { dispatch } = this.props;
    let { data } = this.props.findDistrict.district;// 省市数据
    dispatch({
      type: 'findDistrict/fetch',
      payload: { type: 3 },
      callback: (response) => {
        const { code, data } = response;
        if(code === 0) {
          this.setState({ door_freight: data });
          this.reload(data);
        }
      },
    })
  }

  componentWillReceiveProps(nextProps) {
    console.log('-----------------------------', nextProps.dataSouce)
    let { dataSouce } = nextProps;
    if(!dataSouce) dataSouce = []; 
    const data = dataSouce.map((item, index) => {
      item['id'] = `NEW_TEMP_ID_${index}`;
      item['districtId'] = item.districtId || item.name;
      item['editable'] = false;
      item['isNew'] = false;
      return item;
    });
    this.setState({ data });
  }


  reload = (data) => {
    if (data !== undefined) {
      this.setState({
        isCanAdd: false,
        province_option: data.map((e, province_index) => <Option onClick={() => this.provinceClick(province_index)} value={e.label}>{e.label}</Option>)
      });
    }
  }

  // 打开modal
  openModal = (index) => {
    this.setState({ visible: true, tab_index: index });
  }

  // 关闭modal
  closelModal = () => {
    this.setState({ visible: false });
  }

  // 将选中的数据加入到input中
  handleOk = () => {
    console.log(this.state.data);
    const { tab_index } = this.state;
    const id = `NEW_TEMP_ID_${tab_index}`;
    this.handleFieldChange('', 'districtId', id, 'aaa')
    this.setState({ visible: false })
  }

  // 城市改变事件
  cityChange = (value) => {
    this.setState({ area_name: value })
    cityName = value;
  }

  // 省份点击事件
  provinceClick = (province_index) => {
    const citys = this.state.door_freight[province_index].children.map((e, city_index) => <Option onClick={() => this.cityClick(province_index, city_index)} value={e.label}>{e.label}</Option>);
    this.setState({ city_option: citys });

  }

  // 城市点击事件
  cityClick = (province_index, city_index) => {
    const areas = this.state.door_freight[province_index].children[city_index].children.map((e, index) => e.label);
    plainOptions = areas;
    defaultCheckedList = areas;
    this.setState({ area_checkbox: areas, checkAll: false });
  }

  checkboxChange = (checkedValues) => {
    this.setState({ area_name: checkedValues })
    input_text[this.state.tab_index] = checkedValues.toString();
  }

  InputNumberChange = (value) => {
    this.setState({ freight: value });
  }

  newDeliveryArea = () => {
    let dataIndex = this.state.data.length;
    const newData = this.state.data.map(item => ({ ...item }));
    newData.push({
      id: `NEW_TEMP_ID_${dataIndex}`,
      first: '',
      districtId: '',
      editable: true,
      isNew: true,
    });
    dataIndex += 1;
    this.setState({ data: newData, tabIndex: dataIndex, area_name: [] });
  }


  handleFieldChange(e, fieldName, id, isOk) {
    console.log(id);
    console.log(this.state.data)
    if (!isOk) {
      const newData = this.state.data.map(item => ({ ...item }));
      const target = this.getRowByKey(id, newData);
      const index = id.substring(12, id.length);
      if (target) {
        console.log(target)
        target[fieldName] = e.target.value;
        target['districtId'] = input_text[index];
        this.setState({ data: newData });
      }
    } else {
      const newData = this.state.data.map(item => ({ ...item }));
      const target = this.getRowByKey(id, newData);
      console.log(target)
      const index = id.substring(12, id.length);
      target['districtId'] = input_text[index];
      this.setState({ data: newData });
    }

  }

  handleKeyPress(e, id) {
    if (e.id === 'Enter') {
      this.saveRow(e, id);
    }
  }

  getRowByKey(id, newData) {
    console.log(id, newData)
    return (newData || this.state.data).filter(item => item.id === id)[0];
  }

  // checkbox组选择事件
  onCheckGroupChange = (checkedList) => {
    input_text[this.state.tab_index] = checkedList.toString();
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && (checkedList.length < plainOptions.length),
      checkAll: checkedList.length === plainOptions.length,
      area_name: checkedList
    });
  }

  // 全选事件
  onCheckAllChange = (e) => {
    if (e.target.checked) {
      input_text[this.state.tab_index] = cityName;
    } else {
      input_text[this.state.tab_index] = '';
    }
    this.setState({
      checkedList: e.target.checked ? plainOptions : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  }

  index = 0;
  cacheOriginData = {};
  toggleEditable = (e, id) => {
    const index = id.substring(12, id.length);
    const districtId = this.state.data[index].districtId;
    input_text[index] = districtId;
    console.log(districtId, 'districtId')
    const array = districtId.split(",");
    this.reload(this.state.express_freight)
    e.preventDefault();
    const newData = this.state.data.map(item => ({ ...item }));
    const target = this.getRowByKey(id, newData);
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this.cacheOriginData[id] = { ...target };
      }
      target.editable = !target.editable;
      this.setState({ data: newData, area_name: array });
    }
  }

  // 保存当前操作(table)
  saveRow(e, id) {
    e.persist();
    this.setState({ loading: true, area_name: [] });

    setTimeout(() => {
      if (this.clickedCancel) {
        this.clickedCancel = false;
        return;
      }
      const target = this.getRowByKey(id) || {};
      if (target.first === '' || input_text[this.state.tab_index] === '') {
        Message.error('请填写完整成员信息。');
        e.target.focus();
        this.setState({
          loading: false,
        });
        return;
      }
      delete target.isNew;
      this.toggleEditable(e, id);
      this.setState({
        loading: false,
        is_newAdd: false
      });
    }, 500);

    const new_data = this.state.data;
    console.log("new_data=========-----",new_data)
    const freight = this.state.freight;
    this.props.callbackParent(new_data, freight);
  }

  // 删除当前操作(table)
  remove(id) {
    console.log("input_text", input_text)
    const newData = this.state.data.filter(item => item.id !== id);
    this.setState({ data: newData, is_newAdd: true });
    this.props.onChange(newData);
  }

  // 取消当前操作(table)
  cancel(e, id) {
    this.setState({ area_name: [] });
    this.clickedCancel = true;
    e.preventDefault();
    const newData = this.state.data.map(item => ({ ...item }));
    const target = this.getRowByKey(id, newData);
    if (this.cacheOriginData[id]) {
      Object.assign(target, this.cacheOriginData[id]);
      target.editable = false;
      delete this.cacheOriginData[id];
    }
    this.setState({ data: newData });
    this.clickedCancel = false;
  }

  render() {
    const { isCanAdd } = this.state;
    const columns = [{
      title: '运送到',
      dataIndex: 'districtId',
      key: 'districtId',
      width: '50%',
      render: (text, record, index) => {
        if (record.editable) {
          return (
            <Input
              value={input_text[index]}
              readOnly
              onClick={() => this.openModal(index, record)}
              onChange={e => this.handleFieldChange(e, 'districtId', record.id)}
              onKeyPress={e => this.handleKeyPress(e, record.id)}
              placeholder="未添加地区"
            />
          );
        }
        return text;
      },
    }, {
      title: '运费(元)',
      dataIndex: 'first',
      key: 'first',
      width: 140,
      render: (text, record) => {

        if (record.editable) {
          return (
            <Input
              value={text}
              type="number"
              min={0}
              onChange={e => this.handleFieldChange(e, 'first', record.id)}
              onKeyPress={e => this.handleKeyPress(e, record.id)}
              placeholder="运费(元)"
            />
          );
        }
        return text;
      },
    }, {
      title: '操作',
      key: 'action',
      width: 160,
      render: (text, record) => {
        if (!!record.editable && this.state.loading) {
          return null;
        }
        if (record.editable) {
          if (record.isNew) {
            return (
              <span>
                <a onClick={e => this.saveRow(e, record.id)}>添加</a>
                <Divider type="vertical" />
                <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.id)}>
                  <a>删除</a>
                </Popconfirm>
              </span>
            );
          }
          return (
            <span>
              <a onClick={e => this.saveRow(e, record.id)}>保存</a>
              <Divider type="vertical" />
              <a onClick={e => this.cancel(e, record.id)}>取消</a>
            </span>
          );
        }
        return (
          <span>
            <a onClick={e => this.toggleEditable(e, record.id)}  disabled={isCanAdd}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.id)}>
              <a  disabled={isCanAdd}>删除</a>
            </Popconfirm>
          </span>
        );
      },
    }];

    const { getFieldDecorator } = this.props.form;
    const message = <span>默认运费：<InputNumber min={0} defaultValue={0} onChange={this.InputNumberChange} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value.replace(/\$\s?|(,*)/g, '')} /> 元</span>
    return (
      <Card title="配送区域" bordered={false}>
        <FormItem>
          <div>
            <Table
              columns={columns}
              dataSource={this.state.data}
              pagination={false}
            />
            <Button
              style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
              type="dashed"
              onClick={this.newDeliveryArea}
              icon="plus"
              disabled={isCanAdd}
            >
              为指定地区设置运费
            </Button>
          </div>
        </FormItem>
        <Modal
          title="快递配送区域"
          width={700}
          visible={this.state.visible}
          destroyOnClose
          onOk={this.handleOk}
          onCancel={this.closelModal}>
          <Form>
            <Select style={{ width: 120 }} placeholder="请选择省份">{this.state.province_option}</Select>
            &nbsp;&nbsp;
            <Select style={{ width: 120 }} onChange={this.cityChange} placeholder="请选择城市">{this.state.city_option}</Select>
            <Divider type="horizontal" />
            <CheckboxGroup options={plainOptions} value={this.state.checkedList} onChange={this.onCheckGroupChange} />
            <Divider type="horizontal" />
            <Checkbox
              indeterminate={this.state.indeterminate}
              onChange={this.onCheckAllChange}
              checked={this.state.checkAll}>
              全选
          </Checkbox>
          </Form>
        </Modal>
      </Card>
    );
  }
}