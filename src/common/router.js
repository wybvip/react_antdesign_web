import { createElement } from 'react';
import dynamic from 'dva/dynamic';

let routerDataCache;

const modelNotExisted = (app, model) => (
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  })
);

const dynamicWrapper = (app, models, component) => {
  if (component.toString().indexOf('.then(') < 0) {
    models.forEach((model) => {
      if (modelNotExisted(app, model)) {
        // eslint-disable-next-line
        app.model(require(`../models/${model}`).default);
      }
    });
    return (props) => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  // () => import('module')
  return dynamic({
    app,
    models: () => models.filter(
      model => modelNotExisted(app, model)).map(m => import(`../models/${m}.js`)
      ),
    // add routerData prop
    component: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then((raw) => {
        const Component = raw.default || raw;
        return props => createElement(Component, {
          ...props,
          routerData: routerDataCache,
        });
      });
    },
  });
};

export const getRouterData = (app) => {
  const routerConfig = {

    // ***********首页START*************
    '/': {
      component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
    },
    '/dashboard/analysis': {
      component: dynamicWrapper(app, ['chart'], () => import('../routes/Dashboard/Analysis')),
    },
    '/dashboard/monitor': {
      component: dynamicWrapper(app, ['monitor'], () => import('../routes/Dashboard/Monitor')),
    },
    '/dashboard/workplace': {
      component: dynamicWrapper(app, ['project', 'activities', 'chart'], () => import('../routes/Dashboard/Workplace')),
      // hideInBreadcrumb: true,
      // name: '工作台',
      // authority: 'admin',
    },
    // ***********首页END*************
    // ******企业资质、店铺信息、品牌信息START*****
    '/register/enterprise-aptitude': {
      component: dynamicWrapper(app, ['district/findDistrict', 'register/submitEnterpriseAptitude'], () => import('../routes/Register/EnterpriseAptitude')),
    },
    '/register/shop-aptitude': {
      component: dynamicWrapper(app, ['register/submitShopAptitude'], () => import('../routes/Register/ShopAptitude')),
    },
    '/register/brand-aptitude': {
      component: dynamicWrapper(app, ['register/submitBrandAptitude'], () => import('../routes/Register/BrandAptitude')),
    },
    '/register/result': {
      component: dynamicWrapper(app, ['register/auditResult'], () => import('../routes/Register/Result')),
    },
    // ******企业资质、店铺信息、品牌信息END******

    // ***********表单页START*************
    '/form/basic-form': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/BasicForm')),
    },
    '/form/step-form': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm')),
    },
    '/form/step-form/info': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step1')),
    },
    '/form/step-form/confirm': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step2')),
    },
    '/form/step-form/result': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step3')),
    },
    '/form/advanced-form': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/AdvancedForm')),
    },
    // ***********表单页END*************

    // ***********订单START*************
    '/orders/list': {
      // 订单列表
      component: dynamicWrapper(app, ['orders/orderList'], () => import('../routes/Orders/OrderList')),
    },
    // *************订单END****************

    // ***********收入/提现START*************
    '/orders/income': {
      // 收入/提现
      component: dynamicWrapper(app, ['income/income'], () => import('../routes/InCome/InComeList')),
    },
    // *************收入/提现END****************

    // ***********评论列表*************
    '/orders/comments': {
      // 评论列表
      component: dynamicWrapper(app, ['comment/commentList'], () => import('../routes/Comment/CommentList')),
    },
    // *************评论列表****************

    // ***********消息中心START*************
    '/message/list': {
      // 消息中心
      component: dynamicWrapper(app, ['message/messageList'], () => import('../routes/Message/MessageList')),
    },
    // *************消息中心END****************

    // *************列表页START****************
    '/list/basic-list': {
      // component: dynamicWrapper(app, ['list'], () => import('../routes/List/BasicList')),
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/BasicList')),
    },
    '/list/search': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/List')),
    },
    '/list/search/projects': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/Projects')),
    },

    '/list/search/applications': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/Applications')),
    },
    '/list/search/articles': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/Articles')),
    },
    // *************列表页END****************

    // *************ProfileSTART****************
    '/profile/basic': {
      component: dynamicWrapper(app, ['list', 'shopList'], () => import('../routes/List/ShopList')),
    },
    '/profile/advanced': {
      component: dynamicWrapper(app, ['profile'], () => import('../routes/Profile/AdvancedProfile')),
    },
    '/result/success': {
      component: dynamicWrapper(app, [], () => import('../routes/Result/Success')),
    },
    '/result/fail': {
      component: dynamicWrapper(app, [], () => import('../routes/Result/Error')),
    },
    // *************ProfileEND****************

    // *************异常页START****************
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    },
    '/exception/404': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
    },
    '/exception/500': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
    },
    '/exception/trigger': {
      component: dynamicWrapper(app, ['error'], () => import('../routes/Exception/triggerException')),
    },
    // *************异常页END****************

    // *************用户页START****************
    '/user': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    },
    '/user/login': {
      component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
    },
    '/user/register': {
      component: dynamicWrapper(app, ['register'], () => import('../routes/User/Register')),
    },
    '/user/register-result': {
      component: dynamicWrapper(app, [], () => import('../routes/User/RegisterResult')),
    },
    '/user/forget': {
      component: dynamicWrapper(app, ['forget'], () => import('../routes/User/Forget')),
    },
    // *************用户页END****************

    '/list/income': {
      component: dynamicWrapper(app, [], () => import('../routes/User/Forget')),
    },

    // *************资金支持START****************
    /* 业务说明 */
    '/financialsupport/business-explain': {
      component: dynamicWrapper(app, ['orderList', 'rule'], () => import('../routes/Goods/AllGoods')),
    },
    /* 申请流程 */
    '/financialsupport/application-procedure': {
      component: dynamicWrapper(app, ['financialsupport'], () => import('../routes/FinancialSupport/ApplicationProcedure')),
    },
    /* 立即申请 */
    '/financialsupport/apply-immediately': {
      component: dynamicWrapper(app, ['financial/upload', 'financialsupport'], () => import('../routes/FinancialSupport/ApplyImmediately')),
    },
    /* 申请记录 */
    '/financialsupport/application-record': {
      component: dynamicWrapper(app, ['financialsupport'], () => import('../routes/FinancialSupport/ApplicationRecord')),
    },
    /* 申请详情 */
    '/financialsupport/applicationRecordDatail/:id': {
      component: dynamicWrapper(app, ['financialsupport'], () => import('../routes/FinancialSupport/ApplicationRecordDatail')),
    },
    // *************资金支持END****************

    // *************店铺管理START****************
    /* 自提点 */
    '/shop/shops': {
      component: dynamicWrapper(app, ['shop/shop'], () => import('../routes/Shop/Shops')),
    },
    /* 我的文件 */
    '/shop/files': {
      component: dynamicWrapper(app, ['shop/files'], () => import('../routes/Shop/Files')),
    },
    /* 店铺通知 */
    '/shop/notice': {
      component: dynamicWrapper(app, ['shop/shop'], () => import('../routes/Shop/Notice')),
    },
    /* 增值服务 */
    '/shop/services': {
      component: dynamicWrapper(app, ['shop/services'], () => import('../routes/Shop/Services')),
    },
    // *************店铺管理END****************

    // *************商品页面START****************
    /*  商品详情模版 */
    '/product/list': {
      component: dynamicWrapper(app, ['productList'], () => import('../routes/List/ProductList')),
    },
    '/product/template': {
      component: dynamicWrapper(app, ['goods/goodsDetial'], () => import('../routes/Goods/GoodsDetial')),
    },
    // '/product/list': {
    //   component: dynamicWrapper(app, ['productList'], () => import('../routes/List/ProductList')),
    // },
    '/product/rent_rule': {
      component: dynamicWrapper(app, ['rentRule'], () => import('../routes/Goods/RentRule')),
    },
    '/product/compensate_rule': {
      component: dynamicWrapper(app, ['goods/compensateRule'], () => import('../routes/Goods/CompensateRule')),
    },
    '/product/group': {
      component: dynamicWrapper(app, ['goods/productGroup'], () => import('../routes/Goods/ProductGroup')),
    },
    '/product/freight_template': {
      component: dynamicWrapper(app, ['goods/freightTemplate'], () => import('../routes/Goods/FreightTemplate')),
    },
    '/product/giveback': {
      component: dynamicWrapper(app, ['goods/giveBack', 'findDistrict'], () => import('../routes/Goods/Giveback')),
    },
    '/product/template_add': {
      component: dynamicWrapper(app, ['goods/goodsDetial'], () => import('../routes/Product/TemplateAdd')),
    },
    '/product/rent_rule_add': {
      component: dynamicWrapper(app, ['rentRule'], () => import('../routes/Product/RentRuleAdd')),
    },
    '/product/compensate_rule_add': {
      component: dynamicWrapper(app, ['goods/compensateRule'], () => import('../routes/Product/CompensateRuleAdd')),
    },

    '/product/freight_template_add/:type/:id': {
      component: dynamicWrapper(app, ['goods/freightTemplate', 'district/findDistrict'], () => import('../routes/Product/FreightTemplateAdd')),
    },
    '/product/giveback_add': {
      component: dynamicWrapper(app, ['goods/giveBack', 'findDistrict'], () => import('../routes/Product/GivebackAdd')),
    },
    '/product/add_new_product/:id': {
      component: dynamicWrapper(app, ['goods/newProduct',
        'goods/giveBack',
        'findDistrict',
        'rentRule',
        'goods/compensateRule',
        'goods/goodsDetial',
        'goods/findCategories',
        'shop/files',
        'shop/shop',
      ], () => import('../routes/Product/AddNewProduct')),
    },
    '/product/add_new_product1': {
      component: dynamicWrapper(app, ['goods/findCategories'], () => import('../routes/Product/step1')),
    },
    // *************商品页面END****************

    // *************权限管理START****************
    '/admin/role': {
      component: dynamicWrapper(app, ['role/role'], () => import('../routes/Role/RoleList')),
    },
    '/admin/role_add/:id': {
      component: dynamicWrapper(app, ['role/role', 'role/menus'], () => import('../routes/Role/RoleAdd')),
    },
    '/admin/employee': {
      component: dynamicWrapper(app, ['user/users'], () => import('../routes/User/UserList')),
    },
    '/admin/employee_add/:id': {
      component: dynamicWrapper(app, ['user/users'], () => import('../routes/User/UserAdd')),
    },
    // *************权限管理END****************
  };
  const routerData = {};
  Object.keys(routerConfig).forEach((path) => {
    const menuItem = {};
    let router = routerConfig[path];
    router = {
      ...router,
      name: router.name || menuItem.name,
      authority: router.authority || menuItem.authority,
    };
    routerData[path] = router;
  });
  return routerData;
};
