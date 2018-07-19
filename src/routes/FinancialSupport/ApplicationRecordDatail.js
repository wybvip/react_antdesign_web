import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Badge, Table, Divider, Button, Modal  } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from '../../components/DescriptionList';
import AppUoload from './ApplyIMGUpload';
import {message} from "antd/lib/index";
const { Description } = DescriptionList;
@connect(({ financialsupport, loading }) => ({
  financialsupport,
  loading: loading.models.financialsupport,
}))
export default class ApplicationRecordDatail extends Component {
  state = {
    src: this.props.src ? this.props.src : '',
    previewVisible: false,
    item: { shopName: '天猫一号商家' },
    // record: this.props.location.state.record,
    fileList: [],
    fileListT: [],
  };
  handleModalVisible(e) {
    this.props.history.goBack();
  }
  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'financialsupport/fetchSelectDatail',
      payload: { appId: this.props.match.params.id },
    });
    console.log('this.props.financialsupport.InfoDataItem:', this.props.financialsupport.InfoDataItem);
    this.setState({ InfoDataItem: this.props.financialsupport.InfoDataItem });
  }
  componentWillReceiveProps() {
    this.setState({
      InfoDataItem: this.props.financialsupport.InfoDataItem,
    });
  }
  handleUpLoadTab() {
    console.log(this.state);
    const { InfoDataItem: { Item: { srcs } },previewVisible, previewImage, fileList  } = this.state;
    if (!srcs) { return; }
    const res = [];
    const showS = true;
    let upLabel = '身份证正面';
    for (let i = 0; i < srcs.length; i++) {
      let maxLength = 0;
      let fileList = [];
      if (srcs[i].srcType === 1) {
        upLabel = '身份证正面';
      } else if (srcs[i].srcType === 2) {
        upLabel = '身份证反面';
      } else if (srcs[i].srcType === 3) {
        upLabel = '营业执照';
      } else if (srcs[i].srcType === 4) {
        upLabel = '个人征信报告';
      } else if (srcs[i].srcType === 5) {
        upLabel = '公司近一年流水';
      } else if (srcs[i].srcType === 6) {
        upLabel = '法人不动产证明';
      } else if (srcs[i].srcType === 7) {
        upLabel = '企业征信报告';
      }
      fileList.push({
        uid: -1,
        status: 'done',
        url: srcs[i] });
      maxLength++;
      res.push(
        <Modal
          onPreview={this.handlePreview}
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" src={srcs[i].src} />
        </Modal>);
    }
    return res;
  }
  render() {
    const { fileList, fileListT, InfoDataItem: { Item } } = this.state;
    return (
      <PageHeaderLayout title="申请记录详情">
        <Card bordered={false}>
          <Button onClick={() => this.handleModalVisible()}>返回</Button>
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList size="large" style={{ marginBottom: 32 }}>
            <Description term="店铺名称">{Item.shopName}</Description>
            <Description term="商户管理员">{Item.adminName}</Description>
            <Description term="管理员电话">{Item.adminPhone}</Description>
            <Description term="申请额度">{Item.applyLimit}</Description>
            <Description term="审核时间">{Item.checkStart}</Description>
            <Description term="审核员">{Item.checkUserName}</Description>
            <Description term="审核结果">{Item.applyCheckStatus}</Description>
            <Description term="审核理由">{Item.checkReason}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <div>
            {this.handleUpLoadTab()}
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
