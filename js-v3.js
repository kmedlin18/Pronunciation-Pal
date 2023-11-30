// Imports and declarations
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechGrammarList =
  window.SpeechGrammarList || window.webkitSpeechGrammarList;
const SpeechRecognitionEvent =
  window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

// Placeholder for recently recognized words
const recentWords = [];

// Placeholder for the image source
const imgSrc = "images\\pronunciation_images\\pronunciation_placeholder.PNG";

// Speech recognition instance
const recognition = new SpeechRecognition();

const speechRecognitionList = new SpeechGrammarList();
recognition.grammars = speechRecognitionList;
recognition.continuous = false;
recognition.lang = "en-US";
recognition.interimResults = false;
recognition.maxAlternatives = 1;

// Create a function to update the recent section with recognized words (showing only the last 3 words)
function updateRecentWords() {
  const recentSection = document.querySelector(".recent-section");
  recentSection.innerHTML = recentWords
    .slice(-3) // Display only the last 3 recognized words
    .map(
      (word) => `
        <div class="recent-word-box">
          <div class="word-title">${word}</div>
          <div class="diagram-popup"></div>
          <button class="show-diagrams-btn">Show Diagrams</button>
        </div>
      `
    )
    .join("");
}

// Attach an event handler to the click event on the listen button
const listenButton = document.getElementById("listen-button");
const listeningIndicator = document.getElementById('listening-indicator')
listenButton.addEventListener("click", () => {
  recognition.start();
  console.log("Ready to receive command");
  listenButton.textContent = "Recording...";
  listeningIndicator.style.display = 'block'; // Display listening indicator
});

// Array of predefined words
const predefinedWords = ["hey", "what", "come", "go", "hand", "sick"];

// Event handler for recognition results
recognition.onresult = (event) => {
  const recognizedWords = event.results[0][0].transcript;

  // Split recognized words into an array
  const recognizedWordsArray = recognizedWords.split(" ");

  // Process each recognized word
  recognizedWordsArray.forEach((word) => {
    recentWords.push(word);
    updateRecentWords();

    // Display spoken word
    const recognizedWordElement = document.querySelector(
      "#recognized-word span"
    );
    recognizedWordElement.textContent = recognizedWords;
    const recognizedWordContainer = document.querySelector("#recognized-word");
    recognizedWordContainer.style.display = "block";

    // Check if the recognized word is in the predefined list
    if (predefinedWords.includes(word)) {
      handleRecognizedWord(word);
    }
  });
};

// Function to handle recognized words
function handleRecognizedWord(word) {

  if (predefinedWords.includes(word)) {
    const wordImgSrc = `images/pronunciation_images/${word}/${word}.png`;
    displayWordImage(wordImgSrc);
  }
}

// Function to display diagrams for each letter in the recognized word
function displayWordImage(wordImgSrc) {
  // Clear the existing content in the diagram section
  const diagramSection = document.querySelector(".diagram-section");
  diagramSection.innerHTML = "";

  const img = document.createElement("img");
  img.src = wordImgSrc;

  const container = document.createElement("div");
  container.className = "image-container";
  container.appendChild(img);

  diagramSection.appendChild(container);
}

// Event handler for the click event on the show-diagrams-btn button
document.addEventListener("click", (event) => {
  console.log("Clicked element:", event.target);
  // Check if the clicked element is a show-diagrams-btn button
  if (event.target.classList.contains("show-diagrams-btn")) {
    // Find the corresponding recent-word-box element
    const recentWordBox = event.target.closest(".recent-word-box");

    // Get the word associated with the recent-word-box
    const word = recentWordBox.querySelector(".word-title").textContent;

    const wordImgSrc = `images\\pronunciation_images\\${word}\\${word}.png`;

    // Display a popup with the diagrams
    displayDiagramsPopup(wordImgSrc);
  }
});

// Function to display diagrams in a popup or modal
function displayDiagramsPopup(wordImgSrc) {
  console.log("Displaying popup with sources:", wordImgSrc);
  // Remove any existing popups
  const existingPopup = document.querySelector(".diagram-popup");
  if (existingPopup) {
    existingPopup.parentElement.removeChild(existingPopup);
  }
  // Create a popup or modal element
  const popup = document.createElement("div");
  popup.className = "diagram-popup";

  // Close button
  const closeBtn = document.createElement("button");
  closeBtn.className = "close-popup-btn";
  closeBtn.innerHTML = "&times;";
  closeBtn.addEventListener("click", () => {
    document.querySelector(".recent-section").removeChild(popup);
  });
  popup.appendChild(closeBtn);

  const img = document.createElement("img");
  img.src = wordImgSrc;
  popup.appendChild(img);


  // Append the popup to the recent section
  document.querySelector(".recent-section").appendChild(popup);

  // "open" class to make the close button visible
  popup.classList.add("open");
}

// Event handler for the end of speech recognition
recognition.onspeechend = () => {
  recognition.stop();
  console.log("Speech recognition ended");
  listenButton.textContent = "Record";
  listeningIndicator.style.display = 'none';
};

// Event handler for recognition errors
recognition.onerror = (event) => {
  console.error(`Error occurred in recognition: ${event.error}`);
};


