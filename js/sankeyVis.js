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

    initVis() {
        let vis = this;

        // console.log("data", vis.data)

        // standardize fields
        vis.data.forEach(function(d, i) {
            d.Nationality = d.Nationality[0];
            if (d.Nationality == undefined) {
                d.Nationality = "Nationality unknown";
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

        vis.genderGroup = this.groupBy(vis.data,"Gender");

        vis.nationalityGroupMale = this.groupBy(vis.genderGroup["Male"],"Nationality");
        vis.nationalityGroupFemale = this.groupBy(vis.genderGroup["Female"],"Nationality");
        vis.nationalityGroupNonbinary = this.groupBy(vis.genderGroup["Non-Binary"],"Nationality");

        vis.CLEANnationalityGroupMale = {}
        vis.CLEANnationalityGroupFemale = {}
        vis.CLEANnationalityGroupNonbinary = {}

        vis.French = []
        vis.American = []
        vis.German = []
        vis.Dutch = []
        vis.Italian = []
        vis.British = []
        vis.Japanese = []
        vis.Swiss = []
        vis.Spanish = []
        vis.Russian = []
        vis.Belgian = []
        vis.Mexican = []
        vis["Nationality unknown"] = []

        // CLEANING nationalities
        for (let attr in vis.nationalityGroupMale){
            if (vis.nationalityGroupMale[attr].length > 1000) {
                vis.CLEANnationalityGroupMale[attr] = vis.nationalityGroupMale[attr];
                for (let i = 0; i < vis.nationalityGroupMale[attr].length; i++) {
                    vis[attr].push(vis.nationalityGroupMale[attr][i]);
                }
            }
        }
        for (let attr in vis.nationalityGroupFemale){
            if (vis.nationalityGroupFemale[attr].length > 1000) {
                vis.CLEANnationalityGroupFemale[attr] = vis.nationalityGroupFemale[attr];
                for (let i = 0; i < vis.nationalityGroupFemale[attr].length; i++) {
                    vis[attr].push(vis.nationalityGroupFemale[attr][i]);
                }
            }
        }
        for (let attr in vis.nationalityGroupNonbinary){
            if (vis.nationalityGroupNonbinary[attr].length > 1000) {
                vis.CLEANnationalityGroupNonbinary[attr] = vis.nationalityGroupNonbinary[attr];
                for (let i = 0; i < vis.nationalityGroupNonbinary[attr].length; i++) {
                    vis[attr].push(vis.nationalityGroupNonbinary[attr][i]);
                }
            }
        }

        vis.classificationFrench = this.groupBy(vis.French,"Classification");
        vis.classificationAmerican = this.groupBy(vis.American,"Classification");
        vis.classificationGerman = this.groupBy(vis.German,"Classification");
        vis.classificationDutch = this.groupBy(vis.Dutch,"Classification");
        vis.classificationItalian = this.groupBy(vis.Italian,"Classification");
        vis.classificationBritish = this.groupBy(vis.British,"Classification");
        vis.classificationJapanese = this.groupBy(vis.Japanese,"Classification");
        vis.classificationSwiss = this.groupBy(vis.Swiss,"Classification");
        vis.classificationSpanish = this.groupBy(vis.Spanish,"Classification");
        vis.classificationRussian = this.groupBy(vis.Russian,"Classification");
        vis.classificationBelgian = this.groupBy(vis.Belgian,"Classification");
        vis.classificationMexican = this.groupBy(vis.Mexican,"Classification");
        vis.classificationUnknown = this.groupBy(vis["Nationality unknown"],"Classification");

        vis.CLEANclassificationGroupMale = {}
        vis.CLEANclassificationGroupFemale = {}
        vis.CLEANclassificationGroupNonbinary = {}

        vis.CLEANfrench = {}
        vis.CLEANamerican = {}
        vis.CLEANgerman = {}
        vis.CLEANdutch = {}
        vis.CLEANitalian = {}
        vis.CLEANbritish = {}
        vis.CLEANjapanese = {}
        vis.CLEANswiss = {}
        vis.CLEANspanish = {}
        vis.CLEANrussian = {}
        vis.CLEANbelgian = {}
        vis.CLEANmexican = {}
        vis.CLEANunknown = {}

        // CLEANING classifications
        for (let attr in vis.classificationFrench){
            if (vis.classificationFrench[attr].length > 100) {
                vis.CLEANfrench[attr] = vis.classificationFrench[attr];
            }
        }
        for (let attr in vis.classificationAmerican){
            if (vis.classificationAmerican[attr].length > 100) {
                vis.CLEANamerican[attr] = vis.classificationAmerican[attr];
            }
        }
        for (let attr in vis.classificationGerman){
            if (vis.classificationGerman[attr].length > 100) {
                vis.CLEANgerman[attr] = vis.classificationGerman[attr];
            }
        }
        for (let attr in vis.classificationDutch){
            if (vis.classificationDutch[attr].length > 100) {
                vis.CLEANdutch[attr] = vis.classificationDutch[attr];
            }
        }
        for (let attr in vis.classificationItalian){
            if (vis.classificationItalian[attr].length > 100) {
                vis.CLEANitalian[attr] = vis.classificationItalian[attr];
            }
        }
        for (let attr in vis.classificationBritish){
            if (vis.classificationBritish[attr].length > 100) {
                vis.CLEANbritish[attr] = vis.classificationBritish[attr];
            }
        }
        for (let attr in vis.classificationJapanese){
            if (vis.classificationJapanese[attr].length > 100) {
                vis.CLEANjapanese[attr] = vis.classificationJapanese[attr];
            }
        }
        for (let attr in vis.classificationSwiss){
            if (vis.classificationSwiss[attr].length > 100) {
                vis.CLEANswiss[attr] = vis.classificationSwiss[attr];
            }
        }
        for (let attr in vis.classificationSpanish){
            if (vis.classificationSpanish[attr].length > 100) {
                vis.CLEANspanish[attr] = vis.classificationSpanish[attr];
            }
        }
        for (let attr in vis.classificationRussian){
            if (vis.classificationRussian[attr].length > 100) {
                vis.CLEANrussian[attr] = vis.classificationRussian[attr];
            }
        }
        for (let attr in vis.classificationBelgian){
            if (vis.classificationBelgian[attr].length > 100) {
                vis.CLEANbelgian[attr] = vis.classificationBelgian[attr];
            }
        }
        for (let attr in vis.classificationMexican){
            if (vis.classificationMexican[attr].length > 100) {
                vis.CLEANmexican[attr] = vis.classificationMexican[attr];
            }
        }
        for (let attr in vis.classificationUnknown){
            if (vis.classificationUnknown[attr].length > 100) {
                vis.CLEANunknown[attr] = vis.classificationUnknown[attr];
            }
        }

        // flow: gender -> nationality -> classification

        vis.nodes = []
        // nodes: genders
        for (let attr in vis.genderGroup) {
            vis.nodes.push({ id: attr})
        }
        // nodes: nationalities
        let nationSet = new Set()
        for (let attr in vis.CLEANnationalityGroupMale) {
            nationSet.add(attr)
            vis.nodes.push({ id: attr})
        }
        for (let attr in vis.CLEANnationalityGroupFemale) {
            if (nationSet.has(attr)) {
                continue
            } else {
                nationSet.add(attr)
                vis.nodes.push({ id: attr})
            }
        }
        for (let attr in vis.CLEANnationalityGroupNonbinary) {
            if (nationSet.has(attr)) {
                continue
            } else {
                nationSet.add(attr)
                vis.nodes.push({ id: attr})
            }
        }
        // nodes: classifications
        let classSet = new Set()
        for (let attr in vis.CLEANfrench) {
            classSet.add(attr)
            vis.nodes.push({ id: attr})
        }
        for (let attr in vis.CLEANamerican) {
            if (classSet.has(attr)) {
                continue
            } else {
                classSet.add(attr)
                vis.nodes.push({ id: attr})
            }
        }
        for (let attr in vis.CLEANgerman) {
            if (classSet.has(attr)) {
                continue
            } else {
                classSet.add(attr)
                vis.nodes.push({ id: attr})
            }
        }
        for (let attr in vis.CLEANdutch) {
            if (classSet.has(attr)) {
                continue
            } else {
                classSet.add(attr)
                vis.nodes.push({ id: attr})
            }
        }
        for (let attr in vis.CLEANitalian) {
            if (classSet.has(attr)) {
                continue
            } else {
                classSet.add(attr)
                vis.nodes.push({ id: attr})
            }
        }
        for (let attr in vis.CLEANbritish) {
            if (classSet.has(attr)) {
                continue
            } else {
                classSet.add(attr)
                vis.nodes.push({ id: attr})
            }
        }
        for (let attr in vis.CLEANjapanese) {
            if (classSet.has(attr)) {
                continue
            } else {
                classSet.add(attr)
                vis.nodes.push({ id: attr})
            }
        }
        for (let attr in vis.CLEANswiss) {
            if (classSet.has(attr)) {
                continue
            } else {
                classSet.add(attr)
                vis.nodes.push({ id: attr})
            }
        }
        for (let attr in vis.CLEANspanish) {
            if (classSet.has(attr)) {
                continue
            } else {
                classSet.add(attr)
                vis.nodes.push({ id: attr})
            }
        }
        for (let attr in vis.CLEANrussian) {
            if (classSet.has(attr)) {
                continue
            } else {
                classSet.add(attr)
                vis.nodes.push({ id: attr})
            }
        }
        for (let attr in vis.CLEANbelgian) {
            if (classSet.has(attr)) {
                continue
            } else {
                classSet.add(attr)
                vis.nodes.push({ id: attr})
            }
        }
        for (let attr in vis.CLEANmexican) {
            if (classSet.has(attr)) {
                continue
            } else {
                classSet.add(attr)
                vis.nodes.push({ id: attr})
            }
        }
        for (let attr in vis.CLEANunknown) {
            if (classSet.has(attr)) {
                continue
            } else {
                classSet.add(attr)
                vis.nodes.push({ id: attr})
            }
        }

        // create links
        vis.links = []
        // links: gender to nationality
        for (let attr in vis.CLEANnationalityGroupMale) {
            vis.links.push({ source: "Male", target: attr, value: vis.CLEANnationalityGroupMale[attr].length})
        }
        for (let attr in vis.CLEANnationalityGroupFemale) {
            vis.links.push({ source: "Female", target: attr, value: vis.CLEANnationalityGroupFemale[attr].length})
        }
        for (let attr in vis.CLEANnationalityGroupNonbinary) {
            vis.links.push({ source: "Non-Binary", target: attr, value: vis.CLEANnationalityGroupNonbinary[attr].length})
        }
        // links: nationality to classification
        for (let attr in vis.CLEANfrench) {
            vis.links.push({ source: "French", target: attr, value: vis.CLEANfrench[attr].length})
        }
        for (let attr in vis.CLEANamerican) {
            vis.links.push({source: "American", target: attr, value: vis.CLEANamerican[attr].length})
        }
        for (let attr in vis.CLEANgerman) {
            vis.links.push({source: "German", target: attr, value: vis.CLEANgerman[attr].length})
        }
        for (let attr in vis.CLEANdutch) {
            vis.links.push({source: "Dutch", target: attr, value: vis.CLEANdutch[attr].length})
        }
        for (let attr in vis.CLEANitalian) {
            vis.links.push({source: "Italian", target: attr, value: vis.CLEANitalian[attr].length})
        }
        for (let attr in vis.CLEANbritish) {
            vis.links.push({source: "British", target: attr, value: vis.CLEANbritish[attr].length})
        }
        for (let attr in vis.CLEANswiss) {
            vis.links.push({source: "Swiss", target: attr, value: vis.CLEANswiss[attr].length})
        }
        for (let attr in vis.CLEANspanish) {
            vis.links.push({source: "Spanish", target: attr, value: vis.CLEANspanish[attr].length})
        }
        for (let attr in vis.CLEANrussian) {
            vis.links.push({source: "Russian", target: attr, value: vis.CLEANrussian[attr].length})
        }
        for (let attr in vis.CLEANbelgian) {
            vis.links.push({source: "Belgian", target: attr, value: vis.CLEANbelgian[attr].length})
        }
        for (let attr in vis.CLEANmexican) {
            vis.links.push({source: "Mexican", target: attr, value: vis.CLEANmexican[attr].length})
        }
        for (let attr in vis.CLEANunknown) {
            vis.links.push({ source: "Nationality unknown", target: attr, value: vis.CLEANunknown[attr].length})
        }

        vis.sankeyData = {
            nodes: vis.nodes,
            links: vis.links
        }

        // console.log("SANKEY DATA", vis.sankeyData)

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
            .text('Gender, Nationality, and Art Classification Relationships')
            .attr('transform', `translate(${vis.width / 2}, -5)`)
            .attr('text-anchor', 'middle');

        vis.sankey = d3.sankey()
            .size([vis.width, vis.height])
            .nodeId(d => d.id)
            .nodeWidth(20)
            .nodePadding(10)
            .nodeAlign(d3.sankeyCenter);
        vis.graph = vis.sankey(vis.sankeyData);

        vis.x = d3.scaleLinear()
            .range([0, vis.width])
            .domain(d3.extent(this.getFields(vis.graph.nodes, "x0")));

        vis.y = d3.scaleLinear()
            .range([vis.height, 0])
            .domain(d3.extent(this.getFields(vis.graph.nodes, "y0")));

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
            .attr("stroke-opacity", 0.5)
            .on("mouseover", function(d) {
                if (d.toElement.__data__.source.layer == 0) {
                    let target = d.toElement.__data__.target.id;
                    let relatedLinks = Object.values(d3.selectAll(".link")._groups[0]).filter(d => d.__data__.source.id != target);
                    for (let i = 0; i < relatedLinks.length; i++) {
                        d3.select(relatedLinks[i]).attr("stroke-opacity", 0.1)
                    }
                } else {
                    let relatedLinks = Object.values(d3.selectAll(".link")._groups[0]);
                    for (let i = 0; i < relatedLinks.length; i++) {
                        d3.select(relatedLinks[i]).attr("stroke-opacity", 0.1)
                    }
                }
                d3.select(this).attr("stroke-opacity", 0.5);
            })
            .on("mouseleave", function(d) {
                // d3.select(this).attr("stroke-opacity", 0.5);
                if (d.fromElement.__data__.source.layer == 0) {
                    let target = d.fromElement.__data__.target.id;
                    let relatedLinks = Object.values(d3.selectAll(".link")._groups[0]).filter(d => d.__data__.source.id != target);
                    for (let i = 0; i < relatedLinks.length; i++) {
                        d3.select(relatedLinks[i]).attr("stroke-opacity", 0.5)
                    }
                }
            });

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
                    return d.x0 - vis.sankey.nodeWidth() + 10
                } else {
                    return d.x0 + vis.sankey.nodeWidth() + 10
                }
            })
            .attr("y", d => ((d.y1 - d.y0) / 2) + d.y0)
            .attr("dy", ".35em")
            .attr("text-anchor", d => (d.x0 < vis.width / 2) ? "start" : "end")
            .attr("transform", null)
            .text(d => d.id);

        this.wrangleData();
    }

    color(index) {
        let ratio = index / (this.sankeyData.nodes.length - 1.0);
        // console.log(this.colorScale(ratio))
        return this.colorScale(ratio);
    }

    wrangleData() {
        let vis = this;
        vis.updateVis()

    }

    updateVis() {
        let vis = this;
    }

    getFields(input, field) {
        let output = [];
        for (let i=0; i < input.length ; ++i)
            output.push(input[i][field]);
        return output;
    }


    // groupBy(list, key) {
    //     return list.reduce(function(rv, x) {
    //         (rv[x[key]] = rv[x[key]] || []).push(x);
    //         return rv;
    //     }, {});
    // };
}