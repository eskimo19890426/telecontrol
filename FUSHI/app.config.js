export default {
  token: '1j32ksie3j9jd893dd',
  apihost: 'http://47.92.26.155:9070',
  // apihost: 'http://47.92.200.142:8030',
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
  publicPath: '/',
  app: {
    modules: {
      setting: [{
        name: '系统设置',
        path: '/setting/sys',
        icon: '&#xe607;',
        children: [{
          name: 'LOT服务器设置',
          path: '/setting/sys/lot-server',
          icon: '&#xe62c;'
        }, {
          name: '项目设置',
          path: '/setting/sys/project',
          icon: '&#xe62c;'
        }]
      }, {
        name: '环境设备管理',
        path: '/setting/env-eqpt-mgr',
        icon: '&#xe605;',
        children: [{
          name: '设备管理',
          path: '/setting/env-eqpt-mgr/eqpt',
          icon: '&#xe62c'
        }, {
          name: '区域地图布置',
          path: '/setting/env-eqpt-mgr/region-map',
          icon: '&#xe62c;'
        }]
      }, {
        name: '个人设备管理',
        path: '/setting/pers-eqpt-mgr',
        icon: '&#xe635;',
        children: []
      }, {
        name: '人员及权限管理',
        path: '/setting/user-auth',
        icon: '&#xe60b;',
        children: [{
          name: '权限管理',
          path: '/setting/user-auth/auth',
          icon: '&#xe62c;'
        }, {
          name: '人员管理',
          path: '/setting/user-auth/user',
          icon: '&#xe62c;'
        }]
      }, {
        name: '部门及职务管理',
        path: '/setting/dept-duty',
        icon: '&#xe60d;',
        children: []
      }],
      env: [{
        name: '剂量分布',
        path: '/env/dose',
        icon: '&#xe686;',
        children: []
      }, {
        name: '实时数据',
        path: '/env/rtdata',
        icon: '&#xe604;',
        children: []
      }, {
        name: '累积剂量',
        path: '/env/cum-dose',
        icon: '&#xe767;',
        children: []
      }, {
        name: '历史曲线',
        path: '/env/history',
        icon: '&#xe6ce;',
        children: []
      }
      // , {
      //   name: '设备列表',
      //   path: '/env/eqpt',
      //   icon: '&#xe600;',
      //   children: []
      // }
      ],
      user: [{
        name: '人员列表',
        path: '/user/userlist',
        icon: '&#xe62b;',
        children: []
      }, {
        name: '人员剂量',
        path: '/user/pers-dose',
        icon: '&#xe608;',
        children: []
      }, {
        name: '历史数据',
        path: '/user/history',
        icon: '&#xe612;',
        children: []
      }, {
        name: '累积剂量',
        path: '/user/cum-dose',
        icon: '&#xe767;',
        children: []
      }],
      da: [{
        name: '环境分析',
        path: '/da/env-analysis',
        icon: '&#xe646;',
        children: []
      }, {
        name: '个人分析',
        path: '/da/pers-analysis',
        icon: '&#xe63f;',
        children: []
      }]
    }
  }
}
