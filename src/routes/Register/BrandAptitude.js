import React, { Component } from 'react';
import { connect } from 'dva';
import { Tabs, Icon, Form, Input, Button, Upload, Select, Alert, DatePicker, Message, Tag, Checkbox, Tooltip, Modal } from 'antd';
import moment from 'moment';
import styles from './Register.less';
import BrandAddForm from '../../components/BrandAddForm';
import { Redirect } from 'react-router-dom';
import { routerRedux } from 'dva/router';

const { Option } = Select;
const { Search } = Input;
const { TabPane } = Tabs;
const FormItem = Form.Item;
const { TextArea } = Input;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const CheckboxGroup = Checkbox.Group;

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
  submitBrandAptitude,
  loading
}) => ({
  submitBrandAptitude,
  loading: loading.models.submitBrandAptitude
}))

@Form.create()
export default class BrandAptitude extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    brandAuthType: undefined,
    authStart: undefined,
    authEnd: undefined,
    mainCategoryId: undefined,
    rectangleLogo: undefined,
    squareLogo: undefined,
    tradeMarkLicense: undefined,
    brandLicensing: undefined,
    qualityTesting: undefined,
    show_msg: false,
    brandSwitch: undefined,
    is_brand: undefined,
    form_load: false,
    visible: false,
    checkBoxList: [],
    urlData: [],
  }

  // 默认加载
  componentDidMount() {
    this.props.dispatch({
      type: 'submitBrandAptitude/findbyid',
    });
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
    const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
    if (!isJPG) {
      Message.error('图片格式不正确');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      Message.error('图片大于2MB');
    }
    return isJPG && isLt2M;
  }

  // 品牌长方形Logo上传
  onRectangleLogo = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
    }

    if (info.file.status === 'done') {
      this.setState({
        rectangleLogo: info.file.response.data,
        loading: false
      })
    }
  }

  // 品牌正方形Logo上传
  onSquareLogo = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
    }

    if (info.file.status === 'done') {
      this.setState({
        squareLogo: info.file.response.data,
        loading: false
      })
    }
  }

  // 商标注册证上传
  onTradeMarkLicense = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
    }

    if (info.file.status === 'done') {
      this.setState({
        tradeMarkLicense: info.file.response.data,
        loading: false
      })
    }
  }

  // 品牌授权书上传
  onBrandLicensing = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
    }

    if (info.file.status === 'done') {
      this.setState({
        brandLicensing: info.file.response.data,
        loading: false
      })
    }
  }

  // 质检报告/3C认证上传
  onQualityTesting = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
    }

    if (info.file.status === 'done') {
      this.setState({
        qualityTesting: info.file.response.data,
        loading: false
      })
    }
  }

  // 入驻新品牌(切换事件)
  onBandClick = (e) => {
    this.setState({
      is_brand: e
    });
  }

  // 授权类型选择
  onBrandAuthTypeChange = (value) => {
    this.setState({
      brandAuthType: value
    });
  }

  // 品牌授权有效期
  onDateTimeChange = (date, dateString) => {
    this.setState({
      authStart: dateString[0],
      authEnd: dateString[1]
    });
  }

  // 品牌主营类目
  onMainCategoryIdChange = (value) => {
    this.setState({
      mainCategoryId: value
    });
  }

  // 单个品牌提交 && 修改
  handleBrandSubmit = (e) => {
    const { submitBrandAptitude } = this.props;
    const { find } = submitBrandAptitude;
    const pfst = find.data.platformShopType;// 店铺的经营类型
    const { dispatch } = this.props;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
      if (!err) {
        const params = {
          brandId: fieldsValue.searchNames,
          mainCategoryId: fieldsValue.mainCategoryId,
          authStart: this.state.authStart,
          authEnd: this.state.authEnd,
          brandAuthType: fieldsValue.brandAuthType,
          shopTypeId: pfst.id,
          name: fieldsValue.newName,
          description: fieldsValue.description,
          squareLogo: this.state.squareLogo,
          rectangleLogo: this.state.rectangleLogo,
          tradeMarkLicense: this.state.tradeMarkLicense,
          brandLicensing: this.state.brandLicensing,
          qualityTesting: this.state.qualityTesting,
          channels: this.state.urlData
        }

        dispatch({
          type: 'submitBrandAptitude/save',
          payload: params
        });

        this.setState({
          show_msg: true,
          form_load: true,
        })
      }
    });
  }

  onTabsChange = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'submitBrandAptitude/findbyid',
      payload: { brandId: value }
    });
  }

  // 提示信息
  showMsg = (e) => {
    if (this.state.show_msg) {
      if (e && e.code === 0) {
        Message.success('提交成功！请等待审核结果');
        this.setState({
          show_msg: false,
        });

        setTimeout(() => {
          this.setState({
            form_load: false
          });
        }, 2000);
      }
      if (e && e.code === -1) {
        Message.error("该品牌已存在");
        this.setState({
          show_msg: false
        })
      }
    }
  }

  // 品牌新增切换
  isAddBrand = () => {
    const { is_brand, rectangleLogo, squareLogo } = this.state;
    const { getFieldDecorator } = this.props.form;
    const { submitBrandAptitude } = this.props;
    const { find } = submitBrandAptitude;
    const pfst = find.data.platformShopType;// 店铺的经营类型
    const brand = find.data.shopBrand;// 品牌信息
    const brands_option = find.data.brandsList.map((e) =>
      <Option value={e.id}>{e.name}</Option>
    );
    // 品牌描述
    const brand_dsc = <p>
      品牌简介需在200字以内，无敏感词，需要包括以下几点：<br />
      1）品牌名称/品牌定位<br />
      2）目标用户人群<br />
      3）设计风格/产品特色<br />
      4）品牌理念<br />
      5）品牌历史以及其他信息补充。<br />
      示例：XXX为中国0-6岁消费群体提供创新设计的玩具品牌，拥有众多卡通形象，风格清新简约，将欧洲优秀的智力开发方法与先进的产品创新理念相结合，打造具有XXX特色的时尚创新玩具
    </p>

    const brandSwitch = is_brand === undefined ? find.data.brandSwitch : is_brand;

    if (brand === undefined) {
      if (is_brand) {
        // 添加展示
        return (
          <div>
            <FormItem
              {...formItemLayout}
              label="品牌名称">
              {getFieldDecorator('newName', {
                rules: [{
                  required: true, message: "请输入品牌名称"
                }],
              })(
                <div>
                  <Input placeholder="填写品牌名称，最长30个字符" maxLength="30" onChange={() => this.changeee()} />
                  <span>从白租品牌库中<a onClick={() => this.onBandClick(false)}>查找</a>已有品牌</span>
                </div>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="品牌描述"
            >
              {getFieldDecorator('description', {
                rules: [{
                  required: true, message: "请输入品牌描述"
                }],
              })(
                <div>
                  <TextArea rows={4} placeholder="请输入品牌描述，200字以内" maxLength="200" />
                  <Tooltip placement="bottom" title={brand_dsc} arrowPointAtCenter>
                    <span><a onClick={() => this.newBrand(false)}>品牌简介填写规范</a></span>
                  </Tooltip>
                </div>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="品牌长方形Logo">
              {getFieldDecorator('rectangleLogo', {
                rules: [{
                  required: true, message: '请上传品牌长方形Logo!',
                }],
              })(
                <Upload
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  onChange={this.onRectangleLogo}
                  action="qcbbssapi/upload.cfi">
                  {rectangleLogo ? <img src={rectangleLogo} style={{ width: 100, height: 100 }} /> : this.uploadButton}
                </Upload>
              )}
              请提供白底logo，大小200x100像素，具体设计请查看logo设计要求 示例
                </FormItem>
            <FormItem
              {...formItemLayout}
              label="品牌正方形Logo">
              {getFieldDecorator('squareLogo', {
                rules: [{
                  required: true, message: '请上传品牌正方形Logo!',
                }],
              })(
                <Upload
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  onChange={this.onSquareLogo}
                  action="qcbbssapi/upload.cfi">
                  {squareLogo ? <img src={squareLogo} style={{ width: 100, height: 100 }} /> : this.uploadButton}
                </Upload>
              )}
              请提供大小200x200像素图片，具体设计请查看logo设计要求 示例
                </FormItem>
          </div>
        );
      } else {
        // 添加展示
        return (
          <div>
            <FormItem
              {...formItemLayout}
              label="品牌名称">

              {getFieldDecorator('searchName', {
                rules: [{
                  required: true, message: '请输入品牌名称'
                }],
              })(
                <Select
                  showSearch
                  style={{ width: 220 }}
                  placeholder="搜索品牌关键字与品牌名称"
                  optionFilterProp="children"
                  showArrow={false}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                  {brands_option}
                </Select>
              )}
              <span> 没有您要申请的品牌？马上<a onClick={() => this.onBandClick(true)}>入驻新品牌</a></span>
            </FormItem>
          </div>
        );
      }
    } else {
      if (brandSwitch) {
        const rectangle_logo = rectangleLogo ? rectangleLogo : brand.rectangleLogo;
        const square_logo = squareLogo ? squareLogo : brand.squareLogo;
        // 修改展示
        return (
          <div>
            <FormItem
              {...formItemLayout}
              label="品牌名称">
              {getFieldDecorator('newName', {
                rules: [{
                  required: true, message: "请输入品牌名称"
                }],
                initialValue: brand.name
              })(
                <Input placeholder="填写品牌名称，最长30个字符" maxLength="30" />
              )}
              <span>从白租品牌库中<a onClick={() => this.onBandClick(false)}>查找</a>已有品牌</span>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="品牌描述"
            >
              {getFieldDecorator('description', {
                rules: [{
                  required: true, message: "请输入品牌描述"
                }],
                initialValue: brand.description
              })(
                <TextArea rows={4} placeholder="请输入品牌描述，200字以内" maxLength="200" />

              )}
              <Tooltip placement="bottom" title={brand_dsc} arrowPointAtCenter>
                <span><a onClick={() => this.newBrand(false)}>品牌简介填写规范</a></span>
              </Tooltip>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="品牌长方形Logo">
              {getFieldDecorator('rectangleLogo', {
                rules: [{
                  required: true, message: '请上传品牌长方形Logo!'
                }],
                initialValue: rectangle_logo
              })(
                <Upload
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  onChange={this.onRectangleLogo}
                  action="qcbbssapi/upload.cfi">
                  {rectangle_logo ? <img src={rectangle_logo} style={{ width: 100, height: 100 }} /> : this.uploadButton}
                </Upload>
              )}
              请提供白底logo，大小200x100像素，具体设计请查看logo设计要求 示例
                </FormItem>
            <FormItem
              {...formItemLayout}
              label="品牌正方形Logo">
              {getFieldDecorator('squareLogo', {
                rules: [{
                  required: true, message: '请上传品牌正方形Logo!'
                }],
                initialValue: square_logo
              })(
                <Upload
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  onChange={this.onSquareLogo}
                  action="qcbbssapi/upload.cfi">
                  {square_logo ? <img src={square_logo} style={{ width: 100, height: 100 }} /> : this.uploadButton}
                </Upload>
              )}
              请提供大小200x200像素图片，具体设计请查看logo设计要求 示例
                </FormItem>
          </div>
        );
      } else {
        // 修改展示
        return (
          <div>
            <FormItem
              {...formItemLayout}
              label="品牌名称">

              {getFieldDecorator('searchName', {
                rules: [{
                  required: true, message: '请输入品牌名称'
                }],
                initialValue: brand.brandId
              })(
                <Select
                  showSearch
                  style={{ width: 220 }}
                  placeholder="搜索品牌关键字与品牌名称"
                  optionFilterProp="children"
                  showArrow={false}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                  {brands_option}
                </Select>
              )}
              <span> 没有您要申请的品牌？马上<a onClick={() => this.onBandClick(true)}>入驻新品牌</a></span>
            </FormItem>
          </div>
        );
      }
    }
  }

  // 电商渠道选择事件
  changeOtherUrl = (e) => {
    const { submitBrandAptitude } = this.props;
    const { result, find } = submitBrandAptitude;
    const newData = find.data.channelsList.map((item) => {
      let data = {
        id: item.otherEcommenceId,
        name: item.name,
        val: item.src
      };
      return data;
    });

    this.setState({
      checkBoxList: e,
      urlData: newData
    });
  }

  changeOtherUrlInput = (e, id, name, index) => {
    const { urlData } = this.state;
    const val = e.target.value;
    urlData[index] = { id, name, val };
    this.setState({
      urlData,
    });
  }

  // 品牌信息展示
  addBrand = () => {
    const { getFieldDecorator } = this.props.form;
    const { tradeMarkLicense, brandLicensing, qualityTesting, brandAuthType } = this.state;
    const { submitBrandAptitude } = this.props;
    const { result, find } = submitBrandAptitude;
    const pfst = find.data.platformShopType;// 店铺的经营类型
    const smoc = find.data.shopMainOperationCategories;// 店铺的主营类目(单条)
    const channelsList = find.data.channelsList;// 其他电商渠道
    const brand = find.data.shopBrand;//品牌信息
    let { checkBoxList } = this.state;
    if (!checkBoxList) {
      checkBoxList = [];
    }
    //

    // 授权类型
    const bat_option = find.data.batList.map((e) =>
      <Option value={e.id}>{e.name}</Option>
    );

    // 主营类目
    const smoc_option = find.data.mocList.map((e) =>
      <Option value={e.id}>{e.name}</Option>
    );

    // 电商渠道展示URL
    let channel_array = [];
    if (channelsList !== undefined) {
      find.data.channelsList.map((e) =>
        channel_array.push(e.src)
      );
    }
    // 电商渠道展示选中项
    let check_array = [];
    if (channelsList !== undefined) {
      find.data.channelsList.map((e) =>
        check_array.push(e.name)
      );
    }

    // 其他电商渠道
    const channel_ck = find.data.oecList.map((item, index) =>
      <span>
        <Checkbox value={item.name}>{item.name}</Checkbox>
        <Input style={{ width: 300 }} defaultValue={channel_array[index]} placeholder="店铺地址url" onBlur={e => this.changeOtherUrlInput(e, item.id, item.name, index)} />
      </span>
    );

    // 标题
    const alertTitle = <span><strong>{find.data.shopName}</strong> 信息如下：</span>;
    const alertDescription = <p>
      当前店铺类型：<span style={{ color: 'red' }}>{pfst.name}</span>，可选品牌数：<span style={{ color: 'red' }}>{pfst.brandNum}个</span>；<br />
      店铺主营类目：<strong>{smoc.name}</strong> 可运营子类目为：<strong>{smoc.description}</strong>
    </p>

    if (brand === undefined) {// 品牌信息为空
      return (
        <Form onSubmit={this.handleBrandSubmit}>
          <FormItem>
            <Alert
              message={alertTitle}
              description={alertDescription}
              type="info"
              showIcon
            />
          </FormItem>
          {this.isAddBrand()}
          <FormItem
            {...formItemLayout}
            label="授权类型">

            {getFieldDecorator('brandAuthType', {
              rules: [{
                required: true, message: '请选择授权类型'
              }]
            })(
              <Select style={{ width: 190 }} onChange={this.onBrandAuthTypeChange} placeholder="请选择授权类型">
                {bat_option}
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="品牌授权有效期">

            {getFieldDecorator('dateTime', {
              rules: [{
                required: true, message: '请选择品牌授权有效期'
              }]
            })(
              <RangePicker onChange={this.onDateTimeChange} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="品牌主营类目">

            {getFieldDecorator('mainCategoryId', {
              rules: [{
                required: true, message: '品牌主营类目'
              }],
            })(
              <Select style={{ width: 190 }} onChange={this.onMainCategoryIdChange} placeholder="请选择品牌主营类目">
                {smoc_option}
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="其他电商渠道">

            {getFieldDecorator('url')(
              <Checkbox.Group style={{ width: '100%' }} onChange={this.changeOtherUrl}>
                {channel_ck}
              </Checkbox.Group>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="商标注册证">

            {getFieldDecorator('tradeMarkLicense', {
              rules: [{
                required: true, message: '请上传商标注册证!',
              }],
            })(
              <Upload
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                beforeUpload={this.beforeUpload}
                onChange={this.onTradeMarkLicense}
                action="qcbbssapi/upload.cfi">
                {tradeMarkLicense ? <img src={tradeMarkLicense} style={{ width: 100, height: 100 }} /> : this.uploadButton}
              </Upload>
            )}
            <p style={{ fontSize: 12, lineHeight: '20px' }}>
              若商标为个人所有，且为法人，请一并上传营业执照
              支持png，jpg，gif等基本图片格式，图片文件大小需小于2M
            </p>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="品牌授权书">

            {getFieldDecorator('brandLicensing', {
              rules: [{
                required: true, message: '请上传品牌授权书!',
              }],
            })(
              <Upload
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                beforeUpload={this.beforeUpload}
                onChange={this.onBrandLicensing}
                action="qcbbssapi/upload.cfi">
                {brandLicensing ? <img src={brandLicensing} style={{ width: 100, height: 100 }} /> : this.uploadButton}
              </Upload>
            )}
            <p style={{ fontSize: 12, lineHeight: '20px' }}>
              若非一级代理，请上传各级代理的正规品牌授权文件或证明文件<br />
              选择旗舰授权类型的品牌必需按照旗舰授权书模板样式上传<br />
              支持png，jpg，gif等基本图片格式，图片文件大小需小于2M
            </p>
            <span><a href="http://dev.zudeapp.com/b/public/company/shou.pdf" target="_blank">品牌授权书</a>&nbsp;<a href="http://dev.zudeapp.com/b/public/company/qijian.pdf" target="_blank">旗舰授权书模板</a></span>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="质检报告/3C认证">

            {getFieldDecorator('qualityTesting', {
              rules: [{
                required: true, message: '请上传质检报告/3C认证!',
              }],
            })(
              <Upload
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                beforeUpload={this.beforeUpload}
                onChange={this.onQualityTesting}
                action="qcbbssapi/upload.cfi">
                {qualityTesting ? <img src={qualityTesting} style={{ width: 100, height: 100 }} /> : this.uploadButton}
              </Upload>
            )}
            <p style={{ fontSize: 12, lineHeight: '20px' }}>
              质检报告及其他资质包括但不限于：<br />
              1、每个品牌必须提供一份两年内的质检报告（一次性卫生用品要求一年内的质检报告）查看详细说明<br />
              2、符合强制性认证产品目录的商品（童车，童床，玩具类）必须提供CCC认证《强制性产品认证证书》<br />
              3、进口商品需提供《中华人民共和国海关进口货物报送单》和《入境货物检验检疫证明》<br />
              4、食品，美妆，洗护用品等特殊类目资质要求请查看明细<br />
              支持png，jpg，gif等基本图片格式，图片文件大小需小于2M
        </p>
          </FormItem>
          <FormItem
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: { span: 16, offset: 8 },
            }}>

            <Button type="primary" htmlType="submit" loading={this.state.form_load}>提交审核</Button>
          </FormItem>
        </Form>
      );
    } else {
      const authStart = brand.authStart;// 有效期开始时间 
      const authEnd = brand.authEnd;// 有效期结束时间
      // 渲染品牌资质(待审核, 审核失败)
      const trade_mark_license = tradeMarkLicense ? tradeMarkLicense : find.data.tradeMarkLicense;// 商标注册证
      const brand_licensing = brandLicensing ? brandLicensing : find.data.brandLicensing;// 品牌授权书
      const quality_testing = qualityTesting ? qualityTesting : find.data.qualityTesting;// 质检报告/3C认证
      return (
        <Form onSubmit={this.handleBrandSubmit}>
          <FormItem>
            <Alert
              message={alertTitle}
              description={alertDescription}
              type="info"
              showIcon
            />
          </FormItem>
          {this.isAddBrand()}
          <FormItem
            {...formItemLayout}
            label="授权类型">

            {getFieldDecorator('brandAuthType', {
              rules: [{
                required: true, message: '请选择授权类型'
              }],
              initialValue: brand.brandAuthType
            })(
              <Select style={{ width: 190 }} onChange={this.onBrandAuthTypeChange} placeholder="请选择授权类型">
                {bat_option}
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="品牌授权有效期">

            {getFieldDecorator('dateTime', {
              rules: [{
                required: true, message: '请选择品牌授权有效期'
              }],
              initialValue: [authStart, authEnd]
            })(
              <div>
                {authStart && authEnd !== '' ?
                  <RangePicker
                    defaultValue={[moment(authStart, "YYYY-MM-DD"), moment(authEnd, "YYYY-MM-DD")]}
                    format={"YYYY-MM-DD"}
                    onChange={this.onDateTimeChange} /> : ''}
              </div>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="品牌主营类目">

            {getFieldDecorator('mainCategoryId', {
              rules: [{
                required: true, message: '品牌主营类目'
              }],
              initialValue: brand.mainCategoryId
            })(
              <Select style={{ width: 190 }} onChange={this.onMainCategoryIdChange} placeholder="请选择品牌主营类目">
                {smoc_option}
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="其他电商渠道">

            {getFieldDecorator('url', {
              initialValue: check_array
            })(
              <Checkbox.Group style={{ width: '100%' }} onChange={this.changeOtherUrl}>
                {channel_ck}
              </Checkbox.Group>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="商标注册证">

            {getFieldDecorator('tradeMarkLicense', {
              rules: [{
                required: true, message: '请上传商标注册证!',
              }],
              initialValue: trade_mark_license
            })(
              <Upload
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                beforeUpload={this.beforeUpload}
                onChange={this.onTradeMarkLicense}
                action="qcbbssapi/upload.cfi">
                {trade_mark_license ? <img src={trade_mark_license} style={{ width: 100, height: 100 }} /> : this.uploadButton}
              </Upload>
            )}
            <p style={{ fontSize: 12, lineHeight: '20px' }}>
              若商标为个人所有，且为法人，请一并上传营业执照
              支持png，jpg，gif等基本图片格式，图片文件大小需小于2M
            </p>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="品牌授权书">

            {getFieldDecorator('brandLicensing', {
              rules: [{
                required: true, message: '请上传品牌授权书!',
              }],
              initialValue: brand_licensing
            })(
              <Upload
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                beforeUpload={this.beforeUpload}
                onChange={this.onBrandLicensing}
                action="qcbbssapi/upload.cfi">
                {brand_licensing ? <img src={brand_licensing} style={{ width: 100, height: 100 }} /> : this.uploadButton}
              </Upload>
            )}
            <p style={{ fontSize: 12, lineHeight: '20px' }}>
              若非一级代理，请上传各级代理的正规品牌授权文件或证明文件<br />
              选择旗舰授权类型的品牌必需按照旗舰授权书模板样式上传<br />
              支持png，jpg，gif等基本图片格式，图片文件大小需小于2M
            </p>
            <span><a href="http://dev.zudeapp.com/b/public/company/shou.pdf" target="_blank">品牌授权书</a>&nbsp;<a href="http://dev.zudeapp.com/b/public/company/qijian.pdf" target="_blank">旗舰授权书模板</a></span>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="质检报告/3C认证">

            {getFieldDecorator('qualityTesting', {
              rules: [{
                required: true, message: '请上传质检报告/3C认证!',
              }],
              initialValue: quality_testing
            })(
              <Upload
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                beforeUpload={this.beforeUpload}
                onChange={this.onQualityTesting}
                action="qcbbssapi/upload.cfi">
                {quality_testing ? <img src={quality_testing} style={{ width: 100, height: 100 }} /> : this.uploadButton}
              </Upload>
            )}
            <p style={{ fontSize: 12, lineHeight: '20px' }}>
              质检报告及其他资质包括但不限于：<br />
              1、每个品牌必须提供一份两年内的质检报告（一次性卫生用品要求一年内的质检报告）查看详细说明<br />
              2、符合强制性认证产品目录的商品（童车，童床，玩具类）必须提供CCC认证《强制性产品认证证书》<br />
              3、进口商品需提供《中华人民共和国海关进口货物报送单》和《入境货物检验检疫证明》<br />
              4、食品，美妆，洗护用品等特殊类目资质要求请查看明细<br />
              支持png，jpg，gif等基本图片格式，图片文件大小需小于2M
            </p>
          </FormItem>
          <FormItem
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: { span: 16, offset: 8 },
            }}>

            <Button type="primary" htmlType="submit" loading={this.state.form_load}>保存当前品牌</Button>
            &nbsp;&nbsp;
            <Button type="primary" onClick={this.showModal}>添加品牌</Button>
          </FormItem>
        </Form>
      );
    }
  }

  onEdit = (targetKey, action) => {
    this.props.dispatch({
      type: 'submitBrandAptitude/delete',
      payload: { brandId: targetKey }
    });

    this.props.dispatch({
      type: 'submitBrandAptitude/findbyid',
    });
  }

  // 品牌信息渲染
  showBrands = () => {
    const { getFieldDecorator } = this.props.form;
    const { tradeMarkLicense, brandLicensing, qualityTesting, brandAuthType } = this.state;
    const { submitBrandAptitude } = this.props;
    const { result, find } = submitBrandAptitude;
    const pfst = find.data.platformShopType;// 店铺的经营类型
    const smoc = find.data.shopMainOperationCategories;// 店铺的主营类目(单条)
    const channelsList = find.data.channelsList;// 其他电商渠道
    const brand = find.data.shopBrand;//品牌信息
    let { checkBoxList } = this.state;
    if (!checkBoxList) {
      checkBoxList = [];
    }
    // 授权类型
    const bat_option = find.data.batList.map((e) =>
      <Option value={e.id}>{e.name}</Option>
    );

    // 主营类目
    const smoc_option = find.data.mocList.map((e) =>
      <Option value={e.id}>{e.name}</Option>
    );

    // 标题
    const alertTitle = <span><strong>{find.data.shopName}</strong> 信息如下：</span>;
    const alertDescription = <p>
      当前店铺类型：<span style={{ color: 'red' }}>{pfst.name}</span>，可选品牌数：<span style={{ color: 'red' }}>{pfst.brandNum}个</span>；<br />
      店铺主营类目：<strong>{smoc.name}</strong> 可运营子类目为：<strong>{smoc.description}</strong>
    </p>

    let channel_array = [];
    // 电商渠道展示URL
    if (channelsList !== undefined) {
      find.data.channelsList.map((e) =>
        channel_array.push(e.src)
      );
    }


    // 电商渠道展示选中项
    let check_array = [];
    if (channelsList !== undefined) {
      find.data.channelsList.map((e) =>
        check_array.push(e.name)
      );
    }

    // 其他电商渠道
    const channel_ck = find.data.oecList.map((item, index) =>
      <span>
        <Checkbox value={item.name}>{item.name}</Checkbox>
        <Input style={{ width: 300 }} defaultValue={channel_array[index]} placeholder="店铺地址url" onBlur={e => this.changeOtherUrlInput(e, item.id, item.name, index)} />
      </span>
    );

    // 单个品牌
    if (pfst.brandNum === 0 || pfst.brandNum === 1) {
      if (brand === undefined) {// 品牌信息为空
        return (
          <Form onSubmit={this.handleBrandSubmit}>
            <FormItem>
              <Alert
                message={alertTitle}
                description={alertDescription}
                type="info"
                showIcon
              />
            </FormItem>
            {this.isAddBrand()}
            <FormItem
              {...formItemLayout}
              label="授权类型">

              {getFieldDecorator('brandAuthType', {
                rules: [{
                  required: true, message: '请选择授权类型'
                }]
              })(
                <Select style={{ width: 190 }} onChange={this.onBrandAuthTypeChange} placeholder="请选择授权类型">
                  {bat_option}
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="品牌授权有效期">

              {getFieldDecorator('dateTime', {
                rules: [{
                  required: true, message: '请选择品牌授权有效期'
                }]
              })(
                <RangePicker onChange={this.onDateTimeChange} />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="品牌主营类目">

              {getFieldDecorator('mainCategoryId', {
                rules: [{
                  required: true, message: '品牌主营类目'
                }],
              })(
                <Select style={{ width: 190 }} onChange={this.onMainCategoryIdChange} placeholder="请选择品牌主营类目">
                  {smoc_option}
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="其他电商渠道">

              {getFieldDecorator('url', {
              })(
                <Checkbox.Group style={{ width: '100%' }} onChange={this.changeOtherUrl}>
                  {channel_ck}
                </Checkbox.Group>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="商标注册证">

              {getFieldDecorator('tradeMarkLicense', {
                rules: [{
                  required: true, message: '请上传商标注册证!',
                }],
              })(
                <Upload
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={this.beforeUpload}
                  onChange={this.onTradeMarkLicense}
                  action="qcbbssapi/upload.cfi">
                  {tradeMarkLicense ? <img src={tradeMarkLicense} style={{ width: 100, height: 100 }} /> : this.uploadButton}
                </Upload>
              )}
              <p style={{ fontSize: 12, lineHeight: '20px' }}>
                若商标为个人所有，且为法人，请一并上传营业执照
                支持png，jpg，gif等基本图片格式，图片文件大小需小于2M
              </p>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="品牌授权书">

              {getFieldDecorator('brandLicensing', {
                rules: [{
                  required: true, message: '请上传品牌授权书!',
                }],
              })(
                <Upload
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={this.beforeUpload}
                  onChange={this.onBrandLicensing}
                  action="qcbbssapi/upload.cfi">
                  {brandLicensing ? <img src={brandLicensing} style={{ width: 100, height: 100 }} /> : this.uploadButton}
                </Upload>
              )}
              <p style={{ fontSize: 12, lineHeight: '20px' }}>
                若非一级代理，请上传各级代理的正规品牌授权文件或证明文件<br />
                选择旗舰授权类型的品牌必需按照旗舰授权书模板样式上传<br />
                支持png，jpg，gif等基本图片格式，图片文件大小需小于2M
              </p>
              <span><a href="http://dev.zudeapp.com/b/public/company/shou.pdf" target="_blank">品牌授权书</a>&nbsp;<a href="http://dev.zudeapp.com/b/public/company/qijian.pdf" target="_blank">旗舰授权书模板</a></span>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="质检报告/3C认证">

              {getFieldDecorator('qualityTesting', {
                rules: [{
                  required: true, message: '请上传质检报告/3C认证!',
                }],
              })(
                <Upload
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={this.beforeUpload}
                  onChange={this.onQualityTesting}
                  action="qcbbssapi/upload.cfi">
                  {qualityTesting ? <img src={qualityTesting} style={{ width: 100, height: 100 }} /> : this.uploadButton}
                </Upload>
              )}
              <p style={{ fontSize: 12, lineHeight: '20px' }}>
                质检报告及其他资质包括但不限于：<br />
                1、每个品牌必须提供一份两年内的质检报告（一次性卫生用品要求一年内的质检报告）查看详细说明<br />
                2、符合强制性认证产品目录的商品（童车，童床，玩具类）必须提供CCC认证《强制性产品认证证书》<br />
                3、进口商品需提供《中华人民共和国海关进口货物报送单》和《入境货物检验检疫证明》<br />
                4、食品，美妆，洗护用品等特殊类目资质要求请查看明细<br />
                支持png，jpg，gif等基本图片格式，图片文件大小需小于2M
          </p>
            </FormItem>
            <FormItem
              wrapperCol={{
                xs: { span: 24, offset: 0 },
                sm: { span: 16, offset: 8 },
              }}>

              <Button type="primary" htmlType="submit" loading={this.state.form_load}>提交审核</Button>
            </FormItem>
          </Form>
        );
      } else {
        const authStart = brand.authStart;// 有效期开始时间 
        const authEnd = brand.authEnd;// 有效期结束时间
        // 渲染品牌资质(待审核, 审核失败)
        const trade_mark_license = tradeMarkLicense ? tradeMarkLicense : find.data.tradeMarkLicense;// 商标注册证
        const brand_licensing = brandLicensing ? brandLicensing : find.data.brandLicensing;// 品牌授权书
        const quality_testing = qualityTesting ? qualityTesting : find.data.qualityTesting;// 质检报告/3C认证
        return (
          <Form onSubmit={this.handleBrandSubmit}>
            <FormItem>
              <Alert
                message={alertTitle}
                description={alertDescription}
                type="info"
                showIcon
              />
            </FormItem>
            {this.isAddBrand()}
            <FormItem
              {...formItemLayout}
              label="授权类型">

              {getFieldDecorator('brandAuthType', {
                rules: [{
                  required: true, message: '请选择授权类型'
                }],
                initialValue: brand.brandAuthType
              })(
                <Select style={{ width: 190 }} onChange={this.onBrandAuthTypeChange} placeholder="请选择授权类型">
                  {bat_option}
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="品牌授权有效期">

              {getFieldDecorator('dateTime', {
                rules: [{
                  required: true, message: '请选择品牌授权有效期'
                }],
                initialValue: [authStart, authEnd]
              })(
                <div>
                  {authStart && authEnd !== '' ?
                    <RangePicker
                      defaultValue={[moment(authStart, "YYYY-MM-DD"), moment(authEnd, "YYYY-MM-DD")]}
                      format={"YYYY-MM-DD"}
                      onChange={this.onDateTimeChange} /> : ''}
                </div>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="品牌主营类目">

              {getFieldDecorator('mainCategoryId', {
                rules: [{
                  required: true, message: '品牌主营类目'
                }],
                initialValue: brand.mainCategoryId
              })(
                <Select style={{ width: 190 }} onChange={this.onMainCategoryIdChange} placeholder="请选择品牌主营类目">
                  {smoc_option}
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="其他电商渠道">

              {getFieldDecorator('url', {
                initialValue: check_array
              })(
                <Checkbox.Group style={{ width: '100%' }} onChange={this.changeOtherUrl}>
                  {channel_ck}
                </Checkbox.Group>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="商标注册证">

              {getFieldDecorator('tradeMarkLicense', {
                rules: [{
                  required: true, message: '请上传商标注册证!',
                }],
                initialValue: trade_mark_license
              })(
                <Upload
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={this.beforeUpload}
                  onChange={this.onTradeMarkLicense}
                  action="qcbbssapi/upload.cfi">
                  {trade_mark_license ? <img src={trade_mark_license} style={{ width: 100, height: 100 }} /> : this.uploadButton}
                </Upload>
              )}
              <p style={{ fontSize: 12, lineHeight: '20px' }}>
                若商标为个人所有，且为法人，请一并上传营业执照
                支持png，jpg，gif等基本图片格式，图片文件大小需小于2M
              </p>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="品牌授权书">

              {getFieldDecorator('brandLicensing', {
                rules: [{
                  required: true, message: '请上传品牌授权书!',
                }],
                initialValue: brand_licensing
              })(
                <Upload
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={this.beforeUpload}
                  onChange={this.onBrandLicensing}
                  action="qcbbssapi/upload.cfi">
                  {brand_licensing ? <img src={brand_licensing} style={{ width: 100, height: 100 }} /> : this.uploadButton}
                </Upload>
              )}
              <p style={{ fontSize: 12, lineHeight: '20px' }}>
                若非一级代理，请上传各级代理的正规品牌授权文件或证明文件<br />
                选择旗舰授权类型的品牌必需按照旗舰授权书模板样式上传<br />
                支持png，jpg，gif等基本图片格式，图片文件大小需小于2M
              </p>
              <span><a href="http://dev.zudeapp.com/b/public/company/shou.pdf" target="_blank">品牌授权书</a>&nbsp;<a href="http://dev.zudeapp.com/b/public/company/qijian.pdf" target="_blank">旗舰授权书模板</a></span>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="质检报告/3C认证">

              {getFieldDecorator('qualityTesting', {
                rules: [{
                  required: true, message: '请上传质检报告/3C认证!',
                }],
                initialValue: quality_testing
              })(
                <Upload
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={this.beforeUpload}
                  onChange={this.onQualityTesting}
                  action="qcbbssapi/upload.cfi">
                  {quality_testing ? <img src={quality_testing} style={{ width: 100, height: 100 }} /> : this.uploadButton}
                </Upload>
              )}
              <p style={{ fontSize: 12, lineHeight: '20px' }}>
                质检报告及其他资质包括但不限于：<br />
                1、每个品牌必须提供一份两年内的质检报告（一次性卫生用品要求一年内的质检报告）查看详细说明<br />
                2、符合强制性认证产品目录的商品（童车，童床，玩具类）必须提供CCC认证《强制性产品认证证书》<br />
                3、进口商品需提供《中华人民共和国海关进口货物报送单》和《入境货物检验检疫证明》<br />
                4、食品，美妆，洗护用品等特殊类目资质要求请查看明细<br />
                支持png，jpg，gif等基本图片格式，图片文件大小需小于2M
              </p>
            </FormItem>
            <FormItem
              wrapperCol={{
                xs: { span: 24, offset: 0 },
                sm: { span: 16, offset: 8 },
              }}>

              <Button type="primary" htmlType="submit" loading={this.state.form_load}>保存当前品牌</Button>
            </FormItem>
          </Form>
        );
      }
    } else {// 多个品牌
      if (brand === undefined) {
        const panes = [{ title: '添加品牌', content: this.addBrand(), key: "1" }];
        return (
          <Tabs
            hideAdd
            tabPosition="left"
            activeKey="1"
            type="editable-card">
            {panes.map(pane => <TabPane tab={pane.title} key={pane.key}>{pane.content}</TabPane>)}
          </Tabs>
        );
      } else {
        const panes = find.data.sbList.map((e) => {
          const newData = {
            title: e.name,
            content: this.addBrand(),
            key: e.id
          }
          return newData;
        });

        return (
          <div>
            <Tabs
              hideAdd
              tabPosition="left"
              onChange={this.onTabsChange}
              type="editable-card"
              onEdit={this.onEdit}
              activeKey={`${brand.id}`}>
              {panes.map(pane => <TabPane tab={pane.title} key={pane.key}>{pane.content}</TabPane>)}
            </Tabs>
            <Modal
              width={1000}
              title="添加品牌"
              visible={this.state.visible}
              onOk={this.handleCancel}
              destroyOnClose={true}
              footer={null}
              onCancel={this.handleCancel}>
              <BrandAddForm />
            </Modal>
          </div>
        );
      }
    }
  }

  // 打开modal
  showModal = () => {
    this.setState({ visible: true });
  }

  handleCancel = () => {
    this.setState({
      visible: false
    });
  }

  render() {
    const { submitBrandAptitude } = this.props;
    const { result, find } = submitBrandAptitude;
    if (this.state.redirect) {
      return <Redirect push to="register-result" />;
    }
    return (
      <div className={styles.main}>
        <Tabs defaultActiveKey="3">
          <TabPane tab={<span><Icon type="check" />注册</span>} disabled>1</TabPane>
          <TabPane tab={<span><Icon type="check" />提交企业资质</span>} disabled>2</TabPane>
          <TabPane tab={<span><Icon type="check" />填写店铺信息</span>} disabled>3</TabPane>
          <TabPane tab="4 提交品牌信息" key="4">
            {this.showMsg(result)}
            {this.showBrands()}
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
