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

var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

function xScale(data , chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data , d => d[chosenXAxis]) * 0.9,
         d3.max(data , d => d[chosenXAxis]) * 1.1])
        .range([0, Width]);

    return xLinearScale;
};

function yScale(data , chosenYAxis) {
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data , d => d[chosenYAxis]) * 0.9,
         d3.max(data , d => d[chosenYAxis]) * 1.1])
        .range([Height, 0]);

    return yLinearScale;
};

function renderXAxis(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    
    return xAxis;
};

function renderYAxis(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    
    return yAxis;
};

function renderXCircles(circlesGroup , newXScale , chosenXAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cx" , d => newXScale(d[chosenXAxis]));

    return chosenXAxis;
};

function renderYCircles(circlesGroup , newYScale , chosenYAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cy" , d => newYScale(d[chosenYAxis]));

    return chosenYAxis;
};


d3.csv("assets/data/data.csv").then(function (data, err) {
    //console.log(data);
    if (err) throw err;

    data.forEach(function(data){
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.imcome = +data.income;
        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
        data.smoke = +data.smoke;
        data.abbr = data.abbr;
    });

    var xLinearScale = xScale(data , chosenXAxis);
    var yLinearScale = yScale(data , chosenYAxis);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xAxis = chartGroup.append("g")
                    .classed("x-axis" , true)
                    .attr("transform", `translate(0, ${Height})`)
                    .call(bottomAxis);

    var yAxis = chartGroup.append("g")
                        .classed("y-axis" , true)
                        .call(leftAxis);

    var circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx" , d => xLinearScale(d[chosenXAxis]))
        .attr("cy" , d => yLinearScale(d[chosenYAxis]))
        .attr("r" , "10")
        .attr("fill" , "skyblue")    

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
        
        
    var toolTip = d3.tip()
        .attr("class" , "tooltip")
        .offset([40,-60])
        //.offset([-10,0])
        .style("background" , "black")
        .style("color" , "white")
        .style("padding" , "2px")
        .style("position" , "absolute")
        .html(function(d) {
            return (`<strong>${d.state}</strong><br>Poverty : ${d.poverty}% <br>Obesity : ${d.obesity}%`)
        });

    chartGroup.call(toolTip);

    circleGroup.on("mouseover" , function(d) {
        toolTip.show(d, this);
    })
    .on("mouseout" , function(d) {
        toolTip.hide(d);
    });

    

    var xlablesGroup = chartGroup.append("g")
                        .attr("transform" , `translate(${Width/2} , ${Height + margin.top + 10})`)

    var ylablesGroup = chartGroup.append("g")
                        .attr("transform", "rotate(-90)")

    var povertyLabel = xlablesGroup.append("text")
                        .attr("x", 0)
                        .attr("y", 20)
                        .attr("value", "poverty") // value to grab for event listener
                        .classed("active", true)
                        .text("In Poverty (%)");


    var ageLabel = xlablesGroup.append("text")
                        .attr("x", 10)
                        .attr("y", 30)
                        .attr("value", "age") // value to grab for event listener
                        .classed("inactive", true)
                        .text("Age (Median)");

    var hhiLabel = xlablesGroup.append("text")
                        .attr("x", 10)
                        .attr("y", 30)
                        .attr("value", "income") // value to grab for event listener
                        .classed("inactive", true)
                        .text("Household Income (Median)");

    var healthcareLabel = ylablesGroup.append("text")
                            .attr("y", 0 - margin.left)
                            .attr("x", 0 - (Height / 2))
                            .attr("dy", "1em")
                            .attr("value", "healthcare")
                            .classed("active", true)
                            .text("Lacks Healthcare (%)");
    
    var obesityLabel = ylablesGroup.append("text")
                            .attr("y", 0 - margin.left)
                            .attr("x", 0 - (Height / 2))
                            .attr("dy", "1em")
                            .attr("value", "obesity")
                            .classed("inactive", true)
                            .text("Obesity (%)");

    var smokeLabel = ylablesGroup.append("text")
                            .attr("y", 0 - margin.left)
                            .attr("x", 0 - (Height / 2))
                            .attr("dy", "1em")
                            .attr("value", "smoke")
                            .classed("inactive", true)
                            .text("Smokes (%)");

    xlablesGroup.selectAll("text")
        .on("click" , function() {
            var value = d3.select(this).attr("value");
            if(value !== chosenXAxis) {
                chosenXAxis = value;
                console.log(chosenXAxis);

                xLinearScale = xScale(data, chosenXAxis);
                xAxis = renderXAxis(xLinearScale, xAxis);
                circlesGroup = renderXCircles(circlesGroup, xLinearScale, chosenXAxis);

                if (chosenXAxis == "age") {
                    ageLabel
                        .classed("active" , true)
                        .classed("inactive" , false);
                    povertyLabel
                        .classed("active" , false)
                        .classed("inactive" , true);
                    hhiLabel   
                        .classed("active", false)
                        .classed("inactive" , true);
                } else if(chosenXAxis == "income") {
                    hhiLabel
                        .classed("active" , true)
                        .classed("inactive" , false);
                    povertyLabel
                        .classed("active" , false)
                        .classed("inactive" , true);
                    ageLabel
                        .classed("active" , false)
                        .classed("inactive" , true);
                } else {
                    povertyLabel
                        .classed("active" , true)
                        .classed("inactive" , false);
                    ageLabel
                        .classed("active" , false)
                        .classed("inactive" , true);
                    hhiLabel   
                        .classed("active", true)
                        .classed("inactive" , false);
                }
            }
        })


    ylablesGroup.selectAll("text")
        .on("click" , function() {
            var value1 = d3.select(this).attr("value");
            if(value1 !== chosenYAxis) {
                chosenYAxis = value1;
                console.log(chosenYAxis);

                yLinearScale = yScale(data, chosenYAxis);
                yAxis = renderXAxis(yLinearScale, yAxis);
                circlesGroup = renderYAxis(circlesGroup, yLinearScale, chosenYAxis);

                if (chosenYAxis == "obesity") {
                    obesityLabel
                        .classed("active" , true)
                        .classed("inactive" , false);
                    healthcareLabel
                        .classed("active" , false)
                        .classed("inactive" , true);
                    smokeLabel
                        .classed("active", false)
                        .classed("inactive" , true);
                } else if(chosenYAxis == "smoke") {
                    smokeLabel
                        .classed("active" , true)
                        .classed("inactive" , false);
                    obesityLabel
                        .classed("active" , false)
                        .classed("inactive" , true);
                    healthcareLabel
                        .classed("active" , false)
                        .classed("inactive" , true);
                } else {
                    healthcareLabel
                        .classed("active" , true)
                        .classed("inactive" , false);
                    obesityLabel
                        .classed("active" , false)
                        .classed("inactive" , true);
                    smokeLabel
                        .classed("active", true)
                        .classed("inactive" , false);
                }
            }
        })

}).catch(function(error){
    console.log(error)
});