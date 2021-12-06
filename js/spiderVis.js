/* * * * * * * * * * * * * *
*     class SpiderVis      *
* * * * * * * * * * * * * */


class SpiderVis {
    constructor(parentElement, _data){
        this.parentElement = parentElement;
        this.data = _data;
        this.displayData = [];
        this.change = 1;

        this.initVis()
    }

    initVis() {
        let vis = this;

        // console.log("original data:", vis.data);
        vis.filtered = (vis.data)[0].filter(function (d) {
            return d.Gender == "Female";
        })

        vis.male = (vis.data)[0].filter(function (d) {
            return d.Gender == "Male";
        })

        vis.filtered.sort()
        vis.male.sort()

        // separate out all nationalities, filtered by men and women
        vis.nationality = [];
        vis.femaleNat = [];
        vis.maleNat = [];
        vis.filtered.forEach(function (d, i) {

            if (vis.femaleNat.includes(d.Nationality) != true) {
                var country = d.Nationality;
                vis.femaleNat.push(country);
            }
        });
        vis.male.forEach(function (d, i) {
            if (vis.maleNat.includes(d.Nationality) != true) {
                var country = d.Nationality;
                vis.maleNat.push(country);
            }
        });
        // vis.nationality.push(vis.femaleNat, vis.maleNat);
        vis.femaleNat.forEach(function (d, i) {
            if (vis.femaleNat[i] === undefined) {
                vis.femaleNat[i] = "Unknown";
            }
        });
        vis.maleNat.forEach(function (d, i) {
            if (vis.maleNat[i] === undefined) {
                vis.maleNat[i] = "Unknown";
            }
        });

        // count men and women

        vis.natData = []
        var countryInfo ={}
        var femaleInfo ={}
        vis.femaleNat.forEach(function(f,i){
            var femaleCount = 0;
            vis.filtered.forEach(function(d){
                if(d.Nationality == f){
                    femaleCount += 1;
                }
            })

            femaleInfo[f] = femaleCount;
        })
        var maleInfo = {}
        vis.maleNat.forEach(function(f, i){
            var maleCount = 0;
            vis.male.forEach(function(d){
                if(d.Nationality == f){
                    maleCount += 1;
                }
            })
            maleInfo[f] = maleCount;
        })
        // console.log("Female INFO", femaleInfo);
        // console.log("Male INFO", maleInfo);

        // sort the two groups of data

        vis.femaleSorted = [];
        vis.maleSorted = [];

        for (var country in femaleInfo) {
            vis.femaleSorted.push([country, femaleInfo[country]]);
        }

        vis.femaleSorted.sort(function(a, b) {
            return b[1] - a[1];
        });

        for (var country in maleInfo) {
            vis.maleSorted.push([country, maleInfo[country]]);
        }

        vis.maleSorted.sort(function(a, b) {
            return b[1] - a[1];
        });


        vis.countries = [];
        vis.femaleSortable = vis.femaleSorted.slice(1,9);
        vis.femaleSortable.forEach(function (d,i){
            vis.countries.push(d[0]);
        })
        // console.log("countries", vis.countries);

        //select top 8 male countries based on female data
        vis.maleCountries = [];
        vis.maleSorted.forEach(function(d, i){
            vis.countries.forEach(function(d, j){
                if(vis.countries[j] === vis.maleSorted[i][0]){
                    vis.maleCountries.push(vis.maleSorted[i]);
                }
            })
        });
        // console.log("male country:", vis.maleCountries);

        // convert back into object
        vis.objSortedFemale = {};
        vis.objSortedMale = {};

        vis.femaleSortable.forEach(function(item){
            vis.objSortedFemale[item[0]]=item[1]
        });
        vis.maleCountries.forEach(function(item){
            vis.objSortedMale[item[0]]=item[1]
        });

        vis.natData.push(vis.objSortedMale, vis.objSortedFemale);

        // console.log("Nationality array", vis.natData);


        // create the base of the spider vis
        vis.svg = d3.select("#spidervis").append("svg")
            .attr("width", 800)
            .attr("height", 800);

        vis.radialScale = d3.scaleLinear()
            .domain([0, 23000])
            .range([0, 250]);

        // append the ticks for the count TO BE CHANGED
        vis.ticks = [1000, 5000, 10000, 15000, 23000];

        // add title
        vis.svg.append("text")
            .attr("x", 80)
            .attr("y", 30)
            .text("Distribution of Male and Female Artists Ranked by Top 8 Female Nationalities (Non American)");

        vis.svg.append("rect")
            .attr("x", 650)
            .attr("y", 150)
            .attr("width", 20)
            .attr("height", 20)
            .attr("fill", "pink");

        vis.svg.append("rect")
            .attr("x", 650)
            .attr("y", 175)
            .attr("width", 20)
            .attr("height", 20)
            .attr("fill", "orange");

        vis.svg.append("text")
            .attr("x", 675)
            .attr("y", 165)
            .text("male");

        vis.svg.append("text")
            .attr("x", 675)
            .attr("y", 190)
            .text("female");


        this.wrangleData();
    }

        wrangleData(){
            let vis = this;
            // INCLUDING AMERICANS
            d3.select("#american-toggle").on("click", function (){
                vis.change += 1;
                // console.log("button clicked");
                if(vis.change%2 === 0){
                    vis.natData = [];
                    vis.countries = [];
                    vis.femaleSortable = vis.femaleSorted.slice(0,8);
                    vis.femaleSortable.forEach(function (d,i){
                        vis.countries.push(d[0]);
                    })
                    // console.log("countries", vis.countries);

                    //select top 8 male countries based on female data
                    vis.maleCountries = [];
                    vis.maleSorted.forEach(function(d, i){
                        vis.countries.forEach(function(d, j){
                            if(vis.countries[j] === vis.maleSorted[i][0]){
                                vis.maleCountries.push(vis.maleSorted[i]);
                            }
                        })
                    });

                    // convert back into object
                    vis.objSortedFemale = {};
                    vis.objSortedMale = {};

                    vis.femaleSortable.forEach(function(item){
                        vis.objSortedFemale[item[0]]=item[1]
                    });
                    vis.maleCountries.forEach(function(item){
                        vis.objSortedMale[item[0]]=item[1]
                    });

                    vis.natData.push(vis.objSortedMale, vis.objSortedFemale);

                    // console.log("Nationality array", vis.natData);

                    vis.svgNew = d3.select("#spidervis").append("svg")
                        .attr("width", 800)
                        .attr("height", 800)
                        .attr("stroke", "gray");

                    vis.radialScale
                        .domain([0, 48000])
                        .range([0, 250]);

                    // append the ticks for the count TO BE CHANGED
                    vis.ticks = [3000, 6000, 12000, 24000, 48000];

                    vis.svgNew.append("text")
                        .attr("x",100)
                        .attr("y", 30)
                        .text("Distribution of Male and Female Artists Ranked by Top 8 Female Nationalities");

                    vis.svgNew.append("rect")
                        .attr("x", 650)
                        .attr("y", 150)
                        .attr("width", 20)
                        .attr("height", 20)
                        .attr("fill", "pink");

                    vis.svgNew.append("rect")
                        .attr("x", 650)
                        .attr("y", 175)
                        .attr("width", 20)
                        .attr("height", 20)
                        .attr("fill", "orange");

                    vis.svgNew.append("text")
                        .attr("x", 675)
                        .attr("y", 165)
                        .text("male");

                    vis.svgNew.append("text")
                        .attr("x", 675)
                        .attr("y", 190)
                        .text("female");
                }
                else{
                    vis.svgNew.remove();
                    vis.natData = [];
                    vis.countries = [];
                    vis.femaleSortable = vis.femaleSorted.slice(1,9);
                    vis.femaleSortable.forEach(function (d,i){
                        vis.countries.push(d[0]);
                    })
                    // console.log("countries", vis.countries);

                    //select top 8 male countries based on female data
                    vis.maleCountries = [];
                    vis.maleSorted.forEach(function(d, i){
                        vis.countries.forEach(function(d, j){
                            if(vis.countries[j] === vis.maleSorted[i][0]){
                                vis.maleCountries.push(vis.maleSorted[i]);
                            }
                        })
                    });

                    // convert back into object
                    vis.objSortedFemale = {};
                    vis.objSortedMale = {};

                    vis.femaleSortable.forEach(function(item){
                        vis.objSortedFemale[item[0]]=item[1]
                    });
                    vis.maleCountries.forEach(function(item){
                        vis.objSortedMale[item[0]]=item[1]
                    });

                    vis.natData.push(vis.objSortedMale, vis.objSortedFemale);

                    // console.log("Nationality array", vis.natData);

                    // create the base of the spider vis
                    vis.svg = d3.select("#spidervis").append("svg")
                        .attr("width", 800)
                        .attr("height", 800)
                        .attr("stroke", "gray");

                    vis.radialScale = d3.scaleLinear()
                        .domain([0, 23000])
                        .range([0, 250]);

                    // append the ticks for the count TO BE CHANGED
                    vis.ticks = [1000, 5000, 10000, 15000, 23000];

                    vis.svg.append("text")
                        .attr("x", 80)
                        .attr("y", 30)
                        .text("Distribution of Male and Female Artists Ranked by Top 8 Female Nationalities (Non American)");

                    vis.svg.append("rect")
                        .attr("x", 650)
                        .attr("y", 150)
                        .attr("width", 20)
                        .attr("height", 20)
                        .attr("fill", "pink");

                    vis.svg.append("rect")
                        .attr("x", 650)
                        .attr("y", 175)
                        .attr("width", 20)
                        .attr("height", 20)
                        .attr("fill", "orange");

                    vis.svg.append("text")
                        .attr("x", 675)
                        .attr("y", 165)
                        .text("male");

                    vis.svg.append("text")
                        .attr("x", 675)
                        .attr("y", 190)
                        .text("female");

                }
                vis.updateVis();

            });




            vis.updateVis();

        }

        updateVis() {
            let vis = this;

            if(this.change%2 !== 0) {
                vis.ticks.forEach(t =>
                    vis.svg
                        .append("circle")
                        .attr("cx", 400)
                        .attr("cy", 400)
                        .attr("fill", "none")
                        .attr("stroke", "gray")
                        .attr("opacity", 0.3)
                        .attr("r", vis.radialScale(t))
                );

                vis.ticks.forEach(t =>
                    vis.svg
                        .append("text")
                        .attr("x", 405)
                        .attr("y", 400 - vis.radialScale(t))
                        .text(t.toString())
                );

                // sets the labels as the nationalities and spaces them evenly across the chart
                function angleToCoordinate(angle, value) {
                    let x = Math.cos(angle) * vis.radialScale(value);
                    let y = Math.sin(angle) * vis.radialScale(value);
                    return {"x": 400 + x, "y": 400 - y};
                }

                var value_line = d3.max(vis.ticks);
                var value_label = value_line * 1.05;

                for (var i = 0; i < 8; i++) {
                    let ft_name = vis.countries[i];
                    let angle = (Math.PI / 2) + (2 * Math.PI * i / 8);
                    let line_coordinate = angleToCoordinate(angle, value_line);
                    let label_coordinate = angleToCoordinate(angle, value_label);

                    //draw axis line
                    vis.svg
                        .append("line")
                        .attr("x1", 400)
                        .attr("y1", 400)
                        .attr("x2", line_coordinate.x)
                        .attr("y2", line_coordinate.y)
                        .attr("opacity", 0.3)
                        .attr("stroke", "gray");

                    //draw axis label
                    vis.svg
                        .append("text")
                        .attr("x", label_coordinate.x)
                        .attr("y", label_coordinate.y)
                        .attr("stroke", "gray")
                        .attr("font-size", "10")
                        .text(ft_name);
                }

                // plotting the data
                vis.line = d3.line()
                    .x(d => d.x)
                    .y(d => d.y);
                vis.colors = ["pink", "orange"];

                function getPathCoordinates(data_point) {
                    let coordinates = [];
                    for (var i = 0; i < 8; i++) {
                        let ft_name = vis.countries[i];
                        // console.log("ft_name", ft_name);
                        let angle = (Math.PI / 2) + (2 * Math.PI * i / 8);
                        coordinates.push(angleToCoordinate(angle, data_point[ft_name]));
                    }
                    return coordinates;
                }

                for (var i = 0; i < 2; i++) {
                    let d = vis.natData[i];
                    let color = vis.colors[i];
                    let coordinates = getPathCoordinates(d);
                    // console.log("coord", coordinates);

                    //     //draw the path element
                    vis.svg
                        .append("path")
                        .datum(coordinates)
                        .attr("d", vis.line)
                        .attr("stroke-width", 3)
                        .attr("stroke", color)
                        .attr("fill", color)
                        .attr("stroke-opacity", 1)
                        .attr("opacity", 0.5);
                }
            }

            else{
                vis.svg.remove();

                vis.ticks.forEach(t =>
                    vis.svgNew
                        .append("circle")
                        .style("stroke-linecap", "round")
                        .attr("cx", 400)
                        .attr("cy", 400)
                        .attr("fill", "none")
                        .attr("stroke", "gray")
                        .attr("opacity", 0.3)
                        .attr("r", vis.radialScale(t))
                );

                vis.ticks.forEach(t =>
                    vis.svgNew
                        .append("text")
                        .attr("x", 405)
                        .attr("y",  400-vis.radialScale(t))
                        .text(t.toString())
                );

                // sets the labels as the nationalities and spaces them evenly across the chart
                function angleToCoordinate(angle, value) {
                    let x = Math.cos(angle) * vis.radialScale(value);
                    let y = Math.sin(angle) * vis.radialScale(value);
                    return {"x": 400 + x, "y": 400 - y};
                }
                var value_line = d3.max(vis.ticks);
                var value_label = value_line * 1.05;

                for (var i = 0; i < 8; i++) {
                    let ft_name = vis.countries[i];
                    let angle = (Math.PI / 2) + (2 * Math.PI * i / 8);
                    let line_coordinate = angleToCoordinate(angle, value_line);
                    let label_coordinate = angleToCoordinate(angle, value_label);

                    //draw axis line
                    vis.svgNew
                        .append("line")
                        .style("stroke-linecap", "round")
                        .attr("x1", 400)
                        .attr("y1", 400)
                        .attr("x2", line_coordinate.x)
                        .attr("y2", line_coordinate.y)
                        .attr("opacity", 0.3)
                        .attr("stroke", "gray");

                    //draw axis label
                    vis.svgNew
                        .append("text")
                        .attr("x", label_coordinate.x)
                        .attr("y", label_coordinate.y)
                        .attr("stroke", "gray")
                        .attr("font-size", "10")
                        .text(ft_name);
                }

                // plotting the data
                vis.line = d3.line()
                    .x(d => d.x)
                    .y(d => d.y);
                vis.colors = ["pink", "orange"];

                function getPathCoordinates(data_point) {
                    let coordinates = [];
                    for (var i = 0; i < 8; i++) {
                        let ft_name = vis.countries[i];
                        // console.log("ft_name", ft_name);
                        let angle = (Math.PI / 2) + (2 * Math.PI * i / 8);
                        coordinates.push(angleToCoordinate(angle, data_point[ft_name]));
                    }
                    return coordinates;
                }
                for (var i = 0; i < 2 ; i++) {
                    let d = vis.natData[i];
                    let color = vis.colors[i];
                    let coordinates = getPathCoordinates(d);
                    // console.log("coord", coordinates);


                    //     //draw the path element
                    vis.svgNew
                        .append("path")
                        .datum(coordinates)
                        .attr("d", vis.line)
                        .attr("stroke-width", 3)
                        .attr("stroke", color)
                        .attr("fill", color)
                        .attr("stroke-opacity", 1)
                        .attr("opacity", 0.5);
                }
            }


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


//
// vis.ticks.forEach(t =>
//     vis.svg.append("circle")
//         .attr("cx", 300)
//         .attr("cy", 300)
//         .attr("fill", "none")
//         .attr("stroke", "gray")
//         .attr("r", vis.radialScale(t))
// );
//
// vis.ticks.forEach(t =>
//     vis.svg.append("text")
//         .attr("x", 305)
//         .attr("y",  300-vis.radialScale(t))
//         .text(t.toString())
// );
//
// // sets the labels as the nationalities and spaces them evenly across the chart
// function angleToCoordinate(angle, value) {
//     let x = Math.cos(angle) * vis.radialScale(value);
//     let y = Math.sin(angle) * vis.radialScale(value);
//     return {"x": 300 + x, "y": 300 - y};
// }
// var value_line = d3.max(vis.ticks);
// var value_label = value_line * 1.05;
//
// for (var i = 0; i < 8; i++) {
//     let ft_name = vis.countries[i];
//     console.log("ft_name", ft_name);
//
//     let angle = (Math.PI / 2) + (2 * Math.PI * i / 8);
//     let line_coordinate = angleToCoordinate(angle, value_line);
//     let label_coordinate = angleToCoordinate(angle, value_label);
//
//     //draw axis line
//     vis.svg.append("line")
//         .attr("x1", 300)
//         .attr("y1", 300)
//         .attr("x2", line_coordinate.x)
//         .attr("y2", line_coordinate.y)
//         .attr("stroke", "gray");
//
//     //draw axis label
//     vis.svg.append("text")
//         .attr("x", label_coordinate.x)
//         .attr("y", label_coordinate.y)
//         .attr("stroke", "black")
//         .attr("font-size", "10")
//
//         .text(ft_name);
// }
//
// // plotting the data
// vis.line = d3.line()
//     .x(d => d.x)
//     .y(d => d.y);
// vis.colors = ["orange"];
//
// function getPathCoordinates(data_point) {
//     let coordinates = [];
//     for (var i = 0; i < 8; i++) {
//         let ft_name = vis.countries[i];
//         let angle = (Math.PI / 2) + (2 * Math.PI * i / 8);
//         coordinates.push(angleToCoordinate(angle, data_point[ft_name]));
//     }
//     return coordinates;
// }
// for (var i = 0; i < 1 ; i++) {
//     let d = vis.natData[i];
//     let color = vis.colors[i];
//     let coordinates = getPathCoordinates(d);
//     console.log("coord", coordinates);
//
//     //draw the path element
//     vis.svg.append("path")
//         .datum(coordinates)
//         .attr("d", vis.line)
//         .attr("stroke-width", 3)
//         .attr("stroke", color)
//         .attr("fill", color)
//         .attr("stroke-opacity", 1)
//         .attr("opacity", 0.5);
// }