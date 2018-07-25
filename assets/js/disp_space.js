// Setup plot location and dimensions
// Setup margins
var spacePlotMargin = {
top: 20,
right: 200,
bottom: 80,
left: 80
}
;

// Setup plot dimensions
var spacePlotWidth = 1112 - spacePlotMargin.left - spacePlotMargin.right;
var spacePlotHeight = 556 - spacePlotMargin.top - spacePlotMargin.bottom;

// Setup plot space
var spacePlotSVG = d3.select("#spaceContainer")
.append("svg")
.attr("id", "spacePlot")
.attr("width", spacePlotWidth + spacePlotMargin.left + spacePlotMargin.right)
.attr("height", spacePlotHeight + spacePlotMargin.top + spacePlotMargin.bottom)
;

// Setup main plot object
var spacePlot = spacePlotSVG
.append("g")
.classed("chart", true)
.attr("transform", "translate(" + spacePlotMargin.left + "," + spacePlotMargin.top + ")")
;

// Setup x scale (RA)
var spacePlotXScale = d3.scale.linear()
.domain([0, 360])
.range([0, spacePlotWidth])
;

// Setup y scale (Dec)
var spacePlotYScale = d3.scale.linear()
.domain([-90, 90])
.range([spacePlotHeight, 0])
;

// Setup z (colors)
var spacePlotZObj = {
    "Imaging" : "#1f77b4",
    "Microlensing" : "#ff7f0e",
    "Radial Velocity" : "#2ca02c",
    "Transit" : "#d62728",
    "Other" : "#9467bd"};
var spacePlotZ = [
                  "#1f77b4",
                  "#ff7f0e",
                  "#2ca02c",
                  "#d62728",
                  "#9467bd"
                  ];

// Set initial data index
var spacePlotYear = 2018;
var spacePlotAnnotationsFlag = true;

// Define x-axis
var spacePlotXAxisDef = d3.svg.axis()
.scale(spacePlotXScale)
.orient("bottom")
.ticks(20)
.tickSize(-spacePlotHeight, 0, 0)
;

// Define y-axis
var spacePlotYAxisDef = d3.svg.axis()
.scale(spacePlotYScale)
.orient("left")
.ticks(20)
.tickSize(-spacePlotWidth, 0, 0)
.tickFormat( function(d) { return d; } )
;

// Draw x-axis
var spacePlotXAxis = spacePlot
.append("g")
.attr("class", "x axis")
.attr("transform", "translate(0," + spacePlotHeight + ")")
.call(spacePlotXAxisDef)
.selectAll("text")
.attr("x", 9)
.attr("y", 0)
.attr("dy", ".35em")
.attr("transform", "rotate(90)")
.style("text-anchor", "start")
;

// Draw x-axis label
spacePlot.select(".x.axis")
.append("text")
.attr("x", 0)
.attr("y", 0)
.style("text-anchor", "middle")
.attr("transform", "translate(" + spacePlotWidth / 2 + ", 75)")
.text("Right Ascension (degrees)");

// Draw y-axis
var spacePlotYAxis = spacePlot
.append("g")
.attr("class", "y axis")
.call(spacePlotYAxisDef)
;

// Draw y-axis label
spacePlot.select(".y.axis")
.append("text")
.attr("x", 0)
.attr("y", 0)
.style("text-anchor", "middle")
.attr("transform", "translate(-50, " + spacePlotHeight / 2 + ") rotate(-90)")
.text("Declination (degrees)")
;

// Draw border
spacePlot.append("rect")
.attr("x", 0)
.attr("y", 0)
.attr("width", spacePlotWidth)
.attr("height", spacePlotHeight)
.style("stroke", "#000000")
.style("fill", "none")
.style("stroke-width", 1)
;

// Draw legend title (method)
var spacePlotLegendMethodTitle = spacePlot.append("text")
.attr("x", spacePlotWidth + 5)
.attr("y", 18)
.attr("text-anchor", "start")
.style("text-decoration", "underline")
.text("Discovery Method")
;

// Draw legend base (method)
var spacePlotLegendMethod = spacePlotSVG.selectAll(".legendMethod")
.data(spacePlotZ)
.enter()
.append("g")
.attr("class", "legend")
.attr("transform", function(d, i) { return "translate(105, " + (45 + i * 19) + ")"; })
;

// Draw legend color patches (method)
spacePlotLegendMethod.append("rect")
.attr("x", spacePlotWidth - 18)
.attr("width", 18)
.attr("height", 18)
.style("fill", function(d, i) {return spacePlotZ.slice()[i];})
;

// Draw legend text (method)
spacePlotLegendMethod.append("text")
.attr("x", spacePlotWidth + 5)
.attr("y", 9)
.attr("dy", ".35em")
.style("text-anchor", "start")
.text(function(d, i) {
      switch (i) {
      case 0: return "Imaging";
      case 1: return "Microlensing";
      case 2: return "Radial Velocity";
      case 3: return "Transit";
      case 4: return "Other";
      }
      })
;

// Setup tooltip
var spacePlotTooltip = spacePlotSVG
.append("g")
.attr("class", "tooltip")
.style("display", "none")
;

// Setup tooltip rectangle
spacePlotTooltip
.append("rect")
.attr("width", 120)
.attr("height", 20)
.attr("fill", "white")
.style("opacity", 0.5)
;

// Setup tooltip text
spacePlotTooltip
.append("text")
.attr("x", 60)
.attr("dy", "0.9em")
.style("text-anchor", "middle")
.attr("font-size", "18px")
.attr("font-weight", "bold")
;

// Setup slider handler
d3.select("#spaceSlider")
.on("input", function () {
    var currentValue = this.value;
    var sliderText = "Showing exoplanet discoveries from 1989"
    if ( currentValue > 1989 ) {
        sliderText = sliderText + " through " + currentValue
    }
    document.getElementById("spaceSliderSelected").innerHTML=sliderText;
    plotSpace(currentValue);
    })
;

// Setup Annotations On button
var spacePlotAnnotationsOnButton = d3.select("#spaceAnnotationsButtons")
.append("button")
.attr("id", "spacePlotAnnotationsOnButton")
.attr("class", "button")
.attr("type", "button")
.attr("value", "Annotations On")
.style("font-size", "16px")
.text("Annotations On")
.on("click", function(d) { plotSpaceAnnotations(true, spacePlotYear); })
;

// Setup Annotations Off button
var spacePlotAnnotationsOffButton = d3.select("#spaceAnnotationsButtons")
.append("button")
.attr("id", "spacePlotAnnotationsOffButton")
.attr("class", "button")
.attr("type", "button")
.attr("value", "Annotations Off")
.style("font-size", "16px")
.text("Annotations Off")
.on("click", function(d) { plotSpaceAnnotations(false, spacePlotYear); })
;

function plotSpace(year) {

    // Show/hide annotations
    plotSpaceAnnotations(spacePlotAnnotationsFlag, year);

    // Remove previous plot
    spacePlot
    .selectAll(".dot")
    .remove()
    ;
    
    // Select data based on input year
    var currentData = [];
    data.forEach(
                 function(currentValue, index, arr) {
                 if ( currentValue.pl_disc <= year ) {
                 currentData.push(currentValue);
                 }
                 }
                 )
    
    // Plot data
    spacePlot.selectAll(".dot")
    .data(currentData)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("r", 2)
    .attr("cx", function(d) { return spacePlotXScale(d.ra) })
    .attr("cy", function(d) { return spacePlotYScale(d.dec) })
    .style("fill", function(d, i) { return spacePlotZObj[d.pl_discmethod]; })
    .on("mouseover", function() { spacePlotTooltip.style("display", null); })
    .on("mouseout", function() { spacePlotTooltip.style("display", "none"); })
    .on("mousemove", function(d) {
        var xPosition = d3.mouse(this)[0] + 20;
        var yPosition = d3.mouse(this)[1] + 40;
        spacePlotTooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
        spacePlotTooltip.select("text").text(d.pl_hostname);
        })
    ;
    
    spacePlotYear = year;
}

// Setup annotation #0
var spacePlotAnnotations0Text = ["Since its launch in 2009,",
                                 "the Kepler space observatory",
                                 "has discovered more exoplanets",
                                 "than any other mission to date."]

spacePlot
.append("rect")
.attr("id", "spacePlotAnnotations0Box")
.attr("x", spacePlotXScale(20))
.attr("y", spacePlotYScale(80))
.attr("width", spacePlotXScale(150))
.attr("height", spacePlotYScale(30))
.attr("fill", "gray")
.style("display", "none")
.style("opacity", 0.5)
;

spacePlot
.append("text")
.attr("id", "spacePlotAnnotations00")
.attr("x", spacePlotXScale(30))
.attr("y", spacePlotYScale(70))
.style("text-anchor", "start")
.style("font-size", "24px")
.style("display", "none")
.attr("dy", "0em")
.text(spacePlotAnnotations0Text[0])
;

spacePlot
.append("text")
.attr("id", "spacePlotAnnotations01")
.attr("x", spacePlotXScale(30))
.attr("y", spacePlotYScale(70))
.style("text-anchor", "start")
.style("font-size", "24px")
.style("display", "none")
.attr("dy", "1.5em")
.text(spacePlotAnnotations0Text[1])
;

spacePlot
.append("text")
.attr("id", "spacePlotAnnotations02")
.attr("x", spacePlotXScale(30))
.attr("y", spacePlotYScale(70))
.style("text-anchor", "start")
.style("font-size", "24px")
.style("display", "none")
.attr("dy", "3em")
.text(spacePlotAnnotations0Text[2])
;

spacePlot
.append("text")
.attr("id", "spacePlotAnnotations03")
.attr("x", spacePlotXScale(30))
.attr("y", spacePlotYScale(70))
.style("text-anchor", "start")
.style("font-size", "24px")
.style("display", "none")
.attr("dy", "4.5em")
.text(spacePlotAnnotations0Text[3])
;

// Setup annotation #1
var spacePlotAnnotations1Text = ["Kepler field"]

spacePlot
.append("text")
.attr("id", "spacePlotAnnotations10")
.attr("x", spacePlotXScale(290))
.attr("y", spacePlotYScale(55))
.style("text-anchor", "middle")
.style("font-size", "24px")
.style("display", "none")
.style("font-weight", "bold")
.attr("dy", "0em")
.text(spacePlotAnnotations1Text[0])
;

// Plot annotations function (for Space section)
function plotSpaceAnnotations(annotationsFlag, year) {
    if ( true == annotationsFlag ) {
        d3.select("#spaceAnnotationsButtons")
        .select("#spacePlotAnnotationsOnButton")
        .style("background-color", "lightblue")
        d3.select("#spaceAnnotationsButtons")
        .select("#spacePlotAnnotationsOffButton")
        .style("background-color", "white")
        
        if ( year >= 2009 ) {
            spacePlot.select("#spacePlotAnnotations0Box").style("display", null);
            spacePlot.select("#spacePlotAnnotations00").style("display", null);
            spacePlot.select("#spacePlotAnnotations01").style("display", null);
            spacePlot.select("#spacePlotAnnotations02").style("display", null);
            spacePlot.select("#spacePlotAnnotations03").style("display", null);
        }
        else {
            spacePlot.select("#spacePlotAnnotations0Box").style("display", "none");
            spacePlot.select("#spacePlotAnnotations00").style("display", "none");
            spacePlot.select("#spacePlotAnnotations01").style("display", "none");
            spacePlot.select("#spacePlotAnnotations02").style("display", "none");
            spacePlot.select("#spacePlotAnnotations03").style("display", "none");
        }
        
        if ( year >= 2014 ) {
            spacePlot.select("#spacePlotAnnotations10").style("display", null);
        }
        else {
            spacePlot.select("#spacePlotAnnotations10").style("display", "none");
        }
    }
    else {
        d3.select("#spaceAnnotationsButtons")
        .select("#spacePlotAnnotationsOnButton")
        .style("background-color", "white")
        d3.select("#spaceAnnotationsButtons")
        .select("#spacePlotAnnotationsOffButton")
        .style("background-color", "lightblue")
        
        spacePlot.select("#spacePlotAnnotations0Box").style("display", "none");
        spacePlot.select("#spacePlotAnnotations00").style("display", "none");
        spacePlot.select("#spacePlotAnnotations01").style("display", "none");
        spacePlot.select("#spacePlotAnnotations02").style("display", "none");
        spacePlot.select("#spacePlotAnnotations03").style("display", "none");

        spacePlot.select("#spacePlotAnnotations10").style("display", "none");
    }
    
    spacePlotAnnotationsFlag = annotationsFlag;
}

// Draw initial plot
plotSpace(spacePlotYear)
