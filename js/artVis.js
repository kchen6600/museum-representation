/* * * * * * * * * * * * * *
*      class ArtVis        *
* * * * * * * * * * * * * */

class ArtVis {

    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data[0];
        // this.config = config;
        this.displayData = data;

        this.field = "";
        this.filteredData = data;

        this.initVis();
    }

    groupBy(arr, criteria) {
        let newObj = arr.reduce(function(acc, currentValue) {
            if (!acc[currentValue[criteria]]) {
                acc[currentValue[criteria]] = [];
            }
            acc[currentValue[criteria]].push(currentValue);
            return acc;
        }, {});
        return newObj;
    }

    /*
     * Initialize visualization (static content; e.g. SVG area, axes)
     */

    initVis() {
        let vis = this;

        // * TO-DO *
        vis.margin = {top: 40, right: 40, bottom: 60, left: 45};

        // vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        // vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // Set width and height to the height of the parent element - margins
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right; // NEW!!
        vis.height = $('#' + vis.parentElement).height() - vis.margin.top - vis.margin.bottom; // NEW!!

        vis.data.forEach(function(d, i) {
            if (Array.isArray(d.Gender)) {
                d.Gender = d.Gender[0];
            }
            if (d.Gender == "Female" || d.Gender == "female") {
                d.Gender = "Female";
            }
            if (Array.isArray(d.Artist)) {
                d.Artist = d.Artist[0];
            }
        })
        vis.genderGroup = this.groupBy(vis.data,"Gender");
        vis.filteredData = vis.genderGroup["Female"];
        vis.artistGroup = this.groupBy(vis.filteredData,"Artist");
        vis.sortable = [];
        for (var artist in vis.artistGroup) {
            if (vis.artistGroup[artist][0].ThumbnailURL != null || vis.artistGroup[artist].length == 1) {
                vis.sortable.push([artist, vis.artistGroup[artist].length, vis.artistGroup[artist][0]])
            } else if (vis.artistGroup[artist][1].ThumbnailURL != null) {
                vis.sortable.push([artist, vis.artistGroup[artist].length, vis.artistGroup[artist][1]])
            }
            // } else if (vis.artistGroup[artist][2].ThumbnailURL != null) {
            //     vis.sortable.push([artist, vis.artistGroup[artist].length, vis.artistGroup[artist][2]])
            // }
        }
        // sort by number of artworks
        vis.sortable = vis.sortable.sort(function(a,b) {
            return b[1] - a[1];
        });
        vis.data = vis.sortable.slice(0, 15);
        // console.log("sortable", vis.data)

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left*2.5 + "," + vis.margin.top + ")");

        // Overlay with path clipping
        vis.svg.append("defs").append("clipPath")
            .attr("id", "clip")

            .append("rect")
            .attr("width", vis.width)
            .attr("height", vis.height);

        vis.x = d3.scaleLinear()
            .range([0, vis.width - 70])
            .domain([0, d3.extent(vis.data, function (d) {
                return d[1];
            })[1]]);

        let artistNames = [];
        for (let i = 0; i < vis.data.length; i++) {
            artistNames.push(vis.data[i][0])
        }

        vis.y = d3.scaleBand()
            .range([0, vis.height])
            .domain(artistNames);

        vis.xAxis = d3.axisBottom()
            .scale(vis.x);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y);

        vis.title = vis.svg.append("text")
            .attr("class", "barchart-title")
            .text("Top Female Artists Represented in the MoMA Collection")
            .attr('transform', `translate(${vis.width / 2}, -5)`)
            .attr('text-anchor', 'middle');

        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0,"+ vis.height+")")
            .style("font-size", "11px");

        vis.svg.append("g")
            .attr("class", "y-axis axis")
            .attr("x", 200)
            .style("font-size", "8px");

        vis.svg.select(".y-axis").call(vis.yAxis);
        vis.svg.select(".x-axis").call(vis.xAxis);

        // tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'artTooltip');

        // (2) Draw rectangles
        let rects = vis.svg.selectAll(".bars")
            .data(vis.data);

        rects.enter().append("rect")
            .attr("x", 0.5)
            .attr("y", 40)
            .attr("y", (d, i) => vis.y(artistNames[i]) + (vis.margin.top + vis.margin.bottom)/(artistNames.length) + 2)
            .attr("height", 10)
            .attr("width", d => vis.x(d[1]))
            .attr("class", "bars")
            .on('mouseover', function(event, d){
                d3.selectAll(".bars")
                    .attr("opacity", 0.2)
                d3.select(this)
                    .attr("opacity", 1)
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                     <div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 20px">
                        <h6>${d[0]}<h6>
                        <h7>Example artwork: <b>${d[2].Title}</b> </h7>
                        <img src=${d[2].ThumbnailURL} alt="example artwork">
                     </div>`);
            })
            .on('mouseout', function(event, d){
                d3.selectAll(".bars")
                    .attr("opacity", 1)
                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            });

        // (3) Draw labels
        let labels = vis.svg.selectAll(".labels")
            .data(vis.data);

        labels.enter().append("text")
            .attr("font-size", 12)
            .attr("opacity", .5)
            .merge(labels)
            .text(d => d[1])
            .attr("x", d => vis.x(d[1]) + 10)
            .attr("y", (d, i) => vis.y(artistNames[i]) + (vis.margin.top + vis.margin.bottom)/(artistNames.length) + 11)
            .attr("class", "labels");
    }

}
