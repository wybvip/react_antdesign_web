import { isUrl } from '../utils/utils';

const menuData = [{
  name: 'dashboard',
  icon: 'dashboard',
  path: 'dashboard',
  children: [{
    name: '分析页',
    path: 'analysis',
  }, {
    name: '监控页',
    path: 'monitor',
  }, {
    name: '工作台',
    path: 'workplace',
    // hideInMenu: true,
  }],
}, {
  name: '表单页',
  icon: 'form',
  path: 'form',
  children: [{
    name: '基础表单',
    path: 'basic-form',
  }, {
    name: '分步表单',
    path: 'step-form',
  }, {
    name: '高级表单',
    authority: 'admin',
    path: 'advanced-form',
  }],
}, {
  name: '列表页',
  icon: 'table',
  path: 'list',
  children: [{
    name: '订单列表',
    path: 'orders-list',
  }, {
    name: '收入/提现',
    path: 'income-list',
  }, {
    name: '评论列表',
    path: 'comment-list',
  }, {
    name: '标准列表',
    path: 'basic-list',
  }, {
    name: '搜索列表',
    path: 'search',
    children: [{
      name: '搜索列表（文章）',
      path: 'articles',
    }, {
      name: '搜索列表（项目）',
      path: 'projects',
    }, {
      name: '搜索列表（应用）',
      path: 'applications',
    }],
  }],
}, {
  name: '商品页',
  icon: 'table',
  path: 'goods',
  children: [{
    name: '商品详情模板',
    path: 'goods-detial',
  }, {
    name: '租赁规则模板',
    path: 'rent-rule',
  }, {
    name: '赔偿规则模板',
    path: 'compensate-rule',
  }, {
    name: '商品分类',
    path: 'product-group',
  }, {
    name: '运费模板',
    path: 'freight-template',
  }, {
    name: '归还地址',
    path: 'giveback',
  }],
}, {
  name: '详情页',
  icon: 'profile',
  path: 'profile',
  children: [{
    name: '基础详情页',
    path: 'basic',
  }, {
    name: '高级详情页',
    path: 'advanced',
    authority: 'admin',
  }],
}, {
  name: '权限管理',
  icon: 'profile',
  path: 'admin',
  children: [{
    name: '管理员',
    path: 'employee',
  }, {
    name: '角色',
    path: 'role',
    authority: 'admin',
  }],
}, {
  name: '资金支持',
  icon: 'bank',
  path: 'financialsupport',
  children: [{
    name: '业务说明',
    path: 'business-explain',
  }, {
    name: '申请流程',
    path: 'application-procedure',
  }, {
    name: '立即申请',
    // authority: 'admin',
    path: 'apply-immediately',
  }, {
    name: '申请记录',
    // authority: 'admin',
    path: 'application-record',
  }],
}, {
  name: '店铺管理',
  icon: 'shop',
  path: 'shop',
  children: [{
    name: '自提点',
    path: 'shops',
  }, {
    name: '我的文件',
    path: 'files',
  }, {
    name: '店铺通知',
    // authority: 'admin',
    path: 'notice',
  }, {
    name: '增值服务',
    // authority: 'admin',
    path: 'services',
  }],
}, {
  name: '结果页',
  icon: 'check-circle-o',
  path: 'result',
  children: [{
    name: '成功',
    path: 'success',
  }, {
    name: '失败',
    path: 'fail',
  }],
}, {
  name: '异常页',
  icon: 'warning',
  path: 'exception',
  children: [{
    name: '403',
    path: '403',
  }, {
    name: '404',
    path: '404',
  }, {
    name: '500',
    path: '500',
  }, {
    name: '触发异常',
    path: 'trigger',
    hideInMenu: true,
  }],
}, {
  name: '账户',
  icon: 'user',
  path: 'user',
  authority: 'guest',
  children: [{
    name: '登录',
    path: 'login',
  }, {
    name: '注册',
    path: 'register',
  }, {
    name: '注册结果',
    path: 'register-result',
  }],
}];

function formatter(data, parentPath = '', parentAuthority) {
  return data.map((item) => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
