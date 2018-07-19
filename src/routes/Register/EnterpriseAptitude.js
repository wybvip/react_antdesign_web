import React, { Component } from 'react';
import { connect } from 'dva';
import { Tabs, Icon, Form, Input, Button, Upload, Modal, DatePicker, Select, Radio, Cascader, Message, Divider, InputNumber } from 'antd';
import styles from './Register.less';
import Configure from '../../conf/configure';
import moment from 'moment';
import { Redirect } from 'react-router-dom';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const Option = Select.Option;
const { TextArea } = Input;
const RadioGroup = Radio.Group;

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
  loading,
  findDistrict,
  submitEnterpriseAptitude,
}) => ({
  loading: loading.models.findDistrict,
  findDistrict,
  submitEnterpriseAptitude,
}))

@Form.create()
export default class EnterpriseAptitude extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    loading: false,
    blt_switch: false, // 营业执照扫描件范例
    businessLicenseThumbs: '', // 营业执照扫描件
    ift_switch: false, // 法人身份证正面范例
    idFrontThumbs: '', // 法人身份证正面
    ibt_switch: false, // 法人身份证反面范例
    idBackThumbs: '', // 法人身份证反面
    olt_switch: false, // 组织机构代码扫描件范例
    organizationLicenseThumbs: '', // 组织机构代码扫描件
    tlt_switch: false, // 税务登记证件扫描件(国税或地税)范例
    taxLicenseThumbs: '', // 税务登记证件扫描件(国税或地税)
    img_url: '', // 范例图片
    isShow: true,
    licenseStart: '', // 营业执照有效期开始时间
    licenseEnd: '', // 营业执照有效期结束时间
    licenseProvince: '', // 营业执照所在省
    licenseCity: '',// 营业执照所在市
    show_msg: false,
    form_load: false,
    redirect: false
  };

  // 默认加载
  componentDidMount() {
    const { dispatch } = this.props;
    const { submitEnterpriseAptitude } = this.props;
    const { result, findbyid } = submitEnterpriseAptitude;
    const { sei } = findbyid.data; // 企业信息

    this.setState({
      isShow: (sei.isMerged === 1 ? true : false)
    });

    dispatch({
      type: 'findDistrict/fetch',
      payload: { type: 1 }
    });

    dispatch({
      type: 'submitEnterpriseAptitude/find',
    })
  }

  // 上传按钮
  uploadButton = (
    <div>
      <Icon type={this.state.loading ? 'loading' : 'plus'} />
      <div className="ant-upload-text">点击上传</div>
    </div>
  );

  // 附件范例单击事件
  // num 0 营业执照扫描件范例 1 法人身份证正面范例 2 法人身份证反面范例 3 组织机构代码扫描件范例 4 税务登记证件扫描件(国税或地税)范例
  onClickDemo = (num) => {
    if (num === 0) {
      this.setState({
        blt_switch: true,
        img_url: 'http://dev.zudeapp.com/b/public/company/ex_zhizhao_min.jpg'
      })
    } else if (num === 1) {
      this.setState({
        ift_switch: true,
        img_url: 'http://dev.zudeapp.com/b/public/company/ex_shenfenzheng_z.jpg'
      })
    } else if (num === 2) {
      this.setState({
        ibt_switch: true,
        img_url: 'http://dev.zudeapp.com/b/public/company/ex_shenfenzheng_f.jpg'
      })
    } else if (num === 3) {
      this.setState({
        olt_switch: true,
        img_url: 'http://dev.zudeapp.com/b/public/company/ex_jigou.jpg'
      })
    } else {
      this.setState({
        tlt_switch: true,
        img_url: 'http://dev.zudeapp.com/b/public/company/ex_shuiwu.jpg'
      })
    }
  }

  // 附件范例关闭事件
  // num 0 营业执照扫描件范例 1 法人身份证正面范例 2 法人身份证反面范例 3 组织机构代码扫描件范例 4 税务登记证件扫描件(国税或地税)范例
  handleClose = (num) => {
    if (num === 0) {
      this.setState({ blt_switch: false })
    } else if (num === 1) {
      this.setState({ ift_switch: false })
    } else if (num === 2) {
      this.setState({ ibt_switch: false })
    } else if (num === 3) {
      this.setState({ olt_switch: false })
    } else {
      this.setState({ tlt_switch: false })
    }
  }

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

  // 营业执照扫描件上传
  onBusinessLicenseThumbs = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
    }

    if (info.file.status === 'done') {
      this.setState({
        businessLicenseThumbs: info.file.response.data,
        loading: false
      })
    }
  }

  // 法人代表身份证正面上传
  onIdFrontThumbs = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
    }

    if (info.file.status === 'done') {
      this.setState({
        idFrontThumbs: info.file.response.data,
        loading: false
      })
    }
  }

  // 法人代表身份证反面上传
  onIdBackThumbs = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
    }

    if (info.file.status === 'done') {
      this.setState({
        idBackThumbs: info.file.response.data,
        loading: false
      })
    }
  }

  // 组织机构代码证扫描件上传
  onOrganizationLicenseThumbs = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
    }

    if (info.file.status === 'done') {
      this.setState({
        organizationLicenseThumbs: info.file.response.data,
        loading: false
      })
    }
  }

  // 税务登记证件扫描件上传
  onTaxLicenseThumbs = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
    }

    if (info.file.status === 'done') {
      this.setState({
        taxLicenseThumbs: info.file.response.data,
        loading: false
      })
    }
  }

  // 营业执照有效期选择器
  onBusinessLicenseDatePick = (date, dateString) => {
    this.setState({
      licenseStart: dateString[0],
      licenseEnd: dateString[1]
    })
  }

  // 组织机构代码有效期选择器
  onInstitutionalFrameworkDatePick = (date, dateString) => {
    this.setState({
      oclStart: dateString[0],
      oclEnd: dateString[1]
    })
  }

  // 获取省份数据
  onDistrict = (value) => {
    this.setState({
      licenseProvince: value[0],
      licenseCity: value[1]
    })
  }

  // radio选择
  onRadioGroup = (e) => {
    const { value } = e.target;
    if (value === 1) {
      this.setState({
        isShow: true,
      });
    } else {
      this.setState({
        isShow: false,
      });
    }
  }

  // 提交企业资质信息
  handleSubmit = (e) => {
    const { dispatch } = this.props;

    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) {
        return;
      } else {
        const params = {
          businessLicenseThumbs: this.state.businessLicenseThumbs,
          idFrontThumbs: this.state.idFrontThumbs,
          idBackThumbs: this.state.idBackThumbs,
          organizationLicenseThumbs: this.state.organizationLicenseThumbs,
          taxLicenseThumbs: this.state.taxLicenseThumbs,
          name: fieldsValue.name,
          registrationCapital: fieldsValue.registrationCapital,
          businessLicenseNo: fieldsValue.businessLicenseNo,
          licenseStart: this.state.licenseStart,
          licenseEnd: this.state.licenseEnd,
          licenseProvince: this.state.licenseProvince,
          licenseCity: this.state.licenseCity,
          realname: fieldsValue.realname,
          contactName: fieldsValue.contactName,
          contactTelephone: fieldsValue.contactTelephone,
          contactQq: fieldsValue.contactQq,
          contactEmail: fieldsValue.contactEmail,
          isMerged: fieldsValue.isMerged,
          oclStart: this.state.oclStart,
          oclEnd: this.state.oclEnd,
          identity: fieldsValue.identity,
          licenseStreet: fieldsValue.licenseStreet
        };

        dispatch({
          type: 'submitEnterpriseAptitude/save',
          payload: params
        });

        this.setState({
          show_msg: true,
          form_load: true
        });
      }
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

  // 渲染企业资质
  showEnterpriseAptitude = () => {
    const { getFieldDecorator } = this.props.form;
    const { businessLicenseThumbs, idFrontThumbs, idBackThumbs, organizationLicenseThumbs, taxLicenseThumbs } = this.state;
    const { data } = this.props.findDistrict.district;// 省市数据
    const { submitEnterpriseAptitude } = this.props;
    const { result, findbyid } = submitEnterpriseAptitude;

    // 地区检索
    function filter(inputValue, path) {
      return (path.some(option => (option.label).toLowerCase().indexOf(inputValue.toLowerCase()) > -1));
    }

    console.log("findbyid", findbyid)

    if (findbyid && findbyid.code === -1) {
      // 渲染企业资质(待提交)
      return (
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label="营业执照扫描件">

            {getFieldDecorator('businessLicenseThumbs', {
              rules: [{
                required: true, message: '请上传营业执照扫描件!'
              }],
            })(
              <div>
                {this.showMsg(result)}
                <Upload
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={this.beforeUpload}
                  onChange={this.onBusinessLicenseThumbs}
                  action="qcbbssapi/upload.cfi">
                  {businessLicenseThumbs ? <img src={businessLicenseThumbs} style={{ width: 100, height: 100 }} /> : this.uploadButton}
                </Upload>
                <a onClick={() => this.onClickDemo(0)}>营业执照扫描件范例</a>
                <Modal
                  visible={this.state.blt_switch}
                  onOk={() => this.handleClose(0)}
                  onCancel={() => this.handleClose(0)}>
                  <img style={{ width: '100%' }} src={this.state.img_url} />
                </Modal>
              </div>
            )}
            可上传最新的营业执照，复印件需加盖公章，支持png、jpg、gif等基本图片格式，图片小于2M
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="企业名称">

            {getFieldDecorator('name', {
              rules: [{
                required: true, message: '请输入企业名称!', whitespace: true
              }],
            })(
              <Input placeholder="与营业执照公司名一致，最多60个字" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="注册资金（万元）">

            {getFieldDecorator('registrationCapital', {
              rules: [{
                required: true, message: '请正确填写注册资金金额（万元）!'
              }],
            })(
              <InputNumber min={0} defaultValue={0} formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')} style={{ width: 300 }} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="营业执照注册号">

            {getFieldDecorator('businessLicenseNo', {
              rules: [{
                required: true, message: '请正确填写营业执照注册号!', whitespace: true
              }],
            })(
              <Input placeholder="营业执照右上方注册号码" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="营业执照有效期">

            {getFieldDecorator('businessLicenseDatepick', {
              rules: [{
                required: true, message: '请选择营业执照有效期!',
              }],
            })(
              <RangePicker onChange={this.onBusinessLicenseDatePick} placeholder={['生效时间', '失效时间']} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="营业执照所在地">

            {getFieldDecorator('licenseStreet', {
              rules: [{
                required: true, message: '请选择营业执照所在地并填写详细地址', whitespace: true
              }],
            })(
              <div>
                <Cascader
                  options={data}
                  onChange={this.onDistrict}
                  placeholder="请选择省份与城市"
                  showSearch={{ filter }} />
                <TextArea rows={4} placeholder="请输入营业执照所在地与其详细地址" />
              </div>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="法人姓名">

            {getFieldDecorator('realname', {
              rules: [{
                required: true, message: '请正确填写法人姓名!', whitespace: true
              }],
            })(
              <Input placeholder="请输入法人姓名" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="联系人姓名">

            {getFieldDecorator('contactName', {
              rules: [{
                required: true, message: '请正确填写联系人姓名!', whitespace: true
              }],
            })(
              <Input placeholder="请输入联系人姓名" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="联系人手机号">

            {getFieldDecorator('contactTelephone', {
              rules: [{
                required: true, message: '请正确填写联系人手机号!', whitespace: true, pattern: /^[1][3,4,5,7,8][0-9]{9}$/
              }],
            })(
              <Input maxLength="11" placeholder="请输入联系人手机号" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="联系人QQ">

            {getFieldDecorator('contactQq', {
            })(
              <Input name="contactQq" placeholder="请输入联系人QQ" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="联系人邮箱">
            {getFieldDecorator('contactEmail', {
              rules: [{
                required: true, message: '请正确填写联系人邮箱!', whitespace: true, type: 'email'
              }],
            })(
              <Input placeholder="请输入联系人邮箱" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="法人身份证号">
            {getFieldDecorator('identity', {
              rules: [{
                required: true, message: '请正确填写法人身份证号!', whitespace: true, pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
              }],
            })(
              <Input maxLength="18" placeholder="请输入法人身份证号" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="是否已多证合一">

            {getFieldDecorator('isMerged', {
              rules: [{
                required: true
              }],
              initialValue: 1
            })(
              <div>
                <RadioGroup defaultValue={1} onChange={this.onRadioGroup}>
                  <Radio value={1}>是</Radio>
                  <Radio value={2}>否</Radio>
                </RadioGroup>
              </div>
            )}
          </FormItem>
          {this.show()}
          <FormItem
            {...formItemLayout}
            label="法人身份证正面">

            {getFieldDecorator('idFrontThumbs', {
              rules: [{
                required: true, message: '请上传法人身份证正面'
              }],
            })(
              <div>
                <Upload
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={this.beforeUpload}
                  onChange={this.onIdFrontThumbs}
                  action="qcbbssapi/upload.cfi">
                  {idFrontThumbs ? <img src={idFrontThumbs} style={{ width: 100, height: 100 }} /> : this.uploadButton}
                </Upload>
                <a onClick={() => this.onClickDemo(1)}>法人身份证正面范例</a>
                <Modal
                  visible={this.state.ift_switch}
                  onOk={() => this.handleClose(1)}
                  onCancel={() => this.handleClose(1)}>
                  <img style={{ width: '100%' }} src={this.state.img_url} />
                </Modal>
              </div>
            )}
            扫描件，复印件需加盖公章，支持png，jpg，gif等基本图片格式，图片小于2M
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="法人身份证反面">

            {getFieldDecorator('idBackThumbs', {
              rules: [{
                required: true, message: '请上传法人身份证反面'
              }],
            })(
              <div>
                <Upload
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={this.beforeUpload}
                  onChange={this.onIdBackThumbs}
                  action="qcbbssapi/upload.cfi">
                  {idBackThumbs ? <img src={idBackThumbs} style={{ width: 100, height: 100 }} /> : this.uploadButton}
                </Upload>
                <a onClick={() => this.onClickDemo(2)}>法人身份证反面范例</a>
                <Modal
                  visible={this.state.ibt_switch}
                  onOk={() => this.handleClose(2)}
                  onCancel={() => this.handleClose(2)}>
                  <img style={{ width: '100%' }} src={this.state.img_url} />
                </Modal>
              </div>
            )}
            扫描件，复印件需加盖公章，支持png，jpg，gif等基本图片格式，图片小于2M
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
      );
    } else {
      const { sei } = findbyid.data; // 企业信息
      const province = findbyid.data.province + "";// 营业执照所在省
      const city = findbyid.data.city + "";// 营业执照所在市
      const licenseStart = sei.licenseStart;// 营业执照生效时间
      const licenseEnd = sei.licenseEnd;// 营业执照失效时间
      const licenseStreet = sei.licenseStreet; // 企业地址
      // 营业执照
      const business_license_thumbs = businessLicenseThumbs ? businessLicenseThumbs : findbyid.data.businessLicenseThumbs;

      // 身份证正面
      const id_front_thumbs = idFrontThumbs ? idFrontThumbs : findbyid.data.idFrontThumbs;
      // 身份证背面
      const id_back_thumbs = idBackThumbs ? idBackThumbs : findbyid.data.idBackThumbs;

      // 渲染企业资质(待审核, 审核失败)
      return (
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label="营业执照扫描件">

            {getFieldDecorator('businessLicenseThumbs', {
              rules: [{
                required: true, message: '请上传营业执照扫描件!'
              }],
              initialValue: findbyid ? findbyid.data.businessLicenseThumbs : ''
            })(
              <div>
                {this.showMsg(result)}
                <Upload
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={this.beforeUpload}
                  onChange={this.onBusinessLicenseThumbs}
                  action="qcbbssapi/upload.cfi">
                  {business_license_thumbs ? <img src={business_license_thumbs} style={{ width: 100, height: 100 }} /> : this.uploadButton}
                </Upload>
                <a onClick={() => this.onClickDemo(0)}>营业执照扫描件范例</a>
                <Modal
                  visible={this.state.blt_switch}
                  onOk={() => this.handleClose(0)}
                  onCancel={() => this.handleClose(0)}>
                  <img style={{ width: '100%' }} src={this.state.img_url} />
                </Modal>
              </div>
            )}
            可上传最新的营业执照，复印件需加盖公章，支持png、jpg、gif等基本图片格式，图片小于2M
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="企业名称">

            {getFieldDecorator('name', {
              rules: [{
                required: true, message: '请输入企业名称!', whitespace: true
              }],
              initialValue: sei ? sei.name : ''
            })(
              <Input placeholder="与营业执照公司名一致，最多60个字" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="注册资金（万元）">

            {getFieldDecorator('registrationCapital', {
              rules: [{
                required: true, message: '请正确填写注册资金金额（万元）!'
              }],
              initialValue: sei ? sei.registrationCapital : ''
            })(
              <InputNumber formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')} style={{ width: 300 }} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="营业执照注册号">

            {getFieldDecorator('businessLicenseNo', {
              rules: [{
                required: true, message: '请正确填写营业执照注册号!', whitespace: true
              }],
              initialValue: sei ? sei.businessLicenseNo : ''
            })(
              <Input placeholder="营业执照右上方注册号码" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="营业执照有效期">

            {getFieldDecorator('businessLicenseDatepick', {
              rules: [{
                required: true, message: '请选择营业执照有效期!',
              }],
              initialValue: [licenseStart, licenseEnd]
            })(
              <div>
                {licenseStart && licenseEnd !== '' ?
                  <RangePicker
                    defaultValue={[moment(licenseStart, "YYYY-MM-DD"), moment(licenseEnd, "YYYY-MM-DD")]}
                    format={"YYYY-MM-DD"}
                    onChange={this.onBusinessLicenseDatePick} placeholder={['生效时间', '失效时间']} /> : ''}
              </div>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="营业执照所在地">

            {getFieldDecorator('licenseStreet', {
              rules: [{
                required: true, message: '请选择营业执照所在地并填写详细地址', whitespace: true
              }],
              initialValue: licenseStreet
            })(
              <div>
                {province && city !== "" ?
                  <Cascader
                    options={data}
                    onChange={this.onDistrict}
                    placeholder="请选择省份与城市"
                    showSearch={{ filter }}
                    defaultValue={[province, city]} /> : ""}
                {licenseStreet !== undefined ?
                  <TextArea rows={4} placeholder="请输入营业执照所在地与其详细地址" defaultValue={licenseStreet} /> : ''}
              </div>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="法人姓名">

            {getFieldDecorator('realname', {
              rules: [{
                required: true, message: '请正确填写法人姓名!', whitespace: true
              }],
              initialValue: sei ? sei.realname : ''
            })(
              <Input placeholder="请输入法人姓名" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="联系人姓名">

            {getFieldDecorator('contactName', {
              rules: [{
                required: true, message: '请正确填写联系人姓名!', whitespace: true
              }],
              initialValue: sei ? sei.contactName : ''
            })(
              <Input placeholder="请输入联系人姓名" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="联系人手机号">

            {getFieldDecorator('contactTelephone', {
              rules: [{
                required: true, message: '请正确填写联系人手机号!', whitespace: true, pattern: /^[1][3,4,5,7,8][0-9]{9}$/
              }],
              initialValue: sei ? sei.contactTelephone : ''
            })(
              <Input maxLength="11" placeholder="请输入联系人手机号" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="联系人QQ">

            {getFieldDecorator('contactQq', {
              initialValue: sei ? sei.contactQq : ''
            })(
              <Input name="contactQq" placeholder="请输入联系人QQ" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="联系人邮箱">
            {getFieldDecorator('contactEmail', {
              rules: [{
                required: true, message: '请正确填写联系人邮箱!', whitespace: true, type: 'email'
              }],
              initialValue: sei ? sei.contactEmail : ''
            })(
              <Input placeholder="请输入联系人邮箱" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="法人身份证号">
            {getFieldDecorator('identity', {
              rules: [{
                required: true, message: '请正确填写法人身份证号!', whitespace: true, pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
              }],
              initialValue: sei ? sei.identity : ''
            })(
              <Input maxLength="18" placeholder="请输入法人身份证号" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="是否已多证合一">
            {getFieldDecorator('isMerged', {
              rules: [{
                required: true
              }],
              initialValue: sei ? sei.isMerged : 1
            })(
              <RadioGroup onChange={this.onRadioGroup}>
                <Radio value={1}>是</Radio>
                <Radio value={2}>否</Radio>
              </RadioGroup>
            )}
          </FormItem>
          {this.show()}
          <FormItem
            {...formItemLayout}
            label="法人身份证正面">

            {getFieldDecorator('idFrontThumbs', {
              rules: [{
                required: true, message: '请上传法人身份证正面'
              }],
              initialValue: findbyid ? findbyid.data.idFrontThumbs : ''
            })(
              <div>
                <Upload
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={this.beforeUpload}
                  onChange={this.onIdFrontThumbs}
                  action="qcbbssapi/upload.cfi">
                  {id_front_thumbs ? <img src={id_front_thumbs} style={{ width: 100, height: 100 }} /> : this.uploadButton}
                </Upload>
                <a onClick={() => this.onClickDemo(1)}>法人身份证正面范例</a>
                <Modal
                  visible={this.state.ift_switch}
                  onOk={() => this.handleClose(1)}
                  onCancel={() => this.handleClose(1)}>
                  <img style={{ width: '100%' }} src={this.state.img_url} />
                </Modal>
              </div>
            )}
            扫描件，复印件需加盖公章，支持png，jpg，gif等基本图片格式，图片小于2M
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="法人身份证反面">

            {getFieldDecorator('idBackThumbs', {
              rules: [{
                required: true, message: '请上传法人身份证反面'
              }],
              initialValue: findbyid ? findbyid.data.idBackThumbs : ''
            })(
              <div>
                <Upload
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={this.beforeUpload}
                  onChange={this.onIdBackThumbs}
                  action="qcbbssapi/upload.cfi">
                  {id_back_thumbs ? <img src={id_back_thumbs} style={{ width: 100, height: 100 }} /> : this.uploadButton}
                </Upload>
                <a onClick={() => this.onClickDemo(2)}>法人身份证反面范例</a>
                <Modal
                  visible={this.state.ibt_switch}
                  onOk={() => this.handleClose(2)}
                  onCancel={() => this.handleClose(2)}>
                  <img style={{ width: '100%' }} src={this.state.img_url} />
                </Modal>
              </div>
            )}
            扫描件，复印件需加盖公章，支持png，jpg，gif等基本图片格式，图片小于2M
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
      );
    }
  }

  // 是否多正合一展示渲染
  show = () => {
    const { getFieldDecorator } = this.props.form;
    const { organizationLicenseThumbs, taxLicenseThumbs, isShow } = this.state;
    const { submitEnterpriseAptitude } = this.props;
    const { result, findbyid } = submitEnterpriseAptitude;

    if (findbyid && findbyid.code === -1) {

      if (isShow) {
        // 渲染企业资质(待提交)
        return (
          <div>
            <FormItem
              {...formItemLayout}
              label="组织机构代码有效期">

              {getFieldDecorator('institutional_framework', {
                rules: [{
                  required: true, message: '请选择组织机构代码有效期!',
                }],
              })(
                <RangePicker onChange={this.onInstitutionalFrameworkDatePick} placeholder={['生效时间', '失效时间']} />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="组织机构代码证扫描件">

              {getFieldDecorator('organization_license_thumbs', {
                rules: [{
                  required: true, message: '请上传组织机构代码证扫描件'
                }],
              })(
                <div>
                  <Upload
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    beforeUpload={this.beforeUpload}
                    onChange={this.onOrganizationLicenseThumbs}
                    action="qcbbssapi/upload.cfi">
                    {organizationLicenseThumbs ? <img src={organizationLicenseThumbs} style={{ width: 100, height: 100 }} /> : this.uploadButton}
                  </Upload>
                  <a onClick={() => this.onClickDemo(3)}>组织机构代码证扫描件范例</a>
                  <Modal
                    visible={this.state.olt_switch}
                    onOk={() => this.handleClose(3)}
                    onCancel={() => this.handleClose(3)}>
                    <img style={{ width: '100%' }} src={this.state.img_url} />
                  </Modal>
                </div>
              )}
              可上传最新的组织机构代码证，复印件需加盖公章，支持png、jpg、gif等基本图片格式，图片小于2M
            </FormItem>
            <FormItem
              style={{ display: this.state.display }}
              {...formItemLayout}
              label="税务登记证件扫描件">

              {getFieldDecorator('tax_license_thumbs', {
                rules: [{
                  required: true, message: '请上传税务登记证件扫描件'
                }],
              })(
                <div>
                  <Upload
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    beforeUpload={this.beforeUpload}
                    onChange={this.onTaxLicenseThumbs}
                    action="qcbbssapi/upload.cfi">
                    {taxLicenseThumbs ? <img src={taxLicenseThumbs} style={{ width: 100, height: 100 }} /> : this.uploadButton}
                  </Upload>
                  <a onClick={() => this.onClickDemo(4)}>税务登记证件扫描件范例</a>
                  <Modal
                    visible={this.state.tlt_switch}
                    onOk={() => this.handleClose(4)}
                    onCancel={() => this.handleClose(4)}>
                    <img style={{ width: '100%' }} src={this.state.img_url} />
                  </Modal>
                </div>
              )}
              可上传最新的税务登记证，复印件需加盖公章，支持png、jpg、gif等基本图片格式，图片小于2M
            </FormItem>
          </div>
        )
      }
    } else {
      const { sei } = findbyid.data; // 企业信息
      // 组织机构代码扫描件
      const organization_license_thumbs = organizationLicenseThumbs ? organizationLicenseThumbs : findbyid.data.organizationLicenseThumbs;
      // 税务登记证件扫描件(国税或地税)范例
      const tax_license_thumbs = taxLicenseThumbs ? taxLicenseThumbs : findbyid.data.taxLicenseThumbs;
      // 组织机构生效时间
      const oclStart = sei.oclStart;
      // 组织机构失效时间
      const oclEnd = sei.oclEnd;
      // 是否多证合一
      if (!isShow) {
        // 渲染企业资质(待审核,审核失败)
        return (
          <div>
            <FormItem
              {...formItemLayout}
              label="组织机构代码有效期">

              {getFieldDecorator('institutional_framework', {
                rules: [{
                  required: true, message: '请选择组织机构代码有效期!',
                }],
                initialValue: [oclStart, oclEnd]
              })(
                <div>
                  {oclStart && oclEnd !== '' ?
                    <RangePicker
                      defaultValue={[moment(oclStart, "YYYY-MM-DD"), moment(oclEnd, "YYYY-MM-DD")]}
                      format={"YYYY-MM-DD"}
                      onChange={this.onInstitutionalFrameworkDatePick} placeholder={['生效时间', '失效时间']} /> : ''}
                </div>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="组织机构代码证扫描件">

              {getFieldDecorator('organization_license_thumbs', {
                rules: [{
                  required: true, message: '请上传组织机构代码证扫描件'
                }],
                initialValue: findbyid ? findbyid.data.organizationLicenseThumbs : ''
              })(
                <div>
                  <Upload
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    beforeUpload={this.beforeUpload}
                    onChange={this.onOrganizationLicenseThumbs}
                    action="qcbbssapi/upload.cfi">
                    {organization_license_thumbs ? <img src={organization_license_thumbs} style={{ width: 100, height: 100 }} /> : this.uploadButton}
                  </Upload>
                  <a onClick={() => this.onClickDemo(3)}>组织机构代码证扫描件范例</a>
                  <Modal
                    visible={this.state.olt_switch}
                    onOk={() => this.handleClose(3)}
                    onCancel={() => this.handleClose(3)}>
                    <img style={{ width: '100%' }} src={this.state.img_url} />
                  </Modal>
                </div>
              )}
              可上传最新的组织机构代码证，复印件需加盖公章，支持png、jpg、gif等基本图片格式，图片小于2M
            </FormItem>
            <FormItem
              style={{ display: this.state.display }}
              {...formItemLayout}
              label="税务登记证件扫描件">

              {getFieldDecorator('tax_license_thumbs', {
                rules: [{
                  required: true, message: '请上传税务登记证件扫描件'
                }],
                initialValue: findbyid ? findbyid.data.taxLicenseThumbs : ''
              })(
                <div>
                  <Upload
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    beforeUpload={this.beforeUpload}
                    onChange={this.onTaxLicenseThumbs}
                    action="qcbbssapi/upload.cfi">
                    {tax_license_thumbs ? <img src={tax_license_thumbs} style={{ width: 100, height: 100 }} /> : this.uploadButton}
                  </Upload>
                  <a onClick={() => this.onClickDemo(4)}>税务登记证件扫描件范例</a>
                  <Modal
                    visible={this.state.tlt_switch}
                    onOk={() => this.handleClose(4)}
                    onCancel={() => this.handleClose(4)}>
                    <img style={{ width: '100%' }} src={this.state.img_url} />
                  </Modal>
                </div>
              )}
              可上传最新的税务登记证，复印件需加盖公章，支持png、jpg、gif等基本图片格式，图片小于2M
            </FormItem>
          </div>
        )
      }
    }
  }

  render() {
    if (this.state.redirect) {
      return <Redirect push to="shop-aptitude" />;
    }
    return (
      <div className={styles.main}>
        <Tabs defaultActiveKey="2">
          <TabPane tab={<span><Icon type="check" />注册</span>} disabled></TabPane>
          <TabPane tab="2 提交企业资质" key="2">
            {this.showEnterpriseAptitude()}
          </TabPane>
          <TabPane tab="3 填写店铺信息" key="3" disabled></TabPane>
          <TabPane tab="4 提交品牌信息" key="4" disabled></TabPane>
        </Tabs>
      </div>
    );
  }
}
