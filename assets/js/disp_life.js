// Setup plot location and dimensions
// Setup margins
var lifePlotMargin = {
top: 20,
right: 200,
bottom: 80,
left: 80
}
;

// Setup plot dimensions
var lifePlotWidth = 1112 - lifePlotMargin.left - lifePlotMargin.right;
var lifePlotHeight = 556 - lifePlotMargin.top - lifePlotMargin.bottom;

// Setup plot life
var lifePlotSVG = d3.select("#lifeContainer")
.append("svg")
.attr("id", "lifePlot")
.attr("width", lifePlotWidth + lifePlotMargin.left + lifePlotMargin.right)
.attr("height", lifePlotHeight + lifePlotMargin.top + lifePlotMargin.bottom)
;

// Setup plot
var lifePlot = lifePlotSVG.append("g")
.classed("chart", true)
.attr("transform", "translate(" + lifePlotMargin.left + "," + lifePlotMargin.top + ")")
;

// Set x
var lifePlotXMin = d3.min(dataLife, function(d) { return d.st_mass }) * 0.8;
var lifePlotXMax = d3.max(dataLife, function(d) { return d.st_mass }) / 0.8;
var lifePlotXScale = d3.scale.log()
.domain([lifePlotXMin, lifePlotXMax])
.range([0, lifePlotWidth])
;

// Set y
var lifePlotYMin = d3.min(dataLife, function(d) { return d.pl_orbsmax }) * 0.8;
var lifePlotYMax = d3.max(dataLife, function(d) { return d.pl_orbsmax }) / 0.8;
var lifePlotYScale = d3.scale.log()
.domain([lifePlotYMin, lifePlotYMax])
.range([lifePlotHeight, 0])
;

// Set r
var lifePlotRScale = d3.scale.log()
.domain([1, 10000])
.range([2, 6])
;


// Set z (colors)
var lifePlotZObj = {
    "Imaging" : "#1f77b4",
    "Microlensing" : "#ff7f0e",
    "Radial Velocity" : "#2ca02c",
    "Transit" : "#d62728",
    "Other" : "#9467bd"};

// Set z (colors)
var lifePlotZ = [
                 "#1f77b4",
                 "#ff7f0e",
                 "#2ca02c",
                 "#d62728",
                 "#9467bd"
                 ];

// Set initial data index
var lifePlotPlanetMass = 10000;
var lifePlotAnnotationsFlag = true;

// Define x-axis
var lifePlotXAxisDef = d3.svg.axis()
.scale(lifePlotXScale)
.orient("bottom")
.ticks(5, ",.1r")
.tickSize(-lifePlotHeight, 0, 0)
;

// Define y-axis
var lifePlotYAxisDef = d3.svg.axis()
.scale(lifePlotYScale)
.orient("left")
.ticks(5, ",.1r")
.tickSize(-lifePlotWidth, 0, 0)
;

// Draw x-axis
var lifePlotXAxis = lifePlot
.append("g")
.attr("class", "x axis")
.attr("transform", "translate(0," + lifePlotHeight + ")")
.call(lifePlotXAxisDef)
;

// Draw x-axis label
lifePlot.select(".x.axis")
.append("text")
.attr("x", 0)
.attr("y", 0)
.style("text-anchor", "middle")
.attr("transform", "translate(" + lifePlotWidth / 2 + ", 50)")
.text("Host Star Mass (solar masses)");

// Draw y-axis
var lifePlotYAxis = lifePlot
.append("g")
.attr("class", "y axis")
.call(lifePlotYAxisDef)
;

// Draw y-axis label
lifePlot.select(".y.axis")
.append("text")
.attr("x", 0)
.attr("y", 0)
.style("text-anchor", "middle")
.attr("transform", "translate(-50, " + lifePlotHeight / 2 + ") rotate(-90)")
.text("Orbital Semi-Major Axis (AU)")
;

// Draw border
lifePlot.append("rect")
.attr("x", 0)
.attr("y", 0)
.attr("width", lifePlotWidth)
.attr("height", lifePlotHeight)
.style("stroke", "#000000")
.style("fill", "none")
.style("stroke-width", 1)
;

// Draw legend title (method)
var lifePlotLegendMethodTitle = lifePlot.append("text")
.attr("x", lifePlotWidth + 5)
.attr("y", 18)
.attr("text-anchor", "start")
.style("text-decoration", "underline")
.text("Discovery Method")
;

// Draw legend base (method)
var lifePlotLegendMethod = lifePlotSVG.selectAll(".legendMethod")
.data(lifePlotZ)
.enter()
.append("g")
.attr("class", "legend")
.attr("transform", function(d, i) { return "translate(105, " + (45 + i * 19) + ")"; })
;

// Draw legend color patches (method)
lifePlotLegendMethod.append("rect")
.attr("x", lifePlotWidth - 18)
.attr("width", 18)
.attr("height", 18)
.style("fill", function(d, i) {return lifePlotZ.slice()[i];})
;

// Draw legend text (method)
lifePlotLegendMethod.append("text")
.attr("x", lifePlotWidth + 5)
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

// Draw legend title (planet mass)
var lifePlotLegendMassTitle = lifePlot
.append("text")
.attr("x", lifePlotWidth + 5)
.attr("y", lifePlotHeight - 105)
.attr("text-anchor", "start")
.style("text-decoration", "underline")
.text("Planet mass (Earths)")
;

var lifePlotDataLegendMass

// Draw legend base (planet mass)
var lifePlotLegendMass = lifePlotSVG.selectAll(".legendMass")
.data(lifePlotZ)
.enter()
.append("g")
.attr("class", "legend")
.attr("transform", function(d, i) { return "translate(105, " + (lifePlotHeight - 76 + i * 19) + ")"; })
;

// Draw legend symbols (planet mass)
lifePlotLegendMass.append("circle")
.attr("r", function(d, i) { return 6 - i; })
.attr("cx", lifePlotWidth + 20)
.attr("cy", 10)
.style("fill", 0)
;

// Draw legend text (planet mass)
lifePlotLegendMass.append("text")
.attr("x", lifePlotWidth + 35)
.attr("y", 9)
.attr("dy", ".35em")
.style("text-anchor", "start")
.text(function(d, i) {
      switch (i) {
      case 0: return "10000";
      case 1: return "1000";
      case 2: return "100";
      case 3: return "10";
      case 4: return "1";
      }
      })
;

// Draw legend title (HZ)
var lifePlotLegendHZTitle = lifePlot
.append("text")
.attr("x", lifePlotWidth + 5)
.attr("y", lifePlotHeight - 260)
.attr("text-anchor", "start")
.style("text-decoration", "underline")
.text("Habitable Zone")
;

var lifePlotDataLegendHZLine = [
                           {
                           "x" : 0,
                           "y" : 0
                           }
                           ,
                           {
                           "x" : 18,
                           "y" : 0
                           }
                           ]
;

// Draw legend line (HZ)
var lifePlotLegendHZLine = d3.svg.line()
.x(function (d) { return d.x; })
.y(function (d) { return d.y; })
.interpolate("basis")
;

// Draw legend base (HZ inner)
var lifePlotLegendHZ = lifePlotSVG.selectAll(".legendHZ")
.data([{"x" : 0, "y" : 0}])
.enter()
.append("g")
.attr("class", "legend")
.attr("transform", function(d, i) { return "translate(920, " + (lifePlotHeight - 220 + i * 19) + ")"; })
;

// Draw legend symbols (HZ inner)
lifePlotLegendHZ
.append("path")
.attr("id", "lifePlotLegendHZLine")
.attr("class", "line")
.attr("stroke", "black")
.attr("stroke-width", 2)
.attr("stroke-dasharray", ("2, 2"))
.attr("d", lifePlotLegendHZLine(lifePlotDataLegendHZLine))
;

// Draw legend text (HZ inner)
lifePlotLegendHZ.append("text")
.attr("x", 20)
.attr("y", 0)
.attr("dy", ".35em")
.style("text-anchor", "start")
.text(function(d, i) {
      switch (i) {
      case 0: return "Inner radius";
      }
      })
;

// Draw legend base (HZ outer)
var lifePlotLegendHZ = lifePlotSVG.selectAll(".legendHZ")
.data([{"x" : 0, "y" : 0}])
.enter()
.append("g")
.attr("class", "legend")
.attr("transform", function(d, i) { return "translate(920, " + (lifePlotHeight - 201 + i * 19) + ")"; })
;

// Draw legend symbols (HZ outer)
lifePlotLegendHZ
.append("path")
.attr("id", "lifePlotLegendHZLine")
.attr("class", "line")
.attr("stroke", "black")
.attr("stroke-width", 2)
.attr("stroke-dasharray", ("5, 5"))
.attr("d", lifePlotLegendHZLine(lifePlotDataLegendHZLine))
;

// Draw legend text (HZ outer)
lifePlotLegendHZ.append("text")
.attr("x", 20)
.attr("y", 0)
.attr("dy", ".35em")
.style("text-anchor", "start")
.text(function(d, i) {
      switch (i) {
      case 0: return "Outer radius";
      }
      })
;

// Setup tooltip
var lifePlotTooltip = lifePlotSVG
.append("g")
.attr("class", "tooltip")
.style("display", "none")
;

// Setup tooltip rectangle
lifePlotTooltip
.append("rect")
.attr("width", 120)
.attr("height", 30)
.attr("fill", "white")
.style("opacity", 0.5)
;

// Setup tooltip text
lifePlotTooltip
.append("text")
.attr("x", 60)
.attr("dy", "1.2em")
.style("text-anchor", "middle")
.attr("font-size", "18px")
.attr("font-weight", "bold")
;

// Setup slider handler
d3.select("#lifeSlider")
.on("input", function () {
    var currentValue = this.value;
    var sliderText = "Showing exoplanets up to " + Math.pow(10, currentValue * 0.001).toFixed(2) + " Earth masses"
    document.getElementById("lifeSliderSelected").innerHTML=sliderText;
    plotLife(Math.pow(10, currentValue * 0.001));
    })
;

// Setup Annotations On button
var lifePlotAnnotationsOnButton = d3.select("#lifeAnnotationsButtons")
.append("button")
.attr("id", "lifePlotAnnotationsOnButton")
.attr("class", "button")
.attr("type", "button")
.attr("value", "Annotations On")
.style("font-size", "16px")
.text("Annotations On")
.on("click", function(d) { plotLifeAnnotations(true, lifePlotPlanetMass); })
;

// Setup Annotations Off button
var lifePlotAnnotationsOffButton = d3.select("#lifeAnnotationsButtons")
.append("button")
.attr("id", "lifePlotAnnotationsOffButton")
.attr("class", "button")
.attr("type", "button")
.attr("value", "Annotations Off")
.style("font-size", "16px")
.text("Annotations Off")
.on("click", function(d) { plotLifeAnnotations(false, lifePlotPlanetMass); })
;

// Setup habitable zone inner radius
var lineHZInner = d3.svg.line()
.x(function (d) { return lifePlotXScale(d.st_mass); })
.y(function (d) { return lifePlotYScale(d.pl_horbin); })
.interpolate("basis")
;

// Setup habitable zone outer radius
var lineHZOuter = d3.svg.line()
.x(function (d) { return lifePlotXScale(d.st_mass); })
.y(function (d) { return lifePlotYScale(d.pl_horbout); })
.interpolate("basis")
;

function plotLifeHZ() {

    // Trim HZ line
    var currentDataInner = [];
    var currentDataOuter = [];
    dataHZ.forEach(
                   function(currentValue, index, arr) {
                   if ( lifePlotXScale(currentValue.st_mass) < lifePlotWidth &&
                       lifePlotXScale(currentValue.st_mass) > 0 ) {
                   if ( lifePlotYScale(currentValue.pl_horbin) < lifePlotHeight &&
                       lifePlotYScale(currentValue.pl_horbin) > 0) {
                   currentDataInner.push(currentValue);
                   }
                   if ( lifePlotYScale(currentValue.pl_horbout) < lifePlotHeight &&
                       lifePlotYScale(currentValue.pl_horbout) > 0) {
                   currentDataOuter.push(currentValue);
                   }
                   }
                   }
    )
    
    // Plot HZ inner radius
    lifePlot
    .append("path")
    .attr("id", "lifePlotHZInner")
    .attr("class", "line")
    .attr("stroke", "black")
    .attr("stroke-width", 2)
    .attr("stroke-dasharray", ("2, 2"))
    .attr("d", lineHZInner(currentDataInner))
    ;

    // Plot HZ outer radius
    lifePlot
    .append("path")
    .attr("id", "lifePlotHZOuter")
    .attr("class", "line")
    .attr("stroke", "black")
    .attr("stroke-width", 2)
    .attr("stroke-dasharray", ("5, 5"))
    .attr("d", lineHZOuter(currentDataOuter))
    ;
}

function plotLife(planetMass) {

    // Show/hide annotations
    plotLifeAnnotations(lifePlotAnnotationsFlag, planetMass);

    // Remove previous plot
    lifePlot
    .selectAll(".dot")
    .remove()
    ;
    
    // Select data based on input planet mass
    var currentData = [];
    dataLife.forEach(
                     function(currentValue, index, arr) {
                     if ( currentValue.pl_bmasse <= planetMass ) {
                     currentData.push(currentValue);
                     }
                     }
                     )

    // Plot data
    lifePlot
    .selectAll(".dot")
    .data(currentData)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("r", function(d) { return lifePlotRScale(d.pl_bmasse); })
    .attr("cx", function(d) { return lifePlotXScale(d.st_mass); })
    .attr("cy", function(d) { return lifePlotYScale(d.pl_orbsmax); })
    .style("fill", function(d, i) { return lifePlotZObj[d.pl_discmethod]; })
    .on("mouseover", function() { lifePlotTooltip.style("display", null); })
    .on("mouseout", function() { lifePlotTooltip.style("display", "none"); })
    .on("mousemove", function(d) {
        var xPosition = d3.mouse(this)[0] + 20;
        var yPosition = d3.mouse(this)[1] + 40;
        lifePlotTooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
        lifePlotTooltip.select("text").text(d.pl_hostname + " " + d.pl_letter);
        })
    ;

    lifePlot
    .select("#lifePlotHZInner")
    .remove();

    lifePlot
    .select("#lifePlotHZOuter")
    .remove();

    plotLifeHZ();

    lifePlotPlanetMass = planetMass;
}

// Setup annotation #0
var lifePlotAnnotations0Text = ["Very few exoplanets with Earth-like",
                                "masses have been discovered so far,",
                                "but our technology and methods",
                                "are constantly improving."]

lifePlot
.append("rect")
.attr("id", "lifePlotAnnotations0Box")
.attr("x", lifePlotWidth * 0.04)
.attr("y", lifePlotHeight * 0.15)
.attr("width", lifePlotWidth * 0.44)
.attr("height", lifePlotHeight * 0.32)
.attr("fill", "gray")
.style("opacity", 0.5)
;

lifePlot
.append("text")
.attr("id", "lifePlotAnnotations00")
.attr("x", lifePlotWidth * 0.05)
.attr("y", lifePlotHeight * 0.2)
.style("text-anchor", "start")
.style("font-size", "24px")
.style("display", "none")
.attr("dy", "0em")
.text(lifePlotAnnotations0Text[0])
;

lifePlot
.append("text")
.attr("id", "lifePlotAnnotations01")
.attr("x", lifePlotWidth * 0.05)
.attr("y", lifePlotHeight * 0.2)
.style("text-anchor", "start")
.style("font-size", "24px")
.style("display", "none")
.attr("dy", "1.5em")
.text(lifePlotAnnotations0Text[1])
;

lifePlot
.append("text")
.attr("id", "lifePlotAnnotations02")
.attr("x", lifePlotWidth * 0.05)
.attr("y", lifePlotHeight * 0.2)
.style("text-anchor", "start")
.style("font-size", "24px")
.style("display", "none")
.attr("dy", "3em")
.text(lifePlotAnnotations0Text[2])
;

lifePlot
.append("text")
.attr("id", "lifePlotAnnotations03")
.attr("x", lifePlotWidth * 0.05)
.attr("y", lifePlotHeight * 0.2)
.style("text-anchor", "start")
.style("font-size", "24px")
.style("display", "none")
.attr("dy", "4.5em")
.text(lifePlotAnnotations0Text[3])
;

// Setup annotation #1
var lifePlotAnnotations1Text = ["From the clustering of discoveries",
                                "in this parameter space, different",
                                "methods are more sensitive to some",
                                "orbital parameters and host stars."]

lifePlot
.append("rect")
.attr("id", "lifePlotAnnotations1Box")
.attr("x", lifePlotWidth * 0.04)
.attr("y", lifePlotHeight * 0.15)
.attr("width", lifePlotWidth * 0.44)
.attr("height", lifePlotHeight * 0.32)
.attr("fill", "gray")
.style("opacity", 0.5)
;

lifePlot
.append("text")
.attr("id", "lifePlotAnnotations10")
.attr("x", lifePlotWidth * 0.05)
.attr("y", lifePlotHeight * 0.2)
.style("text-anchor", "start")
.style("font-size", "24px")
.style("display", "none")
.attr("dy", "0em")
.text(lifePlotAnnotations1Text[0])
;

lifePlot
.append("text")
.attr("id", "lifePlotAnnotations11")
.attr("x", lifePlotWidth * 0.05)
.attr("y", lifePlotHeight * 0.2)
.style("text-anchor", "start")
.style("font-size", "24px")
.style("display", "none")
.attr("dy", "1.5em")
.text(lifePlotAnnotations1Text[1])
;

lifePlot
.append("text")
.attr("id", "lifePlotAnnotations12")
.attr("x", lifePlotWidth * 0.05)
.attr("y", lifePlotHeight * 0.2)
.style("text-anchor", "start")
.style("font-size", "24px")
.style("display", "none")
.attr("dy", "3em")
.text(lifePlotAnnotations1Text[2])
;

lifePlot
.append("text")
.attr("id", "lifePlotAnnotations13")
.attr("x", lifePlotWidth * 0.05)
.attr("y", lifePlotHeight * 0.2)
.style("text-anchor", "start")
.style("font-size", "24px")
.style("display", "none")
.attr("dy", "4.5em")
.text(lifePlotAnnotations1Text[3])
;

// Plot annotations function (for life section)
function plotLifeAnnotations(annotationsFlag, planetMass) {
    if ( true == annotationsFlag ) {
        d3.select("#lifeAnnotationsButtons")
        .select("#lifePlotAnnotationsOnButton")
        .style("background-color", "lightblue")
        d3.select("#lifeAnnotationsButtons")
        .select("#lifePlotAnnotationsOffButton")
        .style("background-color", "white")
        
        if ( planetMass < 10 ) {
            lifePlot.select("#lifePlotAnnotations0Box").style("display", null);
            lifePlot.select("#lifePlotAnnotations00").style("display", null);
            lifePlot.select("#lifePlotAnnotations01").style("display", null);
            lifePlot.select("#lifePlotAnnotations02").style("display", null);
            lifePlot.select("#lifePlotAnnotations03").style("display", null);
        }
        else {
            lifePlot.select("#lifePlotAnnotations0Box").style("display", "none");
            lifePlot.select("#lifePlotAnnotations00").style("display", "none");
            lifePlot.select("#lifePlotAnnotations01").style("display", "none");
            lifePlot.select("#lifePlotAnnotations02").style("display", "none");
            lifePlot.select("#lifePlotAnnotations03").style("display", "none");
        }

        if ( planetMass > 1000 ) {
            lifePlot.select("#lifePlotAnnotations1Box").style("display", null);
            lifePlot.select("#lifePlotAnnotations10").style("display", null);
            lifePlot.select("#lifePlotAnnotations11").style("display", null);
            lifePlot.select("#lifePlotAnnotations12").style("display", null);
            lifePlot.select("#lifePlotAnnotations13").style("display", null);
        }
        else {
            lifePlot.select("#lifePlotAnnotations1Box").style("display", "none");
            lifePlot.select("#lifePlotAnnotations10").style("display", "none");
            lifePlot.select("#lifePlotAnnotations11").style("display", "none");
            lifePlot.select("#lifePlotAnnotations12").style("display", "none");
            lifePlot.select("#lifePlotAnnotations13").style("display", "none");
        }
    }
    else {
        d3.select("#lifeAnnotationsButtons")
        .select("#lifePlotAnnotationsOnButton")
        .style("background-color", "white")
        d3.select("#lifeAnnotationsButtons")
        .select("#lifePlotAnnotationsOffButton")
        .style("background-color", "lightblue")
        
        lifePlot.select("#lifePlotAnnotations0Box").style("display", "none");
        lifePlot.select("#lifePlotAnnotations00").style("display", "none");
        lifePlot.select("#lifePlotAnnotations01").style("display", "none");
        lifePlot.select("#lifePlotAnnotations02").style("display", "none");
        lifePlot.select("#lifePlotAnnotations03").style("display", "none");
        
        lifePlot.select("#lifePlotAnnotations1Box").style("display", "none");
        lifePlot.select("#lifePlotAnnotations10").style("display", "none");
        lifePlot.select("#lifePlotAnnotations11").style("display", "none");
        lifePlot.select("#lifePlotAnnotations12").style("display", "none");
        lifePlot.select("#lifePlotAnnotations13").style("display", "none");
    }
    
    lifePlotAnnotationsFlag = annotationsFlag;
}

// Draw initial plot
plotLife(lifePlotPlanetMass);
