var centered;

var projection = d3.geo.azimuthalEqualArea()
    .scale(5000)
    .center([-5.48, 8.25])
    .translate([0, 0]);

var color = d3.scale.linear()
    .domain([0,47852, 62782474])
    .range(["white","gray","green"]);    

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("#vis").append("svg")
    .attr("width", "90%")
    .attr("height", "90%")
    .attr("viewBox", "0 0 600 600");
//    .attr("width", width)
//    .attr("height", height);

//d3.select("svg")
//  .attr("viewBox", "0 0 600 600")
//  .attr("width", "1280")
//  .attr("preserveAspectRatio", "none");

svg.append("rect")
    .attr("class", "background")
    .attr("fill","none")
    .attr("width", "90%")
    .attr("height", "90%")
    .on("click", click);

var g = svg.append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2.5 + ")")
  .append("g")
    .attr("id", "states");

queue()
    .defer(d3.json, "data/ivorytop.json")
    .defer(d3.csv,"data/CallsByWeek.csv")
    .await(ready);

function ready(error, ivory, calls) {

  var callsById = {};
  calls.forEach(function(d) { callsById[d.id] = +d.W20; });        

  g.selectAll("path")
      .data(topojson.object(ivory, ivory.objects.ivory_with_id).geometries)
      .enter()
      .append("path")
      .attr("fill", function(d) { 
      return color(callsById[d.id]); })
      .attr("stroke", "black")
      .attr("d", path)
      .on("mouseover", onmouseover)
      .on("mouseout", onmouseout)
      .on("click", click);
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

function onmouseover(d, i) {
    var currClass = d3.select(this).attr("class");
    d3.select(this)
        .attr("stroke","orange")
        .attr("class", currClass + " current");
    var blurb = "<p>Prefecture ID "+d.id+" saw "+d.id+
    " total calls over this period. </p><br>";

    $("#default1").hide();
    $("#update1").html(blurb);
}

function onmouseout(d, i) {
    var currClass = d3.select(this).attr("class");
    var prevClass = currClass.substring(0, currClass.length-8);
    d3.select(this)
        .transition()
        .duration(200)
        .attr("stroke", "black")
        .attr("class", prevClass);

    $("#default1").show();
    $("#update1").html('');
}