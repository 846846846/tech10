module.exports = {
  root: true,
  env: {
    es2021: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  extends: [
    "prettier", // 追加。他の設定の上書きを行うために、必ず最後に配置する。
  ],
};
