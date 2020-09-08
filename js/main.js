class Place {
    constructor(lat, long) {
        this.lat = lat;
        this.lng = long
    }
}

// var locations = []
var locations = [
    {lat: 54.984951, lng: 73.4012343},
    {lat: 54.9991464, lng: 73.3605812},
    {lat: 55.0225655, lng: 73.31209559999999}
];

function getCoordinatesFromDeals() {
    let arr = [];
    BX24.callMethod(
        "crm.deal.list",
        {
            order: {"STAGE_ID": "ASC"},
            select: ["ID", "TITLE", "STAGE_ID", "PROBABILITY", "OPPORTUNITY", "CURRENCY_ID", "UF_*"]
        },
        function (result) {
            if (result.error())
                console.error(result.error());
            else {
                result.data().forEach(el => {
                    let dealIncompleteAddress = (el.UF_CRM_1598808869287);
                    let invalidCoordinates = dealIncompleteAddress.split('|');
                    let destination = invalidCoordinates[1].split(';');
                    let place = new Place(parseFloat(destination[0]), parseFloat(destination[1]));
                    arr.push(place)
                })
                if (result.more())
                    result.next();
            }
        }
    );
    BX24.callMethod('crm.deals.list', {}, (result) =>{
        
    });
    return arr;
}

function initMap() {

    // The location of Uluru
    let region = {lat: 55.7301636, lng: 72.691498};
    // The map, centered at Uluru
    let map = new google.maps.Map(
        document.getElementById('map'), {zoom: 4, center: region});
    // The marker, positioned at Uluru
    // let marker = new google.maps.Marker({position: region, map: map});

    let labels = 'ABC';
    let markers = locations.map(function (location, i) {
        return new google.maps.Marker({
            position: location,
            label: labels[i % labels.length]
        });
    });

    // Add a marker clusterer to manage the markers.
    let markerCluster = new MarkerClusterer(map, markers,
        {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
}

function include(url) {
    let script = document.createElement('script');
    script.setAttribute('defer', '');
    script.src = url;
    let scripts = document.getElementsByTagName('body');
    scripts[0].appendChild(script);
}

// function getLocations(array) {
//     let placesForMap = [];
//     array.forEach(el => {
//         let invalidCoordinates = el.split('|');
//         let destination = invalidCoordinates[1].split(';');
//         let place = new Place(destination[0], destination[1]);
//         placesForMap.push(place);
//     });
//     return placesForMap;
// }

