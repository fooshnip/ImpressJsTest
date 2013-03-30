var width = 700,
    height = 1000;

var color = d3.scale.linear()
    .domain([0, 46257, 423085.8, 952170.0, 321738925.0])
    .range(["#f0ffe9", "#b0fe8b", "#8afc53" ,"#6ecb41" ,"#5cab36"]);


var map = d3.geo.azimuthalEqualArea()
		.scale(5000)
		.center([-3.75, 8.00]);

var path = d3.geo.path().projection(map);


var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height);

queue()
    .defer(d3.json, "data/ivorytop.json")
    .defer(d3.csv, "data/CallsByWeek.csv")
    .await(ready);

function ready(error, ivory, calls) {
  var callsById = {};
  
  calls.forEach(function(d) { callsById[d.id] = +d.W15; });
  console.log(callsById);

svg.selectAll("path")
      .data(topojson.object(ivory, ivory.objects.ivory_with_id).geometries)
      .enter()
      .append("path")
      .attr("class", "sp")
      .style("fill", function(d) { 
      return color(callsById[d.id]); })
      .attr("stroke", "gray")
      .attr("d", path)
      .append("svg:title")
      .text(function(d){
      return "Sous-prefecture "+d.id+" had "+callsById[d.id]+" calls during this period."
      })
      .attr("font-size", 20);
            
          

d3.select("p")
	  .on("click", function() {

	   var callsById = {};
       calls.forEach(function(d) { callsById[d.id] = +d.W16; });
       console.log(callsById);
       
       svg.selectAll("path")
      .data(topojson.object(ivory, ivory.objects.ivory_with_id).geometries)
      .transition()
      .duration(5000)
      .delay()
      .ease()
      .attr("class", "sp")
      .style("fill", function(d) { 
      if(callsById[d.id]){
      return color(callsById[d.id]);
      }
      else{
      return "white"} })
      .attr("stroke", "grey")
      .attr("d", path)
      .append("svg:title")
      .text(function(d){
      return "Sous-prefecture "+d.id+" had "+callsById[d.id]+" calls during this period."
       })
      .attr("font-size", 20);
       
       });
}







// draw a legend
// function drawLegend(element, qMin, qMax) {
//     
//     // create a new group with the specific base color and add the lower value
//     d3.select(element)
//         .append("g")
//         .attr("id", "legenda")
//         .attr("class", appConstants.COLORBASE)
//         .append("text")
//         .attr("x", "20")
//         .attr("y", "40")
//         .text("Min: " + Math.round(qMin*100)/100);
//  
//     // add the various blocks of the legenda
//     d3.select(element)
//         .select("#legenda")
//         .selectAll("rect")
//         .data(d3.range(0, 8))
//         .enter()
//         .append("rect")
//         .attr("width", "20")
//         .attr("height", "20")
//         .attr("y", "0")
//         .attr("class", function (d, i) {
//             return "q" + i + "-9";
//             })
//         .attr("x", function (d, i) {
//                 return (i + 1) * 20;
//         });
//  
//         // add a text element
//         d3.select(element).select("#legenda").append("text")
//         .attr("x", "140").attr("y", "40").text("Max: " + Math.round(qMax*100)/100)
// }