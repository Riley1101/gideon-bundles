(function (modules) {
  function require(id) {
    if (!id) {
      return;
    }
    const [fn, mapping] = modules[id];

    function localRequire(name) {
      return require(mapping[name]);
    }

    const module = { exports: {} };

    fn(localRequire, module, module.exports);

    return module.exports;
  }

  require("/index.js");
})({
  "/index.js": [
    function (require, module, exports) {
      "use strict";

      var React = _interopRequireWildcard(require("react"));
      var _App = require("./App");
      console.log(_App);
      var _reactDom = require("react-dom");
      function _getRequireWildcardCache(e) {
        if ("function" != typeof WeakMap) return null;
        var r = new WeakMap(),
          t = new WeakMap();
        return (_getRequireWildcardCache = function (e) {
          return e ? t : r;
        })(e);
      }
      function _interopRequireWildcard(e, r) {
        if (!r && e && e.__esModule) return e;
        if (null === e || ("object" != typeof e && "function" != typeof e))
          return { default: e };
        var t = _getRequireWildcardCache(r);
        if (t && t.has(e)) return t.get(e);
        var n = { __proto__: null },
          a = Object.defineProperty && Object.getOwnPropertyDescriptor;
        for (var u in e)
          if ("default" !== u && {}.hasOwnProperty.call(e, u)) {
            var i = a ? Object.getOwnPropertyDescriptor(e, u) : null;
            i && (i.get || i.set)
              ? Object.defineProperty(n, u, i)
              : (n[u] = e[u]);
          }
        return (n.default = e), t && t.set(e, n), n;
      }
      (0, _reactDom.render)(document.getElementById("root")).render(
        /*#__PURE__*/ React.createElement(
          StrictMode,
          null,
          /*#__PURE__*/ React.createElement(_App.App, null),
        ),
      );
    },
    {
      react: "/node_modules/react/index.js",
      "react-dom": "/node_modules/react-dom/index.js",
      "./App": "/App.js",
    },
  ],
  "/node_modules/react/index.js": [
    function (require, module, exports) {
      "use strict";

      if (undefined === "production") {
        module.exports = require("./cjs/react.production.min.js");
      } else {
        module.exports = require("./cjs/react.development.js");
      }
    },
    {},
  ],
  "/node_modules/react-dom/index.js": [
    function (require, module, exports) {
      "use strict";

      function checkDCE() {
        /* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */
        if (
          typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" ||
          typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function"
        ) {
          return;
        }
        if (undefined !== "production") {
          // This branch is unreachable because this function is only called
          // in production, but the condition is true only in development.
          // Therefore if the branch is still here, dead code elimination wasn't
          // properly applied.
          // Don't change the message. React DevTools relies on it. Also make sure
          // this message doesn't occur elsewhere in this function, or it will cause
          // a false positive.
          throw new Error("^_^");
        }
        try {
          // Verify that the code above has been dead code eliminated (DCE'd).
          __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
        } catch (err) {
          // DevTools shouldn't crash React, no matter what.
          // We should still report in case we break this code.
          console.error(err);
        }
      }
      if (undefined === "production") {
        // DCE check should happen before ReactDOM bundle executes so that
        // DevTools can report bad minification during injection.
        checkDCE();
        module.exports = require("./cjs/react-dom.production.min.js");
      } else {
        module.exports = require("./cjs/react-dom.development.js");
      }
    },
    {},
  ],
  "/App.js": [
    function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true,
      });
      exports.App = App;
      var _react = _interopRequireDefault(require("react"));
      function _interopRequireDefault(e) {
        return e && e.__esModule ? e : { default: e };
      }
      function App() {
        return /*#__PURE__*/ _react.default.createElement(
          "div",
          null,
          /*#__PURE__*/ _react.default.createElement(
            "h1",
            null,
            "Hello Gideon Bundles",
          ),
        );
      }
    },
    { react: "/node_modules/react/index.js" },
  ],
});
