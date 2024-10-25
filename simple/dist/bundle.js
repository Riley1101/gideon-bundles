(function (modules) {
  function require(id) {
    const [fn, mapping] = modules[id];

    function localRequire(name) {
      return require(mapping[name]);
    }

    const module = { exports: {} };

    fn(localRequire, module, module.exports);

    return module.exports;
  }
  require(0);
})({
  0: [
    (require, module, exports) => {
      "use strict";

      var _orange = require("./orange");
      var _orange2 = _interopRequireDefault(_orange);
      function _interopRequireDefault(e) {
        return e && e.__esModule ? e : { default: e };
      }
      console.log(_orange2.default);
    },
    { "./orange": 1 },
  ],
  1: [
    (require, module, exports) => {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true,
      });
      exports.default = "Hello from Orange";
    },
    {},
  ],
});
