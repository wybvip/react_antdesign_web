import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Icon, Button, Divider, DatePicker, Message, Tabs, Table, Input, Pagination, Select, Modal, Radio } from 'antd';
import { routerRedux } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../List/TableList.less';
import StandardTable from '../../components/StandardTable';
import TableForm from './TableForm';


const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};
const tableData = [{
  key: '1',
  workId: '00001',
  name: 'John Brown',
  department: 'New York No. 1 Lake Park',
}, {
  key: '2',
  workId: '00002',
  name: 'Jim Green',
  department: 'London No. 1 Lake Park',
}, {
  key: '3',
  workId: '00003',
  name: 'Joe Black',
  department: 'Sidney No. 1 Lake Park',
}];

const RadioGroup = Radio.Group;
const confirm = Modal.confirm;
const { Option } = Select;
const TabPane = Tabs.TabPane;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
//  const status = ['关闭', '运行中', '已上线', '异常'];


@connect(({
  loading,
  login,
  freightTemplate,
}) => ({
  loading: loading.models.freightTemplate,
  login,
  freightTemplate,
}))
@Form.create()
export default class FreightTemplate extends PureComponent {
  state = {
    isModalVisible: false,
    formValues: {},
    tabsId: -1,
    isChangeTabs: false,
    modalType: '添加模版',
    typeValue: 0,
    aroundValue: 1,
    isGetNewQuery: false,
    isShowMessage: false,
    editTableData: '',
    isEdit: false,
    type: 0,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const that = this;
    dispatch({
      type: 'freightTemplate/fetch',
      callback: (response) => {
        console.log(response, '===========')
        const { code, data } = response;
        if (code === 0) {
          const { id } = data[0].freightTemplate;
          that.setState({
            tabsId: id,
          });
        }
      }
    });
    console.log('eee', this.props.freightTemplate);
  }


  componentWillUpdate() {
    const { dispatch } = this.props;
    console.log('{{{', this.state.isGetNewQuery)
    if (this.state.isGetNewQuery) {
      dispatch({
        type: 'freightTemplate/fetch',
      });
      this.setState({
        isGetNewQuery: false,
        isShowMessage: true,
      });
    }
  }
  onChangeAround = (e) => {
    console.log('radio checked', e.target.value);
    this.setState({
      aroundValue: e.target.value,
    });
  }
  onChangeType = (e) => {
    console.log('radio checked', e.target.value);
    this.setState({
      typeValue: e.target.value,
    });
  }

  columns = [
    {
      title: '行政区划',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '首费(元)',
      dataIndex: 'first',
      key: 'first',
    }];

  // 修改模版
  editTemplate = () => {
    const id = this.state.tabsId;
    this.props.dispatch(routerRedux.push({
      pathname: `/product/freight_template_add/edit/${id}`,
    }));
  }
  
  // 添加模版
  addTemplate = () => {
    this.props.dispatch(routerRedux.push({
      pathname: '/product/freight_template_add/add/-1',
    }));
  }

  // 删除模版
  deleteTemplate = () => {
    const id = this.state.tabsId;
    this.deleteModal(id);
  }
  // 删除模版
  deleteModal = (info) => {
    const { form, dispatch } = this.props;
    console.log('删除模版');
    console.log('info', info);
    confirm({
      title: '删除',
      content: '确定删除该模版吗',
      onOk: () => {
        dispatch({
          type: 'freightTemplate/deletefreightTemplate', // 删除
          payload: {
            id: info,
          },
        });
        this.setState({
          isGetNewQuery: true,
        });
      },
      onCancel() { },
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'productGroup/fetch',
      payload: {},
    });
  }

  handleSearch = (e) => {
    e.preventDefault();

    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const { startTime, endTime, pageSize, current } = this.state;
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'productGroup/fetch',
        payload: {
          ...values,
          startTime: startTime,
          endTime: endTime,
          pageSize: pageSize,
          current: current,
        },
      });
    });
  }
  showMessage = () => {
    const { freightTemplate: { updateMessage } } = this.props;
    const { isShowMessage } = this.state;
    console.log('updateMessage', updateMessage, isShowMessage, updateMessage.message.length);
    if (updateMessage && updateMessage.code === 0 && updateMessage.message.length > 0 && isShowMessage) {
      Message.success(updateMessage.message);
      this.setState({
        isShowMessage: false,
      });
    } else if (updateMessage && updateMessage.code !== 0 && updateMessage.message.length > 0 && isShowMessage) {
      Message.error(updateMessage.message);
      this.setState({
        isShowMessage: false,
      });
    }
  }


  pageChange = (page) => {
    console.log(page);
    this.setState({
      pageSize: page.pageSize,
      current: page.current,
    });
    this.handleStandardTableChange(page.current, page.pageSize);
  }
  handleStandardTableChange = (current, size) => {
    console.log('current, size', current, size);
    const params = {
      pageSize: size,
      current: current,
      startTime: this.state.startTime,
      endTime: this.state.endTime,
    };
    console.log('params', params);
    this.props.dispatch({
      type: 'productGroup/fetch',
      payload: params,
    });
  }

  changeTabs = (e) => {
    this.setState({
      tabsId: e,
      isChangeTabs: true,
    });
  }

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      isModalVisible: false,
    });
  }
  handleOk = (e) => {
    console.log(e);
    this.setState({
      isModalVisible: false,
    });
  }
  editHandleOk = () => {
    this.props.form.validateFields((err, values) => {
      console.log('values', err, values);
      err = false;
      const valueArr = Object.values(values);
      valueArr.map((e) => {
        if (e === undefined) err = true;
      });

      console.log('err', err)
      if (!err) {
        this.props.dispatch({
          type: 'productGroup/add',
          payload: values,
        });
        this.setState({
          isEdit: false,
        })
      }
    });
  }
  cancel = () => {
    this.setState({
      isModalVisible: false,
      isEdit: false,
    });
  }
  saveEdit = () => {
    console.log('保存');
    console.log('baocun', this.state.editTableData)
  }
  changeTableForm = (e) => {
    this.setState({
      editTableData: e,
    });
  }

  showTemplate = () => {
    const { getFieldDecorator } = this.props.form;
    const { freightTemplate: { orderDetial } } = this.props;
    let shopFreightTemplate = {};
    let shopFreightTemplateArea = [];
    const { isEdit } = this.state;
    if (isEdit && orderDetial && orderDetial.shopFreightTemplate !== {}) {
      shopFreightTemplate = orderDetial.shopFreightTemplate;
    }
    if (isEdit && orderDetial && orderDetial.shopFreightTemplateArea.length > 0) {
      shopFreightTemplateArea = orderDetial.shopFreightTemplateArea;
    }
    console.log('shopFreightTemplate', this.props.freightTemplate)
    if (!this.state.isModalVisible) return
    else {
      return (
        <Form
          onSubmit={this.editHandleOk}
        >
          <Button style={{ margin: 15 }} type="primary" onClick={this.editHandleOk}>保存</Button>
          <Button style={{ margin: 15 }} type="primary" onClick={this.cancel}>取消</Button>
          <Card title="基本信息" bordered={false}>
            <FormItem
              {...formItemLayout}
              label={(
                <span>
                  模板名称
                </span>
              )}
            >
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入模板名称!', whitespace: true }],
                initialValue: shopFreightTemplate.name,
              })(
                <Input placeholder="请输入模板名称" style={{ width: 300 }} />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={(
                <span>
                  模板类型
                </span>
              )}
            >
              {getFieldDecorator('type', {
                rules: [{ required: true, message: '', whitespace: true, validateTrigger: 'number' }],
                valuePropName: 'checked',
                validateTrigger: 'number',
              })(
                <RadioGroup onChange={this.onChangeType} value={this.state.typeValue}>
                  <Radio value={0}>快递运费模版</Radio>
                  <Radio value={1}>上门运费模版</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={(
                <span>
                  快递范围
                </span>
              )}
            >
              {getFieldDecorator('around', {
                rules: [{ required: true, message: '请选择快递范围!', whitespace: true, validateTrigger: 'number' }],
                valuePropName: 'checked',
                validateTrigger: 'number',
              })(
                <RadioGroup onChange={this.onChangeAround} value={this.state.aroundValue}>
                  <Radio value={1}>全国</Radio>
                  <Radio value={2}>非全国</Radio>
                </RadioGroup>
              )}
            </FormItem>
          </Card>
          <Card title="配送区域" bordered={false}>
            <p>
              配送区域：除指定区域外，其他地区的运费采用“默认运费”。若包邮，则运费填0元。
            </p>
            <FormItem>
              {getFieldDecorator('members', {
                initialValue: shopFreightTemplateArea,
              })(
                <TableForm
                  onChange={this.changeTableForm}
                />
              )}
            </FormItem>
          </Card>
        </Form>
      );
    }
  }
  addModal = () => {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Modal
          title={this.state.modalType}
          // visible={this.state.isModalVisible}
          visible={false}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form
            onSubmit={this.handleOk}
          >
            <FormItem
              {...formItemLayout}
              label={(
                <span>
                  模板名称：
                </span>
              )}
            >
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入模板名称!', whitespace: true }],
              })(
                <Input placeholder="请输入模板名称" style={{ width: 300 }} />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={(
                <span>
                  模板类型：
                </span>
              )}
            >
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请选择模板类型!', whitespace: true }],
              })(
                <Input placeholder="请选择模板类型" style={{ width: 300 }} />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={(
                <span>
                  快递范围：
                </span>
              )}
            >
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请选择模板类型!', whitespace: true }],
              })(
                <Input placeholder="请选择模板类型" style={{ width: 300 }} />
              )}
            </FormItem>
            <p>
              配送区域：除指定区域外，其他地区的运费采用“默认运费”。若包邮，则运费填0元。
            </p>
            <FormItem>
              {getFieldDecorator('members', {
                initialValue: tableData,
              })(<TableForm />)}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }

  renderSimpleForm(e) {
    const { loading } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Table
          columns={this.columns}
          loading={loading}
          dataSource={e}
          onChange={this.pageChange.bind(this)}
          onShowSizeChange={this.handleStandardTableChange}
        />
      </Form>
    );
  }

  renderForm() {
    return this.renderSimpleForm();
  }
  render() {
    const { freightTemplate } = this.props;
    let tabPane = [
      {
        freightTemplate: {},
        freightTemplateArea: [],
      },
    ];
    if (
      freightTemplate.data.dataSource &&
      freightTemplate.data.dataSource &&
      freightTemplate.data.dataSource.data
    ) {
      tabPane = freightTemplate.data.dataSource.data;
      if (!this.state.isChangeTabs) {
        this.setState({
          //tabsId: tabPane[0].freightTemplate.id,
          //typeValue: tabPane[0].freightTemplate.type,
        });
      }
    }
    if (!this.state.isModalVisible) {
      return (
        <PageHeaderLayout title="运费模版">
          <Button style={{ margin: 15 }} type="primary" onClick={this.addTemplate}>添加模版</Button>
          {this.addModal()}
          {this.showMessage()}
          <Tabs onChange={this.changeTabs}>
            {tabPane.map((e, index) => {
              return (
                <TabPane tab={e.freightTemplate.name} key={e.freightTemplate.id} >
                  <Card bordered={false}>
                    <Button style={{ margin: 15 }} type="primary" onClick={this.editTemplate}>修改模版</Button>
                    <Button style={{ margin: 15 }} type="primary" onClick={this.deleteTemplate}>删除模版</Button>
                    <div className={styles.tableList}>
                      {this.renderSimpleForm(e.freightTemplateArea)}
                    </div>
                  </Card>
                </TabPane>
              );
            })
            }
          </Tabs>
        </PageHeaderLayout>
      );
    } else {
      return this.showTemplate();
    }
  }
}
