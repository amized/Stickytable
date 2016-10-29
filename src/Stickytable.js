import getScrollbarWidth from "./ScrollbarWidth";

class Stickytable {

  constructor(el, options) {

    if (!el) {
      throw("Stickytable: no element passed.");
      return;
    }

    const defaults = {
      rowSelector: "tr",
      width: "100%",
      height: "auto"
    }

    this.options = Object.assign({}, defaults, options);

    this._updateScroll = this._updateScroll.bind(this);
    this._onWindowResize = this._onWindowResize.bind(this);

    this.rowSelector = this.options.rowSelector;
    this.scrollBarWidth = getScrollbarWidth();

    // Elements
    this.oldEl = el;
    this.parent = el.parentNode;
    this.elMain = el.cloneNode(true);
    this.elTop = el.cloneNode(true);
    this.elSide = el.cloneNode(true);
    this.elCorner =  el.cloneNode(true);

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
    window.addEventListener("load", () => {
      this._updateStyles(this.elMain);
    });
  }

  _onWindowResize () {
    this.refresh();
  }

  _updateStyles (refEl) {

    const cnr = this._getCornerDimensions(refEl); 
    const cellWidth = cnr.width;
    const cellHeight = cnr.height;
    const tableWidth = refEl.offsetWidth;
    const tableHeight = refEl.offsetHeight;

    const tables = [
      this.elMain, 
      this.elTop, 
      this.elSide, 
      this.elCorner
    ];

    const wrappers = [
      this.elCornerWrapper,
      this.elTopWrapper,
      this.elSideWrapper,
      this.elMainWrapper
    ]

    wrappers.forEach((el) => {
      el.style.position = "absolute";
      el.style.top = 0;
      el.style.left = 0;
    });

    tables.forEach((el) => {
      el.style.position = "absolute";
      el.style.top = 0;
      el.style.left = 0;
      el.style.margin = 0;
      el.style.width = tableWidth;
      el.style.height = tableHeight;
      el.style.transform = "translate3d(0,0,0)";
      el.style['-webkit-transform'] = "translate3d(0,0,0)";
    });

    // Wrapper
    this.elWrapper.style.position = "relative";
    this.elWrapper.style.overflow = "hidden";    
    this.elWrapper.style.height = this.options.height === "auto" ?
        refEl.offsetHeight + this.scrollBarWidth
      :
        this.options.height;

    this.elWrapper.style.width = this.options.width === "auto" ?
        refEl.offsetWidth + this.scrollBarWidth
      :
        this.options.width;
  
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

  _updateScroll () {
    const left = this.elMainWrapper.scrollLeft;
    const top = this.elMainWrapper.scrollTop;
    this.elTop.style.transform = "translateX(" + (-left) + "px)";
    this.elSide.style.transform = "translateY(" + (-top) + "px)";
  }

  _getCornerDimensions(el) {
    const row = el.querySelector(this.rowSelector);
    const cell = row.firstElementChild;

    let width = cell.offsetWidth;
    let height = cell.offsetHeight;

    if (el.tagName === "TABLE" || el.style.display === "table") {
      const tableStyle = getComputedStyle(el, null);
      const borderCollapse = tableStyle.getPropertyValue("border-collapse");    

      if (borderCollapse === "collapse") {
        const style = getComputedStyle(cell, null);
        const borderLeft = parseInt(style.getPropertyValue("border-left-width"));
        const borderRight = parseInt(style.getPropertyValue("border-right-width"));
        const borderTop = parseInt(style.getPropertyValue("border-top-width"));
        const borderBottom = parseInt(style.getPropertyValue("border-bottom-width"));
        height = height + (borderTop/2) + (borderBottom/2);
        width = width + (borderLeft/2) + (borderRight/2);
      } else {
        const borderSpacing = parseInt(tableStyle.getPropertyValue("border-spacing"));
        width = width + borderSpacing;
        height = height + borderSpacing;
      }   
    }

    return { width, height };   
  }

  scrollX(num) {
    this.elMainWrapper.scrollLeft = num;
  }

  scrollY(num) {
    this.elMainWrapper.scrollTop = num;
  }

  destroy() {
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

  refresh() {
    this._updateStyles(this.elMain);
  }
}

module.exports = Stickytable;