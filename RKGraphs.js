(function() {

	/**
	 *	Average Constructor
	 *	Calculates running average for a large number of input space
	 *
	 *	@Param arr - Initial array for average calculation
	 */
	var Average = function(arr) {

		// Keep track of average of seen inputs
		var avg = 0;

		// Number of inputs seen
		var num = 0;

		/**
		 *	Calc Method
		 *	Calculates running average by adding a new input
		 *
		 *	@Param val - New Input
		 */
		var calc = function(val) {
			// If no previous seen input, then average is the given  input
			if(num == 0) avg = val;
			else {
				// average is calculates as the new sum divided by new no of inputs
				avg = (avg * num + val) / (num + 1);
			}

			// update number of inputs seen
			num++;
		}

		// If constructor is initialized with an array, then push all those one by one
		if(arr) {
			for(var i = 0; i < arr.length; i++) {
				calc(arr[i]);
			}
		}

		// Constructor method to add a new input
		this.push = function(val) {
			calc(val);
		}

		// Constructor method to show the current average
		this.show = function() {
			return avg;
		}
	};

	/**
	 *	Utility Object
	 *	utility methods
	 */
	var Utility = {
		// Return a random integer between min and max
		random: function(min, max) {
			return Math.floor(Math.random() * (max - min) + min);
		},

		// Return a random color with given alpha, default alpha is 1
		colorify: function(alpha) {
			alpha = alpha || 1;

			return "rgba(" + Utility.random(0, 255) + "," + Utility.random(0, 255) + "," + Utility.random(0, 255) + "," + alpha + ")";
		},

		// Convert polar coordinates to cartesian coordinates
		polarToCartesian: function(cx, cy, r, angle) {
			var radians = (angle-90) * Math.PI / 180.0;

			return {
			  x: cx + (r * Math.cos(radians)),
			  y: cy + (r * Math.sin(radians))
			};
		}
	};

	/**
	 *	Theme Object
	 *	Defines two types of themes for graphs.
	 */
	var Themes = {
		Light: {
			textColor: "black",
			verticesColor: "black",
			backgroundColor: "white"
		},
		Dark: {
			textColor: "white",
			verticesColor: "white",
			backgroundColor: "black"
		}
	};

	// Prototype to clone an array
	Array.prototype.clone = function() {
		var arr = [];
		for(var i = 0; i < this.length; i++) 
			arr.push(this[i]);
		return arr;
	};

	/**
	 *	SVGDoc Constructor
	 *	Handle all the svg related operations. It keeps a svg dom element and add various other elements on it.
	 *
	 *	@Param width - Define width for the svg element
	 *	@Param height - Define height for the svg element
	 *	@Param config - configuration object to add properties to the svg element
	 *	@Param dom - Provide a svg dom object
	 */
	var SVGDoc = function(width, height, config, dom) {
		var svgns = "http://www.w3.org/2000/svg";
		this.dom = null;
		var self = this;

		// returns a svg element using namespace with given configuration
		var getSVGElement = function(name, config) {
			if(typeof name != "string")
				throw "Invalid name for SVG element";

			config = config || {};
			var obj = document.createElementNS(svgns, name);

			for(var prop in config) {
				obj.setAttributeNS(null, prop, config[prop]);
			}
			return obj;
		};	

		// add a given element to the svg dom element
		var add = function(ele) {
			if(self.dom == null || typeof ele == "undefined" || ele == null) 
				throw "Null Pointer Exception with SVG DOM element";
			self.dom.appendChild(ele);
		};

		// Initialize the SVGDoc object
		var init = function(config) {
			config = config || {};

			if(typeof dom != "undefined" || dom != null) {
				self.dom = dom;
				self.dom.setAttributeNS(null, "width", width);
				self.dom.setAttributeNS(null, "height", height);
				self.dom.setAttributeNS(null, "class", config.class);
				
			} else {
				config.width = width;
				config.height = height;

				self.dom = getSVGElement("svg", config);
			}
		};	

		// Clear the dom object
		this.Clear = function() {
			this.dom.innerHTML = "";
		};

		// Add a line element in SVG from (x1, y1) to (x2, y2)
		this.Line = function(x1, y1, x2, y2, config) {
			config = config || {};

			config["x1"] = x1;
			config["x2"] = x2;
			config["y1"] = y1;
			config["y2"] = y2;

			return add(getSVGElement("line", config));
		};

		// Add a circle element in SVG with center at (cx, cy) and radius r
		this.Circle = function(cx, cy, r, config) {
			config = config || {};

			config["cx"] = cx;
			config["cy"] = cy;
			config["r"] = r;

			return add(getSVGElement("circle", config));
		};

		// Add a arc in SVG using path element with center at (cx, cy)
		this.Arc = function(cx, cy, r, startAngle, endAngle, config) {
			var getPath = function(cx, cy, r, startAngle, endAngle){

			    var start = Utility.polarToCartesian(cx, cy, r, endAngle);
			    var end = Utility.polarToCartesian(cx, cy, r, startAngle);

			    var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

			    var d = [
			    	"M", cx, cy,
			        "L", start.x, start.y, 
			        "A", r, r, 0, largeArcFlag, 0, end.x, end.y,
			        "L", cx, cy
			    ].join(" ");

			    return d;       
			};

			config = config || {};
			config["d"] = getPath(cx, cy, r, startAngle, endAngle);

			return add(getSVGElement("path", config));
		};

		// Add a text element in SVG starting from (x, y)
		this.Text = function(x, y, str, config) {
			config = config || {};

			config["x"] = x;
			config["y"] = y;

			var obj = getSVGElement("text", config);
			obj.textContent = str;
			return add(obj);
		};

		// Add a rect element in SVG starting from (x, y) and width and height
		this.Rect = function(x, y, width, height, config) {
			config = config || {};

			config["x"] = x;
			config["y"] = y;
			config["width"] = width;
			config["height"] = height;

			return add(getSVGElement("rect", config));
		};

		// Add a polyline element in SVG with the given datapoints
		this.Polyline = function(dataPoints, config) {
			if(typeof dataPoints != "object")
				throw "Provide a array for Polylines";

			config = config || {};

			var str = "";
			for(var i = 0; i < dataPoints.length; i++) {
				str += dataPoints[i].x + "," + dataPoints[i].y + " ";
			}

			config["points"] = str;

			return add(getSVGElement("polyline", config));
		};

		// Add a polygon element in SVG with the given datapoints
		this.Polygon = function(dataPoints, config) {
			if(typeof dataPoints != "object")
				throw "Provide a array for Polygons";

			config = config || {};

			var str = "";
			for(var i = 0; i < dataPoints.length; i++) {
				str += dataPoints[i].x + "," + dataPoints[i].y + " ";
			}

			config["points"] = str;

			return add(getSVGElement("polygon", config));
		};

		// Add a path element in SVG with the given d param
		this.Path = function(strPath, config) {
			if(typeof strPath != "string")
				throw "Provide a string path";

			config = config || {};

			config["d"] = strPath;

			return add(getSVGElement("path", config));
		};

		// Add a qudratic bezier curve using path element in SVG with the given datapoints
		this.QuadraticBezierPath = function(dataPoints, config) {
			if(typeof dataPoints != "object" || dataPoints.length < 2)
				throw "Provide a array for Polygons with minimum two points";

			config = config || {};

			var str = "M" + dataPoints[0].x + "," + dataPoints[0].y;

			for(var i = 0; i < dataPoints.length-2; i++) {
				var mid_x = (dataPoints[i].x + dataPoints[i+1].x) / 2;
				var mid_y = (dataPoints[i].y + dataPoints[i+1].y) / 2;

				str += " Q" + dataPoints[i].x + "," + dataPoints[i].y + " " + mid_x + "," + mid_y;
			}

			str += " Q" + dataPoints[dataPoints.length-2].x + "," + dataPoints[dataPoints.length-2].y + " " + dataPoints[dataPoints.length-1].x + "," + dataPoints[dataPoints.length-1].y;

			return this.Path(str, config);
		};

		// Add a linear gradient element in SVG with the given name and color and direction
		this.LinearGradient = function(name, colors, direction) {
			var config = {};

			config["id"] = name;
			switch (direction.toLowerCase()) {
				case "left-right": 
					config['x1'] = "0%";
					config['y1'] = "0%";
					config['x2'] = "100%";
					config['y2'] = "0%";
					break;
				case "right-left": 
					config['x1'] = "100%";
					config['y1'] = "0%";
					config['x2'] = "0%";
					config['y2'] = "0%";
					break;
				case "top-bottom": 
					config['x1'] = "0%";
					config['y1'] = "0%";
					config['x2'] = "0%";
					config['y2'] = "100%";
					break;
				case "bottom-top": 
					config['x1'] = "0%";
					config['y1'] = "100%";
					config['x2'] = "0%";
					config['y2'] = "0%";
					break;
				case "lefttop-rightbottom": 
					config['x1'] = "0%";
					config['y1'] = "0%";
					config['x2'] = "100%";
					config['y2'] = "100%";
					break;
				case "rightbottom-lefttop": 
					config['x1'] = "100%";
					config['y1'] = "100%";
					config['x2'] = "0%";
					config['y2'] = "0%";
					break;
			}
			var gradient = getSVGElement("linearGradient", config);

			for(var i = 0; i < colors.length; i++) {
				var stop = getSVGElement("stop", {
					offset: (i / (colors.length-1)) * 100 + "%",
					style: "stop-color:" + colors[i]
				});

				gradient.appendChild(stop);
			}

			return add(gradient);
		};

		// start initializing
		init(config);
	};

	/**
	 *	Graph Constructor
	 *	Creates a generic graph with the given configurations.
	 *
	 *	@Param config - configuration object to create graph
	 */
	var Graph = function(config) {

		// If no config object is provided
		config = config || {};

		// if columns is provided or generated with time
		var fixedColumns = config.fixedColumns || false;

		// if columns is fixed, then specify array ootherwise number of columns
		var columns = config.columns || (fixedColumns ? []: 5);

		if(config.columns && config.columns instanceof Array)
			columns = config.columns.clone();

		// if time based columns, then choose the starting position
		var startingColumnNumber = config.startingColumnNumber || 0;

		// if rows is provided or generated with percentage
		var fixedRows = config.fixedRows || false;

		// Show percentage based system or maximum point based system
		var showPercentageBased = config.showPercentageBased || false;

		// if columns is fixed, then specify array ootherwise number of columns
		var rows = config.rows || (fixedRows ? []: 5);

		if(config.rows && config.rows instanceof Array)
			rows = config.rows.clone();

		// if data is provided in batches or continously
		var fixeddataPoints = config.fixeddataPoints || false;

		// set data points if available
		var dataPoints = config.data || [];

		if(config.data && config.data instanceof Array)
			dataPoints = config.data.clone();

		// Build average value
		var showAverage = config.showAverage || false;

		// if have to show average then store average value
		var avg = showAverage ? new Average(dataPoints): null;

		// Remove excess data points if present
		if(dataPoints.length > columns) {
			dataPoints.splice(0, dataPoints.length - columns);
		}

		// width and height of graph
		var width = config.width || 400;
		var height = config.height || 400;

		// Theme of the graph
		var theme = config.theme || Themes.Light;

		// show vertices
		var show2DVertices = config.show2DVertices || false;

		// object of SVGDocument for drawing to svg
		var svgDoc = new SVGDoc(width, height, { "class": theme.className || "", "style": "background: " + theme.backgroundColor || "transparent" }, config.svg);

		// distance between border to vertices for text
		var padding = config.padding || 50;

		// margin from line to text
		var margin = config.margin || 40;

		// draw multiple graphs by not clearing in all but one
		var dontClear = config.dontClear || false;

		// to store maximum data point seen so far
		var minDataPoint = 0, maxDataPoint = 0;

		// get custom draw method for variety of graphs
		// Method will receive two data points
		var customDrawCallback = config.customDraw || function(svgDoc, prevPoint, currPoint, nextPoint, config) {
			svgDoc.Circle(currPoint.x, currPoint.y, 5, {
				"fill": "blue"
			});
		};

		// method to map points to the graph coordinates
		var mapPoint = function(x, fLow, fHigh, sLow, sHigh) {
			return Math.floor(((x - fLow) / (fHigh - fLow) * (sHigh - sLow) + sLow));
		};

		// Method to calculate minimum of two values
		var Min = function(a, b) {
			return (a < b ? a: b);
		};

		// Method to calculate maximum of two values
		var Max = function(a, b) {
			return (a > b ? a: b);
		};

		// return location of  apoint on the map
		var getMappedLocation = function(x, y) {
			var numCols = (fixedColumns ? columns.length: columns);
			var numRows = (fixedRows ? rows.length: rows);

			return {
				x: mapPoint(x, 0, Max(dataPoints.length-1, numCols-1), padding, width-padding),
				y: height - mapPoint(y, minDataPoint, maxDataPoint, padding, height-padding)
			};
		};

		// Build Vertices
		// it takes svg document as argument
		var Build2DVertices = (show2DVertices ? function(doc, config) {
			// Make sure a valid document is provided
			if(typeof doc == "undefined" || doc == null)
				throw "Please provide a valid SVG Document Object to Build2DVertices";
			config = config || {};

			// Color of the text
			var textColor = config.textColor || theme.textColor || "black";
			var verticesColor = config.verticesColor || theme.verticesColor || textColor;

			//==================== Y-Axis Line =============================

			// draw a vertical line for Y-Axis
			doc.Line(padding, padding, padding, height-padding, { "stroke": verticesColor });

			// set X-Axis rows text
			// if user has decided for fixed number of rows, then show those only
			if(fixedRows) {
				// manipulate array given in rows
				for(var i = 0; i < rows.length; i++) {
					doc.Text(padding - margin, mapPoint(rows.length-i, 1, rows.length, padding, height - padding), rows[i], { "style": "font-size: 12px;", "fill": textColor });
				}
			} else {
				// show rows with number ranging from startingColumnNumber to startingColumnNumber+columns
				for(var i = 0; i < rows; i++) {
					doc.Text(padding - margin, mapPoint(rows-i, 1, rows, padding, height - padding), mapPoint(i, 0, rows-1, minDataPoint, maxDataPoint), { "style": "font-size: 12px;", "fill": textColor });
				}
			}

			//==================== X-Axis Line =============================

			// draw a horizontal line for X-Axis
			doc.Line(padding, height-padding, width-padding, height-padding, { "stroke": verticesColor });

			// set X-Axis columns text
			// if user has decided for fixed number of columns, then show those only
			if(fixedColumns) {
				// manipulate array given in columns
				for(var i = 0; i < columns.length; i++) {
					doc.Text(mapPoint(i, 0, columns.length-1, padding, width-padding), height - margin, columns[i], { "style": "writing-mode: tb; font-size: 12px;", "fill": textColor });
				}
			} else {
				// show columns with number ranging from startingColumnNumber to startingColumnNumber+columns
				for(var i = 0; i < columns; i++) {
					doc.Text(mapPoint(i, 0, columns-1, padding, width-padding), height - margin, i+startingColumnNumber, { "style": "writing-mode: tb; font-size: 12px;", "fill": textColor });
				}
			}	
		} : null);


		// if continous data stream, then specify a method to update data
		this.Add = function(pos) {
			// check is passed integer
			if(isNaN(pos))
				throw "Not A Number Exception";

			// Get number of columns
			var len = parseInt(fixedColumns ? columns.length : columns);

			// Update maximum and minimum axis
			if(pos < minDataPoint)
				minDataPoint = pos;
			if(pos > maxDataPoint)
				maxDataPoint = pos;

			// push point to data points
			dataPoints.push(pos);

			// if have to maintain average then add to average
			if(showAverage)
				avg.push(pos);

			// if dataPoints is larger than specified length, then remove the first element
			var numCols = parseInt(fixedColumns ? columns.length: columns);
			if(dataPoints.length > numCols) {
				dataPoints = dataPoints.splice(1);
				startingColumnNumber++;
			}		

			// redraw everything
			Reset();
		};

		// Draw the graph
		var draw = function() {
			// if show2DVertices enabled, add vertices
			if(show2DVertices)
				Build2DVertices(svgDoc);

			var numCols = (fixedColumns ? columns.length: columns);
			var numRows = (fixedRows ? rows.length: rows);

			// Create config object to pass to customdraw callback method
			var config = {
				theme: theme,
				length: dataPoints.length,
				top: padding,
				left: padding,
				bottom: height - padding,
				right: width - padding,
				rows: numRows,
				cols: numCols
			};		

			// show average if enabled
			if(showAverage)
				config.average = getMappedLocation(0, avg.show()).y;

			for(var i = 0; i < dataPoints.length; i++) {
				var prevPoint = (i > 0 ? getMappedLocation(i-1, dataPoints[i-1]): null);
				var currPoint = getMappedLocation(i, dataPoints[i]);
				var nextPoint = (i < dataPoints.length-1 ? getMappedLocation(i+1, dataPoints[i+1]): null);

				customDrawCallback(svgDoc, prevPoint, currPoint, nextPoint, config);
			}
		};

		// Redraw everything
		var Reset = function() {
			// Find maximum and minimum
			for(var i = 0; i < dataPoints.length; i++) {
				if(dataPoints[i] < minDataPoint)
					minDataPoint = dataPoints[i];
				if(dataPoints[i] > maxDataPoint)
					maxDataPoint = dataPoints[i];
			}

			// clear the svg element
			if(!dontClear)
				svgDoc.Clear();

			// redraw everything
			draw();
		};

		document.body.appendChild(svgDoc.dom);
		Reset();
	};

	/**
	 *	PointGraph Constructor
	 *	Creates a Point graph with the given configurations.
	 *
	 *	@Param config - configuration object to create point graph
	 */
	var PointGraph = function(config) {
		config = config || {};

		var radius = config.radius || 5;
		var color = config.color || "blue";

		var className = config.className || "";
		var doDuplication = config.doDup || false;
		var dupClass = config.dupClass || "";

		var averageLineColor = config.averageLineColor || "red";

		config.show2DVertices = true;

		// add the custom draw method to config
		config.customDraw = function(svgDoc, prevPoint, currPoint, nextPoint, config) {
			// show animation
			if(doDuplication) {
				svgDoc.Circle(currPoint.x, currPoint.y, radius, {
					"fill": color,
					"class": dupClass
				});
			}

			svgDoc.Circle(currPoint.x, currPoint.y, radius, {
				"fill": color,
				"class": className
			});

			if(config.average) {
				svgDoc.Line(config.left, config.average, config.right, config.average, {
					"stroke": averageLineColor
				});
			}
		};

		return new Graph(config);
	};

	/**
	 *	BarGraph Constructor
	 *	Creates a Bar graph with the given configurations.
	 *
	 *	@Param config - configuration object to create bar graph
	 */
	var BarGraph = function(config) {
		config = config || {};

		var gradient = config.gradient;
		var color = config.color || (gradient ? []: "blue");
		var direction = config.direction || "left-right";
		var stroke = config.stroke || false;
		var barSpacing = config.barspacing || 20;

		var className = config.className || "";
		var doDuplication = config.doDup || false;
		var dupClass = config.dupClass || "";

		var averageLineColor = config.averageLineColor || "red";

		config.show2DVertices = true;

		// add the custom draw method to config
		config.customDraw = function(svgDoc, prevPoint, currPoint, nextPoint, config) {
			// calculate wiidth of each bar
			var bar_width = (config.right - config.left - (config.cols-1)*barSpacing) / (config.cols);

			if(prevPoint == null) {
				// show animation
				if(doDuplication) {
					svgDoc.Rect(currPoint.x, currPoint.y, bar_width/2, config.bottom - currPoint.y, {
						"stroke": stroke ? (gradient ? "url(#" + gradient + ")" : color): "none",
						"fill": !stroke ? (gradient ? "url(#" + gradient + ")" : color): "transparent",
						"class": dupClass
					});
				}

				svgDoc.Rect(currPoint.x, currPoint.y, bar_width/2, config.bottom - currPoint.y, {
					"stroke": stroke ? (gradient ? "url(#" + gradient + ")" : color): "none",
					"fill": !stroke ? (gradient ? "url(#" + gradient + ")" : color): "transparent",
					"class": className
				});
			} else if(nextPoint == null) {
				// show animation
				if(doDuplication) {
					svgDoc.Rect(currPoint.x - bar_width/2, currPoint.y, bar_width/2, config.bottom - currPoint.y, {
						"stroke": stroke ? (gradient ? "url(#" + gradient + ")" : color): "none",
						"fill": !stroke ? (gradient ? "url(#" + gradient + ")" : color): "transparent",
						"class": dupClass
					});
				}

				svgDoc.Rect(currPoint.x - bar_width/2, currPoint.y, bar_width/2, config.bottom - currPoint.y, {
					"stroke": stroke ? (gradient ? "url(#" + gradient + ")" : color): "none",
					"fill": !stroke ? (gradient ? "url(#" + gradient + ")" : color): "transparent",
					"class": className
				});
			} else {
				// show animation
				if(doDuplication) {
					svgDoc.Rect(currPoint.x - bar_width/2, currPoint.y, bar_width, config.bottom - currPoint.y, {
						"stroke": stroke ? (gradient ? "url(#" + gradient + ")" : color): "none",
						"fill": !stroke ? (gradient ? "url(#" + gradient + ")" : color): "transparent",
						"class": dupClass
					});
				}

				svgDoc.Rect(currPoint.x - bar_width/2, currPoint.y, bar_width, config.bottom - currPoint.y, {
					"stroke": stroke ? (gradient ? "url(#" + gradient + ")" : color): "none",
					"fill": !stroke ? (gradient ? "url(#" + gradient + ")" : color): "transparent",
					"class": className
				});
			}

			if(config.average) {
				svgDoc.Line(config.left, config.average, config.right, config.average, {
					"stroke": averageLineColor
				});
			}
		};

		return new Graph(config);
	};

	/**
	 *	LineGraph Constructor
	 *	Creates a Line graph with the given configurations.
	 *
	 *	@Param config - configuration object to create line graph
	 */
	var LineGraph = function(config) {
		config = config || {};

		var strokeWidth = config.strokewidth || 5;
		var color = config.color || "blue";

		var className = config.className || "";
		var doDuplication = config.doDup || false;
		var dupClass = config.dupClass || "";

		var averageLineColor = config.averageLineColor || "red";

		config.show2DVertices = true;

		// add the custom draw method to config
		config.customDraw = function(svgDoc, prevPoint, currPoint, nextPoint, config) {
			if(prevPoint == null) return;

			// show animation
			if(doDuplication) {
				svgDoc.Line(prevPoint.x, prevPoint.y, currPoint.x, currPoint.y, {
					"stroke": color,
					"class": dupClass,
					"stroke-width": strokeWidth
				});
			}

			svgDoc.Line(prevPoint.x, prevPoint.y, currPoint.x, currPoint.y, {
				"stroke": color,
				"class": className,
				"stroke-width": strokeWidth
			});

			if(config.average) {
				svgDoc.Line(config.left, config.average, config.right, config.average, {
					"stroke": averageLineColor
				});
			}
		};

		return new Graph(config);
	};

	/**
	 *	PolylineGraph Constructor
	 *	Creates a Polyline graph with the given configurations.
	 *
	 *	@Param config - configuration object to create polyline graph
	 */
	var PolylineGraph = function(config) {
		config = config || {};

		var gradient = config.gradient;
		var color = config.color || (gradient ? []: "blue");
		var direction = config.direction || "left-right";
		var stroke = config.stroke || false;
		var strokeWidth = config.stroke ? config.strokewidth || 5 : 5;

		var className = config.className || "";
		var doDuplication = config.doDup || false;
		var dupClass = config.dupClass || "";

		var averageLineColor = config.averageLineColor || "red";

		var dataPoints = [];

		config.show2DVertices = true;

		// add the custom draw method to config
		config.customDraw = function(svgDoc, prevPoint, currPoint, nextPoint, config) {
			dataPoints.push(currPoint);

			if(nextPoint == null) {

				// show animation
				if(doDuplication) {
					svgDoc.Polyline(dataPoints, {
						"stroke": stroke ? (gradient ? "url(#" + gradient + ")" : color): "none",
						"fill": !stroke ? (gradient ? "url(#" + gradient + ")" : color): "transparent",
						"class": dupClass,
						"stroke-width": strokeWidth
					});
				}

				svgDoc.Polyline(dataPoints, {
					"stroke": stroke ? (gradient ? "url(#" + gradient + ")" : color): "none",
					"fill": !stroke ? (gradient ? "url(#" + gradient + ")" : color): "transparent",
					"class": className,
					"stroke-width": strokeWidth
				});

				if(config.average) {
					svgDoc.Line(config.left, config.average, config.right, config.average, {
						"stroke": averageLineColor
					});
				}

				dataPoints = [];
			}
		};

		return new Graph(config);
	};

	/**
	 *	PolygonGraph Constructor
	 *	Creates a Polygon graph with the given configurations.
	 *
	 *	@Param config - configuration object to create polygon graph
	 */
	var PolygonGraph = function(config) {
		config = config || {};

		var gradient = config.gradient;
		var color = config.color || (gradient ? []: "blue");
		var direction = config.direction || "left-right";
		var stroke = config.stroke || false;

		var className = config.className || "";
		var doDuplication = config.doDup || false;
		var dupClass = config.dupClass || "";

		var averageLineColor = config.averageLineColor || "red";

		var dataPoints = [];

		config.show2DVertices = true;

		// add the custom draw method to config
		config.customDraw = function(svgDoc, prevPoint, currPoint, nextPoint, config) {
			dataPoints.push(currPoint);

			if(nextPoint == null) {

				// add bottom right point and bottom left point for complete polygon
				// bottom right point
				dataPoints.push({
					x: config.right,
					y: config.bottom
				});

				// bottom left point
				dataPoints.push({
					x: config.left,
					y: config.bottom
				});

				// show animation
				if(doDuplication) {
					svgDoc.Polygon(dataPoints, {
						"stroke": stroke ? (gradient ? "url(#" + gradient + ")" : color): "none",
						"fill": !stroke ? (gradient ? "url(#" + gradient + ")" : color): "transparent",
						"class": dupClass
					});
				}

				svgDoc.Polygon(dataPoints, {
					"stroke": stroke ? (gradient ? "url(#" + gradient + ")" : color): "none",
					"fill": !stroke ? (gradient ? "url(#" + gradient + ")" : color): "transparent",
					"class": className
				});

				if(config.average) {
					svgDoc.Line(config.left, config.average, config.right, config.average, {
						"stroke": averageLineColor
					});
				}

				dataPoints = [];
			}
		};

		return new Graph(config);
	};

	/**
	 *	PieGraph Constructor
	 *	Creates a Pie graph with the given configurations.
	 *
	 *	@Param config - configuration object to create point graph
	 */
	var PieGraph = function(config) {
		config = config || {};

		var colors = config.color || [];
		var stroke = config.stroke || false;

		var className = config.className || "";
		var doDuplication = config.doDup || false;
		var dupClass = config.dupClass || "";

		var fixedColumns = config.fixedcolumns || false;
		var columns = config.columns || [];

		var dataPoints = [];

		config.show2DVertices = false;

		// add the custom draw method to config
		config.customDraw = function(svgDoc, prevPoint, currPoint, nextPoint, config) {
			dataPoints.push(currPoint);

			if(nextPoint == null) {

				// find colors for the total data points
				if(dataPoints.length > colors.length || (fixedColumns && columns.length > colors.length)) {
					while(dataPoints.length > colors.length || (fixedColumns && columns.length > colors.length)) {
						colors.push(Utility.colorify(1));
					}
				}

				var totalAngle = 360;
				var sum = 0;
				var startAngle = 0;
				var sidebar_width = 50;

				var delta_width = (config.right - config.left)/2;
				var delta_height = (config.bottom - config.top)/2;

				var columnsProvided = (fixedColumns && columns.length > 0);

				var r = (delta_width < delta_height ? delta_width: delta_height) - (columnsProvided ? sidebar_width/2: 0);
				var cx = config.left + delta_width - (columnsProvided ? sidebar_width: 0);
				var cy = config.top + delta_height;

				// Calculation for side bar showing columns with cooresponsing colors
				var sidebar_x = config.right - sidebar_width;
				var sidebar_y = config.top;

				var col_width = sidebar_width, col_height = (config.bottom - config.top) / columns.length;

				var box_width = box_height = 0.5 * col_height;

				for(var i = 0; i < dataPoints.length; i++) {
					sum += (config.bottom - dataPoints[i].y);
				}

				for(var i = 0; i < dataPoints.length; i++) {
					var angle = ((config.bottom - dataPoints[i].y) / sum) * totalAngle;
					if(doDuplication) {
						svgDoc.Arc(cx, cy, r, startAngle, startAngle+angle, {
							fill: colors[i % colors.length],
							class: dupClass
						});
					}

					svgDoc.Arc(cx, cy, r, startAngle, startAngle+angle, {
						fill: colors[i % colors.length],
						class: className
					});

					startAngle += angle;
				}

				if(columnsProvided) {
					for(var i = 0; i < columns.length; i++) {
						svgDoc.Rect(sidebar_x, config.top + i*col_height + (col_height - box_height)/2, box_width, box_height, {
							fill: colors[i % colors.length]
						});

						svgDoc.Text(sidebar_x + box_height + 10, config.top + i*col_height + col_height/2, columns[i], {
							"style": "text-align: center",
							"fill": (config.theme && config.theme.textColor) ? config.theme.textColor : "black"
						});
					}
				}
			}	
		};

		return new Graph(config);
	};

	/**
	 *	CurveGraph Constructor
	 *	Creates a Curve graph with the given configurations.
	 *
	 *	@Param config - configuration object to create curve graph
	 */
	var CurveGraph = function(config) {
		config = config || {};

		var gradient = config.gradient;
		var color = config.color || (gradient ? []: "blue");
		var direction = config.direction || "left-right";
		var stroke = config.stroke || false;
		var strokeWidth = config.stroke ? config.strokewidth || 5 : 5;

		var className = config.className || "";
		var doDuplication = config.doDup || false;
		var dupClass = config.dupClass || "";

		var averageLineColor = config.averageLineColor || "red";

		var dataPoints = [];

		config.show2DVertices = true;

		// add the custom draw method to config
		config.customDraw = function(svgDoc, prevPoint, currPoint, nextPoint, config) {
			if(dataPoints.length == 0) {
				dataPoints.push({x: config.left, y: config.bottom});

				if(gradient) {
					// setup gradient
					svgDoc.LinearGradient(gradient, color, direction);
				}
			}

			dataPoints.push(currPoint);

			if(nextPoint == null) {

				// add bottom point
				dataPoints.push({x: dataPoints[dataPoints.length-1].x, y: config.bottom});

				// show animation
				if(doDuplication) {
					svgDoc.QuadraticBezierPath(dataPoints, {
						"stroke": stroke ? (gradient ? "url(#" + gradient + ")" : color): "none",
						"fill": !stroke ? (gradient ? "url(#" + gradient + ")" : color): "transparent",
						"class": dupClass,
						"stroke-width": strokeWidth
					});
				}

				svgDoc.QuadraticBezierPath(dataPoints, {
					"stroke": stroke ? (gradient ? "url(#" + gradient + ")" : color): "none",
					"fill": !stroke ? (gradient ? "url(#" + gradient + ")" : color): "transparent",
					"class": className,
					"stroke-width": strokeWidth
				});

				if(config.average) {
					svgDoc.Line(config.left, config.average, config.right, config.average, {
						"stroke": averageLineColor
					});
				}

				dataPoints = [];
			}
		};

		return new Graph(config);
	};

	// Export everything
	window.RKGraph = {
		PointGraph: PointGraph,
		LineGraph: LineGraph,
		PolylineGraph: PolylineGraph,
		PolygonGraph: PolygonGraph,
		BarGraph: BarGraph,
		PieGraph: PieGraph,
		CurveGraph: CurveGraph,
		Themes: Themes,
		Graph: Graph
	};
})();