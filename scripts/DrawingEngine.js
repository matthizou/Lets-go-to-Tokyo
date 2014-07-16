//
// The class DrawingEngine contains the code responsible the drawing part and the interaction with the canvas.
//

var letsGoToTockyo = letsGoToTockyo || {};

//Constructor
letsGoToTockyo.DrawingEngine = function (config) {

    if (!config) {
        throw new Error('DrawingEngine: A configuration object is required');
    }

    if (!config.renderTo) {
        throw new Error('DrawingEngine: The \'renderTo\' parameter is required in the config');
    }

    this.$el = $('#' + config.renderTo); //Name of the container inspired by Backbone.js ;)
    if (!config.renderTo) {
        throw new Error('DrawingEngine: The container has not been found in the page');
    }

    config = $.extend({
        width: 500,
        height: 500,
        airportImgUrl: 'images/blackDot.png',
        airplaneImgUrl: 'images/blackDot.png'
    }, config);

    if (config.renderTo) {
        //Create the canvases in the placeholder
        this.$el.empty().html('<canvas class="bgCanvas" width="' + config.width + '"  height="' + config.height + '"></canvas>' +
            '<canvas class="fgCanvas" width="'+config.width+'"  height="'+config.height+'"></canvas>');
    }
    //if (!this._canvasCxt) {
    //    alert("Your browser doesn't support the HTML Canvas element");
    //    return;
    //}

    if (config.worldMapImgUrl) {
        this.mapImg = $('<img src="' + config.worldMapImgUrl + '"/>')[0];
    }
    if (config.airportImgUrl) {
        this.cityImg = $('<img src="' + config.airportImgUrl + '"/>')[0];
    }
    if (config.airplaneImgUrl) {
        this.airplaneImg = $('<img src="' + config.airplaneImgUrl + '"/>')[0];
    }
    $.extend(this, config);
};

letsGoToTockyo.DrawingEngine.prototype = {

    // Draw the whole background: Map with routes, cities and flight info
    drawMap: function (cities) {
        var canvas = this.$el.find('.bgCanvas')[0],
            bgCanvasCxt = canvas.getContext("2d");

        //Draw world map
        bgCanvasCxt.drawImage(this.mapImg, 0, 0);

        $.extend(bgCanvasCxt, {
            lineCap: 'round',
            lineWidth: 2, // Lines 4px wide, dots of diameter 4
            fillStyle: '#00f',
            font: 'normal 16px sans-serif'
        });
        this.drawNetwork(cities, bgCanvasCxt);
        this.drawCities(cities, bgCanvasCxt);
    },

    //Draw the specified cities on the map, in the background 
    drawCities: function (cities, bgCanvasCxt) {
        var i = 0,
            imgCenterX = 20, //temp hardcoded
            imgCenterY = 20,
            l = cities.length;

        for (i = 0; i < l; i++) {
            bgCanvasCxt.drawImage(this.cityImg, cities[i].x - imgCenterX, cities[i].y - imgCenterY);
        }
    },

    //Draw the flight network and prices on the map (non-recursive way)
    drawNetwork: function (cities, bgCanvasCxt) {
        var processedCities = [],
            from_city,
            to_city,
            flight,
            nbCities = cities.length,
            nbFlights,
            i, j;

        // Set up the color of the network lines
        bgCanvasCxt.strokeStyle = '#aaa';

        //Loop though all cities
        for (i = 0; i < nbCities ; i++) {
            from_city = cities[i];
            processedCities.push(from_city);
            nbFlights = from_city.flights.length;

            //Loop through all flights from the current city
            for (j = 0; j < nbFlights; j++) {
                flight = from_city.flights[j];
                to_city = flight.city;

                if ($.inArray(to_city, processedCities) === -1) {
                    //If the destination city hasn't allready been processed, we draw a line between those two cities
                    this.drawDashedLine(from_city.x, from_city.y, to_city.x, to_city.y, [10, 5, 0, 5], bgCanvasCxt);
                    bgCanvasCxt.stroke();
                    //Add price on the map
                    bgCanvasCxt.fillText(flight.cost, (from_city.x + to_city.x) / 2 + 5, (from_city.y + to_city.y) / 2 - 5);
                }
            }
        }
    },

    //Draw the plane on the map with the given angle
    drawAirplane: function (x, y, angle, planeCanvasCxt) {
        planeCanvasCxt.save();
        planeCanvasCxt.translate(x, y);
        planeCanvasCxt.rotate(angle);
        planeCanvasCxt.drawImage(this.airplaneImg, -20, -20);
        planeCanvasCxt.restore();
    },



    //Move airplane along the route
    displayRoute: function (route) {
        var that = this;
        if (route.length > 1) {
            //Move the plane from the 1rst point of the route to the second
            this.moveAirPlane(route[0].x, route[0].y, route[1].x, route[1].y, 2.5,
                function () {
                    //Callback function when the plane reaches route[1]
                    //Remove first city and trigger recursion
                    route.shift();
                    that.displayRoute(route);
                }
            );
        }
    },

    // Animation - Move airplane from point A to B at the given speed
    // This function is called successively with a time interval, until the plane has reach B
    moveAirPlane: function (x1, y1, x2, y2, speed, callback) {
        var dx = (x2 - x1),
         dy = (y2 - y1),
         angle = dx > 0 ? Math.atan(dy / dx) : Math.atan(dy / dx) + 3.14,
         distRemaining = Math.sqrt(dx * dx + dy * dy),
         fullDist = distRemaining,
         nbSteps = fullDist / speed,
         step = fullDist / nbSteps,
         x = x1,
         y = y1,
         dx2 = Math.cos(angle) * step,
         dy2 = Math.sin(angle) * step,
         stepIndex = 0,
         canvas = this.$el.find('.fgCanvas')[0],
         canvasCxt = canvas.getContext("2d"),
         that = this,
         interval = setInterval(function () {
             // 
             canvasCxt.clearRect(0, 0, that.width, that.height);
             that.drawAirplane(x, y, angle, canvasCxt);
             x += dx2;
             y += dy2;
             stepIndex++;

             if (stepIndex > nbSteps) {
                 clearInterval(interval);
                 if (callback && typeof callback === "function") {
                     callback();
                 }
             }
         }, 40);
    },



    //Util function : Display a dashed line between two points (x,y)->(x2,y2)
    // dashArray : Array of integer to set up the width of a dash and of the gap between dash. [size of dash, size of gap]
    drawDashedLine: function (x, y, x2, y2, dashArray, canvasCxt) {
        if (!dashArray) {
            dashArray = [10, 5];
        }

        var dashCount = dashArray.length,
            dx = (x2 - x),
            dy = (y2 - y),
            xSlope = (Math.abs(dx) > Math.abs(dy)),
            slope = (xSlope) ? dy / dx : dx / dy,
            distRemaining = Math.sqrt(dx * dx + dy * dy),
            dashIndex = 0,
            dashLength,
            step;

        canvasCxt.moveTo(x, y);

        while (distRemaining >= 0.1) {
            dashLength = Math.min(distRemaining, dashArray[dashIndex % dashCount]);
            step = Math.sqrt(dashLength * dashLength / (1 + slope * slope));
            if (xSlope) {
                if (dx < 0) {
                    step = -step;
                }
                x += step;
                y += slope * step;
            } else {
                if (dy < 0) {
                    step = -step;
                }
                x += slope * step;
                y += step;
            }
            canvasCxt[(dashIndex % 2 === 0) ? 'lineTo' : 'moveTo'](x, y);
            distRemaining -= dashLength;
            dashIndex++;
        }
    }
};