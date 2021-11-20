/* * * * * * * * * * * * * *
*      class SankeyVis        *
* * * * * * * * * * * * * */


class SankeyVis {

    constructor(parentElement, _data) {
        this.parentElement = parentElement;
        this.data = _data[0];
        this.displayData = [];

        this.initVis()
    }

    initVis() {
        let vis = this;

        console.log("data", vis.data)

        vis.male = [];
        // Illustrated Book, Photograph, Design, Publication, Print, Drawing, Multiple, Installation, Video, Film, Architecture, Sculpture, Audio, Graphic Design, Work on Paper, Ephemera, Poster, Software, Furniture and Interiors
        vis.maleClassification = [0, 0, 0, 0];
        vis.female = [];
        vis.femaleClassification = [0, 0, 0, 0];

        (vis.data).forEach(function(d, i){

            if (d.Gender[0] == "Male"){
                vis.male.push(d);
                if (d.Classification == "Illustrated Book") {
                    let current = vis.maleClassification[0]
                    vis.maleClassification[0] = current + 1;
                } else if (d.Classification == "Photograph") {
                    let current = vis.maleClassification[1]
                    vis.maleClassification[1] = current + 1;
                } else if (d.Classification == "Design") {
                    let current = vis.maleClassification[2]
                    vis.maleClassification[2] = current + 1;
                } else if (d.Classification == "Publication") {
                    let current = vis.maleClassification[3]
                    vis.maleClassification[3] = current + 1;
                }
            } else if (d.Gender[0] == "Female"){
                vis.female.push(d);
                if (d.Classification == "Illustrated Book") {
                    let current = vis.femaleClassification[0]
                    vis.femaleClassification[0] = current + 1;
                } else if (d.Classification == "Photograph") {
                    let current = vis.femaleClassification[1]
                    vis.femaleClassification[1] = current + 1;
                } else if (d.Classification == "Design") {
                    let current = vis.femaleClassification[2]
                    vis.femaleClassification[2] = current + 1;
                } else if (d.Classification == "Publication") {
                    let current = vis.femaleClassification[3]
                    vis.femaleClassification[3] = current + 1;
                }
            }

        })

        // console.log("male", vis.male.length)
        // console.log("female", vis.female.length)

        // nodes -> gender -> classification -> nationality

        vis.sankeyData = {
            nodes: [
                { id: "Male" },
                { id: "Female" },
                { id: "Illustrated Book" },
                { id: "Photograph" },
                { id: "Design" },
                { id: "Publication" },
                { id: "American" },
                { id: "French" },
                { id: "Japanese" }
            ],
            links: [
                { source: "Male", target: "Illustrated Book", value: vis.maleClassification[0] },
                { source: "Male", target: "Photograph", value: vis.maleClassification[1] },
                { source: "Male", target: "Design", value: vis.maleClassification[2] },
                { source: "Male", target: "Publication", value: vis.maleClassification[3] },
                { source: "Female", target: "Illustrated Book", value: vis.femaleClassification[0] },
                { source: "Female", target: "Photograph", value: vis.femaleClassification[1] },
                { source: "Female", target: "Design", value: vis.femaleClassification[2] },
                { source: "Female", target: "Publication", value: vis.femaleClassification[3] },
                { source: "Illustrated Book", target: "American", value: 20000 },
                { source: "Photograph", target: "American", value: 15000 },
                { source: "Design", target: "French", value: 6000 },
                // { source: "Publication", target: "Japanese", value: 2000 },
            ]
        }

        vis.margin = {top: 20, right: 20, bottom: 20, left: 40};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append('g')
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // add title
        vis.svg.append('g')
            .attr('class', 'title bar-title')
            .append('text')
            .text('Sankey Diagram of Attributes')
            .attr('transform', `translate(${vis.width / 2}, -5)`)
            .attr('text-anchor', 'middle');

        vis.sankey = d3.sankey()
            .size([vis.width, vis.height])
            .nodeId(d => d.id)
            .nodeWidth(20)
            .nodePadding(10)
            .nodeAlign(d3.sankeyCenter);
        vis.graph = vis.sankey(vis.sankeyData);

        vis.links = vis.svg
            .append("g")
            .classed("links", true)
            .selectAll("path")
            .data(vis.graph.links)
            .enter()
            .append("path")
            .classed("link", true)
            .attr("d", d3.sankeyLinkHorizontal())
            .attr("fill", "none")
            .attr("stroke", "#D3D3D3")
            .attr("stroke-width", d => d.width)
            .attr("stoke-opacity", 0.5);

        vis.nodes = vis.svg
            .append("g")
            .classed("nodes", true)
            .selectAll("rect")
            .data(vis.graph.nodes)
            .enter()
            .append("rect")
            .classed("node", true)
            .attr("x", d => d.x0)
            .attr("y", d => d.y0)
            .attr("width", d => d.x1 - d.x0)
            .attr("height", d => d.y1 - d.y0)
            .attr("fill", "blue")
            .attr("opacity", 0.8);

        this.wrangleData();
    }

    wrangleData() {
        let vis = this;
        vis.updateVis()

    }

    updateVis() {
        let vis = this;
    }
}