import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Icon, Button, Divider, Tabs, Table, Input, Select, Modal, Message } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../List/TableList.less';

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

const { confirm } = Modal;
const { Option } = Select;
const { TabPane } = Tabs;
const FormItem = Form.Item;

@connect(({
  loading,
  login,
  productGroup,
}) => ({
  loading: loading.models.productGroup,
  login,
  productGroup,
}))
@Form.create()
export default class ProductGroup extends PureComponent {
  state = {
    isModalVisible: false,
    tabsId: 1,
    addGroups: -1,
    type: 'add',
    parentName: '',
    info: {
      name: '',
      parentName: '请选择类目',
    },
  };

  componentDidMount() {
    this.fetchData();
  }

  // 初始化数据
  fetchData = () => {
    const { dispatch } = this.props;
    const that = this;
    dispatch({
      type: 'productGroup/fetch',
      callback: ((response) => {
        const { code, data } = response;
        if (code === 0) {
          const tabsId = data[0].id;
          that.setState({
            tabsId,
          });
          dispatch({
            type: 'productGroup/fetch',
            payload: { id: tabsId },
          });
        }
      }),
    });
  }


  reload = () => {
    const { tabsId } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'productGroup/fetch',
      payload: { id: tabsId },
    });
  }

  columns = [{
    title: '名称',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    render: (text, record) => (
      <span>
        <a onClick={() => this.editGoodsList(record)}>
          <Icon type="edit" style={{ fontSize: 16, color: '#08c' }} />
        </a>
        <Divider type="vertical" />
        <a onClick={() => this.deleteGoodsList(record)}>
          <Icon type="delete" style={{ fontSize: 16, color: '#08c' }} />
        </a>
      </span>
    ),
  }];

  // 修改模版
  editGoodsList = (info) => {
    const { list } = this.props.productGroup.data;
    const parent = list.filter((even) => {
      if (even.id === info.parentId) return even;
      else return null;
    });
    const newInfo = info;
    if (parent && parent[0] && parent[0].name) {
      newInfo.parentName = parent[0].name;
    }
    this.setState({
      isModalVisible: true,
      info: newInfo,
      disabled: true,
      type: 'update',
      addGroups: info.parentId,
    });
  }
  // 删除模版
  deleteGoodsList = (info) => {
    const { dispatch } = this.props;
    const newInfo = info || 'a';
    let { id } = newInfo;
    const that = this;
    if (!id) id = this.state.tabsId;
    confirm({
      title: '删除',
      content: '确定删除该模版吗',
      onOk: () => {
        dispatch({
          type: 'productGroup/delete', // 删除
          payload: {
            id,
          },
          callback: ((response) => {
            const { code } = response;
            if (code === 0) Message.success('操作成功！');
            else Message.success('操作失败，请重试！');
            if (!info) that.fetchData();
            else that.reload();
          }),
        });
      },
      onCancel() { },
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'productGroup/fetch',
      payload: {},
    });
  }

  addTemplate = () => {
    const newInfo = {
      name: '',
      parentName: '请选择分类',
    };
    this.setState({
      isModalVisible: true,
      type: 'add',
      info: newInfo,
      disabled: false,
    });
  }
  updateTemplate = () => {
    const newInfo = {
      name: this.state.parentName,
      parentName: '请选择分类',
    };
    this.setState({
      isModalVisible: true,
      type: 'update',
      info: newInfo,
      disabled: true,
    });
  }
  handleCancel = () => {
    this.setState({
      isModalVisible: false,
    });
  }
  handleOk = () => {
    const { dispatch } = this.props;
    const that = this;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let newValue = values;
        newValue = {
          ...newValue,
          parentId: this.state.addGroups,
        };
        this.setState({
          isModalVisible: false,
          info: {
            name: '',
            parentName: '请选择类目',
          },
        });
        const { type, info, tabsId } = this.state;
        const id = info.id || tabsId;
        if (type === 'update') {
          newValue.id = id;
          delete newValue.parentId;
        }
        dispatch({
          type: `productGroup/${type}`,
          payload: newValue,
          callback: (response) => {
            const { code } = response;
            if (code === 0) Message.success('操作成功');
            else Message.error('操作失败');
            const { parentId, select } = newValue;
            if (select === '请选择分类' || parentId <= 0) that.fetchData();
            else that.reload();
          },
        });
      }
    });
  }

  changeGroupSelect = (e) => {
    this.setState({
      addGroups: e,
    });
  }

  addModal = (Options) => {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Modal
          title="分类"
          visible={this.state.isModalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          destroyOnClose
        >
          <Form
            onSubmit={this.handleOk}
          >
            <FormItem
              {...formItemLayout}
              label={(
                <span>
                  设置分类名称
                </span>
              )}
            >
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入分类名称!', whitespace: true }],
              })(
                <Input placeholder="请输入分类名称" style={{ width: 300 }} />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={(
                <span>
                  设置分类名称
                </span>
              )}
            >
              {getFieldDecorator('select', {
                // rules: [{ required: false, message: '请输入分类名称!', whitespace: true }],
                initialValue: this.state.info.parentName,
              })(
                <Select
                  style={{ width: 300 }}
                  onChange={this.changeGroupSelect}
                  disabled={this.state.disabled}
                // defaultValue={this.state.info.parentName}
                >
                  <Option value="-1" >请选择父分类</Option>
                  {Options}
                </Select>
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
  changeTabs = (e) => {
    const { productGroup: { data } } = this.props;
    const { list } = data;
    const changeTab = list.filter((tabs) => {
      if (tabs.id === e) return tabs;
      else return null;
    });
    this.setState({
      parentName: changeTab[0] && changeTab[0] ? changeTab[0].name : '',
      tabsId: e,
    });
    this.props.dispatch({
      type: 'productGroup/fetch',
      payload: {
        id: e,
      },
    });
  }

  renderSimpleForm() {
    let {
      productGroup: {
        data,
      },
    } = this.props;
    const { loading } = this.props;
    let dataSource = [];
    if (data && data.dataSource !== {}) {
      dataSource = data.dataSource.data;
    }
    if (!data.list) {
      data = {
        list: [],
        pagination: {
          current: 1,
          pageSize: 10,
          total: 0,
          pageSizeOptions: ['10', '20', '30', '40'],
          showSizeChanger: true,
          showQuickJumper: true,
        },
      };
    }
    if (data && data.pagination) {
      data.pagination = {
        ...data.pagination,
        current: this.state.current,
        pageSize: this.state.pageSize,
      };
    }
    return (
      <Form layout="inline">
        <Table
          columns={this.columns}
          loading={loading}
          dataSource={dataSource}
        />
      </Form>
    );
  }

  renderForm() {
    return this.renderSimpleForm();
  }
  render() {
    const { productGroup } = this.props;
    let data = productGroup.data.list;
    if (!data) {
      data = [];
    }
    let Options;
    if (data !== []) {
      Options = data.map((e) => {
        return (
          <Option value={e.id} >{e.name}</Option>
        );
      });
    }
    return (
      <PageHeaderLayout title="所有商品">
        <Button style={{ margin: 15 }} type="primary" onClick={this.addTemplate.bind(this)}>添加分类</Button>
        <Button style={{ margin: 15 }} type="primary" onClick={this.updateTemplate.bind(this)}>修改一级分类</Button>
        <Button style={{ margin: 15 }} type="primary" onClick={() => this.deleteGoodsList()}>删除一级分类</Button>
        {this.addModal(Options)}
        <Tabs onChange={this.changeTabs}>
          {data.map((e) => {
            return (
              <TabPane tab={e.name} key={e.id} >
                <Card bordered={false}>
                  <div className={styles.tableList}>
                    {this.renderSimpleForm()}
                  </div>
                </Card>
              </TabPane>
            );
          })
          }
        </Tabs>
      </PageHeaderLayout>
    );
  }
}

