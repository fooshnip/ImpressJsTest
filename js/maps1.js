var width = 1024,
    height = 800;

var color = d3.scale.linear()
    .domain([0,47852, 62782474])
    .range(["white","gray","green"]);


var map = d3.geo.azimuthalEqualArea()
		.scale(5000)
		.center([-5.48, 8.25]);

var path = d3.geo.path().projection(map);


var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height);

queue()
    .defer(d3.json, "data/ivorytop.json")
    .defer(d3.csv,"data/CallsByWeek.csv")
    .await(ready);

function ready(error, ivory, calls) {

var callsById = {};
calls.forEach(function(d) { callsById[d.id] = +d.W20; });

svg.selectAll("path")
      .data(topojson.object(ivory, ivory.objects.ivory_with_id).geometries)
      .enter()
      .append("path")
      .attr("fill", function(d) { 
      return color(callsById[d.id]); })
      .attr("stroke", "black")
      .attr("d", path)
      .on("click",click)
      .append("svg:title")
      .text(function(d){
      return "Sous-prefecture "+d.id+" had "+callsById[d.id]+" calls during this period."
      })
      .attr("font-size", 20);
}



function click(d) {
  var x = 0,
      y = 0,
      k = 1;

  if (d && centered !== d) {
    var centroid = path.centroid(d);
    x = -centroid[0];
    y = -centroid[1];
    k = 4;
    centered = d;
  } else {
    centered = null;
  }

  g.selectAll("path")
      .classed("active", centered && function(d) { return d === centered; });

  g.transition()
      .duration(1000)
      .attr("transform", "scale(" + k + ")translate(" + x + "," + y + ")")
      .style("stroke-width", 1.5 / k + "px");
}