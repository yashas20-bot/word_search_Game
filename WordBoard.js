import { Trie } from "./Trie.js";

const MIN_WORD_LENGTH = 4;

class WordBoard {
  constructor(numOneLetters, numTwoLetters, numThreeLetters) {    
    this.trie = new Trie();

    this.results = [];

    let letters = [
      ...this.pickRandomLetters(this.trie.oneLetterGroups, numOneLetters), 
      ...this.pickRandomLetters(this.trie.twoLetterGroups, numTwoLetters), 
      ...this.pickRandomLetters(this.trie.threeLetterGroups, numThreeLetters)
    ];

    this.dimension = Math.floor(Math.sqrt(numOneLetters + numTwoLetters + numThreeLetters));
    
    this.board = [];
    for(let row = 0;row < this.dimension;row++) {
      this.board.push([]);
      for(let col = 0;col < this.dimension;col++) {
        const randPos = Math.floor(Math.random() * letters.length);
        const letterGroup = letters[randPos];
        letters.splice(randPos, 1);
        this.board[row].push({
          letterGroup: letterGroup,
          visited: false
        });
      }
    }
  }

  pickRandomLetters(letterGroup, numLetters) {
    let letters = [];
    for(let i = 0;i < numLetters;i++) {
      const randPos = Math.floor(Math.random() * letterGroup.length);
      letters.push(letterGroup[randPos]);
      letterGroup.splice(randPos, 1);
    }
    return letters;
  }

  solve() {
    this.results = [];
    for(let row = 0;row < this.board.length;row++) {
      for(let col = 0;col < this.board.length;col++) {
        this.board[row][col].visited = false;
      }
    }
    
    for(let row = 0;row < this.board.length;row++) {
      for(let col = 0;col < this.board.length;col++) {
        const traversalInfo = [];
        this.solveHelper("", row, col, traversalInfo);
      }
    }
  }

  solveHelper(wordSoFar, row, col, traversalInfo) {
    if(row >= 0 && row < this.dimension && col >= 0 && col < this.dimension) {
      if(this.board[row][col].visited === false) {
        this.board[row][col].visited = true;
        const updatedWord = wordSoFar + this.board[row][col].letterGroup;
        const searchResult = this.trie.search(updatedWord);

        if(searchResult === "FOUND" || searchResult === "PARTIAL") {
          const traversal = {
            row: row,
            column: col,
            direction: null
          };
          traversalInfo.push(traversal);

          if(searchResult === "FOUND" && updatedWord.length >= MIN_WORD_LENGTH) {
            const foundWordLength = updatedWord.length;
            if(!this.results[foundWordLength]) {
              this.results[foundWordLength] = [];
            }
            const completeWord = {
              word: updatedWord,
              traversalInfo: traversalInfo.map(info => {
                return {
                  row: info.row,
                  column: info.column,
                  direction: info.direction
                };
              })
            };
            this.results[foundWordLength].push(completeWord);
          }
          traversal.direction = "northWest";
          this.solveHelper(updatedWord, row - 1, col - 1, traversalInfo);
          traversal.direction = "north";
          this.solveHelper(updatedWord, row - 1, col, traversalInfo);
          traversal.direction = "northEast";
          this.solveHelper(updatedWord, row - 1, col + 1, traversalInfo);
          traversal.direction = "west";
          this.solveHelper(updatedWord, row, col - 1, traversalInfo);
          traversal.direction = "east";
          this.solveHelper(updatedWord, row, col + 1, traversalInfo);
          traversal.direction = "southWest";
          this.solveHelper(updatedWord, row + 1, col - 1, traversalInfo);
          traversal.direction = "south";
          this.solveHelper(updatedWord, row + 1, col, traversalInfo);
          traversal.direction = "southEast";
          this.solveHelper(updatedWord, row + 1, col + 1, traversalInfo);

          traversalInfo.pop();
        }
        this.board[row][col].visited = false;
      }
    }
  }

  clear(row, col) {
    this.board[row][col].letterGroup = "xxx";
  }
  
  toString() {
    let retVal = [];
    for(let row = 0;row < this.board.length;row++) {
      for(let col = 0;col < this.board.length;col++) {
        retVal.push(`${this.board[row][col].letterGroup}  `.substring(0, 3));
      }
      retVal.push("\n");
    }
    return ` ${retVal.join(" ")}`;
  }
}

export { WordBoard };