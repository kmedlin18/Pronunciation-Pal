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

//TODO: Starting the speech recognition


  