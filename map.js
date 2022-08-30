// What events will your application need?
//      Leaflet creating map code and try to learn foursquare API
// What APIs will you need and in what order?
//      Maps first? Get user location following?
// How will you obtain the user's location?
//      Using gelocation starter from Module 11
// How will you add the user's location to the map?
//      Using async await for getCoords.
// How will you get the selected location from the user?
// How will you add that information to the map?

// Was not aware the activity wanted us to build map as an object

// create map
const myMap = {
    // had to look up appropriate brackets to use.
    // create the coordinates and businesses as arrays to work with in the myMap like in the sandwich activity.
    coordinates: [],
    businesses: [],
    // map and markers become objects?    
    map: {},
    markers: {},

    createMap() {
        this.map = L.map('map', {           // this.map refers to this object and creating it as an object in the property map.
        // center: [34.041228, -118.387673], 
        // needed to change for it to be dynamic?
        center: this.coordinates,          // this.coordinates refers to coordinates above that will be obtained when user coordinates are input.
        zoom: 12,
        });

        // adding openstreetmap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 17,
            attribution: '© OpenStreetMap',
        }).addTo(this.map);

        //create and add geolocation starter marker based on my neighborhood
        // const marker = L.marker([34.041201, -118.387629])
        //  original marker for my neighborhood
        const marker = L.marker(this.coordinates)    //  this.coordinates refers to coordinates obtained when user location is found.
		marker.addTo(this.map).bindPopup('<b>Hello!</b><br>You are here.').openPopup()               
    },

    // Business markers as arrays?  
    addMarkers() {
		for (var i = 0; i < this.businesses.length; i++) {
		this.markers = L.marker([
			this.businesses[i].lat,
			this.businesses[i].long,
		])
			// does order not matter here?
            .bindPopup(`<b>${this.businesses[i].name}</b>`)
			.addTo(this.map)
		}
	},
}


// get user's data, borrowed code from Module 11
// Get the user's coordinates:                                                              
async function getCoords(){
    const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    });
    return [pos.coords.latitude, pos.coords.longitude]
}
// console.log(getCoords());

// foursquare search code? Was able to figure out how to get the options code
// But I would have not figured out that Foursquare code needed to be wrapped as an async as well.
async function getFoursquare(business){
    const options = {
        method: 'GET',
        headers: {
        Accept: 'application/json',
        Authorization: 'fsq3wmyE/31VN7qaHcG54EfkY95INS3urWLF2pzPriRBuE8='
        }
    }

    // let limit = 5
    // Corresponds to the myMap array?
    let lat = myMap.coordinates[0]
    let lon = myMap.coordinates[1]
    let response = await fetch(`https://api.foursquare.com/v3/places/search?&query=${business}&ll=${lat}%2C${lon}&limit=5`, options)
    // my code that came from foursquare was not working.
    // let response = await fetch('https://api.foursquare.com/v3/places/search?query=business', options)
    // not sure where the parsedData code comes from.
    let jsonString = await response.text()
	let data = JSON.parse(jsonString)
	let businesses = data.results
    console.log(business)
	return businesses
    // part of original code that was no pulling responses for fourSquare
    // .then(response => response.json())
    // .then(response => console.log(response))
    // .catch(err => console.error(err));

}
  

// process foursquare array
// Is this code supposed to input information into the business arrays up top?
function processBusinesses(data) {
	let businesses = data.map((element) => {
		let location = {
			name: element.name,
			lat: element.geocodes.main.latitude,
			long: element.geocodes.main.longitude
		};
		return location
	})
	return businesses
}


// The onload event occurs when an object has been loaded.
// Look almost similar to build ad1 and ad2 code from previous module.
window.onload = async () => {
	const coords = await getCoords()
    myMap.coordinates = coords
	myMap.createMap()
    // console.log(coords)
}


// submit button
// does not appear to be logging businesses on my map.
// browser saying cannot read properties of null
// FIXED, turns out html id was misspelled as 'sumbit'.
let submitButt = document.getElementById('submit')
submitButt.addEventListener("click", async (event) => {
        event.preventDefault();
        let business = document.getElementById('business').value;
        let data = await getFoursquare(business);
        myMap.businesses = processBusinesses(data);
        myMap.addMarkers();
    })