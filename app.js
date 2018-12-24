// @TODO: YOUR CODE HERE!
//  Setting up Chart

var svgWidth = 960;
var svgHeight = 500; 

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};
 
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Creating an SVG wrapper

var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Importing data from data.csv

d3.csv("assets/data/data.csv")
    .then(function(data) {

        // Parsing data

        data.forEach(function(data) {
            data.income = +data.income;
            data.healthcare = +data.healthcare;
        });
        
        // Creating Scale Functions 

        var xLinearScale = d3.scaleLinear()
            .domain([7, d3.max(data, d => d.income)])
            .range([0, width]);
        
        var yLinearScale = d3.scaleLinear()
            .domain([5, d3.max(data, d => d.healthcare)])
            .range([height, 0]);

        // Creating Axis Functions

        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        // Creating Circles

        var circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.income))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "15")
        .attr("fill", "green")
        .attr("opacity", ".7");

        
        chartGroup.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d.income))
        .attr("y", d => yLinearScale(d.healthcare))
        .text(d => d.abbr)
        .style("font-size", "8px")
        .style("text-anchor", "middle")

        // Appending Axes 

        chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);

        chartGroup.append("g")
            .call(leftAxis);

        //  Creating Tool Tip
        
        var toolTip = d3.tip()
            .attr("class", "tooltip")
            .offset([80, -60])
            .html(function(d) {
                return (`${d.state}<br>Income: ${d.income}%<br>Healthcare: ${d.healthcare}%`);
            });

        // Creating Tool Tip in Chart
        
        chartGroup.call(toolTip);


        // Creating Event Listeners

        circlesGroup.on("mouseover", function(data) {
            toolTip.show(data, this);
        })
            .on("mouseout", function(data, index)  {
                toolTip.hide(data);
        });

        chartGroup.append("text")
            .attr("transform", `translate(${width / 2}`)
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 40)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .attr("class", "axisText")
            .text("No Healtcare (Percentage)");

        chartGroup.append("text")
            .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
            .attr("class", "axisText")
            .text("Median Income ($)");

    });