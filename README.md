# RKGraph JS

A simple SVG based graphing library to create dynamic graphs in JavaScript and Angular JS. Predefined graphs consist of Line, Point, Pie Chart, Polyline, Polygon and Curve Graph. It also provides a way to create your own graph using combination of predefined graphs and your imagination.

## Writing a simple graph

Let's create a line graph to show datapoints. First import the minified verison of javascript library.

```html 

<script type="text/javascript" src="RKGraphs.js"></script>
```

Now create an object of RKGraph constructor with the configurations (explained later). We will create a simple graph with default style.

```javascript

	var graph = RKGraph.LineGraph({
		width: 800,
		height: 700,
		data: [34, 88, 35, 55]
	});
```
This will create a blue line graph in document.body with width of 800px and height of 700px. Now let's take it furthur. Specify number of rows and columns.

```json

	columns: 20,
	rows: 10
```
This will show 10 datapoints at any particular time and show 20 column intervals in which the given data lie. Now to change the color of the line.
```json

	color: 'red'
```
You can also add gradient to lines and graphs
```json

	gradient: 'mygrad',
	color: ["rgba(0, 0, 0, .4)", "rgba(0, 0, 0, .4)", "rgba(0, 0, 0, .4)", "rgba(0, 0, 0, .05)"],
	direction: "top-bottom"
```

## Configurations

### fixedColumns
It defines whether the number of columns should be fixed for the graph or should be generated with time. If false, the columns (X-Axis) will show time interval. Default is false.

### columns
It can be an array containing the title of columns such as `["Jan", "Feb", "March"]` or a single integer containing the number of columns to show. If `fixedColumn` is set, then it defaults to an empty array, otherwise 5.

### startingColumnNumber
For time based columns, it defined the starting time for the graph. Default is 0.

### fixedRows
It defines whether the number of rows should be fixed for the graph or should be generated as per the points. If false, the rows (Y-Axis) will show points between the maximum Y-value and minimum Y-value seen until the point. Default is false.

### showPercentageBased
It defines whether the row points (Y-Axis) should show percentage or values. Default is false.

### rows
It can be an array containing the title of rows such as `["Jan", "Feb", "March"]` or a single integer containing the number of rows to show. If `fixedRows` is set, then it defaults to an empty array, otherwise 5.

### fixeddataPoints
It defines whether the data for the new points is provided in batches or continously. Default is false.

### data
It is an array containing the Y-Axis data points for the graph. Default is [].

### showAverage
It defines whether to show an average line in the graph based on the data points seen so far. Default is false.

### width
It defines the width of the graph. Default is 400px.

### height
It defines the height of the graph. Default is 400px.

### theme
It takes a `Themes` object to customize the look and feel of the graph. Default is `Themes.Light`. See `Themes` for create custom themes.

### show2DVertices
It defines whether to show X and Y vertices around the graph. Default is false.

### padding
It defines the distance between border to vertices for text. Default is 50px.

### margin
It defines the margin from line to text. Default is 40px.

### dontClear
This prevents the graph from clearing the canvas. It allows multiple `Graph` objects to share the same canvas and draw multiple graphs. The last `Graph` object in the draw chain must have this property to false for proper funtioning. Default is false.

### customDraw
This property allows to create custom graphs. See `Custom Graphs` for documentation. Default functionality is to draw a point graph.

## Themes
Themes are basic color configurations to customize the look and feel of the graph. RKGraph contains 2 themes by default: Light and Dark.

### Using Themes
You can pass theme object in `theme` property of the configuration object.
```javascript
	
	var graph = RKGraph.LineGraph({
		width: 800,
		height: 700,
		data: [34, 88, 35, 55],
		theme: Themes.Dark
	});
```

### Creating custom themes
A theme object contains these configurations.

**textColor**: It defines the color of columns and rows text.

**verticesColor**: It defines the color of X and Y vertices of the graph.

**backgroundColor**: It defines the background color of the graph.

## SVGDoc Constructor
It is used to draw everything on the graph. 

### Arguments

#### width
Width of the graph.

#### height
Height of the graph.

#### config
Basic properties object to apply to each SVG elements. Such as `class` or `style`.

#### dom
SVG element in which the entire graph will be drawn.

### Methods

#### Clear()
This clears the attached SVG DOM element.

#### Line()
This method creates a line from `( x1, y1 )` to `( x2, y2 )`. It takes 5 arguments: x1, y1, x2, y2 and config object (HTML properties).

#### Circle()
This method creates a circle at `( cx, cy )` with radius `r`. It takes 4 arguments: cx, cy, r and config object (HTML properties).

#### Arc()
This method creates an arc from at `( cx, cy )` with radius `r` from `startAngle` to `endAngle`. It takes 6 arguments: cx, cy, r, startAngle, endAngle and config object (HTML properties).

#### Text()
This method add a text element in SVG starting from `(x, y)` with text `str`. It takes 4 arguments: x, y, str and config object (HTML properties).

#### Rect()
This method add a rect element in SVG starting from `(x, y)` with `width` and `height`. It takes 5 arguments: x, y, width, height and config object (HTML properties).

#### Polyline()
This method add a polyline element in SVG with the given `datapoints`. It takes 2 arguments: dataPoints and config object (HTML properties).

#### Polygon()
This method add a polygon element in SVG with the given `datapoints`. It takes 2 arguments: dataPoints and config object (HTML properties).

#### Path()
This method add a path element in SVG with the given `strPath` param. It takes 2 arguments: strPath and config object (HTML properties).

#### QuadraticBezierPath()
This method add a qudratic bezier curve using path element in SVG with the given `datapoints`. It takes 2 arguments: dataPoints and config object (HTML properties).

#### LinearGradient()
This method add a linear gradient element in SVG with the given `name` and `color` and `direction`. It takes 3 arguments: name, colors and direction.

## Predefined Graphs

### PointGraph
It creates a Point graph with the given configurations object.

#### Additional Configurations

**radius**: The radius of points in the graph.

**color**: color of the point.

**className**: class name to be given to each data point in the graph for easy CSS manipulations.

**doDuplication**: whether to create two copies of the same data points at the same position for more effect.

**dupClass**: class name of the duplicated point.

**averageLineColor**: color of the average line.

#### Example
```javascript

	var g = RKGraph.PointGraph({
		width: 800,
		height: 700,
		columns: 5,
		rows: 10,
		data: [1,2,3,4,5]
	});
```

### BarGraph
It creates a Bar graph with the given configurations object.

#### Additional Configurations

**color**: color of the bar.

**className**: class name to be given to each data point bar in the graph for easy CSS manipulations.

**doDuplication**: whether to create two copies of the same data points at the same position for more effect.

**dupClass**: class name of the duplicated bar.

**barspacing**: spacing between two consecutive data point bar. Default is 20px.

**stroke**: defines whether to stroke the bar or fill it with given color. Default is false(fill).

**averageLineColor**: color of the average line.

#### Example
```javascript

	var g = RKGraph.BarGraph({
		width: 800,
		height: 700,
		columns: 5,
		rows: 10,
		data: [1,2,3,4,5]
	});
```

### LineGraph
It creates a Line graph with the given configurations object.

#### Additional Configurations

**color**: color of the line.

**className**: class name to be given to each data point line in the graph for easy CSS manipulations.

**doDuplication**: whether to create two copies of the same data point line at the same position for more effect.

**dupClass**: class name of the duplicated line.

**strokeWidth**: width of the stroke. Default is 5px.

**averageLineColor**: color of the average line.

#### Example
```javascript

	var g = RKGraph.LineGraph({
		width: 800,
		height: 700,
		columns: 5,
		rows: 10,
		data: [1,2,3,4,5]
	});
```

### PolylineGraph
It creates a Polyline graph with the given configurations object.

#### Additional Configurations

**color**: color of the polyline.

**className**: class name to be given to each data point polyline in the graph for easy CSS manipulations.

**doDuplication**: whether to create two copies of the same data point polyline at the same position for more effect.

**dupClass**: class name of the duplicated polyline.

**stroke**: defines whether to stroke the polyline or fill it with given color. Default is false(fill).

**strokeWidth**: width of the stroke. Default is 5px.

**averageLineColor**: color of the average line.

#### Example
```javascript

	var g = RKGraph.PolylineGraph({
		width: 800,
		height: 700,
		columns: 5,
		rows: 10,
		data: [1,2,3,4,5]
	});
```

### PolygonGraph
It creates a Polygon graph with the given configurations object.

#### Additional Configurations

**color**: color of the polygon.

**className**: class name to be given to each data point polygon in the graph for easy CSS manipulations.

**doDuplication**: whether to create two copies of the same data point polygon at the same position for more effect.

**dupClass**: class name of the duplicated polygon.

**stroke**: defines whether to stroke the polygon or fill it with given color. Default is false(fill).

**averageLineColor**: color of the average line.

#### Example
```javascript

	var g = RKGraph.PolygonGraph({
		width: 800,
		height: 700,
		columns: 5,
		rows: 10,
		data: [1,2,3,4,5]
	});
```

### PieGraph
It creates a Pie graph with the given configurations object.

#### Additional Configurations

**color**: list of colors equal to number of data points.

**className**: class name to be given to each data point arc in the graph for easy CSS manipulations.

**doDuplication**: whether to create two copies of the same data point arc at the same position for more effect.

**dupClass**: class name of the duplicated arc.

**stroke**: defines whether to stroke the arc or fill it with given color. Default is false(fill).

#### Example
```javascript

	var g = new RKGraph.PieGraph({
		width: 400,
		height: 400,
		data: [44, 99, 1000, 50],
		color: ["#e74c3c", "#2ecc71", "#3498db", "#e67e22"],
		fixedcolumns: true,
		columns: ["Red", "Green", "Blue", "Orange"],
		theme: "dark",
		doDup: true,
		dupClass: "pop"
	});
```

### CurveGraph
It creates a BezierCurve graph with the given configurations object.

#### Additional Configurations

**color**: color of the curve.

**className**: class name to be given to each data point curve in the graph for easy CSS manipulations.

**doDuplication**: whether to create two copies of the same data point curve at the same position for more effect.

**dupClass**: class name of the duplicated curve.

**stroke**: defines whether to stroke the curve or fill it with given color. Default is false(fill).

**strokeWidth**: width of the stroke. Default is 5px.

**averageLineColor**: color of the average line.

#### Example
```javascript

	var g = RKGraph.CurveGraph({
		width: 800,
		height: 700,
		columns: 5,
		rows: 10,
		data: [1,2,3,4,5],
		color: "blue",
		averageLineColor: "#000",
		showAverage: true
	});
```

## Custom Graphs
The functionality of `RKGraph` can be extended by drawing custom graphs. The configuration object of `Graph` takes `customDraw` property which allows user to create custom data points drawing functionality.

### Creating Simple Custom Graph
First create a method that takes 5 arguments. For our simple example, we will create a graph which shows point graph but the first and last point is a bar graph.
```javascript
	
	function myCustomDraw(svgDoc, prevPoint, currPoint, nextPoint, config) {

		// if first or last point
		if(prevPoint == null || nextPoint == null) {
			// draw a bar
			// get row width
			var bar_width = (config.right - config.left - (config.cols-1)*5) / (config.cols);

			svgDoc.Rect(currPoint.x - bar_width/2, currPoint.y, bar_width, config.bottom - currPoint.y, {
					"fill": "blue"
				});
		} else {
			// draw a point
			svgDoc.Circle(currPoint.x, currPoint.y, 5, {
				"fill": "blue"
			});
		}
	}
```
Now set this method as callback for `customDraw` property in configuration object.

```javascript

	var graph = RKGraph.LineGraph({
		width: 800,
		height: 700,
		data: [34, 88, 35, 55],
		customDraw: myCustomDraw
	});
```

### Arguments

#### svgDoc
It contains the `SVGDoc` object which is used to draw everything on the graph. See `SVGDoc` documentation for more details.

#### prevPoint
It contains the previous data point if exists, otherwise null.

#### currPoint
It contains the current data point in the iteration.

#### nextPoint
It contains the next data point if exists, otherwise null.

#### config
It contains the basic configurations required to draw points on the graphs.

##### theme
The theme of the graph.

##### length
Number fo data points on the graph to show.

##### top
Top most corner of the graph.

##### left
Left most corner of the graph.

##### right
Right most corner of the graph.

##### bottom
Bottom most corner of the graph.

##### rows
Number of rows in the graph.

##### cols
Number of columns in the graph.

## Updating graphs
The graph object has one method `Add()` which allows user to add data points programmatically.

```javascript

	var g = RKGraph.LineGraph({
		width: 800,
		height: 700,
		columns: 5,
		rows: 10,
		data: [1,2,3,4,5],
		color: "blue",
		averageLineColor: "#000",
		showAverage: true
	});

	// add a new point
	g.Add(34);

	// keep adding points between (0, 100)
	setInterval(function() {
		datapoint = random(0, 100);
		g.Add(datapoint);
	}, 1000/5);

```

## Angular 1.6 Module

### Simple Example
Let's create a simple line graph in angularJS. Include the JS file `angular-RKGraph.js` and create a line graph using modules.

```html
<body ng-app="myapp" ng-controller="myctrl">

	<linegraph width="300" height="300" data-inputs="data" data-columns="10" data-average="black" data-theme="light" data-color="#2980b9"></linegraph>

</body>
```

Now to create an app and controller in JavaScript

```javascript

var app = angular.module("myapp", ['RKGraph']);
app.controller("myctrl", function($scope, GraphProvider) {
	$scope.data = [5,6,7,3];
});

```

### Updating graphs
Now that you have created your simple line graph from above example. Let's try to add a data point in `$scope.data`. It will immediately be reflected in the graph. Let's add random data points to the graph.

```javascript

var app = angular.module("myapp", ['RKGraph']);
app.controller("myctrl", function($scope, $interval, GraphProvider) {
	$scope.data = [5,6,7,3];

	$interval(function() {
		$scope.data.push(Math.random() * 100);
	}, 100);
});
```

### Supported Directives
-	piegraph
-	polygongraph
-	polylinegraph
-	bargraph
-	pointgraph
-	linegraph
