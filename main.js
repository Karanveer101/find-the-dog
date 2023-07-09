//Select elements
const dogImage = document.getElementById("dogImage");
const audioElement = document.getElementById("audioElement");
const startGameBtn = document.getElementById("startGameBtn");
const startGameContainer = document.querySelector(".startGameContainer");
const gameOverContainer = document.querySelector(".gameOverContainer");
const threeSecondCountdownElement = document.getElementById(
    "threeSecondCountdown"
);
const gameEndText = document.getElementById("gameEndText");
const playerScoreElement = document.getElementById("playerScore");
const continueBtn = document.getElementById("continueBtn");
const playAgainBtn = document.getElementById("playAgainBtn");
const footerContent = document.querySelector(".footer-content");
const footer = document.querySelector(".footer");

//Dog API fetch request
async function logJSONData() {
    const response = await fetch(
        "https://api.giphy.com/v1/gifs/random?api_key=RwXCKBC9gGgcwLBABoMnvmAqj9bG3OVE&tag=funny dog"
    );
    const jsonData = await response.json();
    dogImage.src = jsonData.data.images.original.url;
    console.log(jsonData.data.images.original.url);
}

logJSONData();

// Ramdomize the position of dog image
// Function to generate random coordinates
let x;
let y;
function getRandomPosition() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    x = Math.floor(Math.random() * (width - 150)); // Subtracting image width for proper positioning
    y = Math.floor(Math.random() * (height - 150)); // Subtracting image height for proper positioning
    return [x, y];
}

getRandomPosition();

// position the image randomly
function placeImageRandomly(e) {
    const x2 = x + 100;
    const y2 = y + 100;

    console.log(x, x2, y, y2);
    console.log(e.clientX, e.clientY);
    //logic to check if the user clicked within a specified range
    if (
        e.clientX >= x &&
        e.clientX <= x2 &&
        e.clientY >= y &&
        e.clientY <= y2
    ) {
        //display the dog image
        dogImage.style.left = x + "px";
        dogImage.style.top = y + "px";
        dogImage.style.display = "block";
        audioHandler();
        window.addEventListener("click", audioHandler);
        clearInterval(timer);
    }
}

// Function to increase the pitch
let source;
let defaultPitchGain = 1;
function increasePitch(value) {
    resetPitchGain(defaultPitchGain); // resets the pitch to default
    const audioElement = document.getElementById("audioElement");
    const audioContext =
        audioElement.audioCtx ||
        new (window.AudioContext || window.webkitAudioContext)();

    // Check if the audio context is already created
    if (!audioElement.audioCtx) {
        console.log("The audio context doesn't exist");
        audioElement.audioCtx = audioContext;
        source = audioContext.createMediaElementSource(audioElement);
        const pitchControl = audioContext.createGain();
        pitchControl.gain.value = value;

        source.connect(pitchControl);
        pitchControl.connect(audioContext.destination);
    } else {
        console.log("Audio context exists");
        console.log(source);
        const pitchControl = audioContext.createGain();
        pitchControl.gain.value = value;
        source.connect(pitchControl);
        pitchControl.connect(audioContext.destination);
    }
    audioElement.play();
}
// Function to reset the pitch gain to default
function resetPitchGain() {
    const audioContext = audioElement.audioCtx;
    if (audioContext) {
        const pitchControl = audioContext.createGain();
        pitchControl.gain.value = defaultPitchGain;
        source.disconnect();
        source.connect(pitchControl);
        pitchControl.connect(audioContext.destination);
    }
}

// Function to calculate distance between two points
function calculateDistance(x1, y1, x2, y2) {
    const xDistance = x2 - x1;
    const yDistance = y2 - y1;
    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

// Function to update audio pitch based on cursor position
let previousDistance;
let conditionOne = false;
let conditionTwo = false;
let conditionThree = false;

function updateAudioPitch(event) {
    // const imagePosition = dogImage.getBoundingClientRect();
    // console.log(imagePosition)
    const cursorX = event.clientX;
    const cursorY = event.clientY;
    const imageCenterX = x + 100 / 2;
    const imageCenterY = y + 100 / 2;
    console.log("image x and y center is " + imageCenterX);
    const distance = calculateDistance(
        cursorX,
        cursorY,
        imageCenterX,
        imageCenterY
    );

    //logic to increase pitch based on distance from dog image

    if (distance <= 250) {
        console.log("increased pitch by 15");
        conditionOne = true;
        increasePitch(16);
    } else if (distance > 250 && distance < 450) {
        conditionTwo = true;
        console.log("increased pitch by 7");
        increasePitch(7);
    } else {
        conditionThree = true;
        console.log("increased pitch by 1");
        increasePitch(1);
    }
    previousDistance = distance;

    console.log(distance);
}

//Creating a countdown timer of 2 minutes
// Set the countdown duration of 2 minutes in seconds
let countdownDuration = 120;
let threeSecondCountdown = 3;

// select element to display countdown
const countdownElement = document.getElementById("countdown");

//three second countdown function
function startThreeSecondCountdown() {
    threeSecondCountdownElement.style.display = "block";
    const interval = setInterval(function () {
        //Decrease countdown
        threeSecondCountdown--;

        //logic
        if (threeSecondCountdown === 0) {
            threeSecondCountdownElement.textContent = "GO!";
            return;
        } else if (threeSecondCountdown < 0) {
            threeSecondCountdownElement.style.display = "none";
            window.removeEventListener("click", audioHandler);
            clearInterval(interval);
            threeSecondCountdown = 3;
            startCountDown();
        }
        //display countdown
        threeSecondCountdownElement.textContent = threeSecondCountdown;
    }, 1000);
}

// Start the timer countdown function
let timer;
function startCountDown() {
    timer = setInterval(function () {
        // Calculate minutes and seconds
        const minutes = Math.floor(countdownDuration / 60);
        const seconds = countdownDuration % 60;

        // Display the countdown in the HTML element
        countdownElement.textContent =
            minutes.toString().padStart(2, "0") +
            ":" +
            seconds.toString().padStart(2, "0");

        // Decrease the countdown duration by 1 second
        countdownDuration--;

        // Check if the countdown has reached 0
        if (countdownDuration < 0) {
            //start dog rain
            startDogRain();

            //pause the audio and re add the event listener
            audioHandler();
            window.addEventListener("click", audioHandler);

            // Stop the countdown
            clearInterval(timer);

            //display the game over container
            gameOverContainer.style.display = "block";

            //display game end text based on dogs found

            if (dogsFound < 5) {
                gameEndText.textContent = `Uh-oh! Your doggy hearing needs a little tune-up. Seems like you missed out on those hidden hounds. Don't worry, though! Keep those ears perked up and give it another try. Game over, but you're just a few woofs away from becoming a true 'paw'sician!`;
            } else if (dogsFound > 5 && dogsFound < 10) {
                gameEndText.textContent =
                    "Hear ye, hear ye! You've unleashed your inner dog maestro, using your 'pawsome' hearing to sniff out those elusive canines. Bravo on your exceptional auditory skills! You've mastered the art of 'pawsical' discovery. Congratulations on a wag-tastic victory!";
            } else {
                gameEndText.textContent =
                    "Listen up, you champion of canine acoustics! With your ears finely tuned to the symphony of hidden hounds, you've conquered the game and emerged as the ultimate 'howl'ophonist! Bravo on your magnificent auditory triumph!";
            }
        }
    }, 1000);
}

//function to handle start game button

function startGame() {
    startGameContainer.style.display = "none";
    startThreeSecondCountdown();
}

//function that handles when dog is clicked
let dogsFound = 0;
function handleDogClick() {
    //logic to not increase dog found count if the image is clicked again
    if (dogImage.classList.contains("dogImageReposition")) {
        return;
    }

    //display the dog
    dogImage.style.display = "block";

    //reposition dog
    dogImage.classList.add("dogImageReposition");

    //increase dogs found score
    dogsFound++;

    //display dogs found score
    playerScoreElement.textContent = dogsFound;

    //pause the timer
    clearInterval(timer);

    //display continue button
    continueBtn.style.display = "block";
}

//function to handle continue button
function handleContinueBtn() {
    //call get random coordinates function
    getRandomPosition();
    //hide continue button
    continueBtn.style.display = "";

    //removeEventListener to enable audio
    window.removeEventListener("click", audioHandler);

    //hide the dog
    dogImage.style.display = "";

    //remove dogImageReposition class
    dogImage.classList.remove("dogImageReposition");

    //continue the timer
    startCountDown();

    //make a new api call
    logJSONData();

    // Call the function to place the image randomly
    placeImageRandomly();
}

//function to createGif
function createDogGif() {
    const dogGif = document.createElement("img");
    dogGif.classList.add("dog-gif");
    dogGif.src = "dog.png";
    // Set initial position
    const randomX = Math.floor(Math.random() * window.innerWidth);
    dogGif.style.left = `${randomX}px`;

    // Append dog image to the rain container
    const rainContainer = document.querySelector(".rain-container");
    rainContainer.appendChild(dogGif);
}

//function to start dog rain
let dogRain;
function startDogRain() {
    dogRain = setInterval(createDogGif, 400);
}

//function to stop dog rain
function stopDogRain() {
    clearInterval(dogRain);
    const dogImages = document.querySelectorAll(".dog-gif");
    dogImages.forEach((dogImage) => {
        dogImage.remove();
    });
}

//function to play again

function playAgain() {
    console.log(threeSecondCountdown);

    //stop dog rain
    stopDogRain();

    //remove event listener to enable audio
    window.addEventListener("click", audioHandler);

    //reset values
    dogsFound = 0;
    countdownDuration = 120;
    startGame();

    //display dogs found score
    playerScoreElement.textContent = dogsFound;

    //hide end game container
    gameOverContainer.style.display = "";
}

//footer expanded content
function toggleFooterContent(event) {
    event.preventDefault();
    footerContent.classList.toggle("expanded");
    if (footerContent.classList.contains("expanded")) {
        footer.innerHTML = `<a href="https://www.freepik.com/free-vector/cute-colorful-kitten-pow-pattern-design_2709577.htm#query=dog%20background&position=2&from_view=keyword&track=ais">Image by starline</a> on Freepik`;
    } else {
        footerContent.textContent = "credits";
    }
}

//audio handler function
function audioHandler() {
    audioElement.pause();
}

// Event listeners
document.addEventListener("click", updateAudioPitch);
dogImage.addEventListener("click", handleDogClick);
continueBtn.addEventListener("click", handleContinueBtn);
startGameBtn.addEventListener("click", startGame);
playAgainBtn.addEventListener("click", playAgain);
footerContent.addEventListener("click", toggleFooterContent);
document.addEventListener("click", placeImageRandomly);
window.addEventListener("click", audioHandler);
