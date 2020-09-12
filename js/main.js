class Place {
    constructor(lat, long) {
        this.lat = lat;
        this.lng = long
    }
}

function getCoordinatesFromDeals() {
    const arr = [];

    return new Promise(res => {

        BX24.callMethod(
            "crm.deal.list",
            {
                order: {"STAGE_ID": "ASC"},
                select: ["ID", "TITLE", "STAGE_ID", "PROBABILITY", "OPPORTUNITY", "CURRENCY_ID", "UF_*"]
            },
            function (result) {
                if (result.error()) {
                    // выбрасываем ошибку #{1}
                    throw new Error(result.error())
                }

                result.data().forEach(el => {
                    let dealIncompleteAddress = (el.UF_CRM_1598808869287);
                    let invalidCoordinates = dealIncompleteAddress.split('|');
                    let destination = invalidCoordinates[1].split(';');
                    let place = new Place(parseFloat(destination[0]), parseFloat(destination[1]))
                    arr.push(place)
                })

                if (result.more()) {
                    result.next();
                } else {
                    return res(arr);
                }
            }
        );
    });
}

async function initMap() {

    let coordinates;

    try {
        coordinates = await getCoordinatesFromDeals();
    } catch (e) {
        // тут обрабатываем ошибку #{1}
        return console.error(e);
    }

    // создаем экземпляр карты
    const map = new google.maps.Map(
        document.getElementById('map'), {zoom: 6}
    );

    // let labels = 'ABC';
    console.log(`На карте будет ${coordinates.length} маркеров`);
    // const infowindow = new google.maps.InfoWindow({
    //     content: 'Hello Moto!'
    // });

    const markers = coordinates.map((_pos) => new google.maps.Marker({position: _pos}));


    console.log(markers);

    // импровизированное центрование отметок
    // if (Array.isArray(markers) && markers.length) {
    //     const avg = markers.reduce((prev, cur) => [prev[0] + cur.position.lat(), prev[1] + cur.position.lng()], [0, 0]);
    //
    //     map.setCenter({
    //         lat: avg[0] / markers.length,
    //         lng: avg[1] / markers.length,
    //     });
    // }


    // Add a marker clusterer to manage the markers.
    const markerCluster = new MarkerClusterer(
        map,
        markers,
        {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'}
    );

}

var locations = [];

function include(url) {
    let script = document.createElement('script');
    script.setAttribute('defer', '');
    script.src = url;
    let scripts = document.getElementsByTagName('body');
    scripts[0].appendChild(script);
}


