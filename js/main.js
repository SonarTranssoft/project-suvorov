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

