import React, { Component } from 'react';
import { Icon, Tag } from 'antd';


export default class SkuImage extends Component {
  index = 0;

  closeImage = (id) => {
    const { onChange } = this.props;
    const { data } = this.props;
    const keys = Object.keys(data);
    keys.forEach((e) => {
      return data[e].forEach((e1, i) => {
        const tmp = e1;
        if (e1.id === id) {
          tmp.image = null;
          data[e][i] = tmp;
        }
      });
    });
    onChange(data);
  }

  addImage = (id) => {
    const { showModal } = this.props;
    showModal(id);
  }

  renderImages = () => {
    const { data = {} } = this.props;
    const keys = Object.keys(data);
    if (keys.length === 0) return;
    const ft = keys.filter((e) => {
      return (data[e].length !== 0);
    });
    if (ft.length === 0) return;
    return ft.map((e) => {
      return data[e];
    }).reduce((e, a) => {
      return e.concat(a);
    }).map((e) => {
      return (
        <div
          style={{ position: 'relative', width: 120, marginLeft: 8, display: 'inline-block' }}
          key={e.id}
        >
          <Icon
            style={{ position: 'absolute', top: -2, right: -6, zIndex: 1000, cursor: 'pointer' }}
            type="close-circle-o"
            onClick={() => { this.closeImage(e.id); }}
          />
          <img
            src={e.image}
            width="100"
            height="100"
            alt="清单"
            onClick={() => { this.addImage(e.id); }}
            style={{ cursor: 'pointer', display: 'block', marginTop: 10, marginBottom: 10, padding: 2, border: '1px solid #e2e2e2' }}
          />
          <Tag>{e.name}</Tag>
        </div>
      );
    });
  }

  render() {
    return (
      <div>
        {this.renderImages()}
      </div>
    );
  }
}
