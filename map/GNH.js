var svg = d3.select("#GNHmap"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

// Map and projection
var path = d3.geoPath();
var projection = d3.geoMercator()
  .scale(120)
  .center([0,45])
  .translate([width/2, height/2]);

// Data and color scale
var data = d3.map();
var colorScale = d3.scaleThreshold()
  .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  .range(d3.schemeBlues[9]);

//Select years
const years = [{year: 2013, value: "data1"}, {year: 2014, value: "data2"}, 
            {year: 2015, value: "data3"}, {year: 2016, value: "data4"},
            {year: 2017, value: "data5"}, {year: 2018, value: "data6"}, 
            {year: 2019, value: "data7"}, {year: 2020, value: "data8"},
            {year: 2021, value: "data9"}, {year: 2022, value: "data10"}] 
const menuYear = d3.select("#years-menu")
    .style("border-radius", "3px")
    .style("right", "210px");
        
menuYear.selectAll("option")
        .data(years)
        .enter().append("option")
        .attr("value", function(d) {
            return d.value;
        })
        .text(function(d) { return d.year; });

update2013();

d3.select("#years-menu").on("change", function() {
    const selectedOption = d3.select(this).property("value");
    if (selectedOption === "data2") {
        update2014();
    }
    else if (selectedOption === "data3") {
        update2015();
    }
    else if (selectedOption === "data4") {
        update2016();
    }
    else if (selectedOption === "data5") {
        update2017();
    }
    else if (selectedOption === "data6") {
        update2018();
    }
    else if (selectedOption === "data7") {
        update2019();
    }
    else if (selectedOption === "data8") {
        update2020();
    }
    else if (selectedOption === "data9") {
        update2021();
    }
    else if (selectedOption === "data10") {
        update2022();
    }
    else {
        update2013();
    }
})

// Load external data and boot
function update2013() {
    d3.queue()
        .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
        .defer(d3.csv, "/data/hapiness.csv", function(d) { 
            if(d.year === "2013") {
                data.set(d.code, +d.Score);
            }
        })
        .await(ready);
}
function update2014() {
    d3.queue()
        .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
        .defer(d3.csv, "/data/hapiness.csv", function(d) { 
            if(d.year === "2014") {
                data.set(d.code, +d.Score);
            }
        })
        .await(ready);
}
function update2015() {
    d3.queue()
        .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
        .defer(d3.csv, "/data/hapiness.csv", function(d) { 
            if(d.year === "2015") {
                data.set(d.code, +d.Score);
            }
        })
        .await(ready);
}
function update2016() {
    d3.queue()
        .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
        .defer(d3.csv, "/data/hapiness.csv", function(d) { 
            if(d.year === "2016") {
                data.set(d.code, +d.Score);
            }
        })
        .await(ready);
}
function update2017() {
    d3.queue()
        .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
        .defer(d3.csv, "/data/hapiness.csv", function(d) { 
            if(d.year === "2017") {
                data.set(d.code, +d.Score);
            }
        })
        .await(ready);
}
function update2018() {
    d3.queue()
        .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
        .defer(d3.csv, "/data/hapiness.csv", function(d) { 
            if(d.year === "2018") {
                data.set(d.code, +d.Score);
            }
        })
        .await(ready);
}
function update2019() {
    d3.queue()
        .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
        .defer(d3.csv, "/data/hapiness.csv", function(d) { 
            if(d.year === "2019") {
                data.set(d.code, +d.Score);
            }
        })
        .await(ready);
}
function update2020() {
    d3.queue()
        .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
        .defer(d3.csv, "/data/hapiness.csv", function(d) { 
            if(d.year === "2020") {
                data.set(d.code, +d.Score);
            }
        })
        .await(ready);
}
function update2021() {
    d3.queue()
        .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
        .defer(d3.csv, "/data/hapiness.csv", function(d) { 
            if(d.year === "2021") {
                data.set(d.code, +d.Score);
            }
        })
        .await(ready);
}
function update2022() {
    d3.queue()
        .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
        .defer(d3.csv, "/data/hapiness.csv", function(d) { 
            if(d.year === "2022") {
                data.set(d.code, +d.Score);
            }
        })
        .await(ready);
}
//Zooming function
function zoomToBoundingBox(bbox) {
    const [[x0, y0], [x1, y1]] = bbox;
    const bounds = [[x0, y0], [x1, y1]];

    // Compute the center of the bounding box
    const center = [
        (bounds[0][0] + bounds[1][0]) / 2,
        (bounds[0][1] + bounds[1][1]) / 2
    ];

    // Compute the zoom level based on the bounding box width
    const dx = bounds[1][0] - bounds[0][0];
    const dy = bounds[1][1] - bounds[0][1];
    const zoom = Math.min(12, 0.9 / Math.max(dx / width, dy / height));

    // Return the center and zoom level, but don't apply the zoom and pan to the map
    return { center, zoom };
}

// Draw map
function ready(error, topo) {
    //Tool tip
    const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
    
  let mouseOver = function(d) {
    d3.selectAll(".Country")
      .transition()
      .duration(100)
      .style("opacity", .5)
    d3.select(this)
      .transition()
      .duration(200)
      .style("opacity", 1)
      .style("stroke", "black")
    tooltip.html(`<strong>${d.properties.name}</strong><br/>Happiness Score: ${d.Score.toLocaleString()}`)
      .style("left", (d3.event.pageX + 10) + "px")
      .style("top", (d3.event.pageY + 10) + "px")
      .transition()
      .duration(200)
      .style("opacity", .9);
    }

  let mouseLeave = function(d) {
    d3.selectAll(".Country")
      .transition()
      .duration(200)
      .style("opacity", .8)
    d3.select(this)
      .transition()
      .duration(200)
      .style("stroke", "transparent")
    tooltip.transition()
      .duration(200)
      .style("opacity", 0);
    }

    // Zooming behaviour
    const zoomFunction = d3.zoom()
        .scaleExtent([1, 8])
        .on("zoom", zoomed);

    function zoomed() {
        svg.selectAll("path")
            .attr("transform", d3.event.transform);
    }

    svg.call(zoomFunction);
    
     // Draw the map
    svg.append("g")

        .selectAll("path")
        .data(topo.features)
        .enter()
        .append("path")
      // draw each country
        .attr("d", d3.geoPath()
        .projection(projection)
      )
      // set the color of each country
      .attr("fill", function (d) {
        d.Score = data.get(d.id) || 0;
        return colorScale(d.Score);
      })
      .style("stroke", "transparent")
      .attr("class", function(d){ return "Country" } )
      .style("opacity", .8)
      .on("mouseover", mouseOver )
      .on("mouseleave", mouseLeave )
    
    // Call zoomToBoundingBox with the desired bounding box
    const boundingBox = [[-180, -90], [180, 90]]; // Modify this bounding box as needed
    const initialZoom = zoomToBoundingBox(boundingBox);

    // Apply the initial zoom and pan to the map
    svg.call(zoomFunction.transform, d3.zoomIdentity.translate(width / 2, height / 2).scale(initialZoom.zoom).translate(-initialZoom.center[0], -initialZoom.center[1]));
}
