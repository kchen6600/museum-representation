let barVis;
let countVis;
let sankeyVis;
let spiderVis;
let artVis;

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

    // console.log(data)

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
    spiderVis = new SpiderVis("spidervis", data);
    artVis = new ArtVis("artvis", data);

    eventHandler.bind("selectionChanged", function(event){
        // console.log("SELECTION CHANGED");
        // console.log(event);
        // console.log(event.detail);
        let rangeStart = event.detail[0];
        let rangeEnd = event.detail[1];
        countVis.onSelectionChange(rangeStart, rangeEnd);
        barVis.onSelectionChange(rangeStart, rangeEnd);
    });


}