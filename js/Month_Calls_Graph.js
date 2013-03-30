var margin = {top: 30, right: 30, bottom: 30, left: 60},
    width1 = 400 - margin.left - margin.right,
    height1 = 250 - margin.top - margin.bottom;

var parseDate = d3.time.format("%B-%y").parse;

var x = d3.time.scale()
    .range([0, width1]);

var y = d3.scale.linear()
    .range([height1, 0]);


var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(5);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line1 = d3.svg.line()
    .x(function(d) { return x(d.month); })
    .y(function(d) { return y(d.calls); });

var vis = d3.select("body").append("svg")
    .attr("width", width1 + margin.left + margin.right)
    .attr("height", height1 + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data/Total_Calls_Month.csv", function(error, data) {

    data.forEach(function(d) {
    d.month = parseDate(d.month);
    d.close = +d.close;
  });

  x.domain(d3.extent(data, function(d) { return d.month; }));
  //y.domaind3.extent(data, function(d) { return d.calls; }));
  y.domain([100000000, 160000000]);


  vis.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height1 + ")")
      .call(xAxis);

  vis.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Calls ");

  vis.append("path")
      .datum(data)
      .attr("class", "line1")
      .attr("d", line1);
});
