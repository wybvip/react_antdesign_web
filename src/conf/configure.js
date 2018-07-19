class Configure {
  static getImageCode() {
    return `http://bbss.zudeappcom/qcbbssapi/captcha.cci?t=${  Math.random()}`;
  }

  static getServer(content) {
    return `http://bbss.zudeappcom/qcbbssapi/${content}`;
  }

  static getServerCode(content) {
    return `http://bbss.zudeappcom/qcbbsapi/${content}`;
  }
}

export default Configure;
