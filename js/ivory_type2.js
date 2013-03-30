var width = 600,
    height = 600;

var radius = d3.scale.pow().exponent(.3333)
    .domain([0, 62782473])
    .range([0, 50]);


var azimuthal = d3.geo.azimuthalEqualArea()
    .scale(5000)
	.center([-3.75, 8.5]);
	
var path = d3.geo.path().projection(azimuthal);

var svg = d3.select("#type2").append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", "0 0 800 800")
    .style("align","top");
    

var sous_pre = svg.append("svg:g")
    .attr("id", "sous_pre");

var circles = svg.append("svg:g")
    .attr("id", "circles");

var cells = svg.append("svg:g")
    .attr("id", "cells");

d3.select("input[type=checkbox]").on("change", function() {
  cells.classed("voronoi", this.checked);
});
   

queue()
    .defer(d3.json, "data/ivorytop.json")
    .defer(d3.json, "data/Monthlycalls.json")
    .await(ready);

function ready(error, ivory, centroid) {
    
    sous_pre.selectAll("path") 
      		.data(topojson.object(ivory, ivory.objects.ivory_with_id).geometries)
      		.enter()
      		.append("svg:path")
            .style("fill", function(d){
      	     if(d.id==32 || d.id==38 || d.id==49 || d.id==51 || d.id==72 || d.id==81 || d.id==83 || d.id==87 || d.id==88 || d.id==98 || d.id==105 || d.id==111 || d.id==112 || d.id==135 || d.id==136 || d.id==221 || d.id==239 || d.id==245 ){
             return "url(#pattern)";}
             else{
             return "white";} })
            .style("stroke-width", 0.25)
            .style("stroke", "black")
            .attr("d", path);
}

d3.csv("data/sp_pairs_type2.csv", function(flights) {
  var linksByOrigin = {},
      countByAirport = {},
      locationByAirport = {},
      positions = [],
      ColorById = {};
      
 // Initializing variable
  var arc = d3.geo.greatArc()
      .source(function(d) { return locationByAirport[d.source]; })
      .target(function(d) { return locationByAirport[d.target]; });

  flights.forEach(function(flight) {
    
    var origin = flight.origin,
        destination = flight.destination,
        links = linksByOrigin[origin] || (linksByOrigin[origin] = []); // and
    links.push({source: origin, target: destination});
    console.log(links)
    countByAirport[origin] = (countByAirport[origin] || 0) + 1;
    countByAirport[destination] = (countByAirport[destination] || 0) + 1;  	
    //console.log(countByAirport[origin]);
  	//console.log(locationByAirport);
  
  });

 d3.csv("data/Calls_UT2.csv", function(airports) {
 
 
 
    // Only consider airports with at least one flight.
    airports = airports.filter(function(airport) {
      if (countByAirport[airport.id]) {
        var location = [+airport.longitude, +airport.latitude];
        locationByAirport[airport.id] = location;
        positions.push(azimuthal(location));
        return true;
      }
    });

    // Compute the Voronoi diagram of airports' projected positions.
    
    
    var polygons = d3.geom.voronoi(positions);

    var g = cells.selectAll("g")
        .data(airports)
        .enter()
        .append("svg:g");
        
// Voroni paths
     g.append("svg:path")
         .attr("class", "cell")
         .attr("d", function(d, i) { return "M" + polygons[i].join("L") + "Z"; })
         .on("mouseover", function(d, i) { d3.select("h2 span").text(d.name); });

    g.selectAll("path.arc")
        .data(function(d) { return linksByOrigin[d.id] || []; })
        .enter()
        .append("svg:path")
        .attr("class", "arc")
        .attr("d", function(d) { return path(arc(d)); });

     circles.selectAll("circle")
         .data(airports)
         .enter()
         .append("svg:circle")
         .attr("cx", function(d, i) { return positions[i][0]; })
         .attr("cy", function(d, i) { return positions[i][1]; })
         .attr("r", function(d, i) { return Math.sqrt(countByAirport[d.id]); })
         .attr("fill_opacity", 0.9)
         .sort(function(a, b) { return countByAirport[b.id] - countByAirport[a.id]; });
     
  });



});