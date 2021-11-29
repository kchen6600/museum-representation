/* * * * * * * * * * * * * *
*      class BarVis        *
* * * * * * * * * * * * * */


class BarVis {

    constructor(parentElement, _data){
        this.parentElement = parentElement;
        this.data = _data;
        this.displayData = [];

        this.initVis()
    }

    initVis(){
        let vis = this;

        vis.departments = [];

        (vis.data)[0].forEach(function(d, i){

            if (vis.departments.includes(d.Department) != true){
                vis.departments.push(d.Department);
            }

        })

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
            .text('Male vs Female Artist Representation by Department')
            .attr('transform', `translate(${vis.width / 2}, 10)`)
            .attr('text-anchor', 'middle');

        // tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'barTooltip')

        vis.x = d3.scaleBand()
            .range([vis.margin.right, vis.width])
            .paddingInner(0.1);

        vis.y = d3.scaleLinear()
            .range([vis.height, 0]);

        vis.xAxis = d3.axisBottom(vis.x);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y)
            .ticks(10);

        vis.svg.append("g")
            .attr("class", "axis y-axis");

        vis.svg.append("g")
            .attr("class", "axis x-axis")
            .attr("transform", "translate(0," + vis.height + ")" );

        this.wrangleData();
    }

    wrangleData(){
        let vis = this;

        vis.filteredData = [];

        vis.departments.forEach(function(d, i){

            var filtered = (vis.data)[0].filter(function(item){
                return item.Department == d
            });

            // console.log("bar filter", filtered);

            var malecount = 0;
            var femalecount = 0;
            //
            filtered.forEach(function(item){
                //console.log(item.Gender);

                if ((item.Gender).includes("Male")){
                    malecount += 1
                }
                else if ((item.Gender).includes("Female")){
                    femalecount += 1
                }
            })
            //
            let dept = {
                "name": d,
                "male": malecount,
                "female": femalecount,
            }
            //
            vis.filteredData.push(dept);
        });

        //console.log(vis.filteredData);

        vis.updateVis()

    }

    updateVis(){
        let vis = this;

        vis.x.domain(vis.filteredData.map(d => d.name));
        var maleselection = d3.map(vis.filteredData, function(d){
            return d.male;
        });
        var femaleselection = d3.map(vis.filteredData, function(d){
            return d.female;
        });

        var selection = maleselection.concat(femaleselection);

        vis.y.domain([d3.min(selection), d3.max(selection)]);

        vis.svg.select("g.y-axis")
            .call(vis.yAxis);

        vis.svg.select("g.x-axis")
            .call(vis.xAxis);

        vis.barsMale = vis.svg.selectAll(".male-bars")
            .data(vis.filteredData);

        vis.barsMale.exit()
            .transition()
            .duration(100)
            .remove();

        vis.barsMale
            .enter()
            .append("rect")
            .attr("class", "male-bars")
            .attr('fill', "blue")
            .merge(vis.barsMale)
            .attr("width", vis.x.bandwidth() / 2)
            .attr("height", function(d, i){
                return vis.height - vis.y(d.male);
            })
            .attr("x", d => vis.x(d.name))
            .attr("y", function(d, i){
               return vis.y(d.male);
            })
            .on('mouseover', function(event, d){
                d3.select(this)
                    .attr('stroke-width', '2px')
                    .attr('stroke', 'black')
                    .attr('fill', 'rgba(173,222,255,0.62)')
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                     <div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 20px">
                        <h6>${d.name}<h6>
                        <h7><b>${d.male}</b> male artist pieces</h7>
                     </div>`);
            })
            .on('mouseout', function(event, d){
                d3.select(this)
                    .attr('stroke-width', '0px')
                    .attr("fill", "blue")
                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            })
        ;

        vis.barsFemale = vis.svg.selectAll(".female-bars")
            .data(vis.filteredData);

        vis.barsFemale.exit()
            .transition()
            .duration(100)
            .remove();

        vis.barsFemale
            .enter()
            .append("rect")
            .attr("class", "female-bars")
            .attr('fill', "red")
            .merge(vis.barsFemale)
            .attr("width", vis.x.bandwidth() / 2)
            .attr("height", function(d, i){
                return vis.height - vis.y(d.female);
            })
            .attr("x", d => vis.x(d.name) + (vis.x.bandwidth() / 2))
            .attr("y", function(d, i){
                return vis.y(d.female);
            })
            .on('mouseover', function(event, d){
                d3.select(this)
                    .attr('stroke-width', '2px')
                    .attr('stroke', 'black')
                    .attr('fill', 'rgba(255,192,203,0.62)')
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                     <div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 20px">
                        <h6>${d.name}<h6>
                        <h7><b>${d.female}</b> female artist pieces</h7>
                     </div>`);
            })
            .on('mouseout', function(event, d){
                d3.select(this)
                    .attr('stroke-width', '0px')
                    .attr("fill", "red")
                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            })
        ;


        console.log('here')

    }



}