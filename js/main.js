

d3.json(url).then(jsonData =>{
    console.log(jsonData);
});

fetch(url, function (d) {
    console.log(d)
})
    .then(response => response.json())
    .then(data => {
        gettingStarted(data)
    });




// function that gets called once data has been fetched.
// We're handing over the fetched data to this function.
// From the data, we're creating the final data structure we need and create a new instance of the StationMap
function gettingStarted(data) {

    // log data
    console.log(data)

    // create empty data structure

    var displayData = [];


    // Instantiate visualization object
}
