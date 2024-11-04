
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

        require("/src/index.js");
      })({"/src/index.js": [
          function (require, module, exports) {
            "use strict";

var _App = require("./App");
var _react = require("react");
var _client = require("react-dom/client");
(0, _client.createRoot)(document.getElementById("root")).render(/*#__PURE__*/React.createElement(_react.StrictMode, null, /*#__PURE__*/React.createElement(_App.App, null)));
          },
          {"react":"/node_modules/.pnpm/react@18.3.1/node_modules/react/index.js","react-dom/client":"/node_modules/.pnpm/react-dom@18.3.1_react@18.3.1/node_modules/react-dom/client.js","./App":"/src/App.js"},
        ],"/node_modules/.pnpm/react@18.3.1/node_modules/react/index.js": [
          function (require, module, exports) {
            'use strict';

if (undefined === 'production') {
  module.exports = require('./cjs/react.production.min.js');
} else {
  module.exports = require('./cjs/react.development.js');
}
          },
          {},
        ],"/node_modules/.pnpm/react-dom@18.3.1_react@18.3.1/node_modules/react-dom/client.js": [
          function (require, module, exports) {
            'use strict';

var m = require('react-dom');
if (undefined === 'production') {
  exports.createRoot = m.createRoot;
  exports.hydrateRoot = m.hydrateRoot;
} else {
  var i = m.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  exports.createRoot = function (c, o) {
    i.usingClientEntryPoint = true;
    try {
      return m.createRoot(c, o);
    } finally {
      i.usingClientEntryPoint = false;
    }
  };
  exports.hydrateRoot = function (c, h, o) {
    i.usingClientEntryPoint = true;
    try {
      return m.hydrateRoot(c, h, o);
    } finally {
      i.usingClientEntryPoint = false;
    }
  };
}
          },
          {},
        ],"/src/App.js": [
          function (require, module, exports) {
            "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.App = App;
var _react = _interopRequireDefault(require("react"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function App() {
  return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("h1", null, "Hello Gideon Bundles"));
}
          },
          {"react":"/node_modules/.pnpm/react@18.3.1/node_modules/react/index.js"},
        ],})