//
// The class ProcessingEngine contains the 'clever' code, responsible for solving the algorithm
//

var letsGoToTockyo = letsGoToTockyo || {};

letsGoToTockyo.ProcessingEngine = function () { };
letsGoToTockyo.ProcessingEngine.prototype = {

    // Find the cheapest route from the start city to the destination city.
    // Returns a Route object
    findRoute: function (startCity, destinationCity) {

        // YOUR CHALLENGE, SHOULD YOU ACCEPT IT, IS TO IMPLEMENT THIS FUNCTION -- 
        // Feel free to add new properties/functions if you wish it. The ProcessingEngine class is all yours but you cannot modify any other files.
        // Below is some temporary code to demo

        var firstFlight = startCity.flights[0], // to create a mock route, we take the first neighbour city of the starting city
            city2 = firstFlight.city; 

        return new letsGoToTockyo.Route(
            [startCity, city2, destinationCity], // Array of cities representing the route. You must ensure the path is valid, otherwise your plane will go 'offtrack' when animated
            99  // Cost of the route
        );
    }
}