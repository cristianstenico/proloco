module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@babel/eslint-parser',
    ecmaVersion: 2020,
    requireConfigFile: false
  },

  env: {
    browser: true,
    node: true,
    jquery: true
  },

  extends: [
    'standard',
    'plugin:vue/recommended'
  ],

  rules: {
    indent: [
      'error',
      2,
      {
        SwitchCase: 1
      }
    ],
    'arrow-parens': ['error', 'as-needed'],
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
}
