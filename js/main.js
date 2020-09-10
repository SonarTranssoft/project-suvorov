var locations = []

function getCoordinatesFromDeals() {
    console.log('Начинаем обращаться к битриксу')
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
                    let latLng = {lat: parseFloat(destination[0]), lng: parseFloat(destination[1])};
                    arr.push(latLng);
                })
                if (result.more())
                    result.next();
            }

        }
    )
    console.log('Массив получен, возвращаем данные');
    return arr;
}

function initMap() {

    console.log('Инициализация карты началась')
    let region = {lat: 55.7301636, lng: 72.691498};

    let map = new google.maps.Map(
        document.getElementById('map'), {zoom: 4, center: region});
    console.log('маркеры перед вставкой', locations)
    locations.forEach(el => {
        console.log(el);
        let marker = new google.maps.Marker({position: el, map: map})
    })
    // let markers = locations.map(function (location, i) {
    //     return new google.maps.Marker({
    //         position: {lat: 55.7301636, lng: 72.691498},
    //         label: i.toString()
    //     });
    // });
    // console.log(markers);
    //
    // let markerCluster = new MarkerClusterer(map, markers,
    //     {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});

    console.log('Функция сработала');

}

function include(url) {
    let script = document.createElement('script');
    script.setAttribute('defer', '');
    script.src = url;
    let scripts = document.getElementsByTagName('body');
    scripts[0].appendChild(script);
    console.log('Скрипт смонтирован')
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

