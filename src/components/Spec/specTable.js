import React, { Component } from 'react';
import SpecCon from './specCon';

export default class SpecTable extends Component {
  specConChange = (value) => {
    const { onChange } = this.props;
    onChange(value);
  }

  renderTables = (data) => {
    return data.map((e) => {
      return (
        <SpecCon
          key={JSON.stringify(e)}
          onChange={this.specConChange}
          dataSource={e}
        />
      );
    });
  }

  render() {
    const { data = [] } = this.props;
    return (
      <div>
        {this.renderTables(data)}
      </div>
    );
  }
}
