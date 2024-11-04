
      (function(modules) {
        function require(id) {
          const [fn, mapping] = modules[id];

          function localRequire(name) {
            return require(mapping[name]);
          }

          const module = { exports : {} };

          fn(localRequire, module, module.exports);

          return module.exports;
        }

        require("/test/index.js");
      })({"/test/index.js": [
          function (require, module, exports) {
            "use strict";

var _apple = require("./apple");
var _apple2 = _interopRequireDefault(_apple);
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const a = 12;
const b = 21;
console.log(a + b);
console.log(_apple2.default);
          },
          {"./apple":"/test/apple.js"},
        ],"/test/apple.js": [
          function (require, module, exports) {
            "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = "APPLE WORLD";
          },
          {},
        ],})