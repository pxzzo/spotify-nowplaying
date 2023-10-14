const express = require('express');
const http = require('http');
const SpotifyWebApi = require('spotify-web-api-node');
const open = require('opn');
const { Server } = require('socket.io');
const path = require('path'); // Import the 'path' module

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 8888;
const REDIRECT_URI = `http://localhost:${PORT}/callback`;

app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "img-src 'self' https://i.scdn.co");
    next();
});


const CLIENT_ID = 'bd6f2c6333aa45ed92fa253666f1abb2';
const CLIENT_SECRET = 'e17786057b894b2499c7307d1335a3db';

const spotifyApi = new SpotifyWebApi({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri: REDIRECT_URI,
});

// Variables to store authorization code and access token
let authorizationCode = null;
let accessToken = null;
  

// Serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/cp.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'cp.js'));
    res.type('text/javascript'); // Set the content type explicitly
  });
  
  app.get('/vibrant.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.sendFile(path.join(__dirname, 'vibrant.js'));
});

  

app.get('/login', (req, res) => {
    const scopes = ['user-read-currently-playing', 'user-read-playback-state', 'user-modify-playback-state'];
    const authorizeURL = spotifyApi.createAuthorizeURL(scopes);
    open(authorizeURL);
    req.redirect = '/';
    });
  
  app.get('/callback', (req, res) => {
    authorizationCode = req.query.code;
  
    // Handle the authorization code, store it, and redirect the user or show a success message
    // In a production environment, you should securely store the authorization code
    // ...
  
    res.send('Authentication successful. You can now close this page.');
  });
  
  io.on('connection', (socket) => {
    socket.on('request_current_track', async () => {
      if (!accessToken) {
        if (authorizationCode) {
          try {
            // Use the stored authorization code to obtain an access token
            const data = await spotifyApi.authorizationCodeGrant(authorizationCode);
            accessToken = data.body.access_token;
            // Store the access token securely (e.g., in a session or a database)
            // ...
  
          } catch (error) {
            console.error('Error during authentication:', error);
            socket.emit('current_track', 'An error occurred during authentication.');
            return;
          }
        } else {
          // Handle the case where there is no authorization code or access token
          socket.emit('current_track', 'Please authenticate with Spotify first.');
          return;
        }
      }
  
      // Now, you can use the accessToken to make API requests
      spotifyApi.setAccessToken(accessToken);
  
      try {
        const currentTrack = await spotifyApi.getMyCurrentPlayingTrack();
        let responseText = '';
        let albumImageURL = ''; // Initialize an empty string
  
        if (currentTrack.body && currentTrack.body.item) {
            const trackName = currentTrack.body.item.name;
            const artistName = currentTrack.body.item.artists[0].name;
            const album = currentTrack.body.item.album.name
            const releaseDate = currentTrack.body.item.album.release_date
            const popularity = currentTrack.body.item.popularity

            responseText = `Du hörst gerade:\n\n${trackName}\n\nvon\n\n${artistName}`;
            extraDetails = `Album: ${album}
            ReleaseDate: ${releaseDate}
            Popularität: ${popularity}`
          if (currentTrack.body.item.album.images && currentTrack.body.item.album.images.length > 0) {
            // Choose the first image (you can select a specific size)
            albumImageURL = currentTrack.body.item.album.images[0].url;
          }
        } else {
          responseText = 'No track is currently playing.';
        }
  
        // Send the currently playing track information to the connected client
        socket.emit('current_track', responseText, extraDetails);
        
        socket.emit('album_image', albumImageURL)
        // Calculate the position and duration
        const position = currentTrack.body.progress_ms;
        const duration = currentTrack.body.item.duration_ms;

        // Emit the 'current_position' event
        
        socket.emit('current_position', position, duration);

      } catch (error) {
        console.error('Error getting current track:', error);
        socket.emit('current_track', 'An error occurred while fetching the current track.');
      }
    });

  });
  
  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });