import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select, Divider, Steps, message } from 'antd';
import { routerRedux } from 'dva/router';
import SelectCategories from './SelectCategories';
import styles from './style.less';

const { Option } = Select;
const Step = Steps.Step;

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};
const steps = [{
  title: '选择分类',
  content: 'First-content',
}, {
  title: '商品详情',
  content: 'Second-content',
}];
@connect(({
  findCategories,
  loading,
}) => ({
  findCategories,
  loading: loading.models.findCategories,
}))

@Form.create()
export default class ChooseCategories extends React.PureComponent {

  state = {
    editInfo: {
      firstCategories: '请选择',
      secondCategories: '请选择',
      thirdCategories: '请选择',
    },
    current: 0,
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'findCategories/fetch',
      payload: {
        status: 0,
      },
    });
  }

  onFirstChange = (e) => {
    const value = e.firstCategories;
    this.setState({
      editInfo: {
        firstCategories: value,
        secondCategories: '请选择',
        thirdCategories: '请选择',
      },
    });
    this.props.dispatch({
      type: 'findCategories/fetch',
      payload: {
        id: value,
        status: 1,
        firstCategories: this.props.findCategories.findCategoriesData.data.firstCategories,
      },
    });
  }
  onSecondChange = (e) => {
    const value = e.secondCategories;
    this.setState({
      editInfo: {
        firstCategories: this.state.editInfo.firstCategories,
        secondCategories: value,
        thirdCategories: '请选择',
      },
    });
    this.props.dispatch({
      type: 'findCategories/fetch',
      payload: {
        id: value,
        status: 2,
        firstCategories: this.props.findCategories.findCategoriesData.data.firstCategories,
        secondCategories: this.props.findCategories.findCategoriesData.data.secondCategories,
      },
    });
  }
  onThirdChange = (value) => {
    this.setState({
      editInfo: {
        provinceId: this.state.editInfo.provinceId,
        cityId: this.state.editInfo.cityId,
        areaId: value,
      },
    });
  }
  next() {
    const current = this.state.current + 1;
    this.setState({ current });
  }
  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }

  render() {
    console.log('eeee!!!!!!!!!!', this.props);
    const { findCategories } = this.props;
    const { current } = this.state;
    const { findCategoriesData } = findCategories;
    const { firstCategories } =
      findCategoriesData.code === 0 ? findCategoriesData.data : []; // 第一级类目信息
    const { secondCategories } =
      findCategoriesData.code === 0 ? findCategoriesData.data : []; // 第二级类目信息
    const { thirdCategories } =
      findCategoriesData.code === 0 ? findCategoriesData.data : []; // 第三级类目信息

    return (
      <Fragment>
        <div>
          <Steps current={current}>
            {steps.map(item => <Step key={item.title} title={item.title} />)}
          </Steps>
          <div className="steps-content">
            {
              this.state.current < steps.length - 1
              &&
              (
                <SelectCategories
                  first={firstCategories}
                  second={secondCategories}
                  third={thirdCategories}
                  onFirstChange={this.onFirstChange}
                  onSecondChange={this.onSecondChange}
                />
              )
            }
            {
              this.state.current === steps.length - 1
              &&
              <div>dhaudhiahdia</div>
            }
          </div>
          <div className="steps-action">
            {
              this.state.current < steps.length - 1
              &&
              <Button type="primary" onClick={() => this.next()}>下一步</Button>
            }
            {
              this.state.current === steps.length - 1
              &&
              <Button type="primary" onClick={() => message.success('Processing complete!')}>完成</Button>
            }
            {
              this.state.current > 0
              &&
              <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>上一步</Button>
            }
          </div>
        </div>

      </Fragment>
    );
  }
}
