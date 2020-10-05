const FIRST_STAGE = 'NEW';
const SECOND_STAGE = 'PREPARATION';
const THIRD_STAGE = 'PREPAYMENT_INVOICE';

class Place {
    constructor(lat, long) {
        this.lat = lat;
        this.lng = long;
    }
}

class Deal {
    constructor(id, stage, title, place) {
        this.id = id;
        this.stage = stage;
        this.title = title;
        this.place = place;
    }
}

function showCountOfDeals(arr) {
    return arr.map(el => el.place).length;
}

function getCategoryOfDeals(str, map) {
    let array = [];
    return array = map.get(str);
}

function getPlaceFromDeal(str) {
    if (!str || typeof str !== 'string') return null;
    let invalidCoordinates = str.split('|');
    if (!invalidCoordinates || invalidCoordinates.length !== 2) return null;
    let destination = invalidCoordinates[1].split(';');
    if (isNaN(Number(destination[0])) || isNaN(Number(destination[1]))) return null;
    return new Place(Number(destination[0]), Number(destination[1]));
}

function getDeals() {
    const map = new Map([
        [FIRST_STAGE, []],
        [SECOND_STAGE, []],
        [THIRD_STAGE, []]
    ]);

    return new Promise(res => {

        BX24.callMethod(
            "crm.deal.list",
            {
                order: {"STAGE_ID": "ASC"},
                select: ["ID", "TITLE", "STAGE_ID", "UF_*"]
            },
            function (result) {
                if (result.error()) {
                    // выбрасываем ошибку #{1}
                    throw new Error(result.error())
                }
                console.log(result.data())

                result.data().forEach(el => {
                    console.log(el);
                    //получаем координаты и подготавливаем для вывода на карту
                    let place = getPlaceFromDeal(el.UF_CRM_1598808869287);
                    if (place) {
                        let deal = new Deal(el.ID, el.STAGE_ID, el.TITLE, place);
                        map.get(el.STAGE_ID).push(deal);
                    }
                })

                if (result.more()) {
                    result.next();
                } else {
                    console.log(map);
                    return res(map);
                }
            }
        );
    });
}

async function initMap() {
    const markers = [];
    let dealsMap, newDeals, serviceDeals, plannedDeals;
    let icon = {
        path: "M16.734,0C9.375,0,3.408,5.966,3.408,13.325c0,11.076,13.326,20.143,13.326,20.143S30.06,23.734,30.06,13.324        " +
            "C30.06,5.965,24.093,0,16.734,0z M16.734,19.676c-3.51,0-6.354-2.844-6.354-6.352c0-3.508,2.844-6.352,6.354-6.352        " +
            "c3.508-0.001,6.352,2.845,6.352,6.353C23.085,16.833,20.242,19.676,16.734,19.676z",
        fillOpacity: 0.8,
        anchor: new google.maps.Point(16, 32)
    };

    try {
        dealsMap = await getDeals();
        newDeals = getCategoryOfDeals(FIRST_STAGE, dealsMap);
        serviceDeals = getCategoryOfDeals(SECOND_STAGE, dealsMap);
        plannedDeals = getCategoryOfDeals(THIRD_STAGE, dealsMap);
    } catch (e) {

        // тут обрабатываем ошибку #{1}
        return console.error(e);
    }

    // создаем экземпляр карты
    const map = new google.maps.Map(
        document.getElementById('map'), {zoom: 6}
    );

    console.log(`На карте будет ${newDeals.length} новых сделок`);
    console.log(`На карте будет ${serviceDeals.length} сервисных сделок`);
    console.log(`На карте будет ${plannedDeals.length} запланированных сделок`);

    let blueMarkers = newDeals.map((_pos) => {
        return new google.maps.Marker({
            position: _pos.place,
            icon: Object.assign(icon, {fillColor: '#66afe9'})
        })
    });

    let yellowMarkers = serviceDeals.map((_pos) => new google.maps.Marker({
        position: _pos.place,
        icon: Object.assign(icon, {fillColor: '#fff300'})
    }));

    let greenMarkers = plannedDeals.map((_pos) => new google.maps.Marker({
        position: _pos.place,
        icon: Object.assign(icon, {fillColor: '#00a74c'})
    }));

    markers.push(...blueMarkers, ...yellowMarkers, ...greenMarkers);

    markers.forEach((marker) => {
        let content;

        marker.addListener('click', () => {

            let position = marker.getPosition();

            for (let deals of dealsMap.keys()) {
                dealsMap.get(deals).forEach(el => {
                    if (position.lat() === el.place.lat && position.lng() === el.place.lng) {
                        console.log(`Маркеру присвоен контент ${el.title}`)
                        content = el.title;
                    }
                })
            }
            console.log(content);
            const infoWindow = new google.maps.InfoWindow({
                content: content,
            });
            infoWindow.open(map, marker);
        })
    })

    console.log(markers);

    // импровизированное центрование отметок
    if (Array.isArray(markers) && markers.length) {
        const avg = markers.reduce((prev, cur) => [prev[0] + cur.position.lat(), prev[1] + cur.position.lng()], [0, 0]);

        map.setCenter({
            lat: avg[0] / markers.length,
            lng: avg[1] / markers.length,
        });
    }

    // Add a marker clusterer to manage the markers.
    const markerCluster = new MarkerClusterer(
        map,
        markers,
        {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'}
    );

}

function include(url) {
    let script = document.createElement('script');
    script.setAttribute('defer', '');
    script.src = url;
    let scripts = document.getElementsByTagName('body');
    scripts[0].appendChild(script);
}


