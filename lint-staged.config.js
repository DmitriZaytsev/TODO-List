module.exports = {
  '*.{js,jsx,vue}': ['vue-cli-service lint --fix', 'prettier --write'],
  '*.{scss,css,json,md}': ['prettier --write']
};
