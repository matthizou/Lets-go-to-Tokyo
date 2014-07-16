//Debug util
if (!window.console) {
    window.console = { log: function () { } };
}


// Main
$(document).ready(function () {
    var route, cities, drawingEngine, processingEngine;

    drawingEngine = new letsGoToTockyo.DrawingEngine({
        width: 676,
        height:440,
        renderTo: 'canvasPlaceHolder',
        airportImgUrl: 'images/airport.png',
        airplaneImgUrl: 'images/airplane.png',
        worldMapImgUrl: 'images/worldMap.png'
    });

    cities = getCities();
    setFlightsForTest(cities);

    //The images might not been arrived when the program is ready. Visible in Chrome- needs a delay
    setTimeout(function () { drawingEngine.drawMap(cities); }, 100);

    processingEngine = new letsGoToTockyo.ProcessingEngine();
    route = processingEngine.findRoute(
        letsGoToTockyo.CityUtils.getCityByName('Toronto', cities),
        letsGoToTockyo.CityUtils.getCityByName('Tokyo', cities)
    );

    drawingEngine.displayRoute(route.cities);
});