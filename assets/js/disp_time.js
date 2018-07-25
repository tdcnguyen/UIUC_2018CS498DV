// Setup plot location and dimensions
// Setup margins
var timePlotMargin = {
top: 20,
right: 180,
bottom: 80,
left: 80
};

// Setup plot dimensions
var timePlotWidth = 1112 - timePlotMargin.left - timePlotMargin.right;
var timePlotHeight = 556 - timePlotMargin.top - timePlotMargin.bottom;

// Setup plot space
var timePlotSVG = d3.select("#timeContainer")
.append("svg")
.attr("id", "timePlot")
.attr("width", timePlotWidth + timePlotMargin.left + timePlotMargin.right)
.attr("height", timePlotHeight + timePlotMargin.top + timePlotMargin.bottom)
;

// Setup plot objects
// Setup main plot object
var timePlot = timePlotSVG
.append("g")
.classed("chart", true)
.attr("transform", "translate(" + timePlotMargin.left + "," + timePlotMargin.top + ")")
;

// Transpose data into layers for stacked bar chart
var discMethods = ["Imaging", "Microlensing", "Radial Velocity", "Transit", "Other"];
var timePlotDataDiscCount = d3.layout.stack()(
                                              discMethods.map(
                                                              function(discMethod) {
                                                              return dataDiscCount.map(
                                                                                       function(currentValue) {
                                                                                       return {
                                                                                       x: currentValue.Year,
                                                                                       y: +currentValue[discMethod],
                                                                                       discMethod : discMethod
                                                                                       };
                                                                                       });
                                                              })
                                              );
var timePlotDataDiscFrac = d3.layout.stack()(
                                             discMethods.map(
                                                             function(discMethod) {
                                                             return dataDiscFrac.map(
                                                                                     function(currentValue) {
                                                                                     return {
                                                                                     x: currentValue.Year,
                                                                                     y: +currentValue[discMethod],
                                                                                     discMethod : discMethod
                                                                                     };
                                                                                     });
                                                             })
                                             );

// Setup x scale (discovery years)
var timePlotXScale = d3.scale.ordinal()
.domain(timePlotDataDiscCount[0].map(function(d) { return d.x; }))
.rangeRoundBands([10, timePlotWidth - 10], 0.02);

// Setup y scale for discovery counts truncated
var timePlotYScaleDiscCountTrunc = d3.scale.linear()
.domain([0, 200])
.range([timePlotHeight, 0])
;

// Setup y scale for discovery counts
var timePlotYScaleDiscCount = d3.scale.linear()
.domain([0, d3.max(timePlotDataDiscCount, function(d) {
                   return d3.max(d, function(d) {
                                 return d.y0 + d.y;
                                 });
                   })])
.range([timePlotHeight, 0])
;

// Setup y scale for discovery fractions
var timePlotYScaleDiscFrac = d3.scale.linear()
.domain([0, 1])
.range([timePlotHeight, 0])
;

// Setup z (colors)
var timePlotZ = [
                 "#1f77b4",
                 "#ff7f0e",
                 "#2ca02c",
                 "#d62728",
                 "#9467bd"
                 ];


// Setup structure to hold data that is specific to discovery counts and discovery fractions
var timePlotData = [
                    {
                    data : timePlotDataDiscCount,
                    precision : 0,
                    yScale : timePlotYScaleDiscCountTrunc,
                    yLabel : "Number of Discoveries"
                    }
                    ,
                    {
                    data : timePlotDataDiscCount,
                    precision : 0,
                    yScale : timePlotYScaleDiscCount,
                    yLabel : "Number of Discoveries"
                    }
                    ,
                    {
                    data : timePlotDataDiscFrac,
                    precision : 3,
                    yScale : timePlotYScaleDiscFrac,
                    yLabel : "Proportion of Discoveries"
                    }
                    ];

// Set initial data index
var timePlotDataIndex = 0;
var timePlotAnnotationsFlag = true;

// Define x-axis
var timePlotXAxisDef = d3.svg.axis()
.scale(timePlotXScale)
.orient("bottom")
.tickSize(0, 0, 0)
;

// Define y-axis
var timePlotYAxisDef = d3.svg.axis()
.scale(timePlotData[timePlotDataIndex].yScale)
.orient("left")
.ticks(15, ",.1r")
.tickSize(-timePlotWidth, 0, 0)
.tickFormat( function(d) { return d } )
;

// Draw x-axis
var timePlotXAxis = timePlot
.append("g")
.attr("class", "x axis")
.attr("transform", "translate(0," + timePlotHeight + ")")
.call(timePlotXAxisDef)
.selectAll("text")
.attr("x", 9)
.attr("y", 0)
.attr("dy", ".35em")
.attr("transform", "rotate(90)")
.style("text-anchor", "start")
;

// Draw x-axis label
timePlot
.select(".x.axis")
.append("text")
.attr("x", 0)
.attr("y", 0)
.style("text-anchor", "middle")
.attr("transform", "translate(" + timePlotWidth / 2 + ", 75)")
.text("Discovery Year")
;

// Draw y-axis
var timePlotYAxis = timePlot
.append("g")
.attr("class", "y axis")
.call(timePlotYAxisDef)
;

// Draw y-axis label
timePlot
.select(".y.axis")
.append("text")
.attr("id", "timePlotYLabel")
.attr("x", 0)
.attr("y", 0)
.style("text-anchor", "middle")
.attr("transform", "translate(-50, " + timePlotHeight / 2 + ") rotate(-90)")
.text(timePlotData[timePlotDataIndex].yLabel)
;

// Draw legend title (method)
var timePlotLegendMethodTitle = timePlot.append("text")
.attr("x", timePlotWidth + 5)
.attr("y", 18)
.attr("text-anchor", "start")
.style("text-decoration", "underline")
.text("Discovery Method")
;

// Draw legend base (method)
var timePlotLegendMethod = timePlotSVG.selectAll(".legendMethod")
.data(timePlotZ)
.enter()
.append("g")
.attr("class", "legend")
.attr("transform", function(d, i) { return "translate(105, " + (45 + i * 19) + ")"; })
;

// Draw legend color patches (method)
timePlotLegendMethod.append("rect")
.attr("x", timePlotWidth - 18)
.attr("width", 18)
.attr("height", 18)
.style("fill", function(d, i) {return timePlotZ.slice()[i];})
;

// Draw legend text (method)
timePlotLegendMethod.append("text")
.attr("x", timePlotWidth + 5)
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
var timePlotTooltip = timePlotSVG
.append("g")
.attr("class", "tooltip")
.style("display", "none")
;

// Setup tooltip rectangle
timePlotTooltip
.append("rect")
.attr("width", 160)
.attr("height", 20)
.attr("fill", "white")
.style("opacity", 0.5)
;

// Setup tooltip text
timePlotTooltip
.append("text")
.attr("x", 80)
.attr("dy", "0.9em")
.style("text-anchor", "middle")
.attr("font-size", "18px")
.attr("font-weight", "bold")
;

// Setup Number of Discoveries (Truncated) button
var timePlotDiscCountTruncButton = d3.select("#timeButtons")
.append("button")
.attr("id", "timePlotDiscCountTruncButton")
.attr("class", "button")
.attr("type", "button")
.attr("value", "Number of Discoveries (Truncated)")
.style("font-size", "16px")
.text("Number of Discoveries (Truncated)")
.on("click", function(d) { plotTime(0); })
;

// Setup Number of Discoveries (Full Scale) button
var timePlotDiscCountFullButton = d3.select("#timeButtons")
.append("button")
.attr("id", "timePlotDiscCountFullButton")
.attr("class", "button")
.attr("type", "button")
.attr("value", "Number of Discoveries (Full Scale)")
.style("font-size", "16px")
.text("Number of Discoveries (Full Scale)")
.on("click", function(d) { plotTime(1); })
;

// Setup Fraction of Discoveries button
var timePlotDiscFracButton = d3.select("#timeButtons")
.append("button")
.attr("id", "timePlotDiscFracButton")
.attr("class", "button")
.attr("type", "button")
.attr("value", "Proportion of Discoveries")
.style("font-size", "16px")
.text("Proportion of Discoveries")
.on("click", function(d) { plotTime(2); })
;

// Setup Annotations On button
var timePlotAnnotationsOnButton = d3.select("#timeAnnotationsButtons")
.append("button")
.attr("id", "timePlotAnnotationsOnButton")
.attr("class", "button")
.attr("type", "button")
.attr("value", "Annotations On")
.style("font-size", "16px")
.text("Annotations On")
.on("click", function(d) { plotTimeAnnotations(true, timePlotDataIndex); })
;

// Setup Annotations Off button
var timePlotAnnotationsOffButton = d3.select("#timeAnnotationsButtons")
.append("button")
.attr("id", "timePlotAnnotationsOffButton")
.attr("class", "button")
.attr("type", "button")
.attr("value", "Annotations Off")
.style("font-size", "16px")
.text("Annotations Off")
.on("click", function(d) { plotTimeAnnotations(false, timePlotDataIndex); })
;

// Plot function (for Time section)
function plotTime(plotIndex) {
    if ( 0 == timePlotDataIndex ) {
        d3.select("#timeButtons")
        .select("#timePlotDiscCountTruncButton")
        .style("background-color", "white")
    }
    else if ( 1 == timePlotDataIndex ) {
        d3.select("#timeButtons")
        .select("#timePlotDiscCountFullButton")
        .style("background-color", "white")
    }
    else if ( 2 == timePlotDataIndex ) {
        d3.select("#timeButtons")
        .select("#timePlotDiscFracButton")
        .style("background-color", "white")
    }
    ;
    
    if ( 0 == plotIndex ) {
        d3.select("#timeButtons")
        .select("#timePlotDiscCountTruncButton")
        .style("background-color", "lightblue")
    }
    else if ( 1 == plotIndex ) {
        d3.select("#timeButtons")
        .select("#timePlotDiscCountFullButton")
        .style("background-color", "lightblue")
    }
    else if ( 2 == plotIndex ) {
        d3.select("#timeButtons")
        .select("#timePlotDiscFracButton")
        .style("background-color", "lightblue")
    }
    ;

    // Show/hide annotations
    plotTimeAnnotations(timePlotAnnotationsFlag, plotIndex);
    
    // Remove previous plot
    timePlot
    .selectAll("g.cost")
    .remove()
    ;
    
    // Remove previous y-axis label
    timePlot
    .select(".y.axis")
    .select("#timePlotYLabel")
    .remove()
    ;
    
    // Define y-axis
    timePlotYAxisDef = d3.svg.axis()
    .scale(timePlotData[plotIndex].yScale)
    .orient("left")
    .ticks(15, ",.1r")
    .tickSize(-timePlotWidth, 0, 0)
    .tickFormat( function(d) { return d } )
    ;
    
    // Draw y-axis
    timePlotYAxis
    .transition()
    .call(timePlotYAxisDef)
    ;
    
    // Draw y-axis label
    timePlot
    .select(".y.axis")
    .append("text")
    .attr("id", "timePlotYLabel")
    .attr("x", 0)
    .attr("y", 0)
    .style("text-anchor", "middle")
    .attr("font-size", '18px')
    .attr("transform", "translate(-50, " + timePlotHeight / 2 + ") rotate(-90)")
    .text(timePlotData[plotIndex].yLabel)
    ;
    
    // Create groups for each series
    timePlotGroups = timePlot
    .selectAll("g.cost")
    .data(timePlotData[plotIndex].data)
    .enter()
    .append("g")
    .attr("class", "cost")
    .style("fill", function(d, i) { return timePlotZ[i]; })
    ;
    
    // Create rectangles for each segment
    timePlotRects = timePlotGroups.selectAll("rect")
    .data(function(d) { return d; })
    .enter()
    .append("rect")
    .attr("x", function(d) { return timePlotXScale(d.x); })
    .attr("y", function(d) { return timePlotData[timePlotDataIndex].yScale(d.y0 + d.y); })
    .attr("height", function(d) { return timePlotData[timePlotDataIndex].yScale(d.y0) - timePlotData[timePlotDataIndex].yScale(d.y0 + d.y); })
    .attr("width", timePlotXScale.rangeBand())
    .on("mouseover", function() { timePlotTooltip.style("display", null); })
    .on("mouseout", function() { timePlotTooltip.style("display", "none"); })
    .on("mousemove", function(d) {
        var xPosition = d3.mouse(this)[0] + 20;
        var yPosition = d3.mouse(this)[1] + 40;
        timePlotTooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
        timePlotTooltip.select("text").text(d.discMethod + ": " + d.y.toFixed(timePlotData[plotIndex].precision));
        })
    .transition()
    .attr("x", function(d) { return timePlotXScale(d.x); })
    .attr("y", function(d) { return timePlotData[plotIndex].yScale(d.y0 + d.y); })
    .attr("height", function(d) { return timePlotData[plotIndex].yScale(d.y0) - timePlotData[plotIndex].yScale(d.y0 + d.y); })
    .attr("width", timePlotXScale.rangeBand())
    ;
    
    timePlotDataIndex = plotIndex;
}

// Setup annotation #0
var timePlotAnnotations0Text = ["There has been a significant",
                                "increase in exoplanet discoveries",
                                "over the past three decades."]
timePlot
.append("text")
.attr("id", "timePlotAnnotations00")
.attr("x", timePlotWidth * 0.1)
.attr("y", timePlotHeight * 0.2)
.style("text-anchor", "start")
.style("font-size", "24px")
.style("display", "none")
.attr("dy", "0em")
.text(timePlotAnnotations0Text[0])
;

timePlot
.append("text")
.attr("id", "timePlotAnnotations01")
.attr("x", timePlotWidth * 0.1)
.attr("y", timePlotHeight * 0.2)
.style("text-anchor", "start")
.style("font-size", "24px")
.style("display", "none")
.attr("dy", "1.5em")
.text(timePlotAnnotations0Text[1])
;

timePlot
.append("text")
.attr("id", "timePlotAnnotations02")
.attr("x", timePlotWidth * 0.1)
.attr("y", timePlotHeight * 0.2)
.style("text-anchor", "start")
.style("font-size", "24px")
.style("display", "none")
.attr("dy", "3em")
.text(timePlotAnnotations0Text[2])
;

// Setup annotation #1
var timePlotAnnotations1Text = ["In particular, the Kepler mission",
                                "has confirmed over 2000 exoplanets",
                                "mostly in 2014 and 2016."]
timePlot
.append("text")
.attr("id", "timePlotAnnotations10")
.attr("x", timePlotWidth * 0.35)
.attr("y", timePlotHeight * 0.55)
.style("text-anchor", "start")
.style("font-size", "24px")
.style("display", "none")
.attr("dy", "0em")
.text(timePlotAnnotations1Text[0])
;

timePlot
.append("text")
.attr("id", "timePlotAnnotations11")
.attr("x", timePlotWidth * 0.35)
.attr("y", timePlotHeight * 0.55)
.style("text-anchor", "start")
.style("font-size", "24px")
.style("display", "none")
.attr("dy", "1.5em")
.text(timePlotAnnotations1Text[1])
;

timePlot
.append("text")
.attr("id", "timePlotAnnotations12")
.attr("x", timePlotWidth * 0.35)
.attr("y", timePlotHeight * 0.55)
.style("text-anchor", "start")
.style("font-size", "24px")
.style("display", "none")
.attr("dy", "3em")
.text(timePlotAnnotations1Text[2])
;

// Plot annotations function (for Time section)
function plotTimeAnnotations(annotationsFlag, plotIndex) {
    if ( true == annotationsFlag ) {
        d3.select("#timeAnnotationsButtons")
        .select("#timePlotAnnotationsOnButton")
        .style("background-color", "lightblue")
        d3.select("#timeAnnotationsButtons")
        .select("#timePlotAnnotationsOffButton")
        .style("background-color", "white")
        
        switch (plotIndex) {
            case 0:
                timePlot.select("#timePlotAnnotations00").style("display", null);
                timePlot.select("#timePlotAnnotations01").style("display", null);
                timePlot.select("#timePlotAnnotations02").style("display", null);
                
                timePlot.select("#timePlotAnnotations10").style("display", "none");
                timePlot.select("#timePlotAnnotations11").style("display", "none");
                timePlot.select("#timePlotAnnotations12").style("display", "none");
                break;
            case 1:
                timePlot.select("#timePlotAnnotations00").style("display", null);
                timePlot.select("#timePlotAnnotations01").style("display", null);
                timePlot.select("#timePlotAnnotations02").style("display", null);
                
                timePlot.select("#timePlotAnnotations10").style("display", null);
                timePlot.select("#timePlotAnnotations11").style("display", null);
                timePlot.select("#timePlotAnnotations12").style("display", null);
                break;
            case 2:
                timePlot.select("#timePlotAnnotations00").style("display", "none");
                timePlot.select("#timePlotAnnotations01").style("display", "none");
                timePlot.select("#timePlotAnnotations02").style("display", "none");
                
                timePlot.select("#timePlotAnnotations10").style("display", "none");
                timePlot.select("#timePlotAnnotations11").style("display", "none");
                timePlot.select("#timePlotAnnotations12").style("display", "none");
                break;
        }
    }
    else {
        d3.select("#timeAnnotationsButtons")
        .select("#timePlotAnnotationsOnButton")
        .style("background-color", "white")
        d3.select("#timeAnnotationsButtons")
        .select("#timePlotAnnotationsOffButton")
        .style("background-color", "lightblue")
        
        timePlot.select("#timePlotAnnotations00").style("display", "none");
        timePlot.select("#timePlotAnnotations01").style("display", "none");
        timePlot.select("#timePlotAnnotations02").style("display", "none");
        
        timePlot.select("#timePlotAnnotations10").style("display", "none");
        timePlot.select("#timePlotAnnotations11").style("display", "none");
        timePlot.select("#timePlotAnnotations12").style("display", "none");
    }
    
    timePlotAnnotationsFlag = annotationsFlag;
}

// Draw initial plot
plotTime(0);
