import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Card,
  Icon,
  List,
  Tooltip,
  Button,
  Input,
  Upload,
  message,
  Popconfirm,
  Pagination,
  Modal,
  Divider,
} from 'antd';

import StandardFormRow from '../../components/StandardFormRow';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Files.less';

const FormItem = Form.Item;

/* eslint react/no-array-index-key: 0 */
@Form.create()
@connect(({ files, loading }) => ({
  files,
  loading: loading.models.files,
}))
export default class Files extends PureComponent {
  state = {
    uploadVisible: false,
    confirmUploadLoading: false,
    loading: false,
    editVisible: false,
    confirmEditLoading: false,
    editBeforeData: {},
    pageData: {},
    imgSrc: {},
    fromValues: {},
    photoVisible: false,
    photoSrc: undefined,
    confirmPhotoLoading: false
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'files/selectByName',
      payload: {},
    });
  }

  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  showUploadModal = () => {
    this.setState({
      uploadVisible: true,
    });
  }

  handleUploadOk = () => {
    this.setState({
      confirmUploadLoading: true,
    });
    const { imgName, imgSrc } = this.state;
    this.props.dispatch({
      type: 'files/addFile',
      payload: {
        imgSrc,
        imgName,
      },
    }).then(() => {
      const code = this.props.files.data.addCode;
      const { pageData } = this.state;
      const queryName = this.state.fromValues;
      if (code === 0) {
        // 弹出消息框  添加成功
        message.success('添加文件成功！', 2.5);
      } else {
        message.error('添加文件失败！', 2.5);
      }
      this.setState({
        uploadVisible: false,
      });
      this.props.dispatch({
        type: 'files/selectByName',
        payload: {
          pageNumber: pageData.pageNumber,
          pageSize: pageData.pageSize,
          queryName,
        },
      });
    });

    setTimeout(() => {
      this.setState({
        loading: false,
        confirmUploadLoading: false,
      });
    }, 500);
  }

  handleUploadCancel = () => {
    this.setState({
      uploadVisible: false,
      loading: false,
    });
  }

  handlePhotoCancel = () => {
    this.setState({
      photoVisible: false,
      confirmPhotoLoading: false,
      loading: false,
    });
  }

  handlerPaginationChange = (pageNumber, pageSize) => {
    if (pageNumber >= 1) {
      this.setState({
        pageData: {
          pageNumber,
          pageSize: pageSize.pageSize,
        },
      });
      const { queryName } = this.state.fromValues;
      this.props.dispatch({
        type: 'files/selectByName',
        payload: {
          pageNumber,
          pageSize: pageSize.pageSize,
          queryName,
        },
      });
    }
  }

  beforeUpload = (file) => {
    const imgName = file.name;
    this.setState({
      imgName,
    });
    const isJPG = file.type === 'image/jpeg';
    if (!isJPG) {
      message.error('请选择上传JPG文件!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('文件大于2MB!');
    }
    return isJPG && isLt2M;
  }

  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      let imgSrc = '';
      if (info.file.response.err_code === 0) {
        imgSrc = info.file.response.data;
      }
      this.setState({
        imgSrc,
      });
      console.log('imgSrc is', imgSrc);
      this.getBase64(info.file.originFileObj, imageUrl => this.setState({
        imageUrl,
        loading: false,
      }));
    }
  }

  deleteConfirm = (e) => {
    if (e) {
      this.props
        .dispatch({
          type: 'files/deleteFile',
          payload: {
            id: e,
          },
        })
        .then(() => {
          const code = this.props.files.data.delCode;
          const { pageData } = this.state;
          const { queryName } = this.state.fromValues;
          if (code === 0) {
            // 弹出消息框  添加成功
            message.success('删除文件成功！', 2.5);
          } else {
            message.error('删除文件失败！', 2.5);
          }
          this.props.dispatch({
            type: 'files/selectByName',
            payload: {
              pageNumber: pageData.pageNumber,
              pageSize: pageData.pageSize,
              queryName,
            },
          });
        });
    }
  };

  handleEditPage = (id, name) => {
    this.setState({
      editVisible: true,
      editBeforeData: {
        id,
        name,
      },
    });
  }

  handleEditOk = () => {
    this.setState({
      confirmEditLoading: true,
    });
    const name = this.state.editName;
    const { id } = this.state.editBeforeData;
    const { pageData } = this.state;
    const { queryName } = this.state.fromValues;
    this.props.dispatch({
      type: 'files/editFile',
      payload: {
        name,
        id,
      },
    }).then(() => {
      const code = this.props.files.data.editCode;
      if (code === 0) {
        // 弹出消息框  添加成功
        message.success('修改文件名成功！', 2.5);
      } else {
        // 弹出消息框，添加失败
        message.error('修改文件名失败！', 2.5);
      }
      this.props.dispatch({
        type: 'files/selectByName',
        payload: {
          pageNumber: pageData.pageNumber,
          pageSize: pageData.pageSize,
          queryName,
        },
      });
    });
    setTimeout(() => {
      this.setState({
        editVisible: false,
        confirmEditLoading: false,
      });
    }, 500);
  }

  handleFileSelect(evt){
    let that = this;
    var files = evt.target.files;
    console.log('files', files);
    //var url =  "bbss.zudeapp.com" + "/" + urls.get('upload', 'getSrc'); // 接收上传文件的后台地址
    var url =  "qcbbssapi/upload.cfi";
    var form = new FormData(); // FormData 对象
    form.append("file", files[0]); // 文件对象
    let xhr = new XMLHttpRequest();  // XMLHttpRequest 对象
    xhr.open("post", url, true); //post方式，url为服务器请求地址，true 该参数规定请求是否异步处理。
    //请求完成
    xhr.onload = function(res){
        let data = JSON.parse(res.target.responseText);
        let url = data.data;
        console.log("url is", url);
        that.setState({
            file: url
        })
    };
    xhr.send(form);
  }

  watchPhoto = (imgSrc) => {
    console.log("photoSrc is", imgSrc);
    this.setState({
      photoSrc: imgSrc,
      photoVisible: true,
    });
    console.log("photoSrc+++",this.state.photoSrc);
  }

  handleEditCancel = () => {
    this.setState({
      editVisible: false,
    });
  }

  handleChangeEditName = (e) => {
    this.setState({
      editName: e.target.value,
    });
  }

  handleSearch = (e) => {
    if (e) e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({
          fromValues: values,
        });
        this.props.dispatch({
          type: 'files/selectByName',
          payload: {
            queryName: values.queryName,
            pageNumber: 1,
            pageSize: 12,
          },
        });
      }
    });
  }

  renderList() {
    const fileList = this.props.files.data.list;
    const { total } = this.props.files.data;
    const { pageSize } = this.props.files.data;
    const { pageNumber } = this.props.files.data;
    const { getFieldDecorator } = this.props.form;
    const {
      uploadVisible, confirmUploadLoading, loading, confirmEditLoading, editVisible,photoVisible, photoSrc,confirmPhotoLoading
    } = this.state;
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传图片</div>
      </div>
    );
    const { imageUrl } = this.state;
    return (
      <PageHeaderLayout
        title="文件列表"
        content="所有的文件信息展示在下方"
      >
        <div className={styles.filterCardList}>
          <Card>
            <Button type="primary" onClick={this.showUploadModal}>
              <Icon type="upload" /> 添加文件
            </Button>
            <Divider />
            <Form layout="inline" onSubmit={this.handleSearch}>
              <FormItem label="名称">
                {getFieldDecorator('queryName', {
                  // initialValue: searchData ? shopData.areaAdd : '',
                })(
                  <Input placeholder="请输入文件名称" style={{ width: '100%' }} />
                )}
              </FormItem>
              <FormItem>
                <Button type="common" htmlType="submit" >
                  <Icon type="search" /> 查询
                </Button>
              </FormItem>
              <StandardFormRow grid last>
                <Modal
                  title="文件修改"
                  visible={editVisible}
                  confirmLoading={confirmEditLoading}
                  onCancel={this.handleEditCancel}
                  destroyOnClose
                  footer={[
                    <Button key="eidtBack" onClick={this.handleEditCancel}>返回</Button>,
                    <Button key="editSubmit" type="primary" loading={loading} onClick={this.handleEditOk}>
                      提交
                    </Button>,
                  ]}
                >
                  <Input id="editInput" defaultValue={this.state.editBeforeData.name} onChange={this.handleChangeEditName} />
                </Modal>
                <Modal
                  title="图片上传"
                  visible={uploadVisible}
                  confirmLoading={confirmUploadLoading}
                  onCancel={this.handleUploadCancel}
                  destroyOnClose
                  footer={[
                    <p>图片大小不超过2M。商品主图，租赁清单图片比例为1：1</p>,
                    <Button key="back" onClick={this.handleUploadCancel}>返回</Button>,
                    <Button key="submit" type="primary" loading={loading} onClick={this.handleUploadOk}>
                      提交
                    </Button>,
                  ]}
                >
                  <Upload
                    name="productImg"
                    listType="picture-card"
                    showUploadList={false}
                    action="///bbss.zudeapp.com/qcbbssapi/upload.cfi"
                    beforeUpload={this.beforeUpload}
                    onChange={this.handleChange}
                  >
                    {imageUrl ? <img src={imageUrl} className={styles.uploadImg} alt="商品主图" /> : uploadButton}
                  </Upload>

                </Modal>

                  <Modal
                    title="图片展示"
                    visible={photoVisible}
                    confirmLoading={confirmPhotoLoading}
                    onCancel={this.handlePhotoCancel}
                    destroyOnClose
                    footer={[
                      <Button key="back" onClick={this.handlePhotoCancel}>返回</Button>,
                    ]}
                  >
                  {

                }
                    <img src={photoSrc} style={{width:'100%',height:'100%'}}/>
                  </Modal>
              </StandardFormRow>
            </Form>
            <List
              rowKey="id"
              style={{ marginTop: 24 }}
              grid={{ gutter: 24, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
              dataSource={fileList}
              loading={this.props.loading}
              renderItem={item => (
                <List.Item key={item.id} style={{ display: 'block', width: '100%' }}>
                  <Card
                    hoverable
                    // bodyStyle={{ paddingBottom: 20 }}

                    actions={[
                      <Tooltip title="编辑">
                        <a>
                          <Icon
                            type="edit"
                            onClick={() => this.handleEditPage(item.id, item.name)}
                          />
                        </a>
                      </Tooltip>,
                      <Tooltip title="删除">
                        <Popconfirm
                          title="确认删除该文件吗?"
                          onConfirm={() => {
                            this.deleteConfirm(item.id);
                          }}
                          onCancel={this.deleteCancel}
                          okText="确认"
                          cancelText="取消"
                        >
                          <Icon type="delete" />
                        </Popconfirm>
                      </Tooltip>,
                    ]}
                  >
                    <div style={{ height: '250px', width: '100%' }}>
                      <div className="fileImage" layout="inline" style={{ height: '200px', width: '100%' }} >
                        <img style={{ width: '100%', height: '200px' }} alt="logo" src={item.src} onClick={() => {
                            this.watchPhoto(item.src);
                          }}/>
                      </div>
                      <div className="dataContent">
                        <div className="name" >Name: {item.name}</div>
                        <div className="createdAt">Added: {item.createdAt}</div>
                      </div>
                    </div>
                  </Card>
                </List.Item>
              )}
            />
          </Card>

        </div>
        <Pagination
          style={{ marginTop: 24 }}
          showQuickJumper
          current={pageNumber}
          total={total}
          pageSize={pageSize}
          onChange={page => this.handlerPaginationChange(page, pageSize)}
        />
      </PageHeaderLayout>
    );
  }

  render() {
    return this.renderList();
  }
}
