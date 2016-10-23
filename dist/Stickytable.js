(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Stickytable = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
function getScrollbarWidth() {
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

exports.default = getScrollbarWidth;

},{}],2:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ScrollbarWidth = require("./ScrollbarWidth");

var _ScrollbarWidth2 = _interopRequireDefault(_ScrollbarWidth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Stickytable = function () {
	function Stickytable(el, options) {
		_classCallCheck(this, Stickytable);

		var defaults = {
			rowSelector: "tr",
			width: "100%",
			height: "auto"
		};

		this.options = Object.assign({}, defaults, options);

		this._updateScroll = this._updateScroll.bind(this);
		this._onWindowResize = this._onWindowResize.bind(this);

		this.rowSelector = this.options.rowSelector;
		this.scrollBarWidth = (0, _ScrollbarWidth2.default)();

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
		this.elMainWrapper.addEventListener("scroll", this._updateScroll);
		window.addEventListener("resize", this._onWindowResize);

		// Update DOM
		this.parent.replaceChild(this.elWrapper, el);

		this._updateStyles(this.elMain);
	}

	_createClass(Stickytable, [{
		key: "_onWindowResize",
		value: function _onWindowResize() {
			this.refresh();
		}
	}, {
		key: "_updateStyles",
		value: function _updateStyles(refEl) {

			var cnr = this._getCornerDimensions(refEl);

			var cellWidth = cnr.width;
			var cellHeight = cnr.height;

			var tableWidth = refEl.offsetWidth;
			var tableHeight = refEl.offsetHeight;

			[this.elMain, this.elTop, this.elSide, this.elCorner].forEach(function (el) {
				el.style.position = "absolute";
				el.style.width = tableWidth;
				el.style.height = tableHeight;
			});

			// Wrapper 
			this.elWrapper.style.position = "relative";
			this.elWrapper.style.overflow = "hidden";
			this.elWrapper.style.height = this.options.height === "auto" ? refEl.offsetHeight + this.scrollBarWidth : this.options.height;

			this.elWrapper.style.width = this.options.width === "auto" ? refEl.offsetWidth + this.scrollBarWidth : this.options.width;

			// Corner
			this.elCornerWrapper.style.position = "absolute";
			this.elCornerWrapper.style.overflow = "hidden";
			this.elCornerWrapper.style.left = "0";
			this.elCornerWrapper.style.top = "0";
			this.elCornerWrapper.style.width = cellWidth + "px";
			this.elCornerWrapper.style.height = cellHeight + "px";
			this.elCornerWrapper.style['pointer-events'] = "none";

			// Top
			this.elTopWrapper.style.position = "absolute";
			this.elTopWrapper.style.top = "0";
			this.elTopWrapper.style.left = "0";
			this.elTopWrapper.style.right = this.scrollBarWidth + "px";
			this.elTopWrapper.style.overflow = "hidden";
			this.elTopWrapper.style.height = cellHeight + "px";
			this.elTopWrapper.style['pointer-events'] = "none";

			// Side
			this.elSideWrapper.style.position = "absolute";
			this.elSideWrapper.style.top = "0";
			this.elSideWrapper.style.left = "0";
			this.elSideWrapper.style.bottom = this.scrollBarWidth + "px";
			this.elSideWrapper.style.overflow = "hidden";
			this.elSideWrapper.style.width = cellWidth + "px";
			this.elSideWrapper.style['pointer-events'] = "none";

			// Main
			this.elMainWrapper.style.position = "absolute";
			this.elMainWrapper.style.left = "0";
			this.elMainWrapper.style.top = "0";
			this.elMainWrapper.style.right = "0";
			this.elMainWrapper.style.bottom = "0";
			this.elMainWrapper.style.overflow = "scroll";
			this.elMainWrapper.style['-webkit-overflow-scrolling'] = 'touch';
		}
	}, {
		key: "_updateScroll",
		value: function _updateScroll() {
			var left = this.elMainWrapper.scrollLeft;
			var top = this.elMainWrapper.scrollTop;
			this.elTop.style.transform = "translateX(" + -left + "px)";
			this.elSide.style.transform = "translateY(" + -top + "px)";
		}
	}, {
		key: "_getCornerDimensions",
		value: function _getCornerDimensions(el) {

			console.log("getting cnr");
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
		key: "destroy",
		value: function destroy() {
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

},{"./ScrollbarWidth":1}]},{},[2])(2)
});


//# sourceMappingURL=Stickytable.js.map
