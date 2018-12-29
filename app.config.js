export default {
  token: '1j32ksie3j9jd893dd',
  apihost: 'http://47.92.26.155:9070',
  timeout: 15000,
  // 登录地址
  loginurl: '/user/login',
  // 免授权的url，不用登陆即可访问
  exemptionAuthUrls: [],
  // 资源上传地址
  res: {
    upload: 'http://47.92.26.155:9070/api/FileUpload/UploadFile'
  },
  // 用于不是根目录并且是静态发布的时候使用
  // publicPath: '/toftek/dist',
  publicPath: '/'
}
