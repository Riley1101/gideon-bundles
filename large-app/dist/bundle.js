
      (function(modules) {
        function require(id) {
          if(!id){
            return ;
          }
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

const h1 = document.querySelector("#title");
h1.innerText = "Hello World!";
          },
          {},
        ],})