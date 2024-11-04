module.exports = {
  presets: [
    "@babel/preset-react",
    [
      "@babel/preset-env",
      {
        useBuiltIns: "entry",
        corejs: "3.22",
      },
    ],
  ],
  plugins: [
    "@babel/plugin-syntax-jsx",
    "@babel/plugin-transform-modules-commonjs",
    [
      "transform-inline-environment-variables",
      {
        include: ["NODE_ENV"],
      },
    ],
  ],
};
