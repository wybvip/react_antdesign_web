import React, { Component } from 'react';
import { connect } from 'dva';
import { Tabs, Icon, Form, Input, Button, Upload, Menu, Dropdown, Divider, Select, Modal, Table, Message } from 'antd';
import styles from './Register.less';
import Configure from '../../conf/configure';
import { Redirect } from 'react-router-dom';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

@connect(({
  submitShopAptitude,
  loading
}) => ({
  submitShopAptitude,
  loading: loading.models.submitShopAptitude

}))

@Form.create()
export default class ShopAptitude extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    loading: false,
    is_switch: false,
    logo: '',
    background: '',
    btn_text: '',
    description: '',
    shopTypeId: null,
    mainCategoryId: null,
    show_msg: false,
    form_load: false,
    redirect: false
  };

  // 默认加载
  componentDidMount() {
    const { dispatch } = this.props;
    const { submitShopAptitude } = this.props;

    dispatch({
      type: 'submitShopAptitude/findmaincategory',
    })
  }

  // 上传按钮
  uploadButton = (
    <div>
      <Icon type={this.state.loading ? 'loading' : 'plus'} />
      <div className="ant-upload-text">点击上传</div>
    </div>
  );

  // 限制用户上传大小与格式
  beforeUpload = (file) => {
    const isJPG = file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/gif";
    if (!isJPG) {
      Message.error("图片格式不正确");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      Message.error("图片大于2MB");
    }
    return isJPG && isLt2M;
  }

  // 店铺logo上传
  onLogo = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
    }

    if (info.file.status === 'done') {
      this.setState({
        logo: info.file.response.data,
        loading: false
      })
    }
  }

  // 店铺背景图上传
  onBackground = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
    }

    if (info.file.status === 'done') {
      this.setState({
        background: info.file.response.data,
        loading: false
      })
    }
  }

  // 店铺信息提交
  handleSubmit = (e) => {
    const { dispatch } = this.props;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) {
        return;
      } else {
        const params = {
          shopTypeId: this.state.shopTypeId,
          mainCategoryId: this.state.mainCategoryId,
          name: fieldsValue.name,
          logo: this.state.logo,
          background: this.state.background,
          description: fieldsValue.description
        }

        dispatch({
          type: 'submitShopAptitude/save',
          payload: params
        });

        this.setState({
          show_msg: true,
          form_load: true,
          shopTypeId:fieldsValue.shopTypeId
        })
      }
    });
  }

  // 店铺经营类型点击事件
  handleMenuClick = (e) => {
    const { submitShopAptitude } = this.props;
    const { findshopmaincategory } = submitShopAptitude;
    // 店铺经营类型说明(品牌)
    const description = findshopmaincategory.data.end.map((d) => {
      if (e.key == d.id) {
        return d.description;
      }
    });

    this.setState({
      btn_text: e.item.props.children,
      description: description,
      shopTypeId: e.key
    })
  }

  firstBtnClcik = () => {
    const { submitShopAptitude } = this.props;
    const { findshopmaincategory } = submitShopAptitude;

    // 店铺经营类型说明
    const description = findshopmaincategory.data.first.map((e) => {
      return e.description;
    });

    this.setState({
      btn_text: '品牌店',
      description: description,
      shopTypeId: findshopmaincategory.data.first[0].id
    })

    console.log("shopTypeId",this.state.shopTypeId)
  }

  // 店铺主营类目值更变
  onMainCategoryIdChange = (value) => {
    this.setState({
      mainCategoryId: value
    });
  }

  // 店铺主营类目与子类目对应关系
  showMainAptitude = () => {
    this.setState({
      is_switch: true
    });
  }

  // 关闭主营类目与子类目对应关系
  handleCancel = () => {
    this.setState({
      is_switch: false
    });
  }

  // 提示信息
  showMsg = (e) => {
    if (this.state.show_msg) {
      if (e && e.code === 0) {
        Message.success('提交成功！请等待审核结果');
        this.setState({ show_msg: false })
        setTimeout(() => {
          this.setState({
            redirect: true
          });
        }, 2000);
      }
    }
  }

  // 渲染店铺信息
  showShopAptitude = () => {
    const { getFieldDecorator } = this.props.form;
    const { logo, background, btn_text } = this.state;
    const { submitShopAptitude } = this.props;
    const { result, findshopmaincategory } = submitShopAptitude;
    const shop = findshopmaincategory.data.shop;
    // 店铺经营类型btn(企业)
    const first = findshopmaincategory.data.first.map((e) => {
      return e.name;
    });

    // 店铺经营类型btn(品牌)
    const end = findshopmaincategory.data.end.map((e) =>
      <Menu.Item key={e.id}>{e.name}</Menu.Item>
    );

    // 店铺主营类目
    const options = findshopmaincategory.data.category.map((e) =>
      <Option value={e.id}>{e.name}</Option>
    );

    // 店铺主营类目与子类目对应关系
    const dataSource = findshopmaincategory.data.category.map((e) => {
      const data = {
        name: e.name,
        description: e.description,
      }
      return data;
    });

    const columns = [{
      title: '店铺主营类目',
      dataIndex: 'name',
      key: 'name'
    }, {
      title: '可运营品牌主营类目',
      dataIndex: 'description',
      key: 'description'
    }];

    const menu = (
      <Menu onClick={this.handleMenuClick}>
        {end}
      </Menu>
    );

    if (shop === undefined) {
      // 店铺主营类目默认值
      const defaultOption = findshopmaincategory.data.defaultOption;
      // 店铺经营类型id
      const shopTypeId = findshopmaincategory.data.first.map((e) => {
        return e.id;
      });
      // 店铺经营类型说明(企业)
      const description = findshopmaincategory.data.first.map((e) => {
        return e.description;
      });

      // 未提交店铺信息
      return (
        <div>
          <Form onSubmit={this.handleSubmit}>
            {this.showMsg(result)}
            <FormItem
              {...formItemLayout}
              label="店铺经营类型">
              {getFieldDecorator('shopTypeId', {
                rules: [{
                  required: true
                }],
                initialValue: this.state.shopTypeId === null ? shopTypeId : this.state.shopTypeId
              })(
                <div>
                  <Button type="primary" onClick={this.firstBtnClcik}>{first}</Button>
                  <Divider type="vertical" />
                  <Dropdown overlay={menu}>
                    <Button>
                      {btn_text === '' ? '品牌店' : btn_text} <Icon type="down" />
                    </Button>
                  </Dropdown>
                </div>
              )}
              <div dangerouslySetInnerHTML={{ __html: this.state.description === '' ? description : this.state.description }}></div>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="店铺主营类目">
              {getFieldDecorator('mainCategoryId', {
                rules: [{
                  required: true, message: "请选择主营类目"
                }],
                initialValue: defaultOption
              })(
                <div>
                  {defaultOption ?
                    <Select defaultValue={defaultOption} placeholder="请选择主营类目" style={{ width: 190 }} onChange={this.onMainCategoryIdClick}>
                      {options}
                    </Select> : ''}
                </div>
              )}
              <a onClick={this.showMainAptitude}><Icon type="eye" />点此查看</a> 店铺主营类目与子类目对应关系
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="店铺名称">
              {getFieldDecorator('name', {
                rules: [{
                  required: true, message: '请输入店铺名称', whitespace: true
                }],
              })(
                <Input placeholder="请输入店铺名称" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="店铺头像">

              {getFieldDecorator('logo', {
                rules: [{
                  required: true, message: '请上传店铺头像!'
                }],
              })(
                <Upload
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={this.beforeUpload}
                  onChange={this.onLogo}
                  action="qcbbssapi/upload.cfi">
                  {logo ? <img src={logo} style={{ width: 100, height: 100 }} /> : this.uploadButton}
                </Upload>
              )}
              建议尺寸: 80像素x80像素
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="店铺背景图">

              {getFieldDecorator('background', {
              })(
                <Upload
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={this.beforeUpload}
                  onChange={this.onBackground}
                  action="qcbbssapi/upload.cfi">
                  {background ? <img src={background} style={{ width: 100, height: 100 }} /> : this.uploadButton}
                </Upload>
              )}
              建议尺寸: 750像素x300像素
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="店铺介绍">

              {getFieldDecorator('description', {
                rules: [{
                  required: true, message: '请填写店铺介绍!', whitespace: true
                }],
              })(
                <TextArea rows={4} placeholder="请填写店铺介绍" />
              )}
            </FormItem>
            <FormItem
              wrapperCol={{
                xs: { span: 24, offset: 0 },
                sm: { span: 16, offset: 8 },
              }}
            >
              <Button type="primary" htmlType="submit" loading={this.state.form_load}>保存，下一步</Button>
            </FormItem>
          </Form>
          <Modal
            width={1000}
            style={{ height: 100 }}
            visible={this.state.is_switch}
            onOk={this.handleCancel}
            title="店铺主营类目与子类目对应关系"
            onCancel={this.handleCancel}>
            <Table defaultExpandAllRows={true} pagination={false} dataSource={dataSource} columns={columns} />
          </Modal>
        </div>
      );
    } else {
      // 店铺主营类目默认值
      const defaultOption = shop.mainCategoryId;
      // 店铺经营类型按钮
      const btnText = btn_text ? btn_text : findshopmaincategory.data.platformShopType.name;
      // 店铺经营类型说明(企业)
      const description = findshopmaincategory.data.platformShopType.description;
      // 店铺logo
      const logo_img = logo ? logo : shop.logo;
      // 店铺background
      const background_img = background ? background : shop.background;

      // 已提交店铺信息
      return (
        <div>
          <Form onSubmit={this.handleSubmit}>
            {this.showMsg(result)}
            <FormItem
              {...formItemLayout}
              label="店铺经营类型">
              {getFieldDecorator('shopTypeId', {
                rules: [{
                  required: true
                }],
                initialValue: this.state.shopTypeId === null ? shop.shopTypeId : this.state.shopTypeId
              })(
                <div>
                  <Button type="primary" onClick={this.firstBtnClcik}>{first}</Button>
                  <Divider type="vertical" />
                  <Dropdown overlay={menu}>
                    <Button>
                      {btnText} <Icon type="down" />
                    </Button>
                  </Dropdown>
                </div>
              )}
              <div dangerouslySetInnerHTML={{ __html: this.state.description === '' ? description : this.state.description }}></div>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="店铺主营类目">
              {getFieldDecorator('mainCategoryId', {
                rules: [{
                  required: true, message: "请选择主营类目"
                }],
                initialValue: defaultOption
              })(
                <div>
                  {defaultOption ?
                    <Select defaultValue={defaultOption} placeholder="请选择主营类目" style={{ width: 190 }} onChange={this.onMainCategoryIdChange}>
                      {options}
                    </Select> : ''}
                </div>
              )}
              <a onClick={this.showMainAptitude}><Icon type="eye" />点此查看</a> 店铺主营类目与子类目对应关系
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="店铺名称">
              {getFieldDecorator('name', {
                rules: [{
                  required: true, message: '请输入店铺名称', whitespace: true
                }],
                initialValue: shop.name
              })(
                <Input placeholder="请输入店铺名称" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="店铺头像">

              {getFieldDecorator('logo', {
                rules: [{
                  required: true, message: '请上传店铺头像!'
                }],
                initialValue: shop.logo
              })(
                <Upload
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={this.beforeUpload}
                  onChange={this.onLogo}
                  action="qcbbssapi/upload.cfi">
                  {logo_img ? <img src={logo_img} style={{ width: 100, height: 100 }} /> : this.uploadButton}
                </Upload>
              )}
              建议尺寸: 80像素x80像素
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="店铺背景图">

              {getFieldDecorator('background', {
                initialValue: shop.background
              })(
                <Upload
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={this.beforeUpload}
                  onChange={this.onBackground}
                  action="qcbbssapi/upload.cfi">
                  {background_img ? <img src={background_img} style={{ width: 100, height: 100 }} /> : this.uploadButton}
                </Upload>
              )}
              建议尺寸: 750像素x300像素
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="店铺介绍">

              {getFieldDecorator('description', {
                rules: [{
                  required: true, message: '请填写店铺介绍!', whitespace: true
                }],
                initialValue: shop.description
              })(
                <TextArea rows={4} placeholder="请填写店铺介绍" />
              )}
            </FormItem>
            <FormItem
              wrapperCol={{
                xs: { span: 24, offset: 0 },
                sm: { span: 16, offset: 8 },
              }}
            >
              <Button type="primary" htmlType="submit" loading={this.state.form_load}>保存，下一步</Button>
            </FormItem>
          </Form>
          <Modal
            width={1000}
            style={{ height: 100 }}
            visible={this.state.is_switch}
            onOk={this.handleCancel}
            title="店铺主营类目与子类目对应关系"
            onCancel={this.handleCancel}>
            <Table defaultExpandAllRows={true} pagination={false} dataSource={dataSource} columns={columns} />
          </Modal>
        </div>
      );
    }
  }

  render() {
    if (this.state.redirect) {
      if(this.state.shopTypeId == 5){
        return <Redirect push to="result" />
      }else{
        return <Redirect push to="brand-aptitude" />
      }
    }
    return (
      <div className={styles.main}>
        <Tabs defaultActiveKey="3">
          <TabPane tab={<span><Icon type="check" />注册</span>} disabled></TabPane>
          <TabPane tab={<span><Icon type="check" />提交企业资质</span>} disabled></TabPane>
          <TabPane tab="3 填写店铺信息" key="3">
            {this.showShopAptitude()}
          </TabPane>
          <TabPane tab="4 提交品牌信息" key="4" disabled></TabPane>
        </Tabs>
      </div>
    );
  }
}
