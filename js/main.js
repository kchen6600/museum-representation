let barVis;
let countVis;
let sankeyVis;
let spiderVis;
let artVis;


let url = 'https://cs171museumrepresentation.s3.us-east-2.amazonaws.com/Artworks.json';

d3.json(url).then(jsonData =>{
    console.log(jsonData);
});

fetch(url, function (d) {
    console.log(d)
})
    .then(response => response.json())
    .then(data => {
        createVis(data)
    });


function createVis(data){

    let artworkData = []
    artworkData.push(data);

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
    barVis = new BarVis("barvis", artworkData);
    countVis = new CountVis("countvis", artworkData, eventHandler);
    sankeyVis = new SankeyVis("sankeyvis", artworkData);
    spiderVis = new SpiderVis("spidervis", artworkData);
    artVis = new ArtVis("artvis", artworkData);

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