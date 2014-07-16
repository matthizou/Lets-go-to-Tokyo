
// Define cities
function getCities() {
    return [
    new letsGoToTockyo.City("Toronto", 94, 106),
    new letsGoToTockyo.City("London", 283, 84),
    new letsGoToTockyo.City("Johannesburg", 345, 333),
    new letsGoToTockyo.City("Dubai", 410, 165),
    new letsGoToTockyo.City("Moscow", 374, 59),
    new letsGoToTockyo.City("Singapore", 555, 234),
    new letsGoToTockyo.City("Tokyo", 624, 118)
    ];
}

// Populate the 'flights' properties to the cities to create the flight network - as according to map image provided to the candidate
function setFlightsForTest(cities) {

    var addFlight = letsGoToTockyo.CityUtils.addFlight, // Create alias to improve readibility
        A = cities[0],
        B = cities[1],
        C = cities[2],
        D = cities[3],
        E = cities[4],
        F = cities[5],
        G = cities[6];

        addFlight(A, B, 3);
        addFlight(A, C, 8);
        addFlight(A, D, 10);
        addFlight(B, D, 4);
        addFlight(B, E, 2);
        addFlight(C, D, 2);
        addFlight(C, F, 5);
        addFlight(D, E, 1);
        addFlight(D, F, 13);
        addFlight(D, G, 6);
        addFlight(E, G, 10);
        addFlight(F, G, 2);
    
    return cities;
}