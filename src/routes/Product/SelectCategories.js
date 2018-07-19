import React, { Fragment } from 'react';
import { Form, Select } from 'antd';

const { Option } = Select;

@Form.create()
export default class SelectCategories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editInfo: {
        firstCategories: '请选择',
        secondCategories: '请选择',
        thirdCategories: '请选择',
      },
      current: 0,
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;
    // dispatch({
    //   type: 'findCategories/fetch',
    //   payload: {
    //     status: 0,
    //   },
    // });
  }

  onFirstChange = (value) => {
    this.setState({
      editInfo: {
        firstCategories: value,
        secondCategories: '请选择',
        thirdCategories: '请选择',
      },
    });
    const editInfo = {
      ...this.state.editInfo,
      firstCategories: value,
    };
    this.props.onFirstChange(editInfo);
  }
  onSecondChange = (value) => {
    this.setState({
      editInfo: {
        firstCategories: this.state.editInfo.firstCategories,
        secondCategories: value,
        thirdCategories: '请选择',
      },
    });
    const editInfo = {
      ...this.state.editInfo,
      secondCategories: value,
    };
    this.props.onSecondChange(editInfo);
  }
  onThirdChange = (value) => {
    this.setState({
      editInfo: {
        firstCategories: this.state.editInfo.firstCategories,
        secondCategories: this.state.editInfo.secondCategories,
        thirdCategories: value,
      },
    });
  }

  render() {
    const { first, second, third } = this.props;
    const firstCategoriesOptions =
      first.map(e => <Option key={e.id}>{e.name}</Option>);
    const secondCategoriesOptions =
      second.map(e => <Option key={e.id}>{e.name}</Option>);
    const thirdCategoriesOptions =
      third.map(e => <Option key={e.id}>{e.name}</Option>);

    return (
      <Fragment>
        <div style={{ maxWidth: 750, margin: 'auto' }}>
          <Select
            //defaultValue={this.state.editInfo.firstCategories}
            style={{ width: 190, marginRight: 10, display: first.length <= 0 ? 'none' : 'inline-block' }}
            onChange={this.onFirstChange.bind(this)}
            value={this.state.editInfo.firstCategories}
          >
            {firstCategoriesOptions}
          </Select>
          <Select
            //defaultValue={this.state.editInfo.secondCategories}
            style={{ width: 190, marginRight: 10, display: second.length <= 0 ? 'none' : 'inline-block' }}
            onChange={this.onSecondChange.bind(this)}
            value={this.state.editInfo.secondCategories}
          >
            {secondCategoriesOptions}
          </Select>
          <Select
            defaultValue={this.state.editInfo.thirdCategories}
            style={{ width: 190, marginRight: 10, display: third.length <= 0 ? 'none' : 'inline-block' }}
            onChange={this.onThirdChange.bind(this)}
            value={this.state.editInfo.thirdCategories}
          >
            {thirdCategoriesOptions}
          </Select>

        </div>

      </Fragment>
    );
  }
}
