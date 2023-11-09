/*
TODO ideas for Kirsten:
- Add a "recent searches" title
- Add red circle to indicate recording
- In the wireframe we have it so there is a new button to listen again, but I think it makes
more sense to have it be the same button
- Maybe some indicator that the app listened properly
- Show the user errors
*/


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

// *** Currently a placeholder for recently said words
const recentWords = [];

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



// Attach an event handler to the click event on the listen button
const listenButton = document.getElementById("listen-button");


listenButton.addEventListener("click", () => {
  recognition.start();
  console.log("Ready to recieve command");
  listenButton.textContent = 'Recording....'
});


// Event handler for recognition results
recognition.onresult = (event) => {
  // Get the recognized color from the recognition results
  //const color = event.results[0][0].transcript;

  // Display the recognized color in the 'diagnostic' element
  //diagnostic.textContent = `Result received: ${color}.`;

  // Change the background color of the entire document to the recognized color
  //document.documentElement.style.backgroundColor = color;

  // Log the confidence level of the recognition result
  //console.log(`Confidence: ${event.results[0][0].confidence}`);


  // ****
  // TODO: Here I am just populating the div element "diagram-section" with the placeholder image after the app is done "listening".
  // There is no voice recognition happening yet, that still needs to be implemented. This is probably temporay code so I could style the html.
  // For the purpose of this palce holder you still have to say something to get it to stop listening and display the images.
  // For now, we were thinking of having a set number of words the user could say and it would populate with the correct pronunciation diagrams similar to how it works with
  // the colors. Claire would know a lot about what diagrams to use.
  // ***

  
  const imgSrc = 'images\\pronunciation_images\\pronunciation_palceholder.PNG'

  const diagramSection = document.querySelector(".diagram-section");
  const rercentSection = document.querySelector('.recent-section');

  diagramSection.innerHTML = ""
  
  // Container for the imgaes
  const container = document.createElement('div');
  container.classList.add("image-container")

  // For loop adds 6 placeholder images like in the wireframe
  for (let i= 0; i<6; i++) {
    const img = document.createElement("img");
    img.src = imgSrc;
    container.appendChild(img);
  }

  diagramSection.appendChild(container)

  // Added placeholder for recently said word
  const recognizedWord = "Placeholder";
  recentWords.push(recognizedWord);
  
  // The array should only store three of the recently used words, pushing out the oldest one
  if (recentWords.length > 3) {
    recentWords.shift();
  }

  // Display all placeholders in recent-section
  rercentSection.innerHTML = recentWords
    .map(word => `
    <div class="recent-word-box">
      <div class="word-title">${word}</div>
      <button class="show-diagrams-btn">Show Diagrams</button>
    </div>
  `) // Each word is now in a box with a title and a button
  .join('');
};

// Event handler for the end of speech recognition
recognition.onspeechend = () => {
  // Stop the speech recognition process
  recognition.stop();
};

recognition.onend = () => {
  document.getElementById("listening-indicator").style.display = 'none';
  listenButton.textContent = 'Record';
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


