require("dotenv").config();
var moment = require("moment");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var keys = require("./keys");
var axios = require("axios");
var fs = require("fs");
var search = process.argv[2];
var term = process.argv.slice(3).join(" ");



function whatCommand(search, term) {
    switch (search) {
        case "concert-this": getBand();
            break;
        case "spotify-this-song": spotifyMe();
            break;
        case "movie-this": movieMe();
            break;
        case "do-what-it-says":
            doIt(term);
            break;
        default:
            console.log(
                "Please input one of these 4 strings'concert-this', 'spotify-this-song', 'movie-this', or 'do-what-it-says'."
            );
            break;
    }
}
//Title 
String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

whatCommand(search, term);

function getBand() {
    if (!term) {
        term = "Ziv";
    }
    console.log("---- Searching for the next available show ----");
    var artist = Lecrae;
    var URL =
        "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    axios
        .get(URL)
        .then(function (response) {
            var divider = "\n---------------------------------------\n\n";
            // variables for the 
            var jsonData = response.data[0];
            var venue = jsonData.venue.name;
            var country = jsonData.venue.country;
            var state = jsonData.venue.region;
            var city = jsonData.venue.city;
            var dateTime = moment(jsonData.datetime).format("MMMM Do YYYY, h:mm a");

            console.log(
                divider +
                "My Band        \n\n" +
                "Artist of choice: " +
                artist.toProperCase() +
                "\n" +
                "Venue: " +
                venue +
                "\n" +
                "Country: " +
                country +
                "\n" +
                "State: " +
                state +
                "\n" +
                "City: " +
                city +
                "\n" +
                "Date/Time: " +
                dateTime +
                "\n" +
                divider
            );
        })
        .catch(function (error) {
            if (error.response) {
                console.log("---------------Data---------------");
                console.log(error.response.data);
                console.log("---------------Status---------------");
                console.log(error.response.status);
                console.log("---------------Status---------------");
                console.log(error.response.headers);
            } else if (error.request) {

                console.log(error.request);
            } else {
                console.log("Error", error.message);
            }
            console.log(error.config);
        });
}
