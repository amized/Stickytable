# Stickytable

Stickytable is a javascript plugin that makes your table headers sticky, allowing users to scroll both horizontally and vertically through big sets of table data.

Some cool things about this plugin:

* You can have any number of rows and columns in your table
* Use your own CSS to style the table exactly how you like
* It works on tables made of other elements, like `<div>`s
* It makes both the row and column headers sticky
* Completely responsive and plays nice with touch devices


## Install

### Download

Github [Stickytable.js](https://raw.githubusercontent.com/amized/Stickytable/master/dist/Stickytable.js)  

### Package managers

N/A

## Usage

Make a table.

	<table>
		...	
	</table>

	
Style it with your css - Widths, heights, colors, borders...

	...
	
	table {
		cellpadding: 0;
		callspacing: 0;
	}
	
	td {
		padding: 15px;
		border: 1px solid #DDD;
	}

	...

Import the module with link
	
	<script src="Stickytable.js"/><script>
	
or commonjs

	var Stickytable = require("stickytable");	
	
Instantiate a Sticky table object by passing the table element and options.

	var el = document.querySelector("table");
	var stickytable = new Stickytable(el, {
		// options
	});


## Options

Option        | Type          | Default      | Description
------------- | ------------- | ------------ | -----------             
width | string | '100%' | Sets the the css width property of the scrollable container. Set to 'auto' to allow the container height to match the height of the table.
height | string | 'auto' | Sets the the css height property of the scrollable container. Set to auto to allow the container height to match the height of the table.
rowSelector | string | 'tr' | A selector to tell Stickytable which elements are the rows in your table. Change this value if your table is made of elements other than table/tr/td, like divs.

## Methods

	Stickytable(element, options)

Instantiates Sticky table.


####Arguments:
 
`element`	DOM element for the table

`options` Object that specifies options

####Returns:
New Stickytable instance

--

	stickytable.destroy()

Destroys the sticky table and restores the original table into the DOM.

####Arguments:
None
####Returns:
Undefined

--

	stickytable.refresh()

Recalculates the sticky element dimensions and redraws the sticky table. 

**NOTE** Stickytable is responsive and will automatically redraw upon window resize
####Arguments:
None
####Returns:
Undefined