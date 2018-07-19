const specs = [{
  name: '颜色',
  type: 'color',
}, {
  name: '规格',
  type: 'spec',
}];

const isNewOrOld = [{
  value: 0,
  text: '全新',
}, {
  value: 1,
  text: '99成新',
}, {
  value: 2,
  text: '97成新',
}, {
  value: 3,
  text: '9成新',
}];

const periodArray = [
  { value: 0, text: '1日及以上' },
  { value: 1, text: '7日及以上' },
  { value: 2, text: '30日及以上' },
  { value: 3, text: '90日及以上' },
  { value: 4, text: '365日及以上' },
];

const description = [
  '元／日,1日及以上，是指租用时长为1日以上（包含1日）每日的租金价格',
  '元／日,7日及以上，是指租用时长为7日以上（包含7日）每日的租金价格',
  '元／日,30日及以上，是指租用时长为30日以上（包含30日）每日的租金价格',
  '元／日,90日及以上，是指租用时长为90日以上（包含90日）每日的租金价格',
  '元／日,365日及以上，是指租用时长为365日以上（包含365日）每日的租金价格',
];

export { specs, isNewOrOld, periodArray, description };
