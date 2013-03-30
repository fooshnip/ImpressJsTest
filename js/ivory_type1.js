var width = 600,
    height = 600;

var radius = d3.scale.pow().exponent(1/3)
    .domain([0, 2924])
    .range([0, 15]);

var azimuthal = d3.geo.azimuthalEqualArea()
		.scale(5000)
		.center([-3.75, 8.5]);

var path = d3.geo.path().projection(azimuthal);

var svg = d3.select("#main").append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", "0 0 800 800")
    .style("align","top")
    .style("align","center");

queue()
    .defer(d3.json, "data/ivorytop.json")
    .defer(d3.json, "data/UsersT1.json")
    .await(ready);


function ready(error, ivory, centroid) {
    
    svg.selectAll("path")
      .attr("class", "prefecture")   
      .data(topojson.object(ivory, ivory.objects.ivory_with_id).geometries)
      .enter()
      .append("path")
      .style("fill", function(d){
      	if(d.id==32 || d.id==38 || d.id==49 || d.id==51 || d.id==72 || d.id==81 || d.id==83 || d.id==87 || d.id==88 || d.id==98 || d.id==105 || d.id==111 || d.id==112 || d.id==135 || d.id==136 || d.id==221 || d.id==239 || d.id==245 ){
          return "url(#pattern)";}
          else{
          return "white";} })
      .attr("d", path);

    svg.selectAll("circle")
      .data(centroid.features)
      .enter()
      .append("circle")
      .attr("fill","#8afc53")
      .attr("fill-opacity",.8)
      .attr("cy", function(d){
        console.log(d.geometry.coordinates)
        return azimuthal(d.geometry.coordinates)[1];
      })
      .attr("cx", function(d){
        return azimuthal(d.geometry.coordinates)[0];
      })
      .attr("r", function(d){
        return radius(d.Users);
      })
      .on("mouseover", function() {
        d3.select(this)
                .attr("fill", "#6ecb41")})
      .on("mouseout", function(d) {
        d3.select(this)
          .transition()
          .duration(500)
          .attr("fill", "#8afc53");})
}