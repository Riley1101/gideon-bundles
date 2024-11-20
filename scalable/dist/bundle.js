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

  require("/test/index.js");
})({
  "/test/index.js": [
    function (require, module, exports) {
      "use strict";

      var _apple = require("./apple");
      var _apple2 = _interopRequireDefault(_apple);
      var _orange = require("./orange");
      var _nested = require("./nested");
      var _nested2 = _interopRequireDefault(_nested);
      function _interopRequireDefault(e) {
        return e && e.__esModule ? e : { default: e };
      }
      const a = 12;
      const b = 21;
      console.log(a + b);
      console.log(_apple2.default);
      console.log(_nested2.default);
      (0, _orange.test)();
    },
    {
      "./orange": "/test/orange.js",
      "./nested": "/test/nested/index.js",
      "./apple": "/test/apple.js",
    },
  ],
  "/test/orange.js": [
    function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true,
      });
      exports.test = test;
      function test() {
        console.log("hello from test");
      }
    },
    {},
  ],
  "/test/nested/index.js": [
    function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true,
      });
      exports.default = "Nested Module";
    },
    {},
  ],
  "/test/apple.js": [
    function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true,
      });
      exports.default = "APPLE WORLD";
    },
    {},
  ],
});
