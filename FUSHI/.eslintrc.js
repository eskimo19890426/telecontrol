// http://eslint.org/docs/user-guide/configuring
module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // 默认全局变量
  globals: {
    'document': true,
    'navigator': true,
    'window': true,
    '$': true,
    'alert': true
  },
  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    // 允许无用的表达式（三元运算中可能会用到）
    'no-unused-expressions': 0,
    // 统一函数定义
    'func-style': [2, 'expression'],
    // 函数括号前面是否加上两个空格
    'space-before-function-paren': [0, 'always'],
    // 末尾是否加上分号 never/always
    'semi': [2, 'never'],
    // 分号前后是否加空格
    'semi-spacing': [2, {
      'before': false,
      'after': true
    }]
  }
}
