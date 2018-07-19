class Configure {
  static getImageCode() {
    return `http://bbss.zudeappcom/qcbbssapi/captcha.cci?t=${  Math.random()}`;
  }

  static getServer(content) {
    return `http://bbss.zudeappcom/qcbbssapi/${content}`;
  }
}

export default Configure;
