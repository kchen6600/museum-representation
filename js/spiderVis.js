/* * * * * * * * * * * * * *
*     class SpiderVis      *
* * * * * * * * * * * * * */


class SpiderVis {
    constructor(parentElement, _data){
        this.parentElement = parentElement;
        this.data = _data;
        this.displayData = [];

        this.initVis()
    }

    initVis() {
        let vis = this;

        console.log("original data:", vis.data);
        vis.filtered = (vis.data)[0].filter(function (d) {
            return d.Gender == "Female";
        })
        console.log("filtered data:", vis.filtered);

        let exdata = [];
        let features = ["A", "B", "C", "D", "E", "F"];
//generate the data
        for (var i = 0; i < 3; i++) {
            var point = {}
            //each feature will be a random number from 1-9
            features.forEach(f => point[f] = 1 + Math.random() * 8);
            exdata.push(point);
        }
        console.log(exdata);

        // separate out all nationalities
        vis.nationality = [];
        vis.filtered.forEach(function (d, i) {
            var personCount = 0;

            if (vis.nationality.includes(d.Nationality) != true) {
                var country = d.Nationality;
                vis.nationality.push(country);
            }
        })
        vis.nationality.forEach(function (d, i) {
            if (vis.nationality[i] === undefined) {
                vis.nationality[i] = "Unknown";
            }
        })

        vis.natData = []
        var countryInfo = {}
        var count = 1;
        vis.nationality.forEach(f => countryInfo[f] = 1 + Math.random() * 8)

        vis.natData.push(countryInfo);

        // vis.natData = vis.natData[0];


        console.log("Nationality array", vis.natData);


        // create the base of the spider vis
        vis.svg = d3.select("#spidervis").append("svg")
            .attr("width", 600)
            .attr("height", 600)
            .attr("stroke", "gray");

        vis.radialScale = d3.scaleLinear()
            .domain([0, 10])
            .range([0, 250]);

        // append the ticks for the count TO BE CHANGED
        vis.ticks = [2, 4, 6, 8, 10];

        vis.ticks.forEach(t =>
            vis.svg.append("circle")
                .attr("cx", 300)
                .attr("cy", 300)
                .attr("fill", "none")
                .attr("stroke", "gray")
                .attr("r", vis.radialScale(t))
        );

        vis.ticks.forEach(t =>
            vis.svg.append("text")
                .attr("x", 305)
                .attr("y", 300 - vis.radialScale(t))
                .text(t.toString())
        );

        // sets the labels as the nationalities and spaces them evenly across the chart
        function angleToCoordinate(angle, value) {
            let x = Math.cos(angle) * vis.radialScale(value);
            let y = Math.sin(angle) * vis.radialScale(value);
            return {"x": 300 + x, "y": 300 - y};
        }

        for (var i = 0; i < vis.nationality.length; i++) {
            let ft_name = vis.nationality[i];
            let angle = (Math.PI / 2) + (2 * Math.PI * i / vis.nationality.length);
            let line_coordinate = angleToCoordinate(angle, 10);
            let label_coordinate = angleToCoordinate(angle, 10.5);

            //draw axis line
            vis.svg.append("line")
                .attr("x1", 300)
                .attr("y1", 300)
                .attr("x2", line_coordinate.x)
                .attr("y2", line_coordinate.y)
                .attr("stroke", "gray");

            //draw axis label
            vis.svg.append("text")
                .attr("x", label_coordinate.x)
                .attr("y", label_coordinate.y)
                .attr("stroke", "black")
                .attr("font-size", "10")

                .text(ft_name);
        }

        // plotting the data
        vis.line = d3.line()
            .x(d => d.x)
            .y(d => d.y);
        vis.colors = ["darkorange"];


        function getPathCoordinates(data_point) {
            let coordinates = [];
            for (var i = 0; i < vis.nationality.length; i++) {
                let ft_name = vis.nationality[i];
                let angle = (Math.PI / 2) + (2 * Math.PI * i / vis.nationality.length);
                coordinates.push(angleToCoordinate(angle, data_point[ft_name]));
            }
            return coordinates;
        }
        for (var i = 0; i < 70; i++) {
            let d = vis.natData[i];
            let color = vis.colors[i];
            let coordinates = getPathCoordinates(d);

            //     //draw the path element
                vis.svg.append("path")
                    .datum(coordinates)
                    .attr("d", vis.line)
                    .attr("stroke-width", 3)
                    .attr("stroke", color)
                    .attr("fill", color)
                    .attr("stroke-opacity", 1)
                    .attr("opacity", 0.5);
            }
            // this.wrangleData();
        }

        // wrangleData(){
        //     let vis = this;
        //
        //     vis.filteredData = [];
        //
        //     vis.nationality.forEach(function(d, i){
        //
        //         var filtered = (vis.data)[0].filter(function(item){
        //             return item.nationality == d
        //         });
        //
        //         var maleCount = 0;
        //         var femaleCount = 0;
        //         //
        //         vis.data.forEach(function(country){
        //             //console.log(item.Gender);
        //
        //             if ((country.Gender).includes("Male")){
        //                 maleCount += 1
        //             }
        //             else if ((country.Gender).includes("Female")){
        //                 femaleCount += 1
        //             }
        //         })
        //         //
        //         let filteredNations = {
        //             "nation": d,
        //             "male": maleCount,
        //             "female": femaleCount,
        //         }
        //         //
        //         vis.filteredData.push(filteredNations);
        //     });
        //
        //     console.log(vis.filteredData);
        // }




    // constructor(parentElement, _data){
    //     this.parentElement = parentElement;
    //     this.data = _data;
    //     this.displayData = [];
    //
    //     this.initVis()
    // }
    //
    // initVis(){
    //     console.log("IN SPIDER");
    //     RadarChart.draw(this.parentElement, data);
    //
    // }

    // wrangleData(){
    // //    count the women of ppl per nationality
    //     //    count the men of ppl per nationality
    //
    //
    // }
    //
    // updateVis(){
    //
}