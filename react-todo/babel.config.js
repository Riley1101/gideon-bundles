module.exports = {
  presets: [
    "@babel/preset-react",
    [
      "@babel/preset-env",
      {
        useBuiltIns: "entry",
        corejs: "3.22",

        targets: {
          browsers: [
            "last 1 chrome version",
            "last 1 firefox version",
            "last 1 safari version",
            "last 1 edge version",
          ],
        },
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
