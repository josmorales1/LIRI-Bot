require("dotenv").config();

let fs = require("fs");
let keys = require("./keys.js");
let Spotify = require('node-spotify-api');
let spotify = new Spotify(keys.spotify);
let axios = require("axios");
let moment = require("moment");
let action = process.argv[2];
let name = process.argv.splice(3).join();

// different statements that we can chose to run from to run
if (action === "concert-this") {
    getconcertinformation();
}
else if (action === "spotify-this-song") {
    getSongInfo();
}
else if (action === "do-what-it-says") {
    getRandomInfo();
}
else if (action === "movie-this") {
    getMovieInfo();
}
else {
    console.log("Error: Invalid Entry")
}

//function for to get the concertinfo
function getconcertinformation() {

    let artistName = name.replace(/,/g, "");
    let queryUrl = "https://rest.bandsintown.com/artists/" + artistName + "/events?app_id=codingbootcamp";

    axios.get(queryUrl).then(function (response) {
        // concert date and the location of each event
        for (let i = 0; i < response.data.length; i++) {
            let concertDate = moment(response.data[i].datetime).format("MM/DD/YYYY");
            let getconcertinformation = ["\nVenue Name: " + response.data[i].venue.name,
            "Venue Location: " + response.data[i].venue.city + ", " + response.data[i].venue.country,
            "Concert Date: " + concertDate + "\n"].join("\n");
            console.log(getconcertinformation);
            fs.appendFileSync("log.txt", getconcertinformation, function (error) {
                if (error) throw error;
            });
        }
    });
}

// function to get song info
function getSongInfo() {
    let songName = "";
    if (!name) {
        songName = "the sign";
    }
    else {
        songName = name;
    }
    spotify.search({
        type: "track",
        query: songName,
        limit: 5
    }, function (error, data) {
        if (error) {
            fs.appendFileSync("log.txt", "Error: " + error, "utf8");
            return console.log("Error: " + error);
        }
        for (let i = 0; i < data.tracks.items.length; i++) {
            songInfo = ["\nSong Title: " + data.tracks.items[i].name,
            "Album Title: " + data.tracks.items[i].album.name,
            "Artist(s) Name: " + data.tracks.items[i].artists[0].name,
            "Preview URL: " + data.tracks.items[i].preview_url + '\n'].join('\n');
            console.log(songInfo);
            fs.appendFileSync("log.txt", songInfo, function (error) {
                if (error) throw error;
            });
        }
    });
}

// function to get movie info
function getMovieInfo() {
    let movieName = name.replace(/,/g, "+");
    // if no movie name entered, 'Rush Hour 3' will appear
    if (!movieName) {
        movieName = "Rush Hour 3 ";
    }

    let queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    axios.get(queryUrl).then(function (response) {
        movieInfo = ["\nTitle: " + response.data.Title,
        "Year Released: " + response.data.Year,
        "IMDB Rating: " + response.data.Ratings[0].Value,
        "Rotten Tomatoes Rating: " + response.data.Ratings[1].Value,
        "Country: " + response.data.Country,
        "Language: " + response.data.Language,
        "Plot: " + response.data.Plot,
        "Actors: " + response.data.Actors + '\n'].join('\n');
        console.log(movieInfo);
        fs.appendFile("log.txt", movieInfo, function (error) {
            if (error) throw error;
        });
    });

}

// function random.txt text
function getRandomInfo() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) throw error;
        else if (data.includes("concert-this")) {
            console.log(data);
            let str = data.split(",").pop().replace(/"/g, "");
            name = str;
            getconcertinformation();
        }
        else if (data.includes("spotify-this-song")) {
            console.log(data);
            let str = data.split(",").pop().replace(/"/g, "");
            name = str;
            getSongInfo();
        }
        else if (data.includes("movie-this")) {
            console.log(data);
            let str = data.split(",").pop().replace(/"/g, "").replace(/ /g, "+");
            name = str;
            getMovieInfo();
        }
        else {
            console.log("Error 1337");
        }
    });
}