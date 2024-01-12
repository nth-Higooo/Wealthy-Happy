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
        console.log('haha') // DEBUGGING
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
            .attr("fill","white")
            .text("Happiness Index");



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
                regions.forEach( region => {
                    if(region['name']== d.Name){
                        temp = (colorSubRegion(region['region']))
                    }
                })
                return temp;
          })
            

            

            .on("mouseover",  (e,d) => {
                //country flag image
                var flag= document.querySelector("#country-flag");
                fetch('data/country-flag.json')
                    .then((response) => response.json())
                    .then((json) => {
                        var countryFlag = json
                        // console.log(countryFlag)
                        for(const country in countryFlag) {
                            if(countryFlag[country]['name']==d['Name']) {
                                console.log(countryFlag[country]['file_url'])
                                flag.src = countryFlag[country]['file_url']
                            }
                        }
                    });

                //country info

                var countryName = document.querySelector("#country-name");
                countryName.textContent = d['Name']
                
                var happinesScore = document.querySelector('#happiness-score')
                happinesScore.textContent='Happiness score: '+d['Happiness']
            })
            .on("mouseout", d => {
                
            });
        
        svg.selectAll("circle")
            .append('title')
            .text(d=> d['Name'])
        }
    }) 
});