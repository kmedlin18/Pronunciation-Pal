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
listenButton.addEventListener("click", () => {
  recognition.start();
  console.log("Ready to receive command");
  listenButton.textContent = "Recording...";
});

// Array of predefined words
const predefinedWords = ["hey", "what", "come", "go", "hand", "word"];

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
  // Show a loading spinner or change the color of the "Record" button during recognition
  showRecognitionInProgress();

  // Create an array to store image sources for each letter
  const letterImageSources = [];

  // Loop through each letter in the recognized word
  for (const letter of word) {
    // Build the image source path for the letter
    const letterImgSrc = `images\\pronunciation_images\\${word}\\${letter}.png`;
    letterImageSources.push(letterImgSrc);
  }

  // Display the diagrams for each letter in the recognized word
  displayLetterDiagrams(letterImageSources);

  // Reset the "Record" button after recognition
  hideRecognitionInProgress();
}

// Function to display diagrams for each letter in the recognized word
function displayLetterDiagrams(letterImageSources) {
  // Clear the existing content in the diagram section
  const diagramSection = document.querySelector(".diagram-section");
  diagramSection.innerHTML = "";

  // Loop through each letter's image source and create and append image elements
  letterImageSources.forEach((letterImgSrc) => {
    const img = document.createElement("img");
    img.src = letterImgSrc;

    const container = document.createElement("div");
    container.className = "image-container";
    container.appendChild(img);

    diagramSection.appendChild(container);
  });
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

    // Get the diagrams for each letter in the word
    const letterImageSources = [];
    for (const letter of word) {
      const letterImgSrc = `images\\pronunciation_images\\${word}\\${letter}.png`;
      letterImageSources.push(letterImgSrc);
    }

    // Display a popup or modal with the diagrams
    displayDiagramsPopup(letterImageSources);
  }
});

// Function to display diagrams in a popup or modal
function displayDiagramsPopup(letterImageSources) {
  console.log("Displaying popup with sources:", letterImageSources);
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
  closeBtn.innerHTML = "&times;"; // Close symbol (X)
  closeBtn.addEventListener("click", () => {
    document.querySelector(".recent-section").removeChild(popup);//body.removeChild(popup);
  });
  popup.appendChild(closeBtn);

  // Loop through each letter's image source and create and append image elements
  letterImageSources.forEach((letterImgSrc) => {
    const img = document.createElement("img");
    img.src = letterImgSrc;
    popup.appendChild(img);
  });

  // Append the popup to the recent section
  document.querySelector(".recent-section").appendChild(popup);

  // Add the "open" class to make the close button visible
  popup.classList.add("open");
}

// Function to show loading spinner or change the color of the "Record" button
function showRecognitionInProgress() {
  // You can add your code here to show a loading spinner or change the style of the "Record" button
  // For example, change the background color of the button
  listenButton.style.backgroundColor = "orange";
}

// Function to hide loading spinner or reset the "Record" button
function hideRecognitionInProgress() {
  // You can add your code here to hide the loading spinner or reset the style of the "Record" button
  // For example, reset the background color of the button
  listenButton.style.backgroundColor = "black";
}

// Event handler for the end of speech recognition
recognition.onspeechend = () => {
  recognition.stop();
  console.log("Speech recognition ended");
  listenButton.textContent = "Record";
};

// Event handler for cases where no match is found
recognition.onnomatch = (event) => {
  console.log("No match found");
  // Further implementation: Add any actions to take when no match is found.
};

// Event handler for recognition errors
recognition.onerror = (event) => {
  console.error(`Error occurred in recognition: ${event.error}`);
};

// Event handler for the end of speech recognition
recognition.onend = () => {
  console.log("Speech recognition ended");
  listenButton.textContent = "Record";
  // Further implementation: Add any actions to take when speech ends.
};
