
import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Divider, Badge } from 'antd';
import styles from './Register.less';
import Configure from '../../conf/configure';
import { Redirect } from 'react-router-dom';

const status = ["审核中...","审核不通过","审核通过"];// 0正在审核 1审核不通过 2审核通过
const badge = ["default","error","success"];// 0正在审核 1审核不通过 2审核通过

@connect(({
  auditResult,
  loading
}) => ({
  auditResult,
  loading: loading.models.auditResult

}))

export default class Result extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    redirect: false,
    redirect_url: ''
  };



  // 默认加载
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'auditResult/find',
    });
  }

  // 企业信息跳转
  onClickEnterprise = () => {
    this.setState({
      redirect: true,
      redirect_url: 'enterprise-aptitude'
    });
  }

  // 商铺信息跳转
  onClickShop = () => {
    this.setState({
      redirect: true,
      redirect_url: 'shop-aptitude'
    });
  }

  // 品牌信息跳转
  onClickBrand = () => {
    this.setState({
      redirect: true,
      redirect_url: 'brand-aptitude'
    });
  }

  // 展示企业
  showEnterprise = () => {
    const { auditResult } = this.props;
    const { result } = auditResult;
    const enterprise = result.data.enterprise;
    const auditRecords = result.data.auditRecords;

    if (enterprise != undefined) { // 审核通过
      if (enterprise.status == 0) {
        return (
          <Card title="企业信息"
            style={{ width: 600 }}
            extra={<a onClick={this.onClickEnterprise} href="javascript:void(0)">修改</a>}>
            <p>公司名称：{enterprise.name}</p>
            <p>联系人：  {enterprise.contactName}</p>
            <p>联系电话：{enterprise.contactTelephone}</p>
            <p>审核状态：<Badge status="default" /><span style={{ color: "red" }}>审核中...</span></p>
          </Card>
        );
      } else if (enterprise.status == 1) {
        return (
          <Card title="企业信息"
            style={{ width: 600 }}
            extra={<a onClick={this.onClickEnterprise} href="javascript:void(0)">修改</a>}>
            <p>公司名称：{enterprise.name}</p>
            <p>联系人：  {enterprise.contactName}</p>
            <p>联系电话：{enterprise.contactTelephone}</p>
            <p>审核状态：<Badge status="error" /><span style={{ color: "red" }}>审核不通过</span></p>
            <p>审核原因：<span style={{ color: "red" }}>{auditRecords != undefined ? auditRecords.reason : ''}</span></p>
          </Card>
        );
      } else {
        return (
          <Card title="企业信息"
            style={{ width: 600 }}>
            <p>公司名称：{enterprise.name}</p>
            <p>联系人：  {enterprise.contactName}</p>
            <p>联系电话：{enterprise.contactTelephone}</p>
            <p>审核状态：<Badge status="success" /><span style={{ color: "red" }}>审核通过</span></p>
          </Card>
        );
      }
    }
  }

  // 展示商铺
  showShop = () => {
    const { auditResult } = this.props;
    const { result } = auditResult;
    const shop = result.data.shop;
    const shopTypeName = result.data.shopTypeName;
    const mainCategoryName = result.data.mainCategoryName;

    if (shop !== undefined) {
      if (shop.status == 3) {
        return (
          <Card title="店铺信息"
            style={{ width: 600 }}
            extra={<a onClick={this.onClickShop} href="javascript:void(0)">修改</a>}>
            <p>店铺名称：{shop.name}</p>
            <p>店铺类型：{shopTypeName}</p>
            <p>主营类目：{mainCategoryName}</p>
            <p>审核状态：<Badge status="default" /><span style={{ color: "red" }}>审核中...</span></p>
          </Card>
        );
      } else if (shop.status == 4) {
        return (
          <Card title="店铺信息"
            style={{ width: 600 }}
            extra={<a onClick={this.onClickShop} href="javascript:void(0)">修改</a>}>
            <p>店铺名称：{shop.name}</p>
            <p>店铺类型：{shopTypeName}</p>
            <p>主营类目：{mainCategoryName}</p>
            <p>审核状态：<Badge status="error" /><span style={{ color: "red" }}>审核不通过</span></p>
          </Card>
        );
      } else if (shop.status == 5) {
        return (
          <Card title="店铺信息"
            style={{ width: 600 }}>
            <p>店铺名称：{shop.name}</p>
            <p>店铺类型：{shopTypeName}</p>
            <p>主营类目：{mainCategoryName}</p>
            <p>审核状态：<Badge status="success" /><span style={{ color: "red" }}>审核通过</span></p>
          </Card>
        );
      }
    }
  }

  // 展示品牌
  showBrands = () => {
    const { auditResult } = this.props;
    const { result } = auditResult;
    const shopBrand = result.data.shopBrands;
    
    if (shopBrand.length === 0) {
      return null;
    } else {
      const shopBrands = result.data.shopBrands.map((e) => 
        <div>
            <p>品牌名称：{e.name}</p>
            <p>审核状态：<Badge status={badge[e.status]} /><span style={{ color: "red" }}>{status[e.status]}</span></p>
        </div>
      );
      return (
        <Card title="品牌信息" 
          style={{ width: 600 }}
          extra={<a onClick={this.onClickBrand} href="javascript:void(0)">修改</a>}>
          {shopBrands}
        </Card>
      );
    }
  }

  render() {
    if (this.state.redirect) {
      return <Redirect push to={this.state.redirect_url} />;
    }
    return (
      <div className={styles.main}>
        {this.showEnterprise()}
        <Divider type="vertical" />
        {this.showShop()}
        <Divider type="vertical" />
        {this.showBrands()}
      </div>
    );
  }
}
