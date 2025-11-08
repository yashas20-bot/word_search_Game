import { WordBoard } from "./WordBoard.js";

let wordBoard;
let numFoundWords;
let startTime;
let lastSolveTime;

document.addEventListener("DOMContentLoaded", event => {
  loadBoard();
});

function loadBoard() {
  numFoundWords = 0;
  startTime = new Date();
  lastSolveTime = startTime;
  
  wordBoard = new WordBoard(33, 11, 5);

  for(let row = 0;row < wordBoard.board.length;row++) {
    for(let col = 0; col < wordBoard.board[row].length;col++) {
      const td = document.getElementById(`row${row}:column${col}`);
      td.innerHTML = wordBoard.board[row][col].letterGroup;
  
      td.classList = "";
      td.classList.add("boardPiece");
      td.addEventListener("click", letterGroupClicked);
    }
  }

  const longestWordList = document.getElementById("longestWordList");
  longestWordList.innerHTML = "";

  const congratsMessage = document.getElementById("congratsMessage");
  congratsMessage.innerHTML = "";

  const solvedWords = document.getElementById("solvedWords");
  solvedWords.innerHTML = ""; 

  displayPossibleWords();
}

function displayPossibleWords() {
  wordBoard.solve();
  const completeWords = wordBoard.results[wordBoard.results.length - 1];

  const longestWordList = document.getElementById("longestWordList");
  longestWordList.innerHTML = "";
  const numCompleted = document.getElementById("numCompleted");
  numCompleted.innerHTML = `${document.getElementsByClassName("solved").length}/49 squares`;

  if(completeWords && completeWords.length > 0) {
    const uniqueWords = new Set();

    completeWords.forEach(completeWord => {
      if(!uniqueWords.has(completeWord.word)) {
        uniqueWords.add(completeWord.word);
        const wordSpan = document.createElement("li");
        wordSpan.classList.add("solvableWord");
        wordSpan.innerHTML = completeWord.word;
        longestWordList.appendChild(wordSpan)
      }
    });
  } else {
    const endGame = document.createElement("div");
    const gameEndTime = new Date();
    const gameDuration = ((gameEndTime.getTime() - startTime.getTime()) / 1000).toFixed(0);
    endGame.innerHTML = `Congratulations! <br/>You solved it in ${gameDuration} seconds.`;

    const newGameButton = document.createElement("button");
    newGameButton.classList.add("btn");
    newGameButton.classList.add("btn-dark");
    newGameButton.innerHTML = "New Game";
    newGameButton.addEventListener("click", event => {
      loadBoard();
    });

    const congratsMessage = document.getElementById("congratsMessage");
    congratsMessage.innerHTML = "";
    congratsMessage.appendChild(endGame);
    congratsMessage.appendChild(newGameButton);  
  }
}

function letterGroupClicked(event) {
  const clickedLetterGroup = event.target;

  if(clickedLetterGroup.classList.contains("clicked")) {
    clickedLetterGroup.classList.remove("clicked");
  } else { 
    if(clickedLetterGroup.classList.contains("solved") === false) {
      clickedLetterGroup.classList.add("clicked");
    }
  }

  checkForResult();
}

function checkForResult() {
  const longestCompleteWords = wordBoard.results[wordBoard.results.length - 1];
  if(longestCompleteWords && longestCompleteWords.length > 0) {
    let recentSelections = document.getElementsByClassName("clicked");

    for(let i = 0;i < longestCompleteWords.length;i++) {
      const completeWord = longestCompleteWords[i];
      if(recentSelections.length === completeWord.traversalInfo.length) {
        if(compareSelectionToCompleteWords(recentSelections, completeWord)) {
          const solvedColor = `solved${numFoundWords % 20}`;
          
          while(recentSelections.length > 0) {
            const selection = recentSelections[0];
            selection.classList.remove("clicked");
            selection.classList.add(solvedColor);
            selection.classList.add("solved");

            const row = Number(selection.getAttribute("boardRow"));
            const column = Number(selection.getAttribute("boardColumn"));

            wordBoard.clear(row, column);
          }

          displayPossibleWords();
          addWordToResults(completeWord.word, solvedColor);
          numFoundWords++;
        }
      }
    }
  } else {
    console.log("No more words left");
  }
}

function compareSelectionToCompleteWords(recentSelections, completeWord) {
  let retVal = false;

  const traversalInfoObjects = {};

  for(let i = 0;i < completeWord.traversalInfo.length;i++) {
    const traversal = completeWord.traversalInfo[i];
    const traversalLocationInfo = `row:${traversal.row},column:${traversal.column}`;
    traversalInfoObjects[traversalLocationInfo] = traversal;
  }

  let numMatches = 0;
  for(let i = 0;i < recentSelections.length;i++) {
    const selectedLetterGroup = recentSelections[i];
    const selectedRow = Number(selectedLetterGroup.getAttribute("boardRow"));
    const selectedColumn = Number(selectedLetterGroup.getAttribute("boardColumn"));
    const selectedLocationInfo = `row:${selectedRow},column:${selectedColumn}`;

    if(traversalInfoObjects[selectedLocationInfo]) {
      numMatches++;
    }
  }

  if(numMatches === completeWord.traversalInfo.length) {
    for(let i = 0;i < recentSelections.length;i++) {
      const selectedLetterGroup = recentSelections[i];
      const selectedRow = Number(selectedLetterGroup.getAttribute("boardRow"));
      const selectedColumn = Number(selectedLetterGroup.getAttribute("boardColumn"));
      const selectedLocationInfo = `row:${selectedRow},column:${selectedColumn}`;
      if(traversalInfoObjects[selectedLocationInfo].direction) {
        selectedLetterGroup.classList.add(traversalInfoObjects[selectedLocationInfo].direction);
      }

      if(completeWord.traversalInfo[0].row === selectedRow && completeWord.traversalInfo[0].column === selectedColumn) {
        selectedLetterGroup.classList.add("firstLetter");
      }

      if(completeWord.traversalInfo[completeWord.traversalInfo.length - 1].row === selectedRow && completeWord.traversalInfo[completeWord.traversalInfo.length - 1].column === selectedColumn) {
        selectedLetterGroup.classList.add("lastLetter");
      }
    }
    retVal = true;
  }
  return retVal;
}

function addWordToResults(word, solvedColor) {
  const solvedWords = document.getElementById("solvedWords");
  const wordLi = document.createElement("li");

  const wordColor = document.createElement("span");
  wordColor.classList.add(solvedColor);
  wordColor.classList.add("swatch");
  wordColor.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";  
  wordLi.appendChild(wordColor);

  const wordText = document.createElement("span");
  wordText.innerHTML = word;
  wordLi.appendChild(wordText);

  const endTime = new Date();
  const diff = (endTime.getTime() - lastSolveTime.getTime()) / 1000;
  const lengthOfTime = document.createElement("span");
  lengthOfTime.innerHTML = ` (${diff.toFixed(1)} seconds) `;
  wordLi.appendChild(lengthOfTime);
  lastSolveTime = endTime;

  const defineLink = document.createElement("a");
  defineLink.setAttribute("href", `https://www.google.com/search?q=define+${word}`);
  defineLink.setAttribute("target", "_blank");
  defineLink.classList.add("text-muted");
  defineLink.innerHTML = `<small>Define '${word}'</small>`;
  wordLi.appendChild(defineLink);

  wordLi.addEventListener("mouseover", event => {
    const elements = document.getElementsByClassName(solvedColor);
    for(let i = 0;i < elements.length;i++) {
      elements[i].classList.add("highlight");
    }
  });
  wordLi.addEventListener("mouseout", event => {
    const elements = document.getElementsByClassName(solvedColor);
    for(let i = 0;i < elements.length;i++) {
      elements[i].classList.remove("highlight");
    }
  });

  wordLi.addEventListener("touchstart", event => {
    const elements = document.getElementsByClassName(solvedColor);
    for(let i = 0;i < elements.length;i++) {
      elements[i].classList.add("highlight");
    }
  });
  wordLi.addEventListener("touchend", event => {
    const elements = document.getElementsByClassName(solvedColor);
    for(let i = 0;i < elements.length;i++) {
      elements[i].classList.remove("highlight");
    }
  });
  
  solvedWords.appendChild(wordLi);
}