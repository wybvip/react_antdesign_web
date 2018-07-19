import React, { PureComponent, Fragment } from 'react';
import { Table, Button, Input, message, Popconfirm, Divider } from 'antd';
import styles from '../Forms/style.less';

export default class TableForm extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: props.value,
      loading: false,
    };
  }
  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      this.setState({
        data: nextProps.value,
      });
    }
  }
  onFocusw = (e) => {
    this.props.onFocus(e)
  }

  getRowByKey(id, newData) {
    return (newData || this.state.data).filter(item => item.id === id)[0];
  }
  index = 0;
  cacheOriginData = {};
  toggleEditable = (e, id) => {
    e.preventDefault();
    const newData = this.state.data.map(item => ({ ...item }));
    const target = this.getRowByKey(id, newData);
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this.cacheOriginData[id] = { ...target };
      }
      target.editable = !target.editable;
      this.setState({ data: newData });
    }
  }
  remove(id) {
    const newData = this.state.data.filter(item => item.id !== id);
    this.setState({ data: newData });
    this.props.onChange(newData);
  }
  newMember = () => {
    const newData = this.state.data.map(item => ({ ...item }));
    newData.push({
      id: `NEW_TEMP_ID_${this.index}`,
      first: '',
      districtId: '',
      department: '',
      editable: true,
      isNew: true,
    });
    this.index += 1;
    this.setState({ data: newData });
  }
  handleKeyPress(e, id) {
    if (e.id === 'Enter') {
      this.saveRow(e, id);
    }
  }
  handleFieldChange(e, fieldName, id) {
    const newData = this.state.data.map(item => ({ ...item }));
    const target = this.getRowByKey(id, newData);
    if (target) {
      target[fieldName] = e.target.value;
      this.setState({ data: newData });
    }
  }
  focus = (record) => {
    this.props.onFocus(record)
  }
  saveRow(e, id) {
    e.persist();
    this.setState({
      loading: true,
    });
    setTimeout(() => {
      if (this.clickedCancel) {
        this.clickedCancel = false;
        return;
      }
      const target = this.getRowByKey(id) || {};
      if (target.first === '' || !target.districtId) {
        message.error('请填写完整成员信息。');
        message.error(target.first);
        message.success(target.districtId);
        e.target.focus();
        this.setState({
          loading: false,
        });
        return;
      }
      delete target.isNew;
      this.toggleEditable(e, id);
      this.props.onChange(this.state.data);
      this.setState({
        loading: false,
      });
    }, 500);
  }

  cancel(e, id) {
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
    const columns = [{
      title: '运送到',
      dataIndex: 'districtId',
      key: 'districtId',
      width: '50%',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
             // onFocus={() => { this.props.onFocus(record); }}
              //autoFocus
              onFocus={this.onFocusw}
              onChange={e => this.handleFieldChange(e, 'districtId', record.id)}
              onKeyPress={e => this.handleKeyPress(e, record.id)}
              placeholder="运送到"
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
              //onFocus={() => { this.props.onFocus(); }}
              onChange={e => this.handleFieldChange(e, 'first', record.id)}
              onKeyPress={e => this.handleKeyPress(e, record.id)}
              placeholder="运费(元)"
            />
          );
        }
        return text;
      },
    },
    //, {
    //   title: '所属部门',
    //   dataIndex: 'department',
    //   key: 'department',
    //   width: '40%',
    //   render: (text, record) => {
    //     if (record.editable) {
    //       return (
    //         <Input
    //           value={text}
    //           onChange={e => this.handleFieldChange(e, 'department', record.key)}
    //           onKeyPress={e => this.handleKeyPress(e, record.key)}
    //           placeholder="所属部门"
    //         />
    //       );
    //     }
    //     return text;
    //   },
    // },
    {
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

    return (
      <Fragment>
        <Table
          loading={this.state.loading}
          columns={columns}
          dataSource={this.state.data}
          pagination={false}
          rowClassName={(record) => {
            return record.editable ? styles.editable : '';
          }}
        />
        <Button
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          type="dashed"
          onClick={this.newMember}
          icon="plus"
        >
          为指定地区设置运费
        </Button>
      </Fragment>
    );
  }
}
