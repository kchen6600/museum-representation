
/*
 * CountVis - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data						-- the actual data: perDayData
 */


// filter data here, by year
// array of objects { year: , male: , female: }
// convert string to date object

// Function to convert date objects to strings or reverse
let dateFormatter = d3.timeFormat("%Y-%m-%d");
let dateParser = d3.timeParse("%Y-%m-%d");


class CountVis {

    constructor(_parentElement, _data, _eventHandler) {
        this.parentElement = _parentElement;
        this.data = _data;
        this.eventHandler = _eventHandler;

        this.initVis();
    }


    /*
     * Initialize visualization (static content, e.g. SVG area or axes)
     */

    initVis() {
        let vis = this;

        vis.filteredData = [];

        var acquisitionDates = Array.from(d3.rollup(vis.data[0], v=>v.length, d=>d.DateAcquired, d=>d.Gender));

        acquisitionDates.sort(function(a, b){
            return new Date(a[0]) - new Date(b[0]);
        });

        acquisitionDates.forEach(function(d, i){
            var malecount = 0;
            var femalecount = 0;
            var nonbinarycount = 0;

            for (let key of d[1].keys()){
                if (key.includes("Male")){
                    malecount +=1
                }
                else if (key.includes("Female")){
                    femalecount +=1
                }
                else if (key.includes("Non-binary")){
                    nonbinarycount +=1
                }
            }

            let day = {
                time: new Date(d[0]),
                male: malecount,
                female: femalecount,
                nonbinary: nonbinarycount,
            }

            vis.filteredData.push(day);

        })

        console.log(vis.filteredData);

        this.displayData = vis.filteredData;


        vis.margin = { top: 40, right: 10, bottom: 60, left: 60 };

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right,
            vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // SVG clipping path

        vis.svg.append("defs")
            .append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", vis.width)
            .attr("height", vis.height);

        // Scales and axes
        vis.x = d3.scaleTime()
            .range([0, vis.width]);

        vis.y = d3.scaleLinear()
            .range([vis.height, 0]);

        vis.xAxis = d3.axisBottom()
            .scale(vis.x)
            .ticks(10);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y);

        // Set domains
        var maleselection = d3.map(vis.filteredData, function(d){
            return d.male;
        });
        var femaleselection = d3.map(vis.filteredData, function(d){
            return d.female;
        });

        var selection = maleselection.concat(femaleselection);

        console.log(d3.max(selection));

        vis.y.domain([d3.min(selection), d3.max(selection)]);

        let minMaxX = d3.extent(vis.filteredData.map(function (d) { return (d.time); }));
        vis.x.domain(minMaxX);


        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0," + vis.height + ")")
            .style("font-size", "11px");

        vis.svg.append("g")
            .attr("class", "y-axis axis")
            .style("font-size", "11px");

        // Axis title
        vis.svg.append("text")
            .attr("x", -50)
            .attr("y", -8)
            .text("Number of Acquisitions by Gender");

        // Append a path for the area function, so that it is later behind the brush overlay
        vis.maletimePath = vis.svg.append("path")
            .attr("class", "area area-time");

        vis.femaletimePath = vis.svg.append("path")
            .attr("class", "area area-time");

        vis.nonbinarytimePath = vis.svg.append("path")
            .attr("class", "area area-time");


        // Initialize brushing component
        // *** TO-DO ***
        vis.currentBrushRegion = null;
        vis.brush = d3.brushX()
            .extent([[0,0],[vis.width, vis.height]])
            .on("brush", function(event){

                // User just selected a specific region
                vis.currentBrushRegion = event.selection;
                vis.currentBrushRegion = vis.currentBrushRegion.map(vis.x.invert);

                // 3. Trigger the event 'selectionChanged' of our event handler
                vis.eventHandler.trigger("selectionChanged", vis.currentBrushRegion);
            });


        // Append brush component here
        // *** TO-DO ***
        vis.brushGroup = vis.svg.append("g")
            .attr("class", "brush")
            .call(vis.brush);

        // Add zoom component
        // *** TO-DO ***
        //
        vis.xOrig = vis.x; // save original scale
        //
        vis.zoomFunction = function(event) {
            console.log("zoom");
            vis.xScaleModified = event.transform.rescaleX(vis.xOrig);
            vis.x = vis.xScaleModified;
            if(vis.currentBrushRegion) {
                vis.brushGroup.call(vis.brush.move, vis.currentBrushRegion.map(vis.x));
            }
            vis.updateVis();
        } // function that is being called when user zooms
        //
        vis.zoom = d3.zoom()
            .on("zoom", vis.zoomFunction)
            .scaleExtent([1,30]);

        // (Filter, aggregate, modify data)
        vis.wrangleData();
    }



    /*
     * Data wrangling
     */

    wrangleData() {
        let vis = this;

        // Update the visualization
        vis.updateVis();
    }



    /*
     * The drawing function - should use the D3 update sequence (enter, update, exit)
     * Function parameters only needed if different kinds of updates are needed
     */

    updateVis() {
        let vis = this;

        vis.brushGroup.call(vis.zoom)
            .on("mousedown.zoom", null)
            .on("touchstart.zoom", null);

        vis.xAxis.scale(vis.x);

        vis.malePath = d3.area()
            .curve(d3.curveLinear)
            .x(function(d){
                return vis.x(d.time)
            })
            .y0(vis.height)
            .y1(function(d){
                return vis.y(d.male)
            });

        vis.femalePath = d3.area()
            .curve(d3.curveLinear)
            .x(function(d){
                return vis.x(d.time)
            })
            .y0(vis.height)
            .y1(function(d){
                return vis.y(d.female)
            });

        vis.nonbinaryPath = d3.area()
            .curve(d3.curveLinear)
            .x(function(d){
                return vis.x(d.time)
            })
            .y0(vis.height)
            .y1(function(d){
                return vis.y(d.nonbinary)
            });

        // Call the area function and update the path
        // D3 uses each data point and passes it to the area function.
        // The area function translates the data into positions on the path in the SVG.
        vis.maletimePath
            .datum(vis.displayData)
            .attr("d", vis.malePath)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("clip-path", "url(#clip)");

        vis.femaletimePath
            .datum(vis.displayData)
            .attr("d", vis.femalePath)
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("stroke-width", 1.5)
            .attr("clip-path", "url(#clip)");

        vis.nonbinarytimePath
            .datum(vis.displayData)
            .attr("d", vis.nonbinaryPath)
            .attr("fill", "none")
            .attr("stroke", "purple")
            .attr("stroke-width", 1.5)
            .attr("clip-path", "url(#clip)");

        // Call axis functions with the new domain

        vis.svg.select(".x-axis").call(vis.xAxis);
        vis.svg.select(".y-axis").call(vis.yAxis);

    }


    onSelectionChange(selectionStart, selectionEnd) {
        let vis = this;

        console.log(selectionStart);
        console.log(selectionEnd);
        // d3.select("#time-period-min").text(dateFormatter(selectionStart));
        // d3.select("#time-period-max").text(dateFormatter(selectionEnd));

    }
}

