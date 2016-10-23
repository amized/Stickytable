import Stickytable from "./Stickytable";

export default Stickytable;
/*
(function(name, definition) {
    if (typeof module != 'undefined') module.exports = definition();
    else if (typeof define == 'function' && typeof define.amd == 'object') define(definition);
    else window[name] = definition();

    console.log(window.Stickytable);
    //console.log(this.Stickytable);
}('Stickytable', function() {
    //This is the code you would normally have inside define() or add to module.exports
    return Stickytable;
}));

window.Stickytable = Stickytable;
*/