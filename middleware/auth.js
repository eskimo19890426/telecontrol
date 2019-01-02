import JsCookies from 'js-cookie'
import config from './../app.config.js'
// 通过cookie 获取用户
var getAccoutFromReqCookie = function(req) {
  // 检测是否有cookie
  if (!req.headers.cookie) return false
  // 获取登陆状态
  const Cookies = req.headers.cookie.split(';').find(c => c.trim().startsWith('account='))
  if (!Cookies) return false
  let account = Cookies.split('=')[1]
  // 替换双引号
  account = JSON.parse(account.replace(/%22/g, '"'))
  if (account) {
    return true
  } else {
    return false
  }
}

// 通过本地存储获取用户
var getAccoutFromBrowserCookie = function() {
  let account = null
  try {
    account = JSON.parse(JsCookies.get('account'))
  } catch (e) {}
  if (account) {
    return true
  } else {
    return false
  }
}

// 校验url是否需要登陆
var checkurl = function(req, route) {
  let url
  req && req.url ? url = req.url : url = route.path
  let exemptionAuthUrls = config.exemptionAuthUrls
  // 默认登陆页面为免授权登陆页面
  exemptionAuthUrls.push(config.loginurl)
  let exist = false
  for (let path of exemptionAuthUrls) {
    if (path === url) {
      exist = true
    }
  }
  return !exist
}

export default function({
  isServer,
  store,
  req,
  redirect,
  route
}) {
  // 如果没有请求则返回
  if (isServer && !req) return
  // 获取账户
  const islogin = process.server ? getAccoutFromReqCookie(req) : getAccoutFromBrowserCookie()
  // 如果当前用户没有登陆则跳转到登陆界面
  if (!islogin && checkurl(req, route)) {
    redirect(config.loginurl)
  }
}
