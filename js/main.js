let barVis;

let promises = [
    d3.json("data/Artworks.json")
]

Promise.all(promises)
    .then(function (data){
        createVis(data)
    })
    .catch(function(err){
        console.log(err)
    });

function createVis(data){

    let artworkData = data[0]

    console.log(data)

    var displayData = [];


    // Instantiate visualization object
    barVis = new BarVis("barvis", data);

}