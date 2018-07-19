import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import {
  Form, Button, Input, Card, Select, Radio,
  Modal, Cascader, Table, Tag, message, InputNumber,
} from 'antd';
import { routerRedux } from 'dva/router';
import RentList from '../../components/Spec/RentList';
import SpecIndex from '../../components/Spec/SpecIndex';
import PeakPremium from '../../components/Spec/PeakPremium';
import SkuImage from '../../components/Spec/SkuImage';
import SpecTable from '../../components/Spec/specTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import Edit from '../../components/edit';

const { Option } = Select;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const formItemLayout = {
  labelCol: {
    span: 2,
  },
  wrapperCol: {
    span: 22,
  },
};

const initState = {
  imageVisible: false,
  skuImageVisible: false,
  offlineVisible: false,
  giveBackVisible: false,
  mainImageVisible: false,
  skuId: '',
  didMountAllDone: false,
  peak: [], // peak: [{start: null, end: null, price: null}]
  additionServices: [],
  rentList: [],
  imageTable: [],
  offlineTable: [],
  offlineSelected: [],
  giveBackSelected: [],
  specs: {}, // {color: [{id: "color1", name: "黑色"}], spec: [{id: "spec1", name: "128G"}] }
  price: [], // price: [[{color: "黑色", spec: "128G"}], [{color: "黑色", spec: "128G"}]]
  mainImage: [],
  sku: [[{ cycle: [] }]],
  detail: '',
};

@connect(({
  newProduct,
  findCategories,
  loading,
  giveBack,
  findDistrict,
  rentRule,
  compensateRule,
  goodsDetial,
  files,
  shop,
}) => ({
  newProduct,
  findCategories,
  loading: loading.models.newProduct,
  filesLoading: loading.models.files,
  offlineLoading: loading.models.shop,
  giveBack,
  findDistrict,
  rentRule,
  compensateRule,
  goodsDetial,
  files,
  shop,
}))


@Form.create()
export default class AddNewProduct extends Component {
  state = Object.assign({}, initState);

  componentDidMount() {
    const { dispatch, match: { params: { id } } } = this.props;
    if (id !== '0') {
      dispatch({
        type: 'newProduct/getProductDetial',
        payload: { id },
        callback: () => {
          if (this.state.didMountAllDone) this.addAddress();
          const specs = this.convertSpecs();
          const price = this.initPrice(this.dealData(this.feedSpecTable(specs)));
          let { sku } = this.state;
          const mainImage = this.props.newProduct.productDetail.productImageList.map((e) => {
            return { id: e.id, image: e.src };
          });
          if (price.length === 0) {
            sku = this.initDefaultPrice();
          }
          this.setState({
            ...this.state,
            specs,
            peak: this.props.newProduct.productDetail.productPeakPremiumPrice,
            rentList: this.props.newProduct.productDetail.productRentLists,
            didMountAllDone: true,
            detail: this.props.newProduct.productDetail.product.detail,
            price,
            sku,
            mainImage,
          });
        },
      });
    } else {
      dispatch({
        type: 'newProduct/clearDetail',
      });
    }
    dispatch({
      type: 'newProduct/findAllCategory',
    });
    dispatch({
      type: 'newProduct/preAdd',
      callback: () => {
        if (this.state.didMountAllDone) this.addAddress();
        this.setState({
          ...this.state,
          didMountAllDone: true,
        });
      },
    });
  }

  onPeakChange = (peak) => {
    this.setState({
      ...this.state,
      peak,
    });
  }

  onRentListChange = (rentList) => {
    this.setState({
      ...this.state,
      rentList,
    });
  }

  onMainImageChange = (mainImage) => {
    this.setState({
      ...this.state,
      mainImage,
    });
  }

  onAdditionalServiceChange = (additionServices) => {
    this.setState({
      ...this.state,
      additionServices,
    });
  }

  onSpecIndexChange = (specs) => {
    const price = this.dealData(this.feedSpecTable(specs));
    let sku = [];
    if (price.length === 0) {
      sku = [[{ cycle: [] }]];
    }
    this.setState({
      ...this.state,
      specs,
      price,
      sku,
    });
  }

  onPriceChange = (value) => {
    // TODO
    let { price } = this.state;
    price = price.map((e) => {
      if (e[0].id === value.id) e[0] = value;
      return e;
    });
    this.setState({
      ...this.state,
      price,
    });
  }

  onDefaultSpecTableChange = (sku) => {
    this.setState({
      ...this.state,
      sku: [[sku]],
    });
  }

  onProductDetailTemplateChange = (value) => {
    const { newProduct: { preAdd: { productDetailTemplates } } } = this.props;
    const detail = (productDetailTemplates.filter((e) => {
      return e.id === value;
    })[0]).content;
    this.setState({
      ...this.state,
      detail,
    });
  }

  onReceiveHtml = (detail) => {
    this.setState({
      ...this.state,
      detail,
    });
  }

  specIndexTable = 0;

  convertSpecs = () => {
    // specs: [[{children: [{id: 1, name: 黑色}]}], [{children: [{id: 1, name: 黑色}]}]]
    const { newProduct: { productDetail: { specs } } } = this.props;
    if (specs.length === 0) {
      return {};
    }
    const spec = ['color', 'spec'];
    return specs.map((e, i) => {
      const { children } = e;
      const ones = children.map((x) => {
        return { id: x.id, name: x.name, image: x.image };
      });
      const one = spec[i];
      return { [one]: ones };
    }).reduce((k, a) => {
      return Object.assign(k, a);
    });
  }

  feedSpecTable = (specs) => {
    const keys = Object.keys(specs);
    if (keys.length === 0) return {};
    const arr = keys.map((e) => {
      return specs[e].map((one) => {
        return one.name;
      });
    });
    const result = {};
    keys.forEach((e, i) => {
      result[e] = arr[i];
    });
    return result;
  }

  dealData = (data) => { // 组成tables所需要的数据
    const keys = Object.keys(data);
    if (keys.length === 0) return [];
    return this.permutation(keys.map((e) => {
      return data[e];
    }).filter((e) => { return e.length !== 0; })).map((e) => {
      return e.map((one, i) => {
        const spec = {};
        spec[keys[i]] = one;
        return spec;
      });
    }).map((v) => {
      const tmp = v.reduce((e, a) => {
        return Object.assign(e, a);
      });
      this.specIndexTable += 1;
      tmp.id = this.specIndexTable;
      return [tmp];
    });
  }

  permutation = (arr) => { // 传入数组，生成排列组合 [[1, 2, 3], [a]]
    const results = [];
    const result = [];
    if (!arr || !(arr instanceof Array) || arr.length === 0) return [];
    const doExchange = (arr2, depth2) => {
      for (let i = 0; i < arr2[depth2].length; i += 1) {
        result[depth2] = arr2[depth2][i];
        if (depth2 !== arr2.length - 1) {
          doExchange(arr2, depth2 + 1);
        } else {
          results.push(result.join('|'));
        }
      }
    };
    doExchange(arr, 0);
    return results.map((e) => {
      return e.split('|');
    }); // [[1, a], [2, a], [3, a]]
  }

  addAddress = () => {
    const { newProduct: { preAdd: { givebackAddress = [], offlineShop = [] },
      productDetail: { productGiveBackAddresses = [], productLogisticForms = [] } } } = this.props;
    const giveBackSelected = givebackAddress.filter((e) => {
      return productGiveBackAddresses.filter((e1) => {
        return e1.addressId === e.id;
      }).length > 0;
    });
    const offlineSelected = offlineShop.filter((e) => {
      return productLogisticForms.filter((e1) => {
        return e1.templateId === e.id;
      }).length > 0;
    });
    this.setState({
      ...this.state,
      giveBackSelected,
      offlineSelected,
    });
  }

  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/product/list'));
  }

  imageColumns = [{
    title: '图片',
    dataIndex: 'src',
    key: 'src',
    render: record => <img alt="" src={record} style={{ width: 80, height: 80 }} />,
  }, {
    title: '名称',
    dataIndex: 'name',
    key: 'size',
  }, {
    title: '时间',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
  },
  ];

  columnsGiveback = [
    {
      title: '手机号码',
      dataIndex: 'telephone',
      key: 'telephone',
    }, {
      title: '收货地址',
      dataIndex: 'street',
      key: 'street',
    }, {
      title: '收货人姓名',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '邮政',
      dataIndex: 'zcode',
      key: 'zcode',
    }, {
      title: '添加时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    }];

  columnsOffline = [
    {
      title: '店铺编号',
      dataIndex: 'number',
      key: 'number',
    }, {
      title: '店铺名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '店铺地址',
      dataIndex: 'street',
      key: 'street',
    }];

  showImageModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'files/fileList',
      callback: () => {
      },
    });
    this.setState({
      ...this.state,
      imageVisible: true,
    });
  }

  showMainImageModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'files/fileList',
      callback: () => {
      },
    });
    this.setState({
      ...this.state,
      mainImageVisible: true,
    });
  }

  handleImageModalCancel = () => {
    this.setState({
      ...this.state,
      imageVisible: false,
    });
  }

  handleMainImageModalCancel = () => {
    this.setState({
      ...this.state,
      mainImageVisible: false,
    });
  }

  handleImageModalOk = (selected) => {
    const { rentList } = this.state;
    selected.forEach((e) => {
      const { id, name, src } = e;
      rentList.push({ id, name, image: src });
    });
    this.setState({
      ...this.state,
      imageVisible: false,
      rentList,
    });
  }

  handleMainImageModalOk = (selected) => {
    let { mainImage } = this.state;
    const images = selected.map((e) => {
      return { id: e.id, name: e.name, image: e.src };
    });
    mainImage = mainImage.concat(images);
    this.setState({
      ...this.state,
      mainImageVisible: false,
      mainImage,
    });
  }

  handleSkuImageModalOk = (selected) => {
    const one = selected[selected.length - 1];
    if (selected.length === 0) return;
    const { specs, skuId } = this.state;
    const keys = Object.keys(specs);
    keys.forEach((e) => {
      return specs[e].forEach((e1, i) => {
        const tmp = e1;
        if (e1.id === skuId) {
          tmp.image = one.src;
          specs[e][i] = tmp;
        }
      });
    });
    this.setState({
      ...this.state,
      skuImageVisible: false,
      specs,
    });
  }

  showSkuImageModal = (skuId) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'files/fileList',
      callback: () => {
      },
    });
    this.setState({
      ...this.state,
      skuImageVisible: true,
      skuId,
    });
  }

  handleSkuImageModalCancel = () => {
    this.setState({
      ...this.state,
      skuImageVisible: false,
    });
  }

  showGiveBackModal = () => {
    this.setState({
      ...this.state,
      giveBackVisible: true,
    });
  }

  handleGiveBackModalCancel = () => {
    this.setState({
      ...this.state,
      giveBackVisible: false,
    });
  }

  handleGiveBackModalOk = (selected) => {
    this.setState({
      ...this.state,
      giveBackVisible: false,
      giveBackSelected: selected,
    });
  }

  handleImageTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const params = {
      pageNumber: pagination.current,
      pageSize: pagination.pageSize,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'files/fileList',
      payload: params,
    });
  }

  showOfflineModal = () => {
    this.setState({
      ...this.state,
      offlineVisible: true,
    });
  }

  handleOfflineModalCancel = () => {
    this.setState({
      ...this.state,
      offlineVisible: false,
    });
  }

  handleOfflineModalOk = (selected) => {
    this.setState({
      ...this.state,
      offlineVisible: false,
      offlineSelected: selected,
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { dispatch, match: { params: { id } } } = this.props;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = this.packParams(values);
        if (!this.canSubmit(params)) {
          message.warn('表单填写不完整或填写有误');
          return;
        }
        if (id !== '0') {
          dispatch({
            type: 'newProduct/updateProduct',
            payload: params,
          });
        } else {
          dispatch({
            type: 'newProduct/addProduct',
            payload: params,
          });
        }
      }
    });
  }

  initPrice = (oldPrice) => {
    const { newProduct: { productDetail: { price } } } = this.props;
    if (price.length === 1 && price[0].specs.length === 0) return [];
    return price.map((e) => {
      const specs1 = e.specs.map((e1) => {
        return e1.name;
      });
      const result = oldPrice.filter((e1) => {
        const specs2 = Object.keys(e1[0]).filter((e2) => {
          return e2 !== 'id';
        }).map((e2) => {
          return e1[0][e2];
        });
        return specs2.toString() === specs1.toString();
      });
      result[0][0].degree = e.productSkus.oldNewDegree;
      result[0][0].stock = e.productSkus.inventory;
      result[0][0].price = e.productSkus.marketPrice;
      result[0][0].cycle = e.cyclePrices.map((e2) => {
        const s = {};
        s.id = e2.days;
        s.value = e2.price;
        return s;
      });
      return result[0];
    });
  }

  initDefaultPrice = () => {
    const { newProduct: { productDetail: { price } } } = this.props;
    return price.map((e) => {
      const result = {};
      result.degree = e.productSkus.oldNewDegree;
      result.stock = e.productSkus.inventory;
      result.price = e.productSkus.marketPrice;
      result.cycle = e.cyclePrices.map((e2) => {
        const s = {};
        s.id = e2.days;
        s.value = e2.price;
        return s;
      });
      return [result];
    });
  }

  packParams = (value) => {
    const packPrice = (price) => {
      return price.map((e) => {
        const { cycle = [] } = e[0];
        const cyclePrices = cycle.map((a) => {
          return { days: a.id, price: a.value };
        });
        let tmpSpecs = [{ name: e[0].color }, { name: e[0].spec }];
        tmpSpecs = tmpSpecs.filter((a) => { return a.name !== undefined; });
        return {
          productSkus: {
            marketPrice: e[0].price,
            lostPrice: e[0].price,
            inventory: e[0].stock,
            totalInventory: e[0].stock,
            oldNewDegree: e[0].degree,
          },
          specs: tmpSpecs,
          cyclePrices,
        };
      });
    };

    let product = {};
    const specs = [];
    let price = [];
    const shopGroupProduct = {};
    const productCornerMark = {};
    const productRentLists = this.state.rentList;
    const productSkusImages = [];
    const productImageList = [];
    const productLogisticForms = [];
    const productServiceMarks = [];
    const productPeakPremiumPrice = this.state.peak;
    const productGiveBackAddresses = [];
    const productAdditionalServices = [];

    const { productDetail } = this.props.newProduct;
    const oldProduct = productDetail.product;
    if (Object.keys(oldProduct).length !== 0) product = oldProduct;

    product.name = value.name;
    product.categoryId = value.categoryId[value.categoryId.length - 1];
    product.rentRuleId = value.rentRuleId;
    product.compensateRuleId = value.compensateRuleId;
    product.minRentCycle = value.minRentCycle;
    product.maxRentCycle = value.maxRentCycle;
    product.minAdvancedDays = value.minAdvancedDays;
    product.maxAdvancedDays = value.maxAdvancedDays;
    product.detail = this.state.detail;
    product.type = value.type;

    shopGroupProduct.groupId = value.groupId;

    productCornerMark.infoId = value.cornerId;

    const keys = Object.keys(this.state.specs);
    keys.forEach((e, index) => {
      const one = {};
      one.children = [];
      one.specId = index + 1;
      this.state.specs[e].forEach((e1) => {
        productSkusImages.push(e1);
        one.children.push({ name: e1.name });
      });
      specs.push(one);
    });

    productLogisticForms.push({ type: 0, templateId: value.express });
    productLogisticForms.push({ type: 1, templateId: value.deliver });
    this.state.offlineSelected.forEach((e) => {
      productLogisticForms.push({ type: 2, templateId: e.id });
    });

    value.serviceMark.forEach((infoId) => {
      productServiceMarks.push({ infoId });
    });

    this.state.giveBackSelected.forEach((e) => {
      productGiveBackAddresses.push({ addressId: e.id });
    });

    value.additionService.forEach((e) => {
      productAdditionalServices.push({ shopAdditionalServicesId: e, isMust: 0 });
    });

    this.state.mainImage.forEach((e) => {
      productImageList.push({ src: e.image });
    });

    price = packPrice(this.state.price);
    if (price.length === 0) price = packPrice(this.state.sku);

    return {
      all: {
        product,
        specs,
        price,
        shopGroupProduct,
        productRentLists,
        productSkusImages,
        productCornerMark,
        productImageList,
        productLogisticForms,
        productServiceMarks,
        productPeakPremiumPrice,
        productGiveBackAddresses,
        productAdditionalServices,
      },
    };
  }

  canSubmit = (params) => {
    const isNull = (one) => {
      return (one === undefined || one === null || one === '');
    };
    const specNames = [];
    const { all: { productPeakPremiumPrice, specs, price } } = params;
    const peakBool = productPeakPremiumPrice.filter((e) => {
      return (isNull(e.start) || isNull(e.end) || isNull(e.price));
    }).length > 0;

    let specBool = false;
    specBool = specs.filter((e) => {
      return e.children.filter((e1) => {
        specNames.push(e1.name);
        return isNull(e1.name);
      }).length > 0;
    }).length > 0;

    const isRepeat = specNames.filter((e) => {
      return specNames.filter((e1) => {
        return e === e1;
      }).length > 1;
    }).length > 0;

    const priceBool = price.filter((e) => {
      const { cyclePrices, productSkus } = e;
      const e1Keys = Object.keys(productSkus);
      const skusBool = e1Keys.filter((e1) => {
        return isNull(productSkus[e1]);
      }).length > 0;
      const cycleBool = cyclePrices.filter((e1) => {
        return (isNull(e1.days) || isNull(e1.price));
      }).length > 0;
      return (cycleBool || skusBool);
    }).length > 0;

    return (!peakBool && !priceBool && !specBool && !isRepeat);
  }

  findInitCategory = (id) => {
    const cates = [];
    const findCategoryParentId = (category) => {
      let result;
      const find = (e) => {
        if (e.value === category) result = e;
        for (let i = 0; i < e.children.length; i += 1) {
          find(e.children[i]);
        }
      };
      this.props.newProduct.categories.forEach((e) => {
        find(e);
      });
      return result;
    };
    let element = findCategoryParentId(id);
    cates.push(element);
    while (element && element.parentId !== 0) {
      element = findCategoryParentId(element.parentId);
      cates.push(element);
    }
    return cates;
  }

  renderImageModal = () => {
    let selected = [];
    const { files: { data = {} }, filesLoading } = this.props;
    if (Object.keys(data) === 0) return;
    const pagination = { current: data.pageNumber, total: data.total, pageSize: data.pageSize };
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        selected = selectedRows;
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
    };
    return (
      <Modal
        width={800}
        title="选择图片"
        destroyOnClose
        visible={this.state.imageVisible}
        onOk={() => { this.handleImageModalOk(selected); }}
        onCancel={this.handleImageModalCancel}
      >
        <Table
          style={{ height: 500, overflow: 'auto' }}
          onChange={this.handleImageTableChange}
          rowSelection={rowSelection}
          columns={this.imageColumns}
          loading={filesLoading}
          dataSource={data.list}
          pagination={pagination}
        />
      </Modal>
    );
  }

  renderMainImageModal = () => {
    let selected = [];
    const { files: { data = {} }, filesLoading } = this.props;
    if (Object.keys(data) === 0) return;
    const pagination = { current: data.pageNumber, total: data.total, pageSize: data.pageSize };
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        selected = selectedRows;
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
    };
    return (
      <Modal
        width={800}
        title="选择图片"
        destroyOnClose
        visible={this.state.mainImageVisible}
        onOk={() => { this.handleMainImageModalOk(selected); }}
        onCancel={this.handleMainImageModalCancel}
      >
        <Table
          style={{ height: 500, overflow: 'auto' }}
          onChange={this.handleImageTableChange}
          rowSelection={rowSelection}
          columns={this.imageColumns}
          loading={filesLoading}
          dataSource={data.list}
          pagination={pagination}
        />
      </Modal>
    );
  }

  renderSkuImageModal = () => {
    const { files: { data = {} }, filesLoading } = this.props;
    if (Object.keys(data) === 0) return;
    const pagination = { current: data.pageNumber, total: data.total, pageSize: data.pageSize };
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.handleSkuImageModalOk(selectedRows);
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
    };
    return (
      <Modal
        width={800}
        title="选择图片"
        destroyOnClose
        visible={this.state.skuImageVisible}
        onOk={this.handleSkuImageModalCancel}
        onCancel={this.handleSkuImageModalCancel}
      >
        <Table
          style={{ height: 500, overflow: 'auto' }}
          onChange={this.handleImageTableChange}
          rowSelection={rowSelection}
          columns={this.imageColumns}
          loading={filesLoading}
          dataSource={data.list}
          pagination={pagination}
        />
      </Modal>
    );
  }

  renderOfflineModal = () => {
    let selected = [];
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        selected = selectedRows;
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
    };
    const { newProduct: { preAdd: { offlineShop = [] } } } = this.props;
    return (
      <Modal
        width={800}
        title="选择自提点"
        visible={this.state.offlineVisible}
        onOk={() => { this.handleOfflineModalOk(selected); }}
        onCancel={this.handleOfflineModalCancel}
      >
        <Table
          style={{ height: 500, overflow: 'auto' }}
          rowKey={record => record.id}
          rowSelection={rowSelection}
          columns={this.columnsOffline}
          dataSource={offlineShop}
          pagination={false}
        />
      </Modal>
    );
  }

  renderGiveBackAddresses = () => {
    let selected = [];
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        selected = selectedRows;
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
    };
    const { newProduct: { preAdd: { givebackAddress = [] } } } = this.props;
    return (
      <Modal
        width={800}
        title="选择归还方式"
        visible={this.state.giveBackVisible}
        onOk={() => { this.handleGiveBackModalOk(selected); }}
        onCancel={this.handleGiveBackModalCancel}
      >
        <Table
          style={{ height: 500, overflow: 'auto' }}
          rowKey={record => record.id}
          rowSelection={rowSelection}
          columns={this.columnsGiveback}
          dataSource={givebackAddress}
          pagination={false}
        />
      </Modal>
    );
  }

  renderOne = (getFieldDecorator) => {
    let productName = '';
    let cates = [];
    let gpId = '';
    let cornerId = '';
    let serviceMarkIds = [];

    const name = ['包邮', '减免押金', '免赔', '上门', '随租随还', '异地归还', '全新品'];
    const { newProduct: { preAdd: { serviceMark = [], group = [], cornerMark = [] },
      productDetail: { product, shopGroupProduct, productCornerMark, productServiceMarks,
      } } } = this.props;
    if (Object.keys(product).length !== 0) {
      productName = product.name;
      const category = this.findInitCategory(product.categoryId);
      cates = category.map((e) => {
        return e.value;
      }).reverse();
    }
    if (Object.keys(shopGroupProduct).length !== 0) {
      gpId = shopGroupProduct.groupId;
    }
    if (Object.keys(productCornerMark).length !== 0) {
      cornerId = productCornerMark.infoId;
    }
    serviceMarkIds = productServiceMarks.map((e) => {
      return (e.infoId).toString();
    });
    const platformServiceMark = serviceMark.map((e) => {
      return (
        <Option key={e.id} value={(e.id).toString()}>{name[e.type]}</Option>
      );
    });
    const productGroup = group.map((e) => {
      return (
        <Option key={e.id} value={e.id}>
          {e.groupName}
        </Option>
      );
    });
    const corner = cornerMark.map((e) => {
      return (
        <Option key={e.id} value={e.id}>
          <img width={20} height={20} alt={e.description} src={e.icon} />
        </Option>
      );
    });
    return (
      <Card>
        <Fragment>
          <FormItem
            {...formItemLayout}
            label="商品名称"
          >
            {getFieldDecorator('name', {
              rules: [{
                required: true, message: '请输入商品名称',
              }],
              initialValue: productName,
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="商品类目"
          >
            {getFieldDecorator('categoryId', {
              rules: [{ type: 'array', required: true, message: '请选择商品类目' }],
              initialValue: cates,
            })(
              <Cascader
                onChange={this.onCascaderChange}
                options={this.props.newProduct.categories}
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="商品分类"
          >
            {getFieldDecorator('groupId', {
              rules: [],
              initialValue: gpId,
            })(
              <Select>
                {productGroup}
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="商品角标"
          >
            {getFieldDecorator('cornerId', {
              rules: [],
              initialValue: cornerId,
            })(
              <Select>
                {corner}
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="其他服务"
          >
            {getFieldDecorator('serviceMark', {
              rules: [],
              initialValue: serviceMarkIds,
            })(
              <Select
                mode="tags"
                placeholder="请选择"
              >
                {platformServiceMark}
              </Select>
            )}
          </FormItem>
        </Fragment>
      </Card>
    );
  }

  renderTwo = () => {
    const { price, sku } = this.state;
    const renderDefaultSku = () => {
      if (price.length === 0) {
        return (
          <FormItem
            {...formItemLayout}
            label={(
              <span>
                默认定价
              </span>
            )}
          >
            <SpecTable onChange={this.onDefaultSpecTableChange} data={sku} />
          </FormItem>
        );
      }
      return (
        <div>
          <FormItem
            {...formItemLayout}
            label={(
              <span>
                商品定价
              </span>
            )}
          >
            <SpecTable onChange={this.onPriceChange} data={price} />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={(
              <span>
                SKU图片
              </span>
            )}
          >
            <SkuImage
              showModal={this.showSkuImageModal}
              onChange={this.onSpecIndexChange}
              data={this.state.specs}
            />
          </FormItem>
        </div>
      );
    };
    return (
      <Card>
        <SpecIndex
          specs={this.state.specs}
          onChange={this.onSpecIndexChange}
        />
        {renderDefaultSku()}

      </Card>
    );
  }

  renderThree = (getFieldDecorator) => {
    let asId = [];
    const { newProduct: {
      preAdd: { shopAdditionalService = [] },
      productDetail: { product, productAdditionalServices } } } = this.props;
    const additionalService = shopAdditionalService.map((e) => {
      return (
        <Option
          key={e.id}
          value={(e.id).toString()}
        >
          {e.name}
        </Option>
      );
    });
    asId = productAdditionalServices.map((e) => {
      return (e.shopAdditionalServicesId).toString();
    });
    return (
      <Card>
        <FormItem
          {...formItemLayout}
          label="最小租用周期"
        >
          {getFieldDecorator('minRentCycle', {
            rules: [{
              required: true, message: '不能为空',
            }],
            initialValue: product.minRentCycle,
          })(
            <InputNumber style={{ width: '100%' }} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="最大租用周期:"
        >
          {getFieldDecorator('maxRentCycle', {
            rules: [{
              required: true, message: '不能为空',
            }],
            initialValue: product.maxRentCycle,
          })(
            <InputNumber style={{ width: '100%' }} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="最少提前"
        >
          {getFieldDecorator('minAdvancedDays', {
            rules: [{
              required: true, message: '不能为空',
            }],
            initialValue: product.minAdvancedDays,
          })(
            <InputNumber style={{ width: '100%' }} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="最多提前"
        >
          {getFieldDecorator('maxAdvancedDays', {
            rules: [{
              required: true, message: '不能为空',
            }],
            initialValue: product.maxAdvancedDays,
          })(
            <InputNumber style={{ width: '100%' }} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="增值服务"
        >
          {getFieldDecorator('additionService', {
            initialValue: asId,
          })(
            <Select
              mode="tags"
              placeholder="请选择"
            >
              {additionalService}
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="高峰溢价"
        >
          {getFieldDecorator('peak', {
            rules: [],
          })(
            <PeakPremium data={this.state.peak} onChange={this.onPeakChange} />
          )}
        </FormItem>
      </Card >
    );
  }

  renderFour = (getFieldDecorator) => {
    const { newProduct: { preAdd: {
      rentRules = [],
      compensateRules = [],
      productDetailTemplates = [],
    }, productDetail: { product } } } = this.props;
    const { detail } = this.state;
    const rentRule = rentRules.map((e) => {
      return (
        <Option key={e.id} value={e.id}>{e.name}</Option>
      );
    });
    const compensateRule = compensateRules.map((e) => {
      return (
        <Option key={e.id} value={e.id}>{e.name}</Option>
      );
    });
    const productDetailTemplate = productDetailTemplates.map((e) => {
      return (
        <Option key={e.id} value={e.id}>{e.name}</Option>
      );
    });
    return (
      <Card>

        <FormItem
          {...formItemLayout}
          label="租赁清单"
        >
          {getFieldDecorator('rentList', {
            rules: [],
          })(
            <div>
              <Button
                onClick={this.showImageModal}
              >
                添加清单
              </Button>
              <RentList onChange={this.onRentListChange} data={this.state.rentList} />
            </div>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="租赁规则模板"
        >
          {getFieldDecorator('rentRuleId', {
            rules: [{
              required: true, message: '请选择',
            }],
            initialValue: product.rentRuleId,
          })(
            <Select>
              {rentRule}
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="赔偿规则模板"
        >
          {getFieldDecorator('compensateRuleId', {
            rules: [{
              required: true, message: '请选择',
            }],
            initialValue: product.compensateRuleId,
          })(
            <Select>
              {compensateRule}
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="商品详情模板"
        >
          {getFieldDecorator('productDetailTemplate', {
            rules: [{
              required: true, message: '请选择',
            }],
          })(
            <Select onChange={this.onProductDetailTemplateChange}>
              {productDetailTemplate}
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="商品主图"
        >
          {getFieldDecorator('mainImage', {
            rules: [],
          })(
            <div>
              <Button
                onClick={this.showMainImageModal}
              >
                添加商品主图
              </Button>
              <RentList
                showInput={false}
                onChange={this.onMainImageChange}
                data={this.state.mainImage}
              />
            </div>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="商品详细信息"
        >
          {getFieldDecorator('productDetail', {
            rules: [],
          })(
            <Edit
              htmlContent={detail}
              cbReceiver={this.onReceiveHtml}
            />
          )}
        </FormItem>
      </Card>
    );
  }

  renderFive = (getFieldDecorator) => {
    let expressId = '';
    let deliverId = '';

    const { newProduct: { preAdd: {
      freightTemplates = [],
    }, productDetail: { productLogisticForms, product } } } = this.props;

    expressId = productLogisticForms.filter((e) => {
      return e.type === 0;
    });

    deliverId = productLogisticForms.filter((e) => {
      return e.type === 1;
    });

    if (expressId.length !== 0) expressId = expressId[0].templateId;
    if (deliverId.length !== 0) deliverId = deliverId[0].templateId;

    const express = freightTemplates.filter((e) => {
      return e.type !== 1;
    }).map((e) => {
      return (
        <Option key={e.id} value={e.id}>{e.name}</Option>
      );
    });
    const deliver = freightTemplates.filter((e) => {
      return e.type !== 0;
    }).map((e) => {
      return (
        <Option key={e.id} value={e.id}>{e.name}</Option>
      );
    });
    return (
      <Card>
        <FormItem
          {...formItemLayout}
          label="归还方式"
        >
          {getFieldDecorator('name', {
            rules: [],
          })(
            <div>
              {this.state.giveBackSelected.map((e) => {
                return (
                  <Tag key={e.id} closable>{e.name}</Tag>
                );
              })}
              <Button
                onClick={this.showGiveBackModal}
              >
                选择归还方式
              </Button>
            </div>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="自提点"
        >
          {getFieldDecorator('offline', {
            rules: [],
          })(
            <div>
              {this.state.offlineSelected.map((e) => {
                return (
                  <Tag key={e.id} closable>{e.name}</Tag>
                );
              })}
              <Button
                onClick={this.showOfflineModal}
              >
                选择自提点
              </Button>
            </div>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="快递模板"
        >
          {getFieldDecorator('express', {
            rules: [{
              required: true, message: '请选择快递模板',
            }],
            initialValue: expressId,
          })(
            <Select>
              {express}
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="上门模板"
        >
          {getFieldDecorator('deliver', {
            rules: [{
              required: true, message: '请选择上门模板',
            }],
            initialValue: deliverId,
          })(
            <Select>
              {deliver}
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="上架时间"
        >
          {getFieldDecorator('type', {
            rules: [{
              required: true, message: '请选择',
            }],
            initialValue: product.type,
          })(
            <RadioGroup>
              <Radio value={1}>立即上架</Radio>
              <Radio value={2}>放入仓库</Radio>
            </RadioGroup>
          )}
        </FormItem>
      </Card>
    );
  }

  renderSubmit = () => {
    return (
      <Card>
        <FormItem>
          <Button type="primary" onClick={this.handleSubmit}>
            提交
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={this.handleCancel}>取消</Button>
        </FormItem>
      </Card>
    );
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <PageHeaderLayout>
        <Form>
          {this.renderMainImageModal()}
          {this.renderSkuImageModal()}
          {this.renderImageModal()}
          {this.renderOfflineModal()}
          {this.renderGiveBackAddresses()}
          {this.renderOne(getFieldDecorator)}
          {this.renderTwo()}
          {this.renderThree(getFieldDecorator)}
          {this.renderFour(getFieldDecorator)}
          {this.renderFive(getFieldDecorator)}
          {this.renderSubmit()}
        </Form>

      </PageHeaderLayout>
    );
  }
}
