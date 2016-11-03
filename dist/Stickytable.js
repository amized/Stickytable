/*
 * stickytable 1.0.2
 * Make table row headers and column headers sticky
 * http://amielzwier.com/stickytable
 *
 * Copyright 2016, Amiel Zwier <hi@amielzwier.com> (http://amielzwier.com)
 * Released under the MIT license.
*/

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Stickytable = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require("./polyfill");

var _scrollbarWidth = require("./scrollbarWidth");

var _scrollbarWidth2 = _interopRequireDefault(_scrollbarWidth);

var _debounce = require("./debounce");

var _debounce2 = _interopRequireDefault(_debounce);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Stickytable = function () {
  function Stickytable(el, options) {
    var _this = this;

    _classCallCheck(this, Stickytable);

    if (!el) {
      throw "Stickytable: no element passed.";
      return;
    }

    var defaults = {
      rowSelector: "tr",
      width: "100%",
      height: "auto"
    };

    this.options = Object.assign({}, defaults, options);

    this.rowSelector = this.options.rowSelector;
    this.scrollBarWidth = (0, _scrollbarWidth2.default)();

    // Elements
    this.oldEl = el;
    this.parent = el.parentNode;
    this.elMain = el.cloneNode(true);
    this.elTop = el.cloneNode(true);
    this.elSide = el.cloneNode(true);
    this.elCorner = el.cloneNode(true);

    this.elMainWrapper = document.createElement('div');
    this.elTopWrapper = document.createElement('div');
    this.elSideWrapper = document.createElement('div');
    this.elCornerWrapper = document.createElement('div');
    this.elWrapper = document.createElement('div');

    this.elWrapper.appendChild(this.elMainWrapper);
    this.elWrapper.appendChild(this.elTopWrapper);
    this.elWrapper.appendChild(this.elSideWrapper);
    this.elWrapper.appendChild(this.elCornerWrapper);

    this.elMainWrapper.appendChild(this.elMain);
    this.elSideWrapper.appendChild(this.elSide);
    this.elTopWrapper.appendChild(this.elTop);
    this.elCornerWrapper.appendChild(this.elCorner);

    // Events
    this._updateScroll = this._updateScroll.bind(this);
    this.elMainWrapper.addEventListener("scroll", this._updateScroll);
    this._onWindowResize = (0, _debounce2.default)(function () {
      _this.refresh();
    }, 100);
    window.addEventListener("resize", this._onWindowResize);

    // Update the styles and modify the DOM
    this._updateStyles(el);
    this.parent.replaceChild(this.elWrapper, el);

    // If the window is not loaded, update styles again as the table properties
    // may have changed
    window.addEventListener("load", function () {
      _this._updateStyles(_this.elMain);
    });
  }

  _createClass(Stickytable, [{
    key: "_updateScroll",
    value: function _updateScroll() {
      var left = this.elMainWrapper.scrollLeft;
      var top = this.elMainWrapper.scrollTop;
      this.elTop.style.transform = "translateX(" + -left + "px)";
      this.elSide.style.transform = "translateY(" + -top + "px)";
    }
  }, {
    key: "_updateStyles",
    value: function _updateStyles(refEl) {

      var cnr = this._getCornerDimensions(refEl);
      var cellWidth = cnr.width;
      var cellHeight = cnr.height;
      var tableWidth = refEl.offsetWidth;
      var tableHeight = refEl.offsetHeight;

      var tables = [this.elMain, this.elTop, this.elSide, this.elCorner];

      var wrappers = [this.elCornerWrapper, this.elTopWrapper, this.elSideWrapper, this.elMainWrapper];

      wrappers.forEach(function (el) {
        el.style.position = "absolute";
        el.style.top = 0;
        el.style.left = 0;
      });

      tables.forEach(function (el) {
        el.style.position = "absolute";
        el.style.top = 0;
        el.style.left = 0;
        el.style.margin = 0;
        el.style.transform = "translate3d(0,0,0)";
        el.style['-webkit-transform'] = "translate3d(0,0,0)";
      });

      // Wrapper
      this.elWrapper.style.position = "relative";
      this.elWrapper.style.overflow = "hidden";
      this.elWrapper.style.height = this.options.height === "auto" ? refEl.offsetHeight + this.scrollBarWidth : this.options.height;

      this.elWrapper.style.width = this.options.width === "auto" ? refEl.offsetWidth + this.scrollBarWidth : this.options.width;

      // Corner
      this.elCornerWrapper.style.overflow = "hidden";
      this.elCornerWrapper.style.width = cellWidth + "px";
      this.elCornerWrapper.style.height = cellHeight + "px";
      this.elCornerWrapper.style['pointer-events'] = "none";

      // Top
      this.elTopWrapper.style.right = this.scrollBarWidth + "px";
      this.elTopWrapper.style.overflow = "hidden";
      this.elTopWrapper.style.height = cellHeight + "px";
      this.elTopWrapper.style['pointer-events'] = "none";

      // Side
      this.elSideWrapper.style.bottom = this.scrollBarWidth + "px";
      this.elSideWrapper.style.overflow = "hidden";
      this.elSideWrapper.style.width = cellWidth + "px";
      this.elSideWrapper.style['pointer-events'] = "none";

      // Main
      this.elMainWrapper.style.right = "0";
      this.elMainWrapper.style.bottom = "0";
      this.elMainWrapper.style.overflow = "scroll";
      this.elMainWrapper.style['-webkit-overflow-scrolling'] = 'touch';

      this._updateScroll();
    }
  }, {
    key: "_getCornerDimensions",
    value: function _getCornerDimensions(el) {
      var row = el.querySelector(this.rowSelector);
      var cell = row.firstElementChild;

      var width = cell.offsetWidth;
      var height = cell.offsetHeight;

      if (el.tagName === "TABLE" || el.style.display === "table") {
        var tableStyle = getComputedStyle(el, null);
        var borderCollapse = tableStyle.getPropertyValue("border-collapse");

        if (borderCollapse === "collapse") {
          var style = getComputedStyle(cell, null);
          var borderLeft = parseInt(style.getPropertyValue("border-left-width"));
          var borderRight = parseInt(style.getPropertyValue("border-right-width"));
          var borderTop = parseInt(style.getPropertyValue("border-top-width"));
          var borderBottom = parseInt(style.getPropertyValue("border-bottom-width"));
          height = height + borderTop / 2 + borderBottom / 2;
          width = width + borderLeft / 2 + borderRight / 2;
        } else {
          var borderSpacing = parseInt(tableStyle.getPropertyValue("border-spacing"));
          width = width + borderSpacing;
          height = height + borderSpacing;
        }
      }

      return { width: width, height: height };
    }
  }, {
    key: "scrollX",
    value: function scrollX(num) {
      this.elMainWrapper.scrollLeft = num;
    }
  }, {
    key: "scrollY",
    value: function scrollY(num) {
      this.elMainWrapper.scrollTop = num;
    }
  }, {
    key: "destroy",
    value: function destroy() {
      window.removeEventListener("resize", this._onWindowResize);
      this.elMainWrapper.removeEventListener("scroll", this._updateScroll);
      this.parent.replaceChild(this.oldEl, this.elWrapper);
      this.parent = null;
      this.elMain = null;
      this.elTop = null;
      this.elSide = null;
      this.elCorner = null;
      this.elWrapper = null;
      this.elMainWrapper = null;
      this.elSideWrapper = null;
      this.elTopWrapper = null;
      this.elCornerWrapper = null;
    }
  }, {
    key: "refresh",
    value: function refresh() {
      this._updateStyles(this.elMain);
    }
  }]);

  return Stickytable;
}();

module.exports = Stickytable;

},{"./debounce":2,"./polyfill":3,"./scrollbarWidth":4}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = debounce;
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
	var timeout;
	return function () {
		var context = this,
		    args = arguments;
		var later = function later() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

},{}],3:[function(require,module,exports){
'use strict';

if (typeof Object.assign != 'function') {
  (function () {
    Object.assign = function (target) {
      'use strict';
      // We must check against these specific cases.

      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var output = Object(target);
      for (var index = 1; index < arguments.length; index++) {
        var source = arguments[index];
        if (source !== undefined && source !== null) {
          for (var nextKey in source) {
            if (source.hasOwnProperty(nextKey)) {
              output[nextKey] = source[nextKey];
            }
          }
        }
      }
      return output;
    };
  })();
}

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
function scrollbarWidth() {
    var outer = document.createElement("div");
    outer.style.visibility = "hidden";
    outer.style.width = "100px";
    outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps

    document.body.appendChild(outer);

    var widthNoScroll = outer.offsetWidth;
    // force scrollbars
    outer.style.overflow = "scroll";

    // add innerdiv
    var inner = document.createElement("div");
    inner.style.width = "100%";
    outer.appendChild(inner);

    var widthWithScroll = inner.offsetWidth;

    // remove divs
    outer.parentNode.removeChild(outer);

    return widthNoScroll - widthWithScroll;
}

exports.default = scrollbarWidth;

},{}]},{},[1])(1)
});