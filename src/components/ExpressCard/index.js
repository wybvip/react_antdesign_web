import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Modal, Table, Message, Checkbox, Button, Divider, InputNumber, Card, Alert, Input, Popconfirm } from 'antd';

const FormItem = Form.Item;
let inputText = [];

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
export default class ExpressCard extends PureComponent {
  state = {
    express_freight: undefined, // 快递运费数据
    // 东北
    dongBei_ck: undefined,
    // 华东
    huaDong_ck: undefined,
    // 华中
    huaZhong_ck: undefined,
    // 华北
    huaBei_ck: undefined,
    // 华南
    huaNan_ck: undefined,
    // 西北
    xiBei_ck: undefined,
    // 西南
    xiNan_ck: undefined,
    data: [],
    loading: false,
    visible: false, // modal开关
    freight: 0, // 默认运费
    tabIndex: 0,
    tablength: 0,
  };

  // 默认加载
  componentDidMount() {
    const { dispatch } = this.props;
    let { data } = this.props.findDistrict.district;// 省市数据
    dispatch({
      type: 'findDistrict/fetch',
      payload: { type: 2 },
    }).then(() => {
      const datas = this.props.findDistrict.district.data;
      data = datas;
      this.setState({ express_freight: data });
      this.reload(data);
    }).catch(() => {
    });
    // 查询详细
    dispatch({
      type: 'findDistrict/detial',
      payload: {},
      callback: () => {
        // console.log(response);
      },
    });
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps)
    let { dataSouce } = nextProps;
    console.log('-----------------------------', dataSouce);
    if (!dataSouce) dataSouce = [];
    console.log(this.props.match);
    const data = dataSouce.map((item, index) => {
      item['id'] = `NEW_TEMP_ID_${index}`;
      item['districtId'] = item.districtId || item.name;
      item['editable'] = false;
      item['isNew'] = true;
      return item;
    });
    inputText = dataSouce.map(item => item.name);
    const { length } = dataSouce;
    this.setState({ data, tabIndex: length });
  }


  getRowByKey(id, newData) {
    console.log(id, newData)
    return (newData || this.state.data).filter(item => item.id === id)[0];
  }

  reload = (data) => {
    // 东北
    if (data.dongBei !== undefined) {
      this.setState({ dongBei_ck: data.dongBei.map((e, index) => <Checkbox value={e.label} onClick={() => this.checkBoxClcik(index, e.label, e.value, 'dongBei')}>{e.label}</Checkbox>) });
    }
    // 华东
    if (data.huaDong !== undefined) {
      this.setState({ huaDong_ck: data.huaDong.map((e, index) => <Checkbox value={e.label} onClick={() => this.checkBoxClcik(index, e.label, e.value, 'huaDong')}>{e.label}</Checkbox>) });
    }
    // 华中
    if (data.huaZong !== undefined) {
      this.setState({ huaZhong_ck: data.huaZong.map((e, index) => <Checkbox value={e.label} onClick={() => this.checkBoxClcik(index, e.label, e.value, 'huaZong')}>{e.label}</Checkbox>) });
    }
    // 华北
    if (data.huaBei !== undefined) {
      this.setState({ huaBei_ck: data.huaBei.map((e, index) => <Checkbox value={e.label} onClick={() => this.checkBoxClcik(index, e.label, e.value, 'huaBei')}>{e.label}</Checkbox>) });
    }
    // 华南
    if (data.huaNan !== undefined) {
      this.setState({ huaNan_ck: data.huaNan.map((e, index) => <Checkbox value={e.label} onClick={() => this.checkBoxClcik(index, e.label, e.value, 'huaNan')}>{e.label}</Checkbox>) });
    }
    // 西北
    if (data.xiBei !== undefined) {
      this.setState({ xiBei_ck: data.xiBei.map((e, index) => <Checkbox value={e.label} onClick={() => this.checkBoxClcik(index, e.label, e.value, 'xiBei')}>{e.label}</Checkbox>) });
    }
    // 西南
    if (data.xiNan !== undefined) {
      this.setState({ xiNan_ck: data.xiNan.map((e, index) => <Checkbox value={e.label} onClick={() => this.checkBoxClcik(index, e.label, e.value, 'xiNan')}>{e.label}</Checkbox>) });
    }
  }

  // 打开modal
  openModal = (index) => {
    this.setState({ visible: true, tabIndex: index });
  }

  // 关闭modal
  closelModal = () => {
    this.setState({ visible: false });
  }

  // 将选中的数据加入到input中
  handleOk = () => {
    const { tabIndex } = this.state;
    const id = `NEW_TEMP_ID_${tabIndex}`;
    this.handleFieldChange('', 'districtId', id, 'aaa');
    this.setState({ visible: false });
  }

  // 快递配送区域点击事件(单个checkbox)
  checkBoxClcik = (index, label, value, type) => {
    if (type === 'dongBei') {
      this.setState({
        ef_check:
          this.state.express_freight.dongBei[index].children.map(
            e => <Checkbox value={e.label}>{e.label}</Checkbox>)
      }
      );
    } else if (type === 'huaDong') {
      this.setState({
        ef_check:
          this.state.express_freight.huaDong[index].children.map(
            e => <Checkbox value={e.label}>{e.label}</Checkbox>)
      }
      );
    } else if (type === 'huaZong') {
      this.setState({
        ef_check:
          this.state.express_freight.huaZong[index].children.map(
            e => <Checkbox value={e.label}>{e.label}</Checkbox>)
      }
      );
    } else if (type === 'huaBei') {
      this.setState({
        ef_check:
          this.state.express_freight.huaBei[index].children.map(
            e => <Checkbox value={e.label}>{e.label}</Checkbox>)
      }
      );
    } else if (type === 'huaNan') {
      this.setState({
        ef_check:
          this.state.express_freight.huaNan[index].children.map(
            e => <Checkbox value={e.label}>{e.label}</Checkbox>)
      });
    } else if (type === 'xiBei') {
      this.setState({
        ef_check:
          this.state.express_freight.xiBei[index].children.map(
            e => <Checkbox value={e.label}>{e.label}</Checkbox>)
      }
      );
    } else {
      this.setState({
        ef_check:
          this.state.express_freight.xiNan[index].children.map(
            e => <Checkbox value={e.label}>{e.label}</Checkbox>)
      }
      );
    }
  }

  checkboxChange = (checkedValues) => {
    this.setState({ area_name: checkedValues });
    inputText[this.state.tabIndex] = checkedValues.toString();
  }

  InputNumberChange = (value) => {
    this.setState({ freight: value });
  }

  dataIndex = this.state.tabIndex;

  //  添加新运费
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
    if (!isOk) {
      const newData = this.state.data.map(item => ({ ...item }));
      const target = this.getRowByKey(id, newData);
      const index = id.substring(12, id.length);
      if (target) {
        console.log(target, 'target');
        target[fieldName] = e.target.value;
        target.districtId = inputText[index];
        this.setState({ data: newData });
      }
    } else {
      const newData = this.state.data.map(item => ({ ...item }));
      const target = this.getRowByKey(id, newData);
      const index = id.substring(12, id.length);
      console.log(index, inputText, target, 'target');
      target.districtId = inputText[index];
      this.setState({ data: newData });
    }
  }

  handleKeyPress(e, id) {
    if (e.id === 'Enter') {
      this.saveRow(e, id);
    }
  }

  cacheOriginData = {};
  toggleEditable = (e, id) => {
    const index = id.substring(12, id.length);
    const { districtId } = this.state.data[index];
    const array = districtId.split(',');
    this.reload(this.state.express_freight);
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
      if (target.first === '') {
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
      });
    }, 500);

    const newDatas = this.state.data;
    const { freight } = this.state;
    this.props.callbackParent(newDatas, freight);
  }

  // 删除当前操作(table)
  remove(id) {
    const newData = this.state.data.filter(item => item.id !== id);

    console.log("newData-----",newData)


    console.log(inputText, id);

    this.setState({ data: newData });
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
    console.log('----------------', this.state.data)
    const columns = [{
      title: '运送到',
      dataIndex: 'districtId',
      key: 'districtId',
      width: '50%',
      render: (text, record, index) => {
        if (record.editable) {
          return (
            <Input
              value={inputText[index]}
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
            <a onClick={e => this.toggleEditable(e, record.id)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.id)}>
              <a>删除</a>
            </Popconfirm>
          </span>
        );
      },
    }];

    const message =
      <span>默认运费：<InputNumber min={0} defaultValue={0} onChange={this.InputNumberChange} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value.replace(/\$\s?|(,*)/g, '')} /> 元</span>;
    return (
      <Card title="配送区域" bordered={false}>
        <FormItem>
          <div>
            <p style={{ color: 'red' }}>配送区域：除指定区域外，其他地区的运费采用“默认运费”。若包邮，则运费填0元。</p>
            <Alert message={message} type="info" />
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
          onCancel={this.closelModal}
        >
          <Form>
            <Checkbox.Group value={this.state.area_name} onChange={this.checkboxChange} style={{ width: '100%' }}>
              东北<Divider type="vertical" />{this.state.dongBei_ck}<br />
              华东<Divider type="vertical" />{this.state.huaDong_ck}<br />
              华中<Divider type="vertical" />{this.state.huaZhong_ck}<br />
              华北<Divider type="vertical" />{this.state.huaBei_ck}<br />
              华南<Divider type="vertical" />{this.state.huaNan_ck}<br />
              西北<Divider type="vertical" />{this.state.xiBei_ck}<br />
              西南<Divider type="vertical" />{this.state.xiNan_ck}<br />
              <Divider type="horizontal" />
              {this.state.ef_check}
            </Checkbox.Group>
          </Form>
        </Modal>
      </Card>
    );
  }
}