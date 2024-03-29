// Read the CSV file
d3.csv("data/gnh_data.csv").then(data => {
    d3.csv("data/region.csv").then(regions => {
        // Set up the initial year and x-axis variable
        let selectedYear = 2013;
        let selectedXAxis = 'Dystopia residual';
        var xAxisSelector = document.getElementById('xAxisSelector')
        xAxisSelector.addEventListener('change', (event) => updateScatterPlot());

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
            d3.select('#scatter-plot').selectAll('*').remove();
            // Filter data based on the selected year
            const filteredData = data.filter(d => +d.Year === selectedYear);
            var yearSelector = document.getElementById('yearSelector')
            yearSelector.addEventListener('change', (event) => updateScatterPlot());

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
                .domain([0, 10])
                .range([height, 0]);

            // Add x-axis label based on the selected x-axis variable
            const xAxisLabels = {
                'Dystopia residual': 'Dystopia Residual',
                'Log GDP per capita': 'Log GDP Per Capita',
                'Social support': 'Social Support',
                'Healthy life expectancy': 'Healthy Life Expectancy',
                'Freedom to make life choices': 'Freedom To Make Life Choices',
                'Generosity': 'Generosity',
                'Perceptions of corruption': 'Perceptions Of Corruption'
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
                .style("fill", "white")
                .text(xAxisLabels[selectedXAxis])
                .attr("font-size", "14px");

            // Add y-axis
            svg.append("g")
                .call(d3.axisLeft(yScale))
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", -margin.left)
                .attr("x", -height / 2)
                .attr("dy", "0.71em")
                .attr("fill", "#000")
                .attr("fill", "white")
                .text("Happiness Index")
                .attr("font-size", "14px");



            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(xScale))
                .selectAll("*")
                .style("stroke", "white")
                .style("fill", "white")
                .style("stroke-width", "2px")
                .style("font-size", "12px")
                .style("font-family", "Arial");


            svg.append("g")
                .call(d3.axisLeft(yScale))
                .selectAll("*")
                .style("stroke", "white")
                .style("fill", "white")
                .style("stroke-width", "2px")
                .style("font-size", "12px")
                .style("font-family", "Arial");


            // const subRegion = ['Southern Asia', 'Northern Europe', 'Southern Europe','Northern Africa', 'Polynesia',
            //                     'Sub-Saharan Africa', 'Latin America and the Caribean', 'Western Asia', 'Australia and New Zealand','Western Europe',
            //                 'Eastern Europe','Northern America', 'South-eastern Asia', 'Eastern Asia', 'Central Asia','Micronesia',
            //                 'Melanesia']
            const colorRange = [
                "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
                "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf",
                "#aec7e8", "#ffbb78", "#98df8a", "#ff9896", "#c5b0d5",
                "#c49c94", "#f7b6d2"
            ]
            const colorSubRegion = d3.scaleOrdinal().range(colorRange)


            // Add circles to represent data points
            svg.selectAll("circle")
                .data(filteredData)
                .enter().append("circle")
                .attr("cx", d => xScale(+d[selectedXAxis]))
                .attr("cy", d => yScale(+d.Happiness))
                .attr("r", 5) // Radius of the circle
                .style("opacity", "0.6")

                .style("fill", d => {
                    let temp;
                    regions.forEach(region => {
                        if (region['name'] == d.Name) {
                            temp = (colorSubRegion(region['region']))
                        }
                    })
                    return temp;
                })




                .on("mouseover", (e, d) => {
                    const circle = d3.select(e.currentTarget);

                    // Apply transition to the circle
                    circle.transition()
                        .duration(10)
                        .attr("r", 10)
                        .style("stroke", "white")
                        .style("stroke-width", 10);

                    //country flag image
                    var flag = document.querySelector("#country-flag");
                    fetch('data/country-flag.json')
                        .then((response) => response.json())
                        .then((json) => {
                            var countryFlag = json;
                            for (const country in countryFlag) {
                                if (countryFlag[country]['name'] == d['Name']) {
                                    flag.src = countryFlag[country]['file_url'];
                                }
                            }
                        });

                    //country info
                    barGraph(d);

                    var countryName = document.querySelector("#country-name");
                    countryName.textContent = d['Name'];

                    var happinessScore = document.querySelector('#happiness-score');
                    happinessScore.textContent = 'Happiness score: ' + d['Happiness'];
                })
                .on("mouseout", (e, d) => {
                    // Reset the circle on mouseout
                    d3.select(e.currentTarget)
                        .transition()
                        .duration(200)
                        .attr("r", 5)
                        .style("stroke", "none");
                });


            svg.selectAll("circle")
                .append('title')
                .text(d => d['Name'])

            const legendData = [
                { label: 'Europe', color: 'orange' },
                { label: 'America', color: 'red' },
                { label: 'Asia', color: 'blue' },
                { label: 'Africa', color: 'green' },
                { label: 'Oceania', color: 'purple' },

                // Add more legend items as needed
            ];

            const legend = svg.append("g")
                .attr("class", "legend")
                .attr("transform", "translate(" + (width - 13) + "," + (height -60) + ")"); // Adjust the translation to position the legend

            const legendRectSize = 18;
            const legendSpacing = 6;

            const legendItems = legend.selectAll(".legend-item")
                .data(legendData)
                .enter()
                .append("g")
                .attr("class", "legend-item")
                .attr("transform", function (d, i) {
                    const height = legendRectSize + legendSpacing;
                    const offset = height * legendData.length / 2;
                    const horz = -2 * legendRectSize;
                    const vert = i * height - offset;
                    return "translate(" + horz + "," + vert + ")";
                });

            legendItems.append("rect")
                .attr("width", legendRectSize)
                .attr("height", legendRectSize)
                .style("fill", function (d) {
                    return d.color;
                });

            legendItems.append("text")
                .attr("x", legendRectSize + legendSpacing)
                .attr("y", legendRectSize - legendSpacing)
                .text(function (d) {
                    return d.label;
                })
                .style("font-size", "12px")
                .style("font-family", "Arial")
                .style("fill", "white");
        }

        function barGraph(data) {
            d3.select("#barGraph").selectAll("*").remove();
            const factors = ['Dystopia residual', 'Log GDP per capita', 'Social support', 'Healthy life expectancy',
                'Freedom to make life choices', 'Generosity', 'Perceptions of corruption']
            const countryFactors = []
            for (const prop in data) {
                let temp = prop
                if (factors.includes(prop)) {

                    countryFactors.push({ 'factor': temp, 'value': data[prop] })
                }
            }
            console.log(countryFactors)
            const svgWidth = 800;
            const svgHeight = 150;

            const svg2 = d3.select("#barGraph")
                .append("svg")
                .attr("width", svgWidth)
                .attr("height", svgHeight);

            const xBarScale = d3.scaleLinear()
                .domain([0, 4])
                .range([0, svgWidth / 2]);

            const yBarScale = d3.scaleBand()
                .domain(factors)
                .range([0, svgHeight])
                .padding(0.1);



            svg2.selectAll("rect")
                .data(countryFactors)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("width", d => xBarScale(+d.value))
                .attr("height", yBarScale.bandwidth())
                .attr("x", 300)
                .attr("y", (d, i) => yBarScale(d.factor))
                .style('fill', '#ff964f')

            svg2.selectAll("text")
                .data(countryFactors)
                .enter().append("text")
                .attr("x", d => 125)
                .attr("y", d => yBarScale(d.factor) + yBarScale.bandwidth() / 2)
                .text(d => d.factor)
                .classed("bar-text", true)
        }

    })
});