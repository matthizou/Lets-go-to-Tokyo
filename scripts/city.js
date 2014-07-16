var letsGoToTockyo = letsGoToTockyo || {};

// Class definition: City
letsGoToTockyo.City = function (name, posX, posY) {
    this.name = name;
    this.x = posX;
    this.y = posY;
    this.flights = [];
};

// Class definition: Route
letsGoToTockyo.Route = function (cities, cost) {
    this.cities = cities
    this.cost = cost;
};

// Utils for City
letsGoToTockyo.CityUtils = {

    // Search and return the specified city from a list a cities
    getCityByName: function (name, cityList) {
        var res = $.grep(cityList, function (x) { return x.name === name; });
        return res.length ? res[0] : null;
    },
    
    // Add a bidrectional flight between 2 cities
    addFlight : function(city1, city2, cost) {
        city1.flights.push({ city: city2, cost: cost });
        city2.flights.push({ city: city1, cost: cost });
    },

    // Display the name of the cities in order in the console. For debugging purposes 
    displayRouteInConsole: function (route) {
    if (route && route.cities) {
        console.log(_.pluck(route.cities, 'name').join(', ') + ': ' + route.cost);
    }
}

}


