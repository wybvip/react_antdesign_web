import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Card, Badge, Table, Divider,Button,
  Upload, Icon, message , Modal } from 'antd';
import co from 'co';
import fs from 'fs';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import AppUoload from './ApplyIMGUpload';

const FormItem = Form.Item;
@connect(({ upload, financialsupport, loading }) => ({
  upload,
  financialsupport,
  loading: loading.models.financialsupport,
}))
@Form.create()
export default class applyImmediately extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      src: this.props.src ? this.props.src : '',
      fileList: [],
      upLoadlistTag: [{
        name: '身份证正面',
        keyEnd: 0,
        srcType: 1,
        fileList: [],
        maxLength: 1,
        showRequired: true,
      }, {
        name: '身份证反面',
        keyEnd: 1,
        srcType: 2,
        fileList: [],
        maxLength: 1,
        showRequired: true,
      }, {
        name: '营业执照',
        keyEnd: 2,
        srcType: 3,
        fileList: [],
        maxLength: 1,
        showRequired: true,
      }, {
        name: '个人征信报告',
        keyEnd: 3,
        srcType: 4,
        fileList: [],
        maxLength: 1,
        showRequired: false,
      }, {
        name: '公司近一年流水',
        keyEnd: 4,
        srcType: 5,
        fileList: [],
        maxLength: 100,
        showRequired: true,
      }, {
        name: '法人不动产证明',
        keyEnd: 5,
        srcType: 6,
        fileList: [],
        maxLength: 100,
        showRequired: true,
      }, {
        name: '企业征信报告',
        keyEnd: 6,
        srcType: 7,
        fileList: [],
        maxLength: 1,
        showRequired: false,
      }],
    };
  }
  // 界面加载后就触发
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'financialsupport/fetchSelectProvisional',
      payload: { shopAdminId: 'c17a79c47425fff8f8411a5ba2eba2bfc02cbba6' }, // 暂时写死，后续从登录注册中取值
    }).then(() => {
      if (this.props.financialsupport.priDataItem.data) {
        this.proCessImagesList(this.props.financialsupport.priDataItem.data.imageList);
      }
    });
  }
  // 处理 图片列表的 方法
  proCessImagesList = (srcs) => {
    let fileList = '';
    console.log('componentWillMount 方法666:', srcs);
    if (srcs) {
      for (const src of srcs) {
        console.log('srcsrcsrcsrcsrc',src);
      }
    }
  }
  // 重写handleChange 方法
  handleChangeSuper = (key, srcType, fileList) => {
    // 4. 设置图片类型
    const newlist = this.state.upLoadlistTag;
    newlist[key].fileList = fileList;
    newlist[key].srcType = srcType;
    const rand = Math.random();
    this.setState(Object.assign({}, { upLoadlistTag: newlist, unness: rand }));
  }
  // 保存
  handleSubmit = (e) => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        e.preventDefault();
        console.log('handleSubmit', values);
        const FormValues = this.props.form.getFieldsValue();// form表单的值
        const fileListSave = this.getFileListData2();
        const pamam = {
          shopAdminId: 'c17a79c47425fff8f8411a5ba2eba2bfc02cbba6', // 暂时写死，后续需要根据登录注册传入
          applicationAmount: FormValues.applicationAmount,
          fileList: fileListSave };
        this.props.dispatch({
          type: 'financialsupport/fetchInsert',
          payload: pamam,
          // pathname: '/user/register-result',
        });
      }
    });
  }
  normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }
  getFileListData = () => { // 获取传给后台的文件列表
    const fileListSave = [];
    for (const item of this.state.upLoadlistTag) {
      const sendFileList = item.fileList.fileList;
      if (sendFileList !== undefined && sendFileList.length !== 0) {
        console.log('ArrayListArrayListArrayList', sendFileList);
        for (const nfile of sendFileList) {
          fileListSave.push({
            originalFilename: nfile.name,
            srcType: item.srcType,
          });
        }
      }
    }

    const pamam = {
      fileListSave };
    this.props.dispatch({
      type: 'upload/uploadFileList',
      payload: pamam,
      // pathname: '/user/register-result',
    });
  }
  getFileListData2 = () => { // 获取传给后台的文件列表
    const fileListSave = [];
    for (const item of this.state.upLoadlistTag) {
      const sendFileList = item.fileList;
      if (sendFileList !== undefined && sendFileList.length !== 0) {
        for (const nfile of sendFileList) {
          fileListSave.push(nfile);
          // fileListSaveBlob.push(dataURItoBlob(nfile));
        }
      }
    }
    const pamam = {
      uploadFileList: fileListSave };
    this.props.dispatch({
      type: 'upload/uploadFileList',
      payload: pamam,
      // pathname: '/user/register-result',
    });
    return fileListSave;
  }
  // 暂存
  provisionalInsert = (e) => {
    e.preventDefault();
    const FormValues = this.props.form.getFieldsValue();// form表单的值
    let formData = new FormData();
    const fileListSave2 = this.getFileListData2();
    formData.append('fileListSave', fileListSave2);
    console.log('formData', formData);
    console.log('FormValues', FormValues);
    console.log('fileListSave2', fileListSave2);
    const fileListSave = [];
    // const fileListSave = this.getFileListData();
    const pamam = {
      shopAdminId: 'c17a79c47 425fff8f8411a5ba2eba2bfc02cbba6', // 暂时写死，后续需要根据登录注册传入
      applicationAmount: FormValues.applicationAmount,
      fileList: fileListSave };
    this.props.dispatch({
      type: 'financialsupport/fetchProInsert',
      payload: pamam,
      // pathname: '/user/register-result',
    });
  }
  render() {
    const { submitting } = this.props;
    const { form, dispatch, data, financialsupport: { priDataItem } } = this.props;
    const formItemLayout = {
      labelCol: {
        span: 2,
      },
      wrapperCol: {
        span: 5,
      },
    };

    const { getFieldDecorator } = form;
    const patternSet = /^([1-9][0-9]{0,16})$/;// 非零开头的数字
    const { fileList } = this.state;
    const ComText = 'PDF、JPG、PNG、BMP、JPEG均可';
    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 40, offset: 0 },
        sm: { span: 20, offset: 7 },
      },
    };
    return (
      <PageHeaderLayout title="立即申请">
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            // hideRequiredMark
            style={{ marginTop: 8 }}
          >
            <div>
              <Form.Item
                {...formItemLayout}
                label="申请额度"
              >
                {getFieldDecorator('applicationAmount', {
                  rules: [
                    { required: true, message: '请输入申请额度' },
                    { pattern: patternSet, message: '请输入合法金额数字' },
                  ],
                })(
                  <Input style={{ marginLeft: 30 }} prefix="￥" placeholder="请输入金额" />
                )}
              </Form.Item>
              <span>必填，请根据您实际需求填写，金额过大或过小都会导致申请失败</span>
            </div>
            {this.state.upLoadlistTag.map((item, index) => (
              <FormItem
                style={{ whiteSpace: 'normal' }}
                {...formItemLayout}
                label={item.name}
                required={item.showRequired}
                key={index}
              >
                <AppUoload
                  style={{ paddingLeft: 20 }}
                  name={('logo'+item.keyEnd)}
                  action="//jsonplaceholder.typicode.com/posts/"
                  listType="picture-card"
                  keyEnd={item.keyEnd}
                  srcType={item.srcType}
                  handleChange={this.handleChangeSuper}
                  maxLength={item.maxLength}
                  fileList={item.fileList}
                  ComText={ComText}
                  key={index}
                />
              </FormItem>
            ))}
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button style={{ marginLeft: 8 }} onClick={this.provisionalInsert}>暂存</Button>
              <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit" loading={submitting} >
                提交
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
