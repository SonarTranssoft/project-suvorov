class Place {
    constructor(lat, long) {
        this.lat = lat;
        this.long = long
    }
}


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
                    let place = new Place(destination[0], destination[1]);
                    arr.push(place)
                })
                if (result.more())
                    result.next();
            }
        }
    );
    return arr;
}

function initMap() {
    // The location of Uluru
    let region = {lat: 55.7301636, lng: 72.691498};
    // The map, centered at Uluru
    let map = new google.maps.Map(
        document.getElementById('map'), {zoom: 4, center: region});
    // The marker, positioned at Uluru
    let marker = new google.maps.Marker({position: region, map: map});
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

