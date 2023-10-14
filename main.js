const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechGrammarList =
  window.SpeechGrammarList || window.webkitSpeechGrammarList;
const SpeechRecognitionEvent =
  window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

const colors = [
  "aqua",
  "azure",
  "beige",
  "bisque",
  "black",
  "blue",
  "brown",
  "chocolate",
  "coral" /* … */,
];

// Tells the speech recognizer what to listen for with JSGF https://www.w3.org/TR/jsgf/
const grammar = `#JSGF V1.0; grammar colors; public <color> = ${colors.join(
    " | ",
)};`;

// Speech recognition instance that controls the recognition for the appliaction
const recognition = new SpeechRecognition();

const speechRecognitionList = new SpeechGrammarList();
//Adding the grammer to the list, accepts as parameters the string we want to add and an optional weighted value
speechRecognitionList.addFromString(grammar, 1);

//Add SpeechGrammerList to the speech recognition instance
recognition.grammars = speechRecognitionList;
//Controls whether continuous results are caotured (true) or a single result (false)
recognition.continuous = false;
recognition.lang = "en-US";
//Defones whether the speech recognition system should return interim results or final results
recognition.interimResults = false;
//Sets the number of alternative potential matches that should be returned per result - this could be good for the future
recognition.maxAlternatives = 1;

// //TODO: Starting the speech recognition

// Find and assign HTML elements by their class names
const diagnostic = document.querySelector(".output"); // Element for displaying diagnostic messages
const hints = document.querySelector(".hints"); // Element for displaying hints

// Initialize a variable to build HTML content for color hints
let colorHTML = "";

// Loop through the 'colors' array to create HTML color hints
colors.forEach((color, i) => {
  console.log(color, i);
  colorHTML += `<span style="background-color:${color};"> ${color} </span>`;
});

// Set the color hints as the content of the 'hints' element
hints.innerHTML = `Tap or click anywhere, then say a color to change the background color of the app. Try ${colorHTML}.`;

// Attach an event handler to the click event on the entire document body
document.body.onclick = () => {
  // Start the speech recognition process
  recognition.start();
  console.log("Ready to receive a color command.");
};

// Event handler for recognition results
recognition.onresult = (event) => {
  // Get the recognized color from the recognition results
  const color = event.results[0][0].transcript;

  // Display the recognized color in the 'diagnostic' element
  diagnostic.textContent = `Result received: ${color}.`;

  // Change the background color of the entire document to the recognized color
  document.documentElement.style.backgroundColor = color;

  // Log the confidence level of the recognition result
  console.log(`Confidence: ${event.results[0][0].confidence}`);
};

// Event handler for the end of speech recognition
recognition.onspeechend = () => {
  // Stop the speech recognition process
  recognition.stop();
};

// Event handler for cases where no match is found
recognition.onnomatch = (event) => {
  // Display a message in the 'diagnostic' element indicating no color match
  diagnostic.textContent = "I didn't recognize that color.";
};

// Event handler for recognition errors
recognition.onerror = (event) => {
  // Display an error message in the 'diagnostic' element
  diagnostic.textContent = `Error occurred in recognition: ${event.error}`;
};


  
