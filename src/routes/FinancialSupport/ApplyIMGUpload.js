import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Form, Input, Card, Badge, Table, Divider,Button,
  Upload, Icon, message , Modal } from 'antd';
import styles from './appLyUpload.less';

const FormItem = Form.Item;
class PicturesWall extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      src: this.props.src ? this.props.src : '',
      previewVisible: false,
      previewImage: '',
    };
  }
  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }
  handleRemove = (file) => {
    if (this.props.handleRemove) {
      this.props.handleRemove(file);
    }
  }

  handleChange = (fileList) => {
    if (this.props.handleChange) {
      const newfileList = fileList.fileList ? fileList.fileList : fileList;
      this.props.handleChange(this.props.keyEnd, this.props.srcType, newfileList);
    }

  }

  render() {
    const { fileList } = this.props;
    const maxLength = this.props.maxLength ? Number(this.props.maxLength) : 1;
    const { previewVisible, previewImage } = this.state;
    const conrtrt = false;
    function beforeUpload(file) {
      /*
      const isJPG = file.type === 'image/!*';
      if (!isJPG) {
        message.error('只能选择图片类型进行上传!');
      }
      */
      const isLt2M = file.size / 1024 / 1024 < 1;
      if (!isLt2M) {
        message.error('图片大小最多不能超过1M!');
      }
      // return isJPG && isLt2M;
      return isLt2M;
    }
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">点击上传</div>
      </div>
    );

    return (
      <div style={{ marginLeft: 20 }}>
        <Upload
          action={this.props.action}
          listType={this.props.listType}
          srcType={this.props.srcType}
          keyEnd={this.props.keyEnd}
          showRemoveIcon={conrtrt}
          fileList={fileList}
          accept="image/*"
          beforeUpload={beforeUpload}
          multiple={Boolean(this.props.multiple)}
          onPreview={this.handlePreview}
          onRemove={this.handleRemove}
          onChange={this.handleChange}
        >
          {fileList.length >= maxLength ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" src={previewImage} />
        </Modal>
      </div>
    );
  }
}
export default PicturesWall;
// ReactDOM.render(<PicturesWall />, this.find);
