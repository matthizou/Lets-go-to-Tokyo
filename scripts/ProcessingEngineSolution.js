//
// The class ProcessingEngine contains the 'clever' code, responsible for solving the algorithm
//

var letsGoToTockyo = letsGoToTockyo || {};

letsGoToTockyo.ProcessingEngine = function () { };
letsGoToTockyo.ProcessingEngine.prototype = {

    findRoute: function (startCity, destinationCity) {
        this._destination = destinationCity;
        return this.findRoute_recursion(startCity, new letsGoToTockyo.Route([startCity], 0));
    },

    // Private
    // Main recursive function (algorithm)
    // While it isn't the most optimzed way to do it, we kept it easy to read
    findRoute_recursion: function (currentCity, route) {

        var fullRoute, nextFlight, visitedCities2, i, l,
            bestRoute = new letsGoToTockyo.Route(null, 9999);

        if (currentCity === this._destination) {
            // We have arrived. End of recursion.
            letsGoToTockyo.CityUtils.displayRouteInConsole(route); // Uncomment to see all possible routes
            return new letsGoToTockyo.Route(route.cities, route.cost); //{ cost: currentCost, cities: visitedCities };
        }

        for (i = 0, l=currentCity.flights.length; i < l; i++) {
            nextFlight = currentCity.flights[i];

            //Check if we already went through this city
            if ($.inArray(nextFlight.city, route.cities) === -1) {

                // Dupplicate array
                visitedCities2 = route.cities.slice(0);

                // Add non-visited neighbough in the route
                visitedCities2.push(nextFlight.city);

                // Recursion with this city as the starting point
                fullRoute = this.findRoute_recursion(
                    nextFlight.city,
                    new letsGoToTockyo.Route(visitedCities2, route.cost + nextFlight.cost)
                  );

                // 
                if (fullRoute.cost < bestRoute.cost) {
                    bestRoute = fullRoute;
                }
            }
        }
        return bestRoute;
    }
}