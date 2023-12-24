module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: ['eslint:recommended', '@nuxtjs/eslint-config-typescript', 'eslint-config-prettier'],
  rules: {
    'import/order': 'off',
    'vue/no-multiple-template-root': 'off',
  },
};
