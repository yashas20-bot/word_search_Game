const BuildTrie = require("./BuildTrie.js"); 

// CORRECTED PATH: Changed '../../' to '../' to properly navigate one level up 
// from the 'build' folder to the 'stProject' folder, then into the 'dictionaries' folder.
const builder = new BuildTrie("../dictionaries/bigDictionary.txt");