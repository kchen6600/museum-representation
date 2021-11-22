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

        vis.data.forEach(function(d, i) {
            d.Nationality = d.Nationality[0];
            if (d.Nationality == "") {
                d.Nationality = undefined;
            }
            d.Gender = d.Gender[0];
            if (d.Gender == "Female" || d.Gender == "female") {
                d.Gender = "Female";
            } else if (d.Gender == "Male" || d.Gender == "male") {
                d.Gender = "Male";
            } else if (d.Gender == "Non-Binary" || d.Gender == "Non-binary" || d.Gender == "" || d.Gender == undefined) {
                d.Gender = "Non-Binary";
            }

        })

        vis.male = [];
        // Illustrated Book, Photograph, Design, Publication, Print, Drawing, Multiple, Installation, Video, Film, Architecture, Sculpture, Audio, Graphic Design, Work on Paper, Ephemera, Poster, Software, Furniture and Interiors
        vis.maleClassification = [0, 0, 0, 0];
        vis.female = [];
        vis.femaleClassification = [0, 0, 0, 0];
        // let genderGroup = vis.groupBy(vis.data,"Gender");
        // let classificationGroup = vis.groupBy(vis.data,"Classification");
        // let nationalityGroup = vis.groupBy(vis.data, "Nationality")

        // console.log("gender", genderGroup)
        // console.log("classification", classificationGroup)
        // console.log("nationality", nationalityGroup)

        (vis.data).forEach(function(d, i){

            if (d.Gender == "Male"){
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
            } else if (d.Gender == "Female"){
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
                { source: "Illustrated Book", target: "American", value: 18000 },
                { source: "Illustrated Book", target: "Japanese", value: 9000 },
                { source: "Photograph", target: "Japanese", value: 12000 },
                { source: "Design", target: "French", value: 6000 },
                { source: "Design", target: "American", value: 3000 },
                { source: "Photograph", target: "Japanese", value: 17000 },
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
            .attr("stroke-opacity", 0.5);

        vis.colorScale = d3.interpolateRainbow;

        vis.nodes = vis.svg
            .append("g")
            .classed("nodes", true)
            .selectAll("rect")
            .data(vis.graph.nodes)
            .enter();

        vis.nodes.append("rect")
            .classed("node", true)
            .attr("x", d => d.x0)
            .attr("y", d => d.y0)
            .attr("width", d => d.x1 - d.x0)
            .attr("height", d => d.y1 - d.y0)
            // .attr("fill", (d,i) => { console.log(d.id) })
            .attr("fill", "#74cfe9")
            .attr("opacity", 0.8);

        // add in the title for the nodes
        vis.nodes.append("text")
            .attr("x", d => {
                if (d.x0 > vis.width / 2) {
                    return d.x0 - vis.sankey.nodeWidth()*2 - 40
                } else {
                    return d.x0 + vis.sankey.nodeWidth() + 10
                }

            })
            .attr("y", d => d.y0 + 50)
            .attr("dy", ".35em")
            // .attr("text-anchor", "end")
            .attr("text-anchor", d => {
                if (d.x0 < vis.width / 2) {
                    console.log("LESS THAN", d.id)
                    return "start"
                } else {
                    console.log("MORE", d.id)
                    return "end"
                }
                    // ? "start" : "end"
            })
            .attr("transform", null)
            .text(d => d.id)
            .attr("text-anchor", "start");

        this.wrangleData();
    }

    color(index) {
        let ratio = index / (this.sankeyData.nodes.length - 1.0);
        console.log(this.colorScale(ratio))
        return this.colorScale(ratio);
    }

    wrangleData() {
        let vis = this;
        vis.updateVis()

    }

    updateVis() {
        let vis = this;
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


    // groupBy(list, key) {
    //     return list.reduce(function(rv, x) {
    //         (rv[x[key]] = rv[x[key]] || []).push(x);
    //         return rv;
    //     }, {});
    // };
}