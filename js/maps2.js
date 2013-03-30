////////////////////////////////////////////////////////// Total Map

var width = 630,
    height = 580,
    centered;

var color_g1 = d3.scale.linear()
    .range(["#d9fac9", "#d9fac9", "#b0fe8b", "#7ce54a", "#65bc3a", "#488c27", "#427a26", "#366f1a"]);

var map = d3.geo.azimuthalEqualArea()
    .scale(6600)
    .center([-6.2, 8.7])
    .translate([0, 0]);

var path = d3.geo.path().projection(map);   

var svglegend = d3.select("#legend").append("svg")
    .attr("width",400)
    .attr("height",40);

var svg = d3.select("#map").append("svg")
    .attr("width", "90%")
    .attr("height", "90%")
    .attr("viewBox", "0 0 800 800")
    .style("align","top")
    .style("align","center"); 

var title = d3.select("#weektitle");        

svg.append("rect")
    .attr("fill","none")
    .style("stroke","none")
    .attr("width", width)
    .attr("height", height)
    .on("mouseover", function onmouseout(d, i) {
      $("#default1").show();
      $("#update1").html('');
    });

var g = svg.append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
  .append("g");

// //legend
var rect1 = [1];

svglegend.selectAll("rect")
    .data(rect1)
    .enter()
    .append("rect")
    .attr("x", 0 )
    .attr("y", 0 )
    .attr("width", 200)
    .attr("height", 15)
    .style("stroke", "black")
    .style("stroke-width", 0.25)
    .style("fill", "url(#MyGradient)");

svglegend.append("text")
    .text(function() {
        return '0';
   })
    .attr("x", 0)
    .attr("y", 35);    

svglegend.append("text")
    .text(function() {
        return '300,000';
   })
    .attr("x", 160)
    .attr("y", 35);      

compareNumbers = function(a,b) {
  return a-b;
}


queue()
    .defer(d3.json, "data/ivorytop.json")
    .defer(d3.csv, "data/CallsByWeek2.csv")
    .defer(d3.csv, "data/Antenna.csv")
    .await(ready);  


function ready(error, ivory, calls, antennas) {

  weekvar = 18;
  var callsById = {};
  var callsCol = [];
  calls.forEach(function(d) { if (d.weeknum == weekvar) {callsById[d.id] = +d.value;}});
  calls.forEach(function(d) { if (d.weeknum == weekvar) {callsCol.push([d.value]);}});

  callsCol.sort(compareNumbers);

  max = d3.max(callsCol.sort(compareNumbers));
  min = d3.min(callsCol.sort(compareNumbers));
  color_g1.domain([0, 10000, 30000, 60000, 90000, 135000, 180000, 24000000, ]);

  title.append("h1")
      .text(function(d){return "Week " + weekvar;});

  g.selectAll("path")
      .data(topojson.object(ivory, ivory.objects.ivory_with_id).geometries)
      .enter()
      .append("path")
      .style("fill", function(d){ if(d.id == 60){
        return "#173a05";
      }
        else {
          return color_g1(callsById[d.id]);
      }})
      .attr("d", path)
      .on("click",click)
      .on("mouseover",onmouseover)
      .on("mouseout", onmouseout);

d3.select("#prevbutton")
      .on("click", previousButton);

d3.select("#nextbutton")
      .on("click", nextButton);

  function onmouseover(d, i) {
      var blurb = "<p>Prefecture ID "+d.id+" saw "+numberWithCommas(callsById[d.id])+
      " total calls over this period. </p>";

      $("#default1").hide();
      $("#update1").html(blurb);
    }  

  function onmouseout(d, i) {
      $("#default1").show();
      $("#update1").html('');
    }

  function click(d) {
    var x = 0,
        y = 0,
        k = 1;

    if (d && centered == null) {
      var centroid = path.centroid(d);
      x = -centroid[0];
      y = -centroid[1];
      k = 4;
      centered = d;

    g.selectAll("circle")
        .data(antennas)
        .enter()
        .append("circle")
        .attr("cy", function(d){
          return map([d.lat,d.lon])[1];
        })
        .attr("cx", function(d){
          return map([d.lat,d.lon])[0];  
        })
        .attr("pointer-events","none")
        .transition()
        .duration(2000)
        .ease("linear")
        .attr("fill","black")
        .attr("fill-opacity",.8)
        .attr("r", 0.75);

    } else {
      centered = null;
      g.selectAll("circle")
      .transition()
      .duration(1500)
      .attr("r", 0)
      .remove();
    }

    g.transition()
        .duration(2000)
        .ease("sqrt")
        .attr("transform", "scale(" + k + ")translate(" + x + "," + y + ")")
        .style("stroke-width", 1.5 / k + "px");      
  }

    function previousButton(d){

      if(weekvar > 1) {
        weekvar = weekvar-1;
      } else {weekvar = 1; alert('Please select the next week.');};
        
      calls.forEach(function(d) { 
        if (d.weeknum == weekvar) 
          {callsById[d.id] = +d.value;}
      });

      calls.forEach(function(d) { 
        if (d.weeknum == weekvar) 
          {callsCol.push([d.value]);
          }
      });

    d3.select("#weektitle")
      .append("h3")
      .remove('h3')
      .data(calls)
      .text(function(d){return "Week " + weekvar;});

    title.exit().remove();

    g.selectAll("path")
      .data(topojson.object(ivory, ivory.objects.ivory_with_id).geometries)
      .enter()
      .append("path")
      .transition()
      .duration(250)
      .style("fill", function(d){ if(d.id == 60){
        return "#173a05";
      }
        else {
          return color_g1(callsById[d.id]);
      }})
      .attr("d", path); 

  }  

    function nextButton(d){

      if(weekvar < 22) {
        weekvar = weekvar+1;
      } else {weekvar = 22; alert('Please select the previous week.');};
        
      calls.forEach(function(d) { 
        if (d.weeknum == weekvar) 
          {callsById[d.id] = +d.value;}
      });

      calls.forEach(function(d) { 
        if (d.weeknum == weekvar) 
          {callsCol.push([d.value]);
          }
      });

    d3.select("#weektitle")
      .append("h1")
      .remove()
      .data(calls)
      .text(function(d){return "Week " + weekvar;});

    g.selectAll("path")
      .data(topojson.object(ivory, ivory.objects.ivory_with_id).geometries)
      .enter()
      .append("path")
      .transition()
      .duration(250)
      .style("fill", function(d){ if(d.id == 60){
        return "#173a05";
      }
        else {
          return color_g1(callsById[d.id]);
      }})
      .attr("d", path); 

  }   

}
////////////////////////////////////////////////////////// Total Calls

var margin = {top: 30, right: 30, bottom: 30, left: 70},
    width1 = 500 - margin.left - margin.right,
    height1 = 250 - margin.top - margin.bottom;


var x = d3.scale.ordinal()
    .rangeRoundBands([0, width1-20], .3, 0.2);
    
var y = d3.scale.linear()
    .range([height1, 0]);


var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");


var svg1 = d3.select("#total").append("svg")
    .attr("width", '100%')
    .attr("height", '100%')
    .attr("viewBox", "0 0 400 700")
    .style("align","top")
    .style("align","left")
    .append("g")
    .attr("transform", "translate(" + 0 + "," + margin.top + ")");

d3.csv("data/Total_Calls_Week.csv", function(error, data) {

    data.forEach(function(d) {
    d.calls = +d.calls/1000000;
  });
	
  x.domain(data.map(function(d) { return d.week; }));
  y.domain([0, d3.max(data, function(d) { return d.calls; })]);


  svg1.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height1 + ")")
      .call(xAxis);

  svg1.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -40)
      .attr("x", -140)
      .attr("dy", ".71em");

    svg1.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.week); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.calls); })
      .attr("height", function(d) { return height1 - y(d.calls); });
});

function numberWithCommas(x) {
   return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

