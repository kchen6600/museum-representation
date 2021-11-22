let barVis;
let countVis;
let sankeyVis;

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

    let displayData = [];

    let eventHandler = {
        bind: (eventName, handler) => {
            document.body.addEventListener(eventName, handler);
        },
        trigger: (eventName, extraParameters) => {
            document.body.dispatchEvent(new CustomEvent(eventName, {
                detail: extraParameters
            }));
        }
    }


    // Instantiate visualization object
    barVis = new BarVis("barvis", data);
    countVis = new CountVis("countvis", data, eventHandler);
    sankeyVis = new SankeyVis("sankeyvis", data);

}