// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 600;

var margin  = {
    top : 20,
    left : 40,
    right : 60,
    bottom : 50
};

var Width = svgWidth - margin.left - margin.right;
var Height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
    .append("svg")
    .attr("width" , svgWidth)
    .attr("height" , svgHeight);

var chartGroup = svg.append("g")
    .attr("transform" , `translate(${margin.left}, ${margin.top})`);

d3.csv("assets/data/data.csv").then(function (data) {

    //console.log(data);

    data.forEach(function(d){
        d.poverty = parseFloat(d.poverty);
        d.healthcare = parseFloat(d.healthcare);
        data.abbr = data.abbr;
        //console.log(d.abbr)
    });

    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.poverty) * 0.9, d3.max(data, d => d.poverty) * 1.1])
        .range([0 , Width]);

    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.healthcare) * 0.9, d3.max(data, d => d.healthcare) * 1.1])
        .range([Height , 0]);

    var xAxis = d3.axisBottom(xLinearScale);
    var yAxis = d3.axisLeft(yLinearScale);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${Height})`)
        .call(xAxis);

    chartGroup.append("g")
        .call(yAxis);

    var circleGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx" , d => xLinearScale(d.poverty))
        .attr("cy" , d => yLinearScale(d.healthcare))
        .attr("r" , "10")
        .attr("fill" , "skyblue")
        .attr("text" , d => d.abbr);

    var textGroup = chartGroup.selectAll(null)
        .data(data)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("font-size", 10)
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y",d => yLinearScale(d.healthcare)+4)
        .attr("fill" , "white")
        .style("text-anchor","middle");

    //console.log(textGroup);

    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", margin.left - 85)
      .attr("x", 0 - (Height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lack Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${Width / 2}, ${Height + margin.top + 10})`)
      .attr("class", "axisText")
      .text("In Poverty (%)");

}).catch(function(error){
    console.log(error)
});