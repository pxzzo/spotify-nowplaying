// Connect to the Socket.io server
// Check if the socket connection is established
console.log('Socket connection established');
const socket = io();


// Function to update the track information on the page
const updateTrackInfo = () => {
    socket.emit('request_current_track');
};

// Initial request for the currently playing track
updateTrackInfo();

// Function to update the progress bar based on current position and duration

const updateProgressBar = (position, duration) => {
  const progress = (position / duration) * 100;
  const progressBar = document.getElementById('progress-bar');
  const currentTimeElement = document.getElementById('current-time');
  const timeLeftElement = document.getElementById('time-left');

  // Update the progress bar
  progressBar.style.width = progress + '%';
  const currentTimeInSeconds = position / 1000;
  const durationInSeconds = duration / 1000;
  const currentTimeFormatted = formatTime(currentTimeInSeconds);
  const durationTimeFormatted = formatTime(durationInSeconds);

  // Update the time measurements
  currentTimeElement.textContent = currentTimeFormatted;
  timeLeftElement.textContent = `-${durationTimeFormatted}`;
};



const formatTime = (timeInSeconds) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

// Function to update the album image and calculate dominant color with smooth transition
const updateAlbumImage = (albumImageURL) => {
    const imageElement = document.getElementById('album-image');

    // Apply fade-out transition

    if (albumImageURL) {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = albumImageURL;

        img.onload = () => {
            const vibrant = new Vibrant(img);
            const swatch = vibrant.VibrantSwatch || vibrant.MutedSwatch;

            if (swatch) {
                const dominantColor = swatch.getHex();
                // Apply the background color transition
                document.body.style.backgroundColor = dominantColor;
                  // Function to calculate the complementary color
                  function calculateComplementaryColor(hexColor) {
                    // Remove the hash symbol from the hex color code (if present)
                    hexColor = hexColor.replace(/^#/, '');
                  
                    // Parse the hex color into RGB components
                    const red = 255 - parseInt(hexColor.substring(0, 2), 16);
                    const green = 255 - parseInt(hexColor.substring(2, 4), 16);
                    const blue = 255 - parseInt(hexColor.substring(4, 6), 16);
                  
                    // Convert the RGB components to a complementary hex color code
                    const complementaryHexColor = `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`;
                  
                    return complementaryHexColor;
                  }

// Get the background color of the body element
const backgroundColor = dominantColor;
let progressBar = document.getElementById('progress-bar');
const complementaryColor = calculateComplementaryColor(backgroundColor);

// Set the complementary color as the progress bar background color
progressBar.style.backgroundColor = complementaryColor;
            }

            // Set the image source and apply the fade-in transition
            imageElement.src = albumImageURL;
            imageElement.style.opacity = 1;
            console.log('Album image URL:', albumImageURL);
        };
    } else {
        // Hide the image element with fade-out transition if there's no album art
        imageElement.style.opacity = 0;
    }
};




// Poll the server for updates every 1 second (adjust as needed)
setInterval(updateTrackInfo, 1000);

socket.on('current_track', (trackInfo, extra) => {
    document.getElementById('track-info').textContent = trackInfo;
    document.getElementById('song-details').textContent = extra;
});

// Log the received data in the 'current_position' event
socket.on('current_position', (position, duration) => {
  console.log('Received position:', position);
  console.log('Received duration:', duration);
  updateProgressBar(position, duration);
});


socket.on('album_image', (albumImageURL) => {
    updateAlbumImage(albumImageURL);
});
