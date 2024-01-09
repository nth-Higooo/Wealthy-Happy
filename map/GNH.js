 // Read the CSV file
   d3.csv("data/gnh_data.csv").then(data => {
    // Use it when the xAxisLabels can't take data
    //     return{
    //     country : +d.Name,
    //     year : +d.Year,
    //     Dystopia: +d['Dystopia residual'],
    //    }
       
       // Set up the initial year and x-axis variable
       let selectedYear = 2013;
       let selectedXAxis = 'dystopia';

       // Function to update the scatter plot based on user selections
       function updateScatterPlot() {
           selectedYear = parseInt(document.getElementById("yearSelector").value, 10);
           selectedXAxis = document.getElementById("xAxisSelector").value;
           drawScatterPlot();
       }

       // Initial drawing of the scatter plot
       drawScatterPlot();

       // Function to draw the scatter plot
       function drawScatterPlot() {
           // Filter data based on the selected year
           const filteredData = data.filter(d => +d.Year === selectedYear);

           // Set up the SVG container dimensions
           const margin = { top: 20, right: 20, bottom: 30, left: 40 };
           const width = 600 - margin.left - margin.right;
           const height = 400 - margin.top - margin.bottom;

           // Create the SVG container
           const svg = d3.select("#scatter-plot")
               .attr("width", width + margin.left + margin.right)
               .attr("height", height + margin.top + margin.bottom)
               .append("g")
               .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

           // Set up scales
           const xScale = d3.scaleLinear()
               .domain([d3.min(filteredData, d => +d[selectedXAxis]), d3.max(filteredData, d => +d[selectedXAxis])])
               .range([0, width]);

           const yScale = d3.scaleLinear()
               .domain([d3.min(filteredData, d => +d.happiness), d3.max(filteredData, d => +d.happiness)])
               .range([height, 0]);

           // Add circles to represent data points
           svg.selectAll("circle")
               .data(filteredData)
               .enter().append("circle")
               .attr("cx", d => xScale(+d[selectedXAxis]))
               .attr("cy", d => yScale(+d.happiness))
               .attr("r", 5) // Radius of the circle
               .on("mouseover", mouseover)
               .on("mousemove", mousemove)
               .on("mouseleave", mouseleave);

           // Add x-axis label based on the selected x-axis variable
           const xAxisLabels = {
               'dystopia': 'Dystopia residual',
               'log-gdp': 'Log GDP per capita',
               'social': 'Social support',
               'healthy': 'Healthy life expectancy',
               'freedom': 'Freedom to make life choices',
               'generosity': 'Generosity',
               'perceptions': 'Perceptions of corruption'
           };

           // Add x-axis
           svg.append("g")
               .attr("transform", "translate(0," + height + ")")
               .call(d3.axisBottom(xScale))
               .append("text")
               .attr("x", width / 2)
               .attr("y", margin.bottom - 10)
               .attr("dy", "0.71em")
               .attr("fill", "#000")
               .text(xAxisLabels[selectedXAxis]);

           // Add y-axis
           svg.append("g")
               .call(d3.axisLeft(yScale))
               .append("text")
               .attr("transform", "rotate(-90)")
               .attr("y", -margin.left)
               .attr("x", -height / 2)
               .attr("dy", "0.71em")
               .attr("fill", "#000")
               .text("Happiness Index");

           // Tooltip
           var tooltip = d3.select("#scatter-plot")
               .append("div")
               .style("opacity", 0)
               .attr("class", "tooltip")
               .style("background-color", "white")
               .style("border", "solid")
               .style("border-width", "2px")
               .style("border-radius", "5px")
               .style("padding", "5px");

           function mouseover(d) {
               tooltip
                   .style("opacity", 1);
               d3.select(this)
                   .style("stroke", "black")
                   .style("opacity", 1);
           }

           function mousemove(d) {
               tooltip
                   .html("Country: " + d.Name)
                   .style("left", (d3.mouse(this)[0] + 70) + "px")
                   .style("top", (d3.mouse(this)[1]) + "px");
           }

           function mouseleave(d) {
               tooltip
                   .style("opacity", 0);
               d3.select(this)
                   .style("stroke", "none")
                   .style("opacity", 0.8);
           }
       }
   });

