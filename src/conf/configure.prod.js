class Configure {
  static getImageCode() {
    return `http://bbss.zudeapp.com/qcbbssapi/captcha.cci?t=${  Math.random()}`;
  }

  static getServer(content) {
    return `http://bbss.zudeapp.com/qcbbssapi/${content}`;
  }
}

export default Configure;
