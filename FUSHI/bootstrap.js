var exec = require('child_process').exec
exec('npm run start', function() {
  console.log('程序启动成功' + Date.now())
})
