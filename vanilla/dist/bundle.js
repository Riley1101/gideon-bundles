
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

        require("/js/index.js");
      })({"/js/index.js": [
          function (require, module, exports) {
            "use strict";

var _apple = require("./apple");
const time_date = document.querySelector(".time_date");
setInterval(() => {
  const d = new Date();
  const day = _apple.days[d.getDay()];
  const seconds = d.getSeconds();
  document.querySelector("#title").innerText = (0, _apple.apple_or_orange)();
  function showtime() {
    time_date.innerHTML = day + " " + seconds;
  }
  showtime();
}, 1000);
          },
          {"./apple":"/js/apple.js"},
        ],"/js/apple.js": [
          function (require, module, exports) {
            "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apple_or_orange = apple_or_orange;
function apple_or_orange() {
  if (Math.random() > 0.5) {
    return "APPLE";
  }
  return "Orange";
}
const days = exports.days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];
          },
          {},
        ],})