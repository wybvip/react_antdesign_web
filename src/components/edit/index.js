import React from 'react';
import LzEditor from 'react-lz-editor';
import { Message } from 'antd';

class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      htmlContent: '',
      responseList: [],
    };
    this.receiveHtml = this.receiveHtml.bind(this);
  }
  componentWillMount() {
    this.setState({
      htmlContent: this.props.htmlContent,
    });
  }
  receiveHtml(content) {
    this.setState({ responseList: [] });
    this.props.cbReceiver(content);
  }
  render() {
    const uploadProps = {
      action: 'http://bbss.zudeapp.com/qcbbssapi/upload.cfi',
      headers: {
        authorization: 'authorization-text',
      },
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          Message.success(`${info.file.name} 上传成功`);
        } else if (info.file.status === 'error') {
          Message.error(`${info.file.name} 上传失败`);
        }
      },
      listType: 'picture',
      fileList: this.state.responseList,
      data: (file) => {
        console.log(file, '88');
      },
      multiple: true,
      beforeUpload: this.beforeUpload,
      showUploadList: true,
    };

    const htmlContent = this.state.htmlContent ? this.state.htmlContent : this.props.htmlContent;
    const html = `<div id="zxcvasdf" style="height: 700px; overflow: auto">${htmlContent}</div>`;
    return (
      <div>
        <LzEditor
          active="true"
// importContent={this.state.htmlContent ? this.state.htmlContent : this.props.htmlContent}
          importContent={html}
          fullScreen={false}
          cbReceiver={this.receiveHtml}
          uploadProps={uploadProps}
          lang="en"
        />
        {/* <br />
        <div>Editor demo 2 (use markdown format ):
        </div>
        <LzEditor
          active={true}
          importContent={this.state.markdownContent}
          cbReceiver={this.receiveMarkdown}
          image={false}
          video={false}
          audio={false}
          convertFormat="markdown" /> */}
      </div>
    );
  }
}
export default Test;
