module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: ['eslint:recommended', '@nuxtjs/eslint-config-typescript', 'eslint-config-prettier'],
  rules: {
    'import/order': 'off',
    'import/no-named-as-default': 'off',
    'vue/no-multiple-template-root': 'off',
  },
};
