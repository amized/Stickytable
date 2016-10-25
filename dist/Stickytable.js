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
    var _this = this;

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
        el.style.width = tableWidth;
        el.style.height = tableHeight;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvU2Nyb2xsYmFyV2lkdGguanMiLCJzcmMvU3RpY2t5dGFibGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztBQ0FBLFNBQVMsaUJBQVQsR0FBNkI7QUFDekIsUUFBSSxRQUFRLFNBQVMsYUFBVCxDQUF1QixLQUF2QixDQUFaO0FBQ0EsVUFBTSxLQUFOLENBQVksVUFBWixHQUF5QixRQUF6QjtBQUNBLFVBQU0sS0FBTixDQUFZLEtBQVosR0FBb0IsT0FBcEI7QUFDQSxVQUFNLEtBQU4sQ0FBWSxlQUFaLEdBQThCLFdBQTlCLENBSnlCLENBSWtCOztBQUUzQyxhQUFTLElBQVQsQ0FBYyxXQUFkLENBQTBCLEtBQTFCOztBQUVBLFFBQUksZ0JBQWdCLE1BQU0sV0FBMUI7QUFDQTtBQUNBLFVBQU0sS0FBTixDQUFZLFFBQVosR0FBdUIsUUFBdkI7O0FBRUE7QUFDQSxRQUFJLFFBQVEsU0FBUyxhQUFULENBQXVCLEtBQXZCLENBQVo7QUFDQSxVQUFNLEtBQU4sQ0FBWSxLQUFaLEdBQW9CLE1BQXBCO0FBQ0EsVUFBTSxXQUFOLENBQWtCLEtBQWxCOztBQUVBLFFBQUksa0JBQWtCLE1BQU0sV0FBNUI7O0FBRUE7QUFDQSxVQUFNLFVBQU4sQ0FBaUIsV0FBakIsQ0FBNkIsS0FBN0I7O0FBRUEsV0FBTyxnQkFBZ0IsZUFBdkI7QUFDSDs7a0JBRWMsaUI7Ozs7Ozs7QUN6QmY7Ozs7Ozs7O0lBRU0sVztBQUVKLHVCQUFZLEVBQVosRUFBZ0IsT0FBaEIsRUFBeUI7QUFBQTs7QUFBQTs7QUFDdkIsUUFBTSxXQUFXO0FBQ2YsbUJBQWEsSUFERTtBQUVmLGFBQU8sTUFGUTtBQUdmLGNBQVE7QUFITyxLQUFqQjs7QUFNQSxTQUFLLE9BQUwsR0FBZSxPQUFPLE1BQVAsQ0FBYyxFQUFkLEVBQWtCLFFBQWxCLEVBQTRCLE9BQTVCLENBQWY7O0FBRUEsU0FBSyxhQUFMLEdBQXFCLEtB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YUFBTCxDQUFtQixTQUFuQixHQUErQixHQUEvQjtBQUNEOzs7OEJBRVM7QUFDUixXQUFLLGFBQUwsQ0FBbUIsbUJBQW5CLENBQXVDLFFBQXZDLEVBQWlELEtBQUssYUFBdEQ7QUFDQSxXQUFLLE1BQUwsQ0FBWSxZQUFaLENBQXlCLEtBQUssS0FBOUIsRUFBcUMsS0FBSyxTQUExQztBQUNBLFdBQUssTUFBTCxHQUFjLElBQWQ7QUFDQSxXQUFLLE1BQUwsR0FBYyxJQUFkO0FBQ0EsV0FBSyxLQUFMLEdBQWEsSUFBYjtBQUNBLFdBQUssTUFBTCxHQUFjLElBQWQ7QUFDQSxXQUFLLFFBQUwsR0FBZ0IsSUFBaEI7QUFDQSxXQUFLLFNBQUwsR0FBaUIsSUFBakI7QUFDQSxXQUFLLGFBQUwsR0FBcUIsSUFBckI7QUFDQSxXQUFLLGFBQUwsR0FBcUIsSUFBckI7QUFDQSxXQUFLLFlBQUwsR0FBb0IsSUFBcEI7QUFDQSxXQUFLLGVBQUwsR0FBdUIsSUFBdkI7QUFDRDs7OzhCQUVTO0FBQ1IsV0FBSyxhQUFMLENBQW1CLEtBQUssTUFBeEI7QUFDRDs7Ozs7O0FBR0gsT0FBTyxPQUFQLEdBQWlCLFdBQWpCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImZ1bmN0aW9uIGdldFNjcm9sbGJhcldpZHRoKCkge1xuICAgIHZhciBvdXRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgb3V0ZXIuc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG4gICAgb3V0ZXIuc3R5bGUud2lkdGggPSBcIjEwMHB4XCI7XG4gICAgb3V0ZXIuc3R5bGUubXNPdmVyZmxvd1N0eWxlID0gXCJzY3JvbGxiYXJcIjsgLy8gbmVlZGVkIGZvciBXaW5KUyBhcHBzXG5cbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKG91dGVyKTtcblxuICAgIHZhciB3aWR0aE5vU2Nyb2xsID0gb3V0ZXIub2Zmc2V0V2lkdGg7XG4gICAgLy8gZm9yY2Ugc2Nyb2xsYmFyc1xuICAgIG91dGVyLnN0eWxlLm92ZXJmbG93ID0gXCJzY3JvbGxcIjtcblxuICAgIC8vIGFkZCBpbm5lcmRpdlxuICAgIHZhciBpbm5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgaW5uZXIuc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcbiAgICBvdXRlci5hcHBlbmRDaGlsZChpbm5lcik7ICAgICAgICBcblxuICAgIHZhciB3aWR0aFdpdGhTY3JvbGwgPSBpbm5lci5vZmZzZXRXaWR0aDtcblxuICAgIC8vIHJlbW92ZSBkaXZzXG4gICAgb3V0ZXIucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChvdXRlcik7XG5cbiAgICByZXR1cm4gd2lkdGhOb1Njcm9sbCAtIHdpZHRoV2l0aFNjcm9sbDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2V0U2Nyb2xsYmFyV2lkdGg7IiwiaW1wb3J0IGdldFNjcm9sbGJhcldpZHRoIGZyb20gXCIuL1Njcm9sbGJhcldpZHRoXCI7XG5cbmNsYXNzIFN0aWNreXRhYmxlIHtcblxuICBjb25zdHJ1Y3RvcihlbCwgb3B0aW9ucykge1xuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgcm93U2VsZWN0b3I6IFwidHJcIixcbiAgICAgIHdpZHRoOiBcIjEwMCVcIixcbiAgICAgIGhlaWdodDogXCJhdXRvXCJcbiAgICB9XG5cbiAgICB0aGlzLm9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLl91cGRhdGVTY3JvbGwgPSB0aGlzLl91cGRhdGVTY3JvbGwuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vbldpbmRvd1Jlc2l6ZSA9IHRoaXMuX29uV2luZG93UmVzaXplLmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLnJvd1NlbGVjdG9yID0gdGhpcy5vcHRpb25zLnJvd1NlbGVjdG9yO1xuICAgIHRoaXMuc2Nyb2xsQmFyV2lkdGggPSBnZXRTY3JvbGxiYXJXaWR0aCgpO1xuXG4gICAgLy8gRWxlbWVudHNcbiAgICB0aGlzLm9sZEVsID0gZWw7XG4gICAgdGhpcy5wYXJlbnQgPSBlbC5wYXJlbnROb2RlO1xuICAgIHRoaXMuZWxNYWluID0gZWwuY2xvbmVOb2RlKHRydWUpO1xuICAgIHRoaXMuZWxUb3AgPSBlbC5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgdGhpcy5lbFNpZGUgPSBlbC5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgdGhpcy5lbENvcm5lciA9ICBlbC5jbG9uZU5vZGUodHJ1ZSk7XG5cbiAgICB0aGlzLmVsTWFpbldyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLmVsVG9wV3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMuZWxTaWRlV3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMuZWxDb3JuZXJXcmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5lbFdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBcbiAgICB0aGlzLmVsV3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmVsTWFpbldyYXBwZXIpO1xuICAgIHRoaXMuZWxXcmFwcGVyLmFwcGVuZENoaWxkKHRoaXMuZWxUb3BXcmFwcGVyKTtcbiAgICB0aGlzLmVsV3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmVsU2lkZVdyYXBwZXIpO1xuICAgIHRoaXMuZWxXcmFwcGVyLmFwcGVuZENoaWxkKHRoaXMuZWxDb3JuZXJXcmFwcGVyKTtcblxuICAgIHRoaXMuZWxNYWluV3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmVsTWFpbik7XG4gICAgdGhpcy5lbFNpZGVXcmFwcGVyLmFwcGVuZENoaWxkKHRoaXMuZWxTaWRlKTtcbiAgICB0aGlzLmVsVG9wV3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmVsVG9wKTtcbiAgICB0aGlzLmVsQ29ybmVyV3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmVsQ29ybmVyKTtcbiAgICBcbiAgICAvLyBFdmVudHNcbiAgICB0aGlzLmVsTWFpbldyYXBwZXIuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCB0aGlzLl91cGRhdGVTY3JvbGwpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIHRoaXMuX29uV2luZG93UmVzaXplKTtcblxuICAgIC8vIFVwZGF0ZSB0aGUgc3R5bGVzIGFuZCBtb2RpZnkgdGhlIERPTVxuICAgIHRoaXMuX3VwZGF0ZVN0eWxlcyhlbCk7XG4gICAgdGhpcy5wYXJlbnQucmVwbGFjZUNoaWxkKHRoaXMuZWxXcmFwcGVyLCBlbCk7XG5cbiAgICAvLyBJZiB0aGUgd2luZG93IGlzIG5vdCBsb2FkZWQsIHVwZGF0ZSBzdHlsZXMgYWdhaW4gYXMgdGhlIHRhYmxlIHByb3BlcnRpZXNcbiAgICAvLyBtYXkgaGF2ZSBjaGFuZ2VkXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsICgpID0+IHtcbiAgICAgIHRoaXMuX3VwZGF0ZVN0eWxlcyh0aGlzLmVsTWFpbik7XG4gICAgfSk7XG4gIH1cblxuICBfb25XaW5kb3dSZXNpemUgKCkge1xuICAgIHRoaXMucmVmcmVzaCgpO1xuICB9XG5cbiAgX3VwZGF0ZVN0eWxlcyAocmVmRWwpIHtcblxuICAgIGNvbnN0IGNuciA9IHRoaXMuX2dldENvcm5lckRpbWVuc2lvbnMocmVmRWwpOyBcbiAgICBjb25zdCBjZWxsV2lkdGggPSBjbnIud2lkdGg7XG4gICAgY29uc3QgY2VsbEhlaWdodCA9IGNuci5oZWlnaHQ7XG4gICAgY29uc3QgdGFibGVXaWR0aCA9IHJlZkVsLm9mZnNldFdpZHRoO1xuICAgIGNvbnN0IHRhYmxlSGVpZ2h0ID0gcmVmRWwub2Zmc2V0SGVpZ2h0O1xuXG4gICAgY29uc3QgdGFibGVzID0gW1xuICAgICAgdGhpcy5lbE1haW4sIFxuICAgICAgdGhpcy5lbFRvcCwgXG4gICAgICB0aGlzLmVsU2lkZSwgXG4gICAgICB0aGlzLmVsQ29ybmVyXG4gICAgXTtcblxuICAgIGNvbnN0IHdyYXBwZXJzID0gW1xuICAgICAgdGhpcy5lbENvcm5lcldyYXBwZXIsXG4gICAgICB0aGlzLmVsVG9wV3JhcHBlcixcbiAgICAgIHRoaXMuZWxTaWRlV3JhcHBlcixcbiAgICAgIHRoaXMuZWxNYWluV3JhcHBlclxuICAgIF1cblxuICAgIHdyYXBwZXJzLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICBlbC5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcbiAgICAgIGVsLnN0eWxlLnRvcCA9IDA7XG4gICAgICBlbC5zdHlsZS5sZWZ0ID0gMDtcbiAgICB9KTtcblxuICAgIHRhYmxlcy5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgZWwuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG4gICAgICBlbC5zdHlsZS50b3AgPSAwO1xuICAgICAgZWwuc3R5bGUubGVmdCA9IDA7XG4gICAgICBlbC5zdHlsZS53aWR0aCA9IHRhYmxlV2lkdGg7XG4gICAgICBlbC5zdHlsZS5oZWlnaHQgPSB0YWJsZUhlaWdodDtcbiAgICB9KTtcblxuICAgIC8vIFdyYXBwZXJcbiAgICB0aGlzLmVsV3JhcHBlci5zdHlsZS5wb3NpdGlvbiA9IFwicmVsYXRpdmVcIjtcbiAgICB0aGlzLmVsV3JhcHBlci5zdHlsZS5vdmVyZmxvdyA9IFwiaGlkZGVuXCI7ICAgIFxuICAgIHRoaXMuZWxXcmFwcGVyLnN0eWxlLmhlaWdodCA9IHRoaXMub3B0aW9ucy5oZWlnaHQgPT09IFwiYXV0b1wiID9cbiAgICAgICAgcmVmRWwub2Zmc2V0SGVpZ2h0ICsgdGhpcy5zY3JvbGxCYXJXaWR0aFxuICAgICAgOlxuICAgICAgICB0aGlzLm9wdGlvbnMuaGVpZ2h0O1xuXG4gICAgdGhpcy5lbFdyYXBwZXIuc3R5bGUud2lkdGggPSB0aGlzLm9wdGlvbnMud2lkdGggPT09IFwiYXV0b1wiID9cbiAgICAgICAgcmVmRWwub2Zmc2V0V2lkdGggKyB0aGlzLnNjcm9sbEJhcldpZHRoXG4gICAgICA6XG4gICAgICAgIHRoaXMub3B0aW9ucy53aWR0aDtcbiAgXG4gICAgLy8gQ29ybmVyXG4gICAgdGhpcy5lbENvcm5lcldyYXBwZXIuc3R5bGUub3ZlcmZsb3cgPSBcImhpZGRlblwiO1xuICAgIHRoaXMuZWxDb3JuZXJXcmFwcGVyLnN0eWxlLndpZHRoID0gY2VsbFdpZHRoICsgXCJweFwiO1xuICAgIHRoaXMuZWxDb3JuZXJXcmFwcGVyLnN0eWxlLmhlaWdodCA9IGNlbGxIZWlnaHQgKyBcInB4XCI7XG4gICAgdGhpcy5lbENvcm5lcldyYXBwZXIuc3R5bGVbJ3BvaW50ZXItZXZlbnRzJ10gPSBcIm5vbmVcIjtcblxuICAgIC8vIFRvcFxuICAgIHRoaXMuZWxUb3BXcmFwcGVyLnN0eWxlLnJpZ2h0ID0gdGhpcy5zY3JvbGxCYXJXaWR0aCArIFwicHhcIjtcbiAgICB0aGlzLmVsVG9wV3JhcHBlci5zdHlsZS5vdmVyZmxvdyA9IFwiaGlkZGVuXCI7XG4gICAgdGhpcy5lbFRvcFdyYXBwZXIuc3R5bGUuaGVpZ2h0ID0gY2VsbEhlaWdodCArIFwicHhcIjtcbiAgICB0aGlzLmVsVG9wV3JhcHBlci5zdHlsZVsncG9pbnRlci1ldmVudHMnXSA9IFwibm9uZVwiO1xuXG4gICAgLy8gU2lkZVxuICAgIHRoaXMuZWxTaWRlV3JhcHBlci5zdHlsZS5ib3R0b20gPSB0aGlzLnNjcm9sbEJhcldpZHRoICsgXCJweFwiO1xuICAgIHRoaXMuZWxTaWRlV3JhcHBlci5zdHlsZS5vdmVyZmxvdyA9IFwiaGlkZGVuXCI7XG4gICAgdGhpcy5lbFNpZGVXcmFwcGVyLnN0eWxlLndpZHRoID0gY2VsbFdpZHRoICsgXCJweFwiO1xuICAgIHRoaXMuZWxTaWRlV3JhcHBlci5zdHlsZVsncG9pbnRlci1ldmVudHMnXSA9IFwibm9uZVwiO1xuXG4gICAgLy8gTWFpblxuICAgIHRoaXMuZWxNYWluV3JhcHBlci5zdHlsZS5yaWdodCA9IFwiMFwiO1xuICAgIHRoaXMuZWxNYWluV3JhcHBlci5zdHlsZS5ib3R0b20gPSBcIjBcIjtcbiAgICB0aGlzLmVsTWFpbldyYXBwZXIuc3R5bGUub3ZlcmZsb3cgPSBcInNjcm9sbFwiO1xuICAgIHRoaXMuZWxNYWluV3JhcHBlci5zdHlsZVsnLXdlYmtpdC1vdmVyZmxvdy1zY3JvbGxpbmcnXSA9ICd0b3VjaCc7XG4gIH1cblxuICBfdXBkYXRlU2Nyb2xsICgpIHtcbiAgICBjb25zdCBsZWZ0ID0gdGhpcy5lbE1haW5XcmFwcGVyLnNjcm9sbExlZnQ7XG4gICAgY29uc3QgdG9wID0gdGhpcy5lbE1haW5XcmFwcGVyLnNjcm9sbFRvcDtcbiAgICB0aGlzLmVsVG9wLnN0eWxlLnRyYW5zZm9ybSA9IFwidHJhbnNsYXRlWChcIiArICgtbGVmdCkgKyBcInB4KVwiO1xuICAgIHRoaXMuZWxTaWRlLnN0eWxlLnRyYW5zZm9ybSA9IFwidHJhbnNsYXRlWShcIiArICgtdG9wKSArIFwicHgpXCI7XG4gIH1cblxuICBfZ2V0Q29ybmVyRGltZW5zaW9ucyhlbCkge1xuICAgIGNvbnN0IHJvdyA9IGVsLnF1ZXJ5U2VsZWN0b3IodGhpcy5yb3dTZWxlY3Rvcik7XG4gICAgY29uc3QgY2VsbCA9IHJvdy5maXJzdEVsZW1lbnRDaGlsZDtcblxuICAgIGxldCB3aWR0aCA9IGNlbGwub2Zmc2V0V2lkdGg7XG4gICAgbGV0IGhlaWdodCA9IGNlbGwub2Zmc2V0SGVpZ2h0O1xuXG4gICAgaWYgKGVsLnRhZ05hbWUgPT09IFwiVEFCTEVcIiB8fCBlbC5zdHlsZS5kaXNwbGF5ID09PSBcInRhYmxlXCIpIHtcbiAgICAgIGNvbnN0IHRhYmxlU3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKGVsLCBudWxsKTtcbiAgICAgIGNvbnN0IGJvcmRlckNvbGxhcHNlID0gdGFibGVTdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKFwiYm9yZGVyLWNvbGxhcHNlXCIpOyAgICBcblxuICAgICAgaWYgKGJvcmRlckNvbGxhcHNlID09PSBcImNvbGxhcHNlXCIpIHtcbiAgICAgICAgY29uc3Qgc3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKGNlbGwsIG51bGwpO1xuICAgICAgICBjb25zdCBib3JkZXJMZWZ0ID0gcGFyc2VJbnQoc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShcImJvcmRlci1sZWZ0LXdpZHRoXCIpKTtcbiAgICAgICAgY29uc3QgYm9yZGVyUmlnaHQgPSBwYXJzZUludChzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKFwiYm9yZGVyLXJpZ2h0LXdpZHRoXCIpKTtcbiAgICAgICAgY29uc3QgYm9yZGVyVG9wID0gcGFyc2VJbnQoc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShcImJvcmRlci10b3Atd2lkdGhcIikpO1xuICAgICAgICBjb25zdCBib3JkZXJCb3R0b20gPSBwYXJzZUludChzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKFwiYm9yZGVyLWJvdHRvbS13aWR0aFwiKSk7XG4gICAgICAgIGhlaWdodCA9IGhlaWdodCArIChib3JkZXJUb3AvMikgKyAoYm9yZGVyQm90dG9tLzIpO1xuICAgICAgICB3aWR0aCA9IHdpZHRoICsgKGJvcmRlckxlZnQvMikgKyAoYm9yZGVyUmlnaHQvMik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBib3JkZXJTcGFjaW5nID0gcGFyc2VJbnQodGFibGVTdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKFwiYm9yZGVyLXNwYWNpbmdcIikpO1xuICAgICAgICB3aWR0aCA9IHdpZHRoICsgYm9yZGVyU3BhY2luZztcbiAgICAgICAgaGVpZ2h0ID0gaGVpZ2h0ICsgYm9yZGVyU3BhY2luZztcbiAgICAgIH0gICBcbiAgICB9XG5cbiAgICByZXR1cm4geyB3aWR0aCwgaGVpZ2h0IH07ICAgXG4gIH1cblxuICBzY3JvbGxYKG51bSkge1xuICAgIHRoaXMuZWxNYWluV3JhcHBlci5zY3JvbGxMZWZ0ID0gbnVtO1xuICB9XG5cbiAgc2Nyb2xsWShudW0pIHtcbiAgICB0aGlzLmVsTWFpbldyYXBwZXIuc2Nyb2xsVG9wID0gbnVtO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLmVsTWFpbldyYXBwZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCB0aGlzLl91cGRhdGVTY3JvbGwpO1xuICAgIHRoaXMucGFyZW50LnJlcGxhY2VDaGlsZCh0aGlzLm9sZEVsLCB0aGlzLmVsV3JhcHBlcik7XG4gICAgdGhpcy5wYXJlbnQgPSBudWxsO1xuICAgIHRoaXMuZWxNYWluID0gbnVsbDtcbiAgICB0aGlzLmVsVG9wID0gbnVsbDtcbiAgICB0aGlzLmVsU2lkZSA9IG51bGw7XG4gICAgdGhpcy5lbENvcm5lciA9IG51bGw7XG4gICAgdGhpcy5lbFdyYXBwZXIgPSBudWxsO1xuICAgIHRoaXMuZWxNYWluV3JhcHBlciA9IG51bGw7XG4gICAgdGhpcy5lbFNpZGVXcmFwcGVyID0gbnVsbDtcbiAgICB0aGlzLmVsVG9wV3JhcHBlciA9IG51bGw7XG4gICAgdGhpcy5lbENvcm5lcldyYXBwZXIgPSBudWxsO1xuICB9XG5cbiAgcmVmcmVzaCgpIHtcbiAgICB0aGlzLl91cGRhdGVTdHlsZXModGhpcy5lbE1haW4pO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU3RpY2t5dGFibGU7Il19
