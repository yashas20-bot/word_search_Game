const fs = require("fs");

const TOP_NUMBER_OF_ONE_LETTER_GROUPS = 26;
const TOP_NUMBER_OF_TWO_LETTER_GROUPS = 20;
const TOP_NUMBER_OF_THREE_LETTER_GROUPS = 10;

class BuildTrie {
  constructor(dictFilePath) {
    this.dictionaryFilePath = dictFilePath;
    this.wordMap = {};

    this.oneLetterGroupings = [];
    this.twoLetterGroupings = [];
    this.threeLetterGroupings = [];

    this.readDictionaryFile(this.dictionaryFilePath);

    let trieCode = fs.readFileSync("./TrieTemplate.txt", "utf-8");
    trieCode = trieCode.replace("/*REPLACE_WORD_MAP*/", JSON.stringify(this.wordMap, null, 0));
    trieCode = trieCode.replace("/*ONE_LETTER_GROUPS*/", JSON.stringify(this.oneLetterGroupings));
    trieCode = trieCode.replace("/*TWO_LETTER_GROUPS*/", JSON.stringify(this.twoLetterGroupings));
    trieCode = trieCode.replace("/*THREE_LETTER_GROUPS*/", JSON.stringify(this.threeLetterGroupings));
    fs.writeFileSync("../Trie.js", trieCode);
  }

  readDictionaryFile(filePath) {
    const oneLetterFrequencies = {};
    const twoLetterFrequencies = {};
    const threeLetterFrequencies = {};

    const words = fs.readFileSync(filePath, "utf-8").split(/\s/);
    words.forEach(word => {
      word = word.toLowerCase();
      this.addWordToObject(word, this.wordMap);

      this.addToFrequencies(word, oneLetterFrequencies, 1);
      this.addToFrequencies(word, twoLetterFrequencies, 2);
      this.addToFrequencies(word, threeLetterFrequencies, 3);
    });

    this.oneLetterGroupings = this.sortByFrequency(oneLetterFrequencies, TOP_NUMBER_OF_ONE_LETTER_GROUPS);
    this.twoLetterGroupings = this.sortByFrequency(twoLetterFrequencies, TOP_NUMBER_OF_TWO_LETTER_GROUPS);
    this.threeLetterGroupings = this.sortByFrequency(threeLetterFrequencies, TOP_NUMBER_OF_THREE_LETTER_GROUPS);
  }

  addWordToObject(word, wordMap) {
    for(let i = 0;i < word.length;i++) {
      const letter = word.at(i);

      if(!wordMap[letter]) {
        wordMap[letter] = {
          wordMap: {}
        };
      }

      if(i === word.length - 1) {
        wordMap[letter].completeWord = true;
      } else { 
        wordMap = wordMap[letter].wordMap;
      }
    }
  }

  addToFrequencies(word, frequencyObject, comboLength) {
    for(let i = 0;i <= word.length - comboLength;i++) {
      const letterCombo = word.substring(i, i + comboLength);
      if(frequencyObject[letterCombo]) {
        frequencyObject[letterCombo]++;
      } else {
        frequencyObject[letterCombo] = 1;
      }
    }
  }

  sortByFrequency(letterFrequencies, topX) {
    let entries = Object.entries(letterFrequencies);

    let numToSort = topX > entries.length ? entries.length: topX;
    for(let i = 0;i < numToSort;i++) {
      for(let j = entries.length - 1;j > 0;j--) {
        if(entries[j][1] > entries[j - 1][1]) {
          let temp = entries[j];
          entries[j] = entries[j - 1];
          entries[j - 1] = temp;
        }
      }
    }

    const topFrequencies = entries.slice(0, numToSort);
    const smallestFreq = topFrequencies[topFrequencies.length - 1][1];
    const relativeLetterGroups = [];

    topFrequencies.forEach(freq => {
      const numOccurrences = Math.floor(freq[1] / smallestFreq);
      for(let i = 0;i < numOccurrences;i++) {
        relativeLetterGroups.push(freq[0]);
      }
    });
    return relativeLetterGroups;
  }
}

module.exports = BuildTrie;