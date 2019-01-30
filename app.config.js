export default {
  token: '1j32ksie3j9jd893dd',
  // apihost: 'http://192.168.43.227:9000/web',
  // urlhost:  'http://192.168.43.227:9000',
  // apihost: 'http://192.168.3.165:9000/web',
  // urlhost:  'http://192.168.3.165:9000',
  apihost: 'http://47.92.200.142:9000/web',
  urlhost:  'http://47.92.200.142:9000',
  timeout: 25000,
  // 登录地址
  loginurl: '/account/login',
  // 免授权的url，不用登陆即可访问
  exemptionAuthUrls: [],
  // 资源上传地址
  res: {
    upload: 'http://47.92.26.155:9070/api/FileUpload/UploadFile'
  },
  // 用于不是根目录并且是静态发布的时候使用
  // publicPath: '/toftek/dist',
  publicPath: '/',


  
  // 110kV备自投装置CSC246A-DA-G
  // #1主变第一套保护装置CSC326T1-DA-G
  // #1主变第二套保护装置CSC326T1-DA-G
  // #2主变第一套保护装置CSC326T1-DA-G
  // #2主变第二套保护装置CSC326T1-DA-G
  // 110kV内桥测控
  // #1主变高压侧测控
  // #1主变低压侧测控
  // #2主变高压侧测控
  // #2主变低压侧II段测控
  // #2主变低压侧III段测控
  // 110kV梧庄1296线测控
  // 110kV安陈1553线测控
  position:
  [
  '',
  '110kV备自投装置CSC246A-DA-G',
  '#1主变第一套保护装置CSC326T1-DA-G',
  '#1主变第二套保护装置CSC326T1-DA-G',
  '#1主变高压侧测控',
  '#1主变低压侧测控',
  '',
  '#2主变第一套保护装置CSC326T1-DA-G',
  '#2主变第二套保护装置CSC326T1-DA-G',
  '#2主变高压侧测控',
  '#2主变低压侧II段测控',
  '#2主变低压侧III段测控',
  '',
  ]

  

}
