import express from "express";  																		// pull the webserver library that we installed in
import fs from 'fs';       																					// pull the standard filesystem library in
import parse from 'csv-parse/lib/sync.js';
import LatLon from 'geodesy/latlon-spherical.js'

const server = express(),																								// express exposes as a generator function
			htmlDocument = `${fs.readFileSync('./src/assets/index.html')}`,  	// stuffing the binary into a string
			jsDocument   = `${fs.readFileSync('./src/assets/client.js')}`, 		// is a quick type change
			csvDocument = `${fs.readFileSync('./src/data/pharmacies.csv')}`,
			dataRecords = parse(csvDocument, { columns: true, skip_empty_lines: true });

// this just repeats the header nonsense for us
function sendAs(response, mime, doc) {
	response.setHeader("Content-Type", mime);
	response.send(doc);
}

// these functions implement the endpoint behaviors
function rootHandler (request, response) {
	sendAs(response, "text/html", htmlDocument);
}

function cliJsHandler (request, response) {
	sendAs(response, "application/javascript", jsDocument);
}

/**
 * Search controller for 'pharmacy' GET query
 * @param request
 * @param response
 */
function dataHandler (request, response) {
	let { latitude, longitude } = request.query,
			userLocation = [latitude, longitude],
			output = 'No results found',
			nearestLocationData = determineNearestPharmacy(userLocation);

	// Note: You could do server-side validation before calling 'determineNearestPharmacy'
	// Example: Return 400 if latitude/longitude are not provided
	if (nearestLocationData) {
		output = formatOutput(nearestLocationData);
	}

	response.json(output);
}

/**
 * This method loops through the pharmacies and calculates the distance (in miles) from the submitted location.
 * If no locations are defined in the CSV, it returns null.
 * @param {Array.<number>} userLocation
 * @returns {{distance: number, location: object}|null} Closest location/distance in an object or null
 */
function determineNearestPharmacy (userLocation) {
	// Update the current Location being analyzed and calculate the distance
	function updateCurrentLocation(){
		currentLocation = dataRecords[idx];
		currentDistance = getDistance(userLocation, [currentLocation.latitude, currentLocation.longitude])
	}
	// Updates the closest Distance/Location to the current values
	function updateClosestLocation(){
		closestLocation = currentLocation;
		closestDistance = currentDistance;
	}

	let numLocations = dataRecords.length,
			idx = 0,
			closestLocation, closestDistance, currentDistance, currentLocation;

	if (numLocations > 0) {
		// Start with first, then check against the rest
		updateCurrentLocation();
		updateClosestLocation();
		for (idx = 1; idx < numLocations; idx += 1) {
			updateCurrentLocation();
			if (currentDistance < closestDistance) {
				updateClosestLocation();
			}
		}
		return {
			location: closestLocation,
			distance: closestDistance
		};
	}
	else return null; // Return null if no locations to check
}

/**
 * Calculate the distance between two points.
 * Points must be given as arrays of two numbers.
 * @param {Array.<number>} a - array of latitude and longitude
 * @param {Array.<number>} b - array of latitude and longitude
 * @return {number} distanceInMiles - Distance between a and b in miles
 */
function getDistance (a, b) {
	const ptA = new LatLon(...a),
				ptB = new LatLon(...b),
				distanceKM = ptA.distanceTo(ptB);

	return meterToMile(distanceKM);
}

/**
 * Takes a distance in meters and converts it to miles
 * @param {number} mDistance
 * @returns {number} mileDistance
 */
function meterToMile(mDistance){
	return mDistance * 0.00062137;
}

/**
 * Creates a response object containing the pharmacy, address, and distance (in miles)
 * @param {{distance: number, location: object}} locationData
 * @return {{pharmacyName: string, address: string, distance: number, distanceText: string}}
 */
function formatOutput(locationData){
	let { location, distance } = locationData;
	return {
		pharmacyName: location.name.trim(),
		address: `${location.address.trim()}, ${location.city.trim()}, ${location.state} ${location.zip}`,
		distance: distance,
		distanceText: `${locationData.distance.toFixed(2)} miles away` // Fixing decimal point to two places
	}
}

// server.use gets applied to every inbound request, then next() defers as incomplete
// this allows us to put CORS headers on everything conveniently
server.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

// and these are the actual endpoints, which call the functions above
server.get('/',          rootHandler);   // this says "when a GET request is made for '/', call this function"
server.get('/client.js', cliJsHandler);
server.get('/pharmacy',      dataHandler);

// finally, start the server
server.listen(15151, () => {
	console.log('server now running on http://127.0.0.1:15151/');
});