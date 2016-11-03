# Stickytable

Stickytable is a javascript plugin that makes your table headers sticky, allowing users to scroll through big sets of table data on any size screen.

[See a Demo](http://amielzwier.com/stickytable)

Features:

* Written in pure javascript, no jQuery or framework needed
* Completely responsive and plays nice with touch devices
* Make both the row and column headers sticky
* Have any number of rows and columns in your table
* Use your own CSS to style your tables</li>
* It works on tables made of other elements, like `<div>`s


## Install

### Download

* [Minified javascript](https://raw.githubusercontent.com/amized/Stickytable/master/dist/Stickytable.min.js)
* [Source code (zip)](https://github.com/amized/Stickytable/archive/1.0.1.zip)  

### Package managers

**NPM** | `npm install stickytable`

## Usage

Make a table

~~~~
<table>
	...	
</table>
~~~~
	
Style it how you like. Don't be scared of using widths/heights/paddings etc...

~~~~
...
	
table {
	cellpadding: 0;
	callspacing: 0;
}

th {
	min-width: 200px;
}
	
td {
	padding: 15px;
	border: 1px solid #DDD;
}

...
~~~~

Import the module with `<script>`
	
	<script src="Stickytable.min.js"/><script>
	
or commonjs

	var Stickytable = require("stickytable");	
	
Instantiate a Stickytable object by passing the table element and options

~~~~
var el = document.querySelector("table");
var stickytable = new Stickytable(el, {
	// options
});
~~~~


## Options

Option        | Type          | Default      | Description
------------- | ------------- | ------------ | -----------             
width | string | '100%' | Sets the the css width property of the scrollable container. Set to 'auto' to allow the container width to match the width of the table.
height | string | 'auto' | Sets the the css height property of the scrollable container. Set to auto to allow the container height to match the height of the table.
rowSelector | string | 'tr' | A selector to tell Stickytable which elements are the rows in your table. Change this value if your table is made of elements other than table/tr/td, like divs.

## Methods
~~~~
Stickytable(element, options)
~~~~

Instantiates Sticky table.


###Arguments:
 
`element`	DOM element for the table

`options` Object that specifies options

###Returns:
New `Stickytable` instance


--
~~~~
stickytable.destroy()
~~~~

Destroys the sticky table and restores the original table into the DOM.

###Arguments:
None
###Returns:
`Undefined`

--
~~~~
stickytable.refresh()
~~~~

Recalculates the sticky element dimensions and redraws the sticky table.
###Arguments:
None
###Returns:
`Undefined`

## License
MIT