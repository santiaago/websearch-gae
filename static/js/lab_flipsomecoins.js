    
var margin = {top: 20, right: 20, bottom: 30, left: 50},
width = (960*0.5) - margin.left - margin.right,
height = (500*0.5) - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .x(function(d) { return x(d.N); })
    .y(function(d) { return y(d.Y); });

var svg = d3.select('.flipsomecoins').append('svg')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
console.log(svg);
d3.tsv("/static/data/flipsomecoins.tsv", function(error, data) {
    data.forEach(function(d) {
	d.N = d.N;
	d.Y = +d.Y;
    });

    x.domain(d3.extent(data, function(d) { return d.N; }));
    y.domain(d3.extent(data, function(d) { return d.Y; }));

    svg.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + height + ")")
	.call(xAxis)
	.append("text")
	.attr("x", 390)
	.attr("dx", ".71em")
	.style("text-anchor", "end")
	.text("N");
    svg.append("g")
	.attr("class", "y axis")
	.call(yAxis)
	.append("text")
	.attr("transform", "rotate(-90)")
	.attr("y", 6)
	.attr("dy", ".71em")
	.style("text-anchor", "end")
	.text("P");
    
    svg.append("path")
	.datum(data)
	.attr("class", "line")
	.attr("d", line);
});